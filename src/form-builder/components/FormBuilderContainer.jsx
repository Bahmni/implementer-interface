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

export default class FormBuilderContainer extends Component {

  constructor() {
    super();
    this.state = { data: [], notification: {}, loading: true };
    this.setState = this.setState.bind(this);
  }

  componentDidMount() {
    httpInterceptor
      .get(`${formBuilderConstants.formUrl}?v=custom:(id,uuid,name,version,published,auditInfo)`)
      .then((data) => {
        this.setState({ data: this.orderFormByVersion(data.results), loading: false });
      })
      .catch((error) => {
        this.showErrors(error);
        this.setState({ loading: false });
      });
  }

  setErrorMessage(errorMessage) {
    const errorNotification = { message: errorMessage, type: commonConstants.responseType.error };
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
        this.setErrorMessage(message);
      });
    } else {
      this.setErrorMessage(error.message);
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
      this.setErrorMessage(message);
    }
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
        routes={this.props.routes}
        saveForm={(formName) => this.saveForm(formName)}
      />
    </div>
    );
  }
}

FormBuilderContainer.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

FormBuilderContainer.propTypes = {
  routes: PropTypes.array,
};
