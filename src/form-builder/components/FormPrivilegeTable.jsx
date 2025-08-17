import React from 'react';
import Popup from 'reactjs-popup';
import { render } from 'react-dom';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { AutoComplete } from 'bahmni-form-controls';
import { connect } from 'react-redux';
import { selectSource, setChangedProperty } from 'form-builder/actions/control';
import { commonConstants } from 'common/constants';
import filter from 'lodash/filter';
import { httpInterceptor } from 'common/utils/httpInterceptor';
import Select from 'react-select';
import { UrlHelper } from 'form-builder/helpers/UrlHelper';
import sortBy from 'lodash/sortBy';
import { formBuilderConstants } from 'form-builder/constants';
import RemoveControlEventConfirmation from
      'form-builder/components/RemoveControlEventConfirmation.jsx';
import { saveFormPrivileges } from 'common/apis/formPrivilegesApi';
import NotificationContainer from 'common/Notification';
export default class FormPrivilegeTable extends Component {
  constructor(props) {
    super(props);

    this.state = { formData: {},
      errorMessage: {},
      formName: '',
      httpReceived: false,
      notification: {},
      loading: true,
      referenceVersion: undefined,
      referenceFormUuid: undefined,
      formPrivileges: [{
        formId: this.props.formId,
        privilegeName: '',
        editable: false,
        viewable: false,
      }],
      availablePrivileges: [],
      selectedPrivilegeOption: 'Select a privilege',
      displayConfirmationPopup: false,
      firstSave: true,
    };

    this.state.value = '';
    this.setErrorMessage = this.setErrorMessage.bind(this);
    this.handleRemoveSpecificRow = this.handleRemoveSpecificRow.bind(this);
    this.handleAddRow = this.handleAddRow.bind(this);
    this.handleTag = this.handleTag.bind(this);
    this.formSave = this.formSave.bind(this);
    this.fetchFormPrivilegesFromDB = this.fetchFormPrivilegesFromDB.bind(this);
    this.removeSelectedPrivilege = this.removeSelectedPrivilege.bind(this);
  }
  componentWillMount() {
    this.fetchFormData();
    this.fetchPrivileges();
  }
  componentDidMount() {
    this.fetchFormPrivilegesFromProps();
  }
  fetchFormData() {
    if ((this.props.formPrivileges == null) || (this.props.formPrivileges.length == 0)) {
      this.fetchFormPrivilegesFromDB();
    }
    const params =
                    'v=custom:(id,uuid,name,version,published,auditInfo,' +
                    'resources:(value,dataType,uuid))';
    httpInterceptor
                    .get(`${formBuilderConstants.formUrl}/${this.props.formUuid}?${params}`)
                    .then((data) => {
                      const parsedFormValue = data.resources.length > 0 ?
                        JSON.parse(data.resources[0].value) : {};

                      this.setState({
                        formData: data,
                      });
                    })

                    .catch((error) => {
                      this.setErrorMessage(error);
                      this.setState({ loading: false });
                    });
  }

  fetchPrivileges() {
    let initialPrivileges = [];
    let privileges = [];
    const queryParams = '?=';
    const optionsUrl = `${formBuilderConstants.formPrivilegeUrl}${queryParams}`;
    httpInterceptor.get(optionsUrl)
      .then((initialPrivileges) => {
        this.collectAllPrivileges(initialPrivileges, privileges);
      });
  }

  collectAllPrivileges(initialPrivileges, allPrivileges) {
    allPrivileges.push(...initialPrivileges.results);
    if (allPrivileges.length === formBuilderConstants.dataLimit) {
      this.setState({ availablePrivileges: this.arrangePrivileges(allPrivileges), loading: false });
      return;
    }
    if (initialPrivileges.links !== undefined && initialPrivileges.links.length > 0) {
      const nextLink = initialPrivileges.links.find(link => link.rel === 'next');
      if (!nextLink) {
        this.setState({ availablePrivileges: this.arrangePrivileges(allPrivileges), loading: false });
        return;
      }
      const nextUri = this.getNextPaginationRequestUrl(nextLink.uri);
      httpInterceptor.get(nextUri)
        .then((privileges) => this.collectAllPrivileges(privileges, allPrivileges));
    } else {
      this.setState({ availablePrivileges: this.arrangePrivileges(allPrivileges), loading: false });
    }
  }

  fetchFormPrivilegesFromDB() {
    let initialPrivilegesFromDB = [];
    const queryParams = '?=';
    let initialPrivileges = [];
    const formId = this.props.formId;
    const formVersion = this.props.formData.version;
    const optionsUrl = `${formBuilderConstants.getFormPrivilegesUrl}?formId=${formId}&formVersion=${formVersion}`;
    httpInterceptor.get(optionsUrl)
        .then((initialPrivilegesFromDB) => {
          initialPrivilegesFromDB.forEach((privilege, key) => {
            initialPrivileges.push(privilege);
          });
          this.setState({ formPrivileges: (initialPrivileges), loading: false });
        });
  }
  fetchFormPrivilegesFromProps() {
    if (this.props.formPrivileges == undefined) {
      const formPrivileges = [{
        formId: this.props.formId,
        privilegeName: '',
        editable: false,
        viewable: false,
      }];
      this.setState({ formPrivileges });
    } else {this.setState({ formPrivileges: this.props.formPrivileges });}
  }
  arrangePrivileges(privilege) {
    const sampleList = [];
    privilege.forEach((privilege) => {
      const item = {
        value: privilege.display,
        uuid: privilege.uuid,
        label: privilege.display,
      };
      sampleList.push(item);
    });
    return sampleList;
  }


  handleTag(event, idx) {
    const formPrivileges = this.state.formPrivileges.slice();
    const availablePrivileges = this.state.availablePrivileges.slice();
    const tempItem = {
      formId: this.state.formData.id,
      privilegeName: event.display,
      editable: false,
      viewable: false,
    };

    if (event.event != undefined && (formPrivileges.length > 0) && (event.event.currentTarget.type === 'checkbox')) {
      if (event.event.currentTarget.name === 'isEditable') {
        formPrivileges[event.idx].editable = event.event.currentTarget.checked;
      }
      if (event.event.currentTarget.name === 'isViewable') {
        formPrivileges[event.idx].viewable = event.event.currentTarget.checked;
      }
    }
    if (event != undefined && (event.event == undefined)) {
      formPrivileges[idx].privilegeName = event.value;
      formPrivileges[idx].formId = this.state.formData.id;
      this.setState({ selectedPrivilegeOption: event.value });
    }
    this.setState({ formPrivileges });
  }
  handleAddRow() {
    const newPrivilegeItem = {
      formId: this.props.formId,
      privilegeName: '',
      editable: false,
      viewable: false,
    };
    this.state.formPrivileges.push(newPrivilegeItem);
    this.setState(this.state.formPrivileges);
    this.setState({ selectedPrivilegeOption: newPrivilegeItem.privilegeName });
  }

  handleRemoveSpecificRow(idx) {
    const formPrivileges = this.state.formPrivileges;
    formPrivileges.splice(idx, 1);
    this.setState({ formPrivileges });
  }
  getValue(privilege) {
    if (privilege != undefined && privilege.privilegeName == '') {
      const selectedPrivilegeOption = 'Select a privilege';
      return (selectedPrivilegeOption);
    } return privilege.privilegeName;
  }
  formSave(formPrivileges) {
    try {
      const formJson = this.getFormJson();
      if (formJson != null) {
        const formName = this.state.formData ? this.state.formData.name : 'FormName';
        const formVersion = this.state.formData ? this.state.formData.version : 'FormVersion';
        const formUuid = this.state.formData ? this.state.formData.uuid : undefined;
        const formId = this.state.formData ? this.state.formData.id : undefined;
        const formResourceUuid = this.state.formData && this.state.formData.resources.length > 0 ?
                             this.state.formData.resources[0].uuid : '';
        formJson.privilege = this.state.formPrivileges;
        this._saveFormPrivileges(this.state.formPrivileges);
      } else {
        this.setErrorMessage('Please submit the main form before adding privileges');
      }
    } catch (e) {

    }
  }
  getFormJson() {
    if (this.state.formData && this.state.formData.resources) {
      const resource = this.state.formData.resources[0];
      if (resource && resource.value) {
        const formJson = JSON.parse(resource.value);

        return formJson;
      }
    }
    return null;
  }
  _saveFormPrivileges(formPrivileges) {
    const self = this;
    saveFormPrivileges(this._createReqObject(this.state.formPrivileges)).then(() => {
      const msg = 'Form Privileges saved successfully. Please save the form again before publishing';
      const successNotification = {
        message: msg,
        type: commonConstants.responseType.success,
      };
      this.setState({ notification: successNotification, loading: false });
    }).catch(() => {
      this.setErrorMessage('Failed to save privileges');
      this.setState({ loading: false });
    });
  }

  setErrorMessage(errorMessage) {
    const errorNotification = {
      message: errorMessage,
      type: commonConstants.responseType.error,
    };
    this.setState({ notification: errorNotification });
    setTimeout(() => {
      this.setState({ errorMessage: {} });
    }, commonConstants.toastTimeout);
  }
  _createReqObject(formPrivileges) {
    let formVersion = this.state.formData.version;
    let formId = this.state.formData.id;
    if ((this.state.firstSave === true) && (this.state.formData.published === true)) {
      console.error('Form is still marked as published. Execution should not be able to arrive at this point');
      formVersion++;
      formVersion = formVersion.toString();
      formId++;
      this.setState({ firstSave: false });
    }
    const formPrivilegeObj = [];
    if (formPrivileges.length === 0) {
      const privilegeCopy = {
        formId,
        privilegeName: '',
        editable: false,
        viewable: false,
        formVersion,
      };
      formPrivilegeObj.push(privilegeCopy);
      return formPrivilegeObj;
    }
    for (let i = 0; i < formPrivileges.length; i++) {
      const privilege = formPrivileges[i];
      const privilegeCopy = {
        formId,
        privilegeName: privilege.privilegeName,
        editable: privilege.editable,
        viewable: privilege.viewable,
        formVersion,
      };

      formPrivilegeObj.push(privilegeCopy);
    }
    return formPrivilegeObj;
  }

  getNextPaginationRequestUrl(uri) {
    if (uri.indexOf('http') === -1) {
      return uri;
    }
    const parsedUrl = new URL(uri);
    if (parsedUrl.protocol != window.location.protocol) {
      parsedUrl.protocol = window.location.protocol;
    }
    return parsedUrl.toString();
  }

  removeSelectedPrivilege(e) {
    let array = this.state.availablePrivileges.filter((item) => item.label !== e);
    this.setState({
      availablePrivileges: array,
    });
  }
  showErrors(error) {
    if (error.response) {
      error.response.json().then((data) => {
        const message = get(data, 'error.globalErrors[0].message') || error.message;
        this.setErrorMessage({ message });
      });
    } else {
      this.setErrorMessage({ message: error.message });
    }
  }
  render() {
    const { formPrivileges } = this.state;
    const { selectedPrivilegeOption } = this.state;
    const { availablePrivileges } = this.state;
    const options = availablePrivileges;
    if (this.state.formPrivileges == undefined) {
      const newPrivilegeItem = {
        formId: this.state.formData.id,
        privilegeName: '',
        editable: false,
        viewable: false,
      };
      this.state.formPrivileges.push(newPrivilegeItem);
    }
    return (
      <div className="form-privilege-table-container">
      <NotificationContainer notification={this.state.notification} />
                  <table className="form-privilege-table" id="tab_logic">
                  <thead>
                      <tr>
                        <th> Privilege </th>
                        <th> Editable </th>
                        <th> Viewable </th>
                        <th> Delete </th>
                      </tr>
                  </thead>
                        <tbody>
                        {this.state.formPrivileges.map((privilege, idx) => (

                            <tr id="addr0" key={idx} >
                                <td>
                                    <Select
                                      onChange={(e) => this.handleTag(e, idx)}
                                      options={availablePrivileges}
                                      value={this.getValue(privilege)}
                                    />
                               </td>
                              <td>
                                    <input
                                      type="checkbox"
                                      name="isEditable"
                                      defaultChecked={privilege.editable}
                                      checked={privilege.editable}
                                      onClick ={(event) => this.handleTag({ event, idx })}
                                      className="form-control"
                                    />
                               </td>
                                  <td>
                                      <input
                                        type="checkbox"
                                        name="isViewable"
                                        checked={privilege.viewable}
                                        defaultChecked={privilege.viewable}
                                        onClick={(event) => this.handleTag({ event, idx })}
                                        className="form-control"
                                      />
                                   </td>
                              <td>
                                  <i className="fa fa-trash"
                                    onClick={(event) => this.handleRemoveSpecificRow(idx)}
                                  >
                                  </i>
                              </td>
                            </tr>
                            ))}
                        </tbody>
                          </table>
                              <br />
                              <br />
                              <br />
                              <br />
                                <br />
                                <br />
                              <button id="add-btn" onClick={this.handleAddRow} className="btn">
                                Add Row
                              </button>

                              <button className="button btn--highlight" onClick={() => this.formSave(this.state.formPrivileges)} type="submit">
                                Save
                              </button>
                               <div>
                                <button className="btn" onClick={this.props.close} type="reset"> Cancel </button>
                               </div>
                   </div>


    );
  }
}
FormPrivilegeTable.propTypes = {
  formPrivileges: PropTypes.array,
  formId: PropTypes.number,
};
FormPrivilegeTable.contextTypes = {
  router: PropTypes.object.isRequired,
};
function mapStateToProps(state) {
  return {
    formDetails: state.formDetails,
    formPrivileges: state.formPrivileges,
    formData: state.formData,
    formId: state.formName,
    formName: state.formName,
  };
}
