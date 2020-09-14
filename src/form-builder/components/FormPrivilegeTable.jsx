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

export class FormPrivilegeTable extends Component {
constructor(){
super();

this.state = { formData: {},
               formName: '',
               httpReceived: false,
               loading: true,
               referenceVersion: undefined,
               referenceFormUuid: undefined,
               formPrivileges:[],
               availablePrivileges:[],
               selectedPrivilegeOption: 'Select a privilege',
               displayConfirmationPopup: false,
 } ;

 this.state.value = '';
 this.closeEditor = this.closeEditor.bind(this);
 this.showConfirmationPopup = this.showConfirmationPopup.bind(this);
 this.closeConfirmationPopup = this.closeConfirmationPopup.bind(this);
 this.handleRemoveSpecificRow = this.handleRemoveSpecificRow.bind(this);
 this.handleAddRow = this.handleAddRow.bind(this);
 this.handleTag = this.handleTag.bind(this);
 this.formSave = this.formSave.bind(this);
}
componentWillMount(){
this.fetchPrivileges();
this.fetchFormData();
}
fetchFormData(){
        const params =
                    'v=custom:(id,uuid,name,version,published,auditInfo,' +
                    'resources:(value,dataType,uuid))';
            httpInterceptor
                    .get(`${formBuilderConstants.formUrl}/${this.props.formUuid}?${params}`)
                    .then((data) => {
                      const parsedFormValue = data.resources.length > 0 ?
                        JSON.parse(data.resources[0].value) : {};

                      this.setState({   formData: data,
                                        httpReceived: true,
                                        loading: false,
                                        formName: data.name,
                                        referenceVersion: parsedFormValue.referenceVersion,
                                        referenceFormUuid: parsedFormValue.referenceFormUuid
                                    });


                      //this.props.dispatch(formLoad(formControlsArray));
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
               this.setState({ availablePrivileges: this.orderFormByVersion(initialPrivileges.results), loading: false });
        })

}
 orderFormByVersion(privilege) {
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
             uuid: event.uuid,
            privilegeName: event.display,
            isEditable: false,
            isViewable: false,
          };

       if(event.event != undefined && (formPrivileges.length >0) && (event.event.currentTarget.type === "checkbox")){

            if(event.event.currentTarget.name === 'isEditable'){
                formPrivileges[event.idx].isEditable = event.event.currentTarget.checked;
            }
            if(event.event.currentTarget.name === 'isViewable'){
                formPrivileges[event.idx].isViewable = event.event.currentTarget.checked;
            }

       }
       if(event != undefined && (event.event == undefined)){
            formPrivileges[idx].privilegeName = event.value;
            formPrivileges[idx].uuid = event.uuid;
            this.setState({selectedPrivilegeOption: event.value});
       }
          this.setState({formPrivileges:formPrivileges});
         // this.removeSelectedPrivilege(event.value);
     };
 handleAddRow(){
    var id = (+ new Date() + Math.floor(Math.random() * 999999)).toString(36);
    const newPrivilegeItem = {
      uuid: id,
      privilegeName: "",
      isEditable: false,
      isViewable: false,
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
             const formName = this.state.formData ? this.state.formData.name : 'FormName';
             const formUuid = this.state.formData ? this.state.formData.uuid : undefined;
             const formResourceUuid = this.state.formData && this.state.formData.resources.length > 0 ?
                             this.state.formData.resources[0].uuid : '';
             formJson.privileges = this.state.formPrivileges;
             console.log("formJson"+formJson);
             const formResource = {
               form: {
                 name: formName,
                 uuid: formUuid,
               },
               value: JSON.stringify(formJson),
               uuid: formResourceUuid,
             };
             console.log("Before _save"+JSON.stringify(formJson));
             this._saveFormResource(formResource);
           } catch (e) {
             console.log("errrrrrrrrrrrrrrrrrrrr"+e);
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
     const translationsPromises = [saveFormPrivileges(this.state.formPrivileges)];
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
  removeSelectedPrivilege(e){
    var array = this.state.availablePrivileges.filter(function(item) {
      return item.label !== e
    });
    this.setState({
      availablePrivileges: array
    })
  };
  closeEditor() {
      this.setState({ displayConfirmationPopup: true });
    }

    closeConfirmationPopup() {
      this.setState({ displayConfirmationPopup: false });
    }

    showConfirmationPopup() {
      return (<Popup className="remove-control-confirmation-popup"
        closeOnDocumentClick={false}
        onClose={() => this.closeConfirmationPopup()}
        open={this.state.displayConfirmationPopup}
        position="top center"
      >
        <RemoveControlEventConfirmation
          close={this.closeConfirmationPopup}
          removeAndClose={() => {
            this.closeConfirmationPopup();
            this.props.removeControlEvent(this.props.titleId);
          }}
        />
      </Popup>);
    }
  render() {
        const { formPrivileges } = this.state;
        const { selectedPrivilegeOption } = this.state;
        const { availablePrivileges } = this.state;
        const options = availablePrivileges;

        return (
      <div className="form-privilege-table-container">
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
                                      defaultChecked={this.state.formPrivileges[idx].isEditable}
                                      onClick ={(event) => this.handleTag({event,idx})}
                                      className="form-control"
                                    />
                               </td>
                                  <td>
                                      <input
                                        type="checkbox"
                                        name="isViewable"
                                        defaultChecked={this.state.formPrivileges[idx].isViewable}
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
                  <button onClick={this.handleAddRow} className="btn btn-primary">
                    Add Row
                  </button>

                  <button className="button btn--highlight"
                                onClick={() => this.formSave(this.state.formPrivileges)}
                                type="submit"
                              >
                                Save
                              </button>
                              <button className="btn"
                                onClick={() => this.props.close()}
                                type="reset"
                              >
                                Cancel
                              </button>
              </div>
    );
  }
}


FormPrivilegeTable.propTypes = {
    formData: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string.isRequired,
        published: PropTypes.bool.isRequired,
        resources: PropTypes.array,
        uuid: PropTypes.string.isRequired,
        version: PropTypes.string.isRequired,
        editable: PropTypes.bool,
      }),
      formDetails: PropTypes.shape({
        events: PropTypes.object,
      }),

      formId: PropTypes.number,
      formName: PropTypes.string.isRequired,
      formResourceControls: PropTypes.array.isRequired,
      formUuid: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    conceptToControlMap: PropTypes.object,
  selectedControl: PropTypes.object,
  formPrivileges: PropTypes.Array,
  formPrivilege: PropTypes.shape({
            privilegeUuid: PropTypes.string.isRequired,
            privilegeName: PropTypes.string.isRequired,
            isEditable: PropTypes.bool,
            isViewable:PropTypes.bool,
    }),

};
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

export default connect(mapStateToProps)(FormPrivilegeTable);
