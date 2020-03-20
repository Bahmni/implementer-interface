import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FormBuilder from 'form-builder/components/FormBuilder.jsx';
import { httpInterceptor } from 'common/utils/httpInterceptor';
import { formBuilderConstants } from 'form-builder/constants';
import { commonConstants } from 'common/constants';
import NotificationContainer from 'common/Notification';
import Spinner from 'common/Spinner';
import get from 'lodash/get';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import formHelper from '../helpers/formHelper';
import { connect } from 'react-redux';
import { setDefaultLocale } from '../actions/control';
import { saveTranslations } from 'common/apis/formTranslationApi';


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

  onValidationError(message) {
    this.setMessage(message,
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
          this.context.router.history.push(`/form-builder/${uuid}`);
        })
        .catch((error) => this.showErrors(error));
    } else {
      const message = 'Leading or trailing spaces and ^/-. are not allowed';
      this.setMessage(message, commonConstants.responseType.error);
    }
  }

  saveTranslations(translations) {
    const self = this;
    self.setMessage('Importing Translations...', commonConstants.responseType.success);
    saveTranslations(translations || [])
      .then(() => {
        self.getFormData();
        self.setMessage('Imported Successfully',
          commonConstants.responseType.success);
      })
      .catch(() => {
        this.setMessage('Error Importing Translations', commonConstants.responseType.error);
      });
  }

  saveFormResource(formJson, formTranslations) {
    const self = this;
    self.setMessage('Importing Form...', commonConstants.responseType.success);
    httpInterceptor.post(formBuilderConstants.bahmniFormResourceUrl, formJson)
      .then((form) => {
        const updatedTranslations = map(formTranslations, (translation) => {
          const formTranslation = translation;
          formTranslation.version = form.form.version || translation.version;
          return formTranslation;
        });
        self.saveTranslations(updatedTranslations);
      })
      .catch(() => {
        this.setMessage('Error Importing Form', commonConstants.responseType.error);
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
          dispatch={this.props.dispatch}
          match={this.props.match}
          onValidationError={(messages) => this.onValidationError(messages)}
          routes={this.props.routes}
          saveForm={(formName) => this.saveForm(formName)}
          saveFormResource={(formJson, translations) =>
            this.saveFormResource(formJson, translations)}
        />
      </div>
    );
  }
}

FormBuilderContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

FormBuilderContainer.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    isExact: PropTypes.bool.isRequired,
    params: PropTypes.object,
  }),
  routes: PropTypes.array,
};

export default connect()(FormBuilderContainer);
