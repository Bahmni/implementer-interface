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

export default class FormPrivilegeTable extends Component {
constructor(props){
super(props);

this.state = { formData: {},
               formName: '',
               httpReceived: false,
               loading: true,
               referenceVersion: undefined,
               referenceFormUuid: undefined,
               formPrivileges:[{
                               formId:"",
                               privilegeName: "",
                               editable:false,
                               viewable:false,
               }],
               availablePrivileges:[],
               selectedPrivilegeOption: 'Select a privilege',
               displayConfirmationPopup: false,
 } ;

 this.state.value = '';
 this.handleRemoveSpecificRow = this.handleRemoveSpecificRow.bind(this);
 this.handleAddRow = this.handleAddRow.bind(this);
 this.handleTag = this.handleTag.bind(this);
 this.formSave = this.formSave.bind(this);
 this.fetchFormPrivilegesFromDB=this.fetchFormPrivilegesFromDB.bind(this);
 this.removeSelectedPrivilege = this.removeSelectedPrivilege.bind(this);
 this.adjustAvailablePrivilegeList = this.adjustAvailablePrivilegeList.bind(this);
}
componentWillMount(){
    this.fetchFormData();
    this.fetchPrivileges();
}
componentDidMount() {
    this.fetchFormPrivilegesFromProps();
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
                      var formPrivilegesParsedValue = parsedFormValue.privileges;
                      if(formPrivilegesParsedValue == undefined){
                         formPrivilegesParsedValue = [{
                          formId: "",
                          privilegeName: "",
                          editable: false,
                          viewable: false,
                        }];

                      }
                      this.setState({   formData: data,
                                        httpReceived: true,
                                        loading: false,
                                        formName: data.name,
                                        formPrivileges:formPrivilegesParsedValue,
                                        referenceVersion: parsedFormValue.referenceVersion,
                                        referenceFormUuid: parsedFormValue.referenceFormUuid
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
               this.setState({ availablePrivileges: this.orderFormByVersion(initialPrivileges.results), loading: false });
        })

}
fetchFormPrivilegesFromDB() {
    let initialPrivilegesFromDB = [];
    const queryParams = `?=`;
    const formId = this.props.formId;
    const optionsUrl = `${formBuilderConstants.getFormPrivilegesUrl}?formId=${this.props.formId}`;
     httpInterceptor.get(optionsUrl)
        .then((initialPrivilegesFromDB) => {
               this.setState({ formPrivileges : (initialPrivilegesFromDB.results), loading: false });
        })

}
fetchFormPrivilegesFromProps() {
        if(this.props.formPrivileges == undefined){
        const formPrivileges = [{
              formId: "",
              privilegeName: "",
              editable: false,
              viewable: false,
            }];
    this.setState({formPrivileges: formPrivileges})
    }else{this.setState({formPrivileges : this.props.formPrivileges})}
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
      formId: this.state.formData.id,
      privilegeName: "",
      editable: false,
      viewable: false,
    };
  this.state.formPrivileges.push(newPrivilegeItem);
  this.setState(this.state.formPrivileges);
  this.setState({selectedPrivilegeOption: newPrivilegeItem.privilegeName});
  };

  adjustAvailablePrivilegeList(){
          const tempPrivList = this.state.formPrivileges;

          if(tempPrivList != null && tempPrivList != undefined){}
          for(var i = 0; i <tempPrivList.length;i++){
                        const privilege = tempPrivList[i];
                        if(privilege.privilegeName != ""){
                        this.removeSelectedPrivilege(privilege.privilegeName);
                        }

          }
          }

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
             const formId = this.state.formData ? this.state.formData.id : undefined;
             const formResourceUuid = this.state.formData && this.state.formData.resources.length > 0 ?
                             this.state.formData.resources[0].uuid : '';
             formJson.privileges = this.state.formPrivileges;
             console.log("formJson"+formJson);
             const formResource = {
               form: {
                 name: formName,
                 uuid: formUuid,
                 id:formId,
               },
               value: JSON.stringify(formJson),
               uuid: formResourceUuid,
             };
             console.log("Before _save"+JSON.stringify(formJson));
             this._saveFormResource(formResource);
             console.log("After _save"+JSON.stringify(formJson));
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
                    this._saveFormPrivileges(this.state.formPrivileges);

          }
      _saveFormPrivileges(formPrivileges) {
              const self = this;
                  saveFormPrivileges(this._createReqObject(this.state.formPrivileges)).then(() => {
                        const message = 'Form translations saved successfully';
                        this.setMessage(message, commonConstants.responseType.success);
                        this.setState({ loading: false });
                      }).catch(() => {
                        this.setErrorMessage('Failed to save translations');
                        this.setState({ loading: false });
                      });
                }


        _createReqObject(formPrivileges) {
            const { privilegeName, version} = this.state.formData;
            const formId = this.state.formData.id;
            const formPrivilegeObj = [];
            const formJson = this.getFormJson();

           for(var i = 0; i <formPrivileges.length;i++){
              const privilege = formPrivileges[i];
              const privilegeCopy = {
                formId: formJson.id,
                privilegeName: privilege.privilegeName,
                editable:privilege.editable,
                viewable:privilege.viewable,
              }
              formPrivilegeObj.push(privilegeCopy);
            }
            console.log("formPrivilegeObj"+formPrivilegeObj);
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

                              <button onClick={this.handleAddRow} className="btn">
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
    formData: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string.isRequired,
        published: PropTypes.bool.isRequired,
        resources: PropTypes.array,
        uuid: PropTypes.string.isRequired,
        version: PropTypes.string.isRequired,
        editable: PropTypes.bool,
      }),
      formPrivileges: PropTypes.array,
      formId: PropTypes.number,
      formName: PropTypes.string.isRequired,
      formResourceControls: PropTypes.array.isRequired,
      formUuid: PropTypes.string.isRequired,
        data: PropTypes.array.isRequired,
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
