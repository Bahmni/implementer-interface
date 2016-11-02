import React, { Component, PropTypes } from 'react';
import FormBuilder from 'form-builder/components/FormBuilder.jsx';
import { httpInterceptor } from 'common/utils/httpInterceptor';
import { formBuilderConstants } from 'form-builder/constants';
import { commonConstants } from 'common/constants';
import NotificationContainer from 'common/Notification';

export default class FormBuilderContainer extends Component {

  constructor() {
    super();
    this.state = { data: [], notifications: [] };
    this.setState = this.setState.bind(this);
  }

  componentWillMount() {
    httpInterceptor
      .get(`${formBuilderConstants.formUrl}?v=custom:(id,uuid,name,version,published,auditInfo)`)
      .then((data) => this.setState({ data: data.results }))
      .catch((error) => this.setErrorMessage(error));
  }

  setErrorMessage(error) {
    const errorNotification = { message: error.message, type: commonConstants.responseType.error };
    const notificationsClone = this.state.notifications.slice(0);
    notificationsClone.push(errorNotification);
    this.setState({ notifications: notificationsClone });
  }

  closeMessage(id) {
    const notificationsClone = this.state.notifications.splice(0);
    notificationsClone.splice(id, 1);
    this.setState({ notifications: notificationsClone });
  }

  saveForm(form) {
    httpInterceptor
      .post(formBuilderConstants.formUrl, form)
      .then((response) => {
        const uuid = response.uuid;
        this.context.router.push(`/form-builder/${uuid}`);
      })
      .catch((error) => this.setErrorMessage(error));
  }

  render() {
    return (
    <div>
      <NotificationContainer
        closeMessage={(id) => this.closeMessage(id)}
        notifications={this.state.notifications}
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
