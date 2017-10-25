import React, { Component, PropTypes } from 'react';
import FormBuilder from 'form-builder/components/FormBuilder.jsx';
import { httpInterceptor } from 'common/utils/httpInterceptor';
import { formBuilderConstants } from 'form-builder/constants';
import { commonConstants } from 'common/constants';
import NotificationContainer from 'common/Notification';
import Spinner from 'common/Spinner';
import get from 'lodash/get';
import sortBy from 'lodash/sortBy';
import formHelper from '../helpers/formHelper';
import { UrlHelper } from 'form-builder/helpers/UrlHelper';
import { connect } from 'react-redux';
import { setDefaultLocale } from '../actions/control';


export class FormBuilderContainer extends Component {

  constructor() {
    super();
    this.state = { data: [], notification: {}, loading: true };
    this.setState = this.setState.bind(this);
  }

  componentDidMount() {
    this.getFormData().then(() => {
      this.getDefaultLocale();
    });
  }

  onValidationError(messages) {
    this.setMessage(`Concept validation error: \n${messages.join('\n')}`,
      commonConstants.responseType.error);
  }

  getFormData() {
    return httpInterceptor
      .get(`${formBuilderConstants.formUrl}?v=custom:(id,uuid,name,version,published,auditInfo)`)
      .then((data) => {
        this.setState({ data: this.orderFormByVersion(data.results), loading: false });
      })
      .catch((error) => {
        this.showErrors(error);
        this.setState({ loading: false });
      });
  }

  getDefaultLocale() {
    httpInterceptor
      .get(`${formBuilderConstants.defaultLocaleUrl}`, 'text')
      .then((data) => {
        this.props.dispatch(setDefaultLocale(data));
        localStorage.setItem('openmrsDefaultLocale', data);
        this.setState({ loading: false });
      })
      .catch((error) => {
        this.showErrors(error);
        this.setState({ loading: false });
      });
  }

  setMessage(message, type) {
    const errorNotification = { message, type };
    this.setState({ notification: errorNotification });
    setTimeout(() => {
      this.setState({ notification: {} });
    }, commonConstants.toastTimeout);
  }

  orderFormByVersion(forms) {
    forms.forEach((form) => {
      // eslint-disable-next-line
      form.version = Number.parseInt(form.version, 10);
    });
    if (!forms) return [];
    return sortBy(forms, ['name', 'version']);
  }

  showErrors(error) {
    if (error.response) {
      error.response.json().then((data) => {
        const message = get(data, 'error.globalErrors[0].message') || error.message;
        this.setMessage(message, commonConstants.responseType.error);
      });
    } else {
      this.setMessage(error.message, commonConstants.responseType.error);
    }
  }

  saveForm(form) {
    if (formHelper.validateFormName(form.name)) {
      httpInterceptor
        .post(formBuilderConstants.formUrl, form)
        .then((response) => {
          const uuid = response.uuid;
          this.context.router.push(`/form-builder/${uuid}`);
        })
        .catch((error) => this.showErrors(error));
    } else {
      const message = 'Leading or trailing spaces and ^/-. are not allowed';
      this.setMessage(message, commonConstants.responseType.error);
    }
  }

  publishForm(formUuid) {
    const self = this;
    httpInterceptor.post(new UrlHelper().bahmniFormPublishUrl(formUuid))
      .then(() => {
        self.getFormData();
        self.setMessage('Imported and Published Successfully',
          commonConstants.responseType.success);
      })
      .catch(() => {
        this.setMessage('Error', commonConstants.responseType.error);
      });
  }

  saveFormResource(formJson) {
    const self = this;
    httpInterceptor.post(formBuilderConstants.bahmniFormResourceUrl, formJson)
      .then((response) => {
        self.setMessage('Importing...', commonConstants.responseType.success);
        self.publishForm(response.form.uuid);
      })
      .catch(() => {
        this.setMessage('Error', commonConstants.responseType.error);
      });
  }

  render() {
    return (
      <div>
        <Spinner show={this.state.loading} />
        <NotificationContainer
          notification={this.state.notification}
        />
        <FormBuilder
          data={this.state.data}
          onValidationError={(messages) => this.onValidationError(messages)}
          routes={this.props.routes}
          saveForm={(formName) => this.saveForm(formName)}
          saveFormResource={(formJson) => this.saveFormResource(formJson)}
        />
      </div>
    );
  }
}

FormBuilderContainer.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

FormBuilderContainer.propTypes = {
  dispatch: PropTypes.func,
  routes: PropTypes.array,
};

export default connect()(FormBuilderContainer);
