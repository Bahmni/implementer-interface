import React from "react";
import Popup from 'reactjs-popup';
import { render } from "react-dom";
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
constructor(props){
super(props);

this.state = { formData: {},
                errorMessage: {},
               formName: '',
               httpReceived: false,
               loading: true,
               referenceVersion: undefined,
               referenceFormUuid: undefined,
               formPrivileges:[{
                               formId:this.props.formId,
                               privilegeName: "",
                               editable:false,
                               viewable:false,
               }],
               availablePrivileges:[],
               selectedPrivilegeOption: 'Select a privilege',
               displayConfirmationPopup: false,
 } ;

 this.state.value = '';
 this.setErrorMessage = this.setErrorMessage.bind(this);
 this.handleRemoveSpecificRow = this.handleRemoveSpecificRow.bind(this);
 this.handleAddRow = this.handleAddRow.bind(this);
 this.handleTag = this.handleTag.bind(this);
 this.formSave = this.formSave.bind(this);
 this.fetchFormPrivilegesFromDB=this.fetchFormPrivilegesFromDB.bind(this);
 this.removeSelectedPrivilege = this.removeSelectedPrivilege.bind(this);

}
componentWillMount(){
    this.fetchFormData();
    this.fetchPrivileges();
}
componentDidMount() {
    this.fetchFormPrivilegesFromProps();
}
fetchFormData(){
        if (this.props.formPrivileges.length == 0){
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
    const queryParams = `?=`;
    const optionsUrl = `${formBuilderConstants.formPrivilegeUrl}${queryParams}`;
     httpInterceptor.get(optionsUrl)
        .then((initialPrivileges) => {
               this.setState({ availablePrivileges: this.arrangePrivileges(initialPrivileges.results), loading: false });
        })

}
fetchFormPrivilegesFromDB() {
    let initialPrivilegesFromDB = [];
    const queryParams = `?=`;
    var initialPrivileges = [];
    const formId = this.props.formId;
    const formVersion = this.props.formData.version;
    const optionsUrl = `${formBuilderConstants.getFormPrivilegesUrl}?formId=${formId}&formVersion=${formVersion}`;
     httpInterceptor.get(optionsUrl)
        .then((initialPrivilegesFromDB) => {
               initialPrivilegesFromDB.forEach(function(privilege, key) {
                             initialPrivileges.push(privilege)
                           })
               this.setState({ formPrivileges : (initialPrivileges), loading: false });
        })

}
fetchFormPrivilegesFromProps() {
        if(this.props.formPrivileges == undefined){
        const formPrivileges = [{
              formId: this.props.formId,
              privilegeName: "",
              editable: false,
              viewable: false,
            }];
    this.setState({formPrivileges: formPrivileges})
    }else{this.setState({formPrivileges : this.props.formPrivileges})}
}
 arrangePrivileges(privilege) {
    const sampleList=[];
     privilege.forEach((privilege) => {
       const item ={
                 value:privilege.display,
                 uuid: privilege.uuid,
                 label:privilege.display,
                 }
       sampleList.push(item);
       });
    return sampleList;
  }



 handleTag(event,idx) {
  const formPrivileges = this.state.formPrivileges.slice();
  const availablePrivileges = this.state.availablePrivileges.slice();
        const tempItem = {
                formId: this.state.formData.id,
                privilegeName: event.display,
                editable: false,
                 viewable: false,
          };

       if(event.event != undefined && (formPrivileges.length >0) && (event.event.currentTarget.type === "checkbox")){

            if(event.event.currentTarget.name === 'isEditable'){
                formPrivileges[event.idx].editable = event.event.currentTarget.checked;
            }
            if(event.event.currentTarget.name === 'isViewable'){
                formPrivileges[event.idx].viewable = event.event.currentTarget.checked;
            }

       }
       if(event != undefined && (event.event == undefined)){
            formPrivileges[idx].privilegeName = event.value;
            formPrivileges[idx].formId = this.state.formData.id;
            this.setState({selectedPrivilegeOption: event.value});
       }
          this.setState({formPrivileges:formPrivileges});

     };
 handleAddRow(){
    const newPrivilegeItem = {
      formId: this.props.formId,
      privilegeName: "",
      editable: false,
      viewable: false,
    };
  this.state.formPrivileges.push(newPrivilegeItem);
  this.setState(this.state.formPrivileges);
  this.setState({selectedPrivilegeOption: newPrivilegeItem.privilegeName});
  };

  handleRemoveSpecificRow(idx) {
    const formPrivileges = this.state.formPrivileges
    formPrivileges.splice(idx, 1)
    this.setState({ formPrivileges })
  };
  getValue(privilege){
    if(privilege!= undefined && privilege.privilegeName == ''){
       const selectedPrivilegeOption = "Select a privilege";
       return (selectedPrivilegeOption);
   }return privilege.privilegeName;
  };
    formSave(formPrivileges) {
       try {
             const formJson = this.getFormJson();
             if(formJson != null){
             const formName = this.state.formData ? this.state.formData.name : 'FormName';
             const formVersion = this.state.formData ? this.state.formData.version: 'FormVersion';
             const formUuid = this.state.formData ? this.state.formData.uuid : undefined;
             const formId = this.state.formData ? this.state.formData.id : undefined;
             const formResourceUuid = this.state.formData && this.state.formData.resources.length > 0 ?
                             this.state.formData.resources[0].uuid : '';
             formJson.privilege = this.state.formPrivileges;
             const formResource = {
               form: {
                 name: formName,
                 uuid: formUuid,

               },
               value: JSON.stringify(formJson),
               uuid: formResourceUuid,
             };

             this._saveFormResource(formResource);
             this._saveFormPrivileges(this.state.formPrivileges);
             }else{
               this.setErrorMessage("Please submit the main form before adding privileges");
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

        _saveFormResource(formJson) {
            this.setState({ loading: true });
            httpInterceptor.post(formBuilderConstants.bahmniFormResourceUrl, formJson)
                    .then((response) => {
                      const updatedUuid = response.form.uuid;
                      this.context.router.history.push(`/form-builder/${updatedUuid}`);
                      const successNotification = {
                        message: commonConstants.saveSuccessMessage,
                        type: commonConstants.responseType.success,
                      };
                      this.setState({ notification: successNotification,
                        formData: this._formResourceMapper(response), loading: false });

                      clearTimeout(this.timeoutID);
                      this.timeoutID = setTimeout(() => {
                        this.setState({ notification: {} });
                      }, commonConstants.toastTimeout);
                    })
                    .catch((error) => {
                      this.setErrorMessage(error);
                      this.setState({ loading: false });
                    });


          }
      _saveFormPrivileges(formPrivileges) {
              const self = this;
                  saveFormPrivileges(this._createReqObject(this.state.formPrivileges)).then(() => {
                        const message = 'Form Privileges saved successfully';
                        const successNotification = {
                                                message: message,
                                                type: commonConstants.responseType.success,
                                              };
                        this.setState(notification: successNotification,
                                         loading: false);

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
      this.setState({ errorMessage: errorNotification });
      setTimeout(() => {
        this.setState({ errorMessage: {} });
      }, commonConstants.toastTimeout);
    }
        _createReqObject(formPrivileges) {

            const formId = this.state.formData.id;
            const formVersion = this.state.formData.version;
            const privilege = undefined;
            const formPrivilegeObj = [];
            const formJson = this.getFormJson();
           if(formPrivileges.length == 0){
           const privilegeCopy = {
                           formId: formId,
                           privilegeName: "",
                           editable:false,
                           viewable:false,
                           formVersion:formVersion,
                         }
               formPrivilegeObj.push(privilegeCopy);
               return formPrivilegeObj;
           }
           for(var i = 0; i <formPrivileges.length;i++){
              const privilege = formPrivileges[i];
              const privilegeCopy = {
                formId: formId,
                privilegeName: privilege.privilegeName,
                editable:privilege.editable,
                viewable:privilege.viewable,
                formVersion:formVersion,
              }

              formPrivilegeObj.push(privilegeCopy);
            }
            return formPrivilegeObj;

          }

          removeSelectedPrivilege(e){
            var array = this.state.availablePrivileges.filter(function(item) {
              return item.label !== e
            });
            this.setState({
              availablePrivileges: array
            })
          };
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
        if(this.state.formPrivileges == undefined){
            const newPrivilegeItem = {
               formId: this.state.formData.id,
               privilegeName: "",
               editable: false,
               viewable: false,
             };
           this.state.formPrivileges.push(newPrivilegeItem);
        }
        return (
      <div className="form-privilege-table-container">
      <NotificationContainer notification={this.state.errorMessage} />
                  <table className="form-privilege-table" id="tab_logic">
                  <thead>
                      <tr>
                        <th> Privilege </th>
                        <th> isEditable </th>
                        <th> isViewable </th>
                        <th>  Delete    </th>
                      </tr>
                  </thead>
                        <tbody>
                        {this.state.formPrivileges.map((privilege, idx) => (

                            <tr id="addr0" key={idx} >
                                <td>
                                    <Select
                                     onChange={(e) => this.handleTag(e , idx)}
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
                                      onClick ={(event) => this.handleTag({event,idx})}
                                      className="form-control"
                                    />
                               </td>
                                  <td>
                                      <input
                                        type="checkbox"
                                        name="isViewable"
                                        checked={privilege.viewable}
                                        defaultChecked={privilege.viewable}
                                        onClick={(event) => this.handleTag({event,idx})}
                                        className="form-control"
                                      />
                                   </td>
                              <td>
                                  <i className="fa fa-trash"
                                  onClick={(event) => this.handleRemoveSpecificRow(idx)}>
                                  </i>
                              </td>
                            </tr>
                            ))}
                        </tbody>
                          </table>

                              <button id="add-btn" onClick={this.handleAddRow} className="btn">
                                Add Row
                              </button>

                              <button className="btn" onClick={() => this.formSave(this.state.formPrivileges)} type="submit">
                                Save
                              </button>
                   </div>


    );
  }
}
FormPrivilegeTable.propTypes = {
      formPrivileges: PropTypes.array,
      formId: PropTypes.number,
}
FormPrivilegeTable.contextTypes = {
      router: PropTypes.object.isRequired,
    };
function mapStateToProps(state) {
  return {
    formDetails: state.formDetails,
    formPrivileges: state.formPrivileges,
    formData: state.formData,
    formDetails:state.formDetails,
    formId:state.formName,
    formName: state.formName,
  };
}
