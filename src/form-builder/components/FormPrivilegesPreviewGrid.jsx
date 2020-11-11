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

export default class FormPrivilegesPreviewGrid extends Component {
constructor(props){
super(props);
this.state ={
    formPrivileges: {},
    searchDisabled: false,
    availablePrivileges: [],
    };
}

componentWillMount(){
    this.fetchFormData();
    this.fetchPrivileges();
}
componentDidMount() {
   // this.fetchFormPrivilegesFromProps();
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
                      var formPrivilegesParsedValue = parsedFormValue.privilege;
                      if(formPrivilegesParsedValue == undefined){
                         formPrivilegesParsedValue = [{
                          formId: "",
                          privilegeName: "",
                          editable: false,
                          viewable: false,
                        }];

                      }
                      this.setState({
                                        formPrivileges:formPrivilegesParsedValue,

                                    });
                                    console.log("formPrivileges from state"+formPrivileges);

                    })

                    .catch((error) => {
                      this.setErrorMessage(error);
                      this.setState({ loading: false });
                    });
}
  fetchPrivileges() {
    let initialPrivileges = [];
    const availablePrivileges = {};
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
getValue(privilege){
    if(privilege!= undefined && privilege.privilegeName == ''){
       const selectedPrivilegeOption = "Select a privilege";
       return (selectedPrivilegeOption);
   }return privilege.privilegeName;
  };
  render() {

        const { availablePrivileges } = this.state;
        const options = availablePrivileges;
        const {searchDisabled} = this.state;
        if (this.state.formPrivileges.map == undefined) {
          return null
        }

        return (
      <div className="translations-table-container">
                  <table className="form-privilege-table">
                  <thead>
                      <tr>
                        <th> Privilege </th>
                        <th> isEditable </th>
                        <th> isViewable </th>

                      </tr>
                  </thead>
                        <tbody>
                        {this.state.formPrivileges.map((privilege, idx) => (

                            <tr id="addr0" key={idx} >
                                <td>
                                    <Select
                                     onChange={(e) => this.handleTag(e , idx)}
                                     options={availablePrivileges}
                                     disabled="true"
                                     value={this.getValue(privilege)}
                                     />
                               </td>
                              <td>
                                    <input
                                      type="checkbox"
                                      name="isEditable"
                                      defaultChecked={privilege.editable}
                                      checked={privilege.editable}
                                      disabled = "true"
                                      className="form-control"
                                    />
                               </td>
                                  <td>
                                      <input
                                        type="checkbox"
                                        name="isViewable"
                                        checked={privilege.viewable}
                                        defaultChecked={privilege.viewable}
                                        disabled = "true"
                                        className="form-control"
                                      />
                                   </td>

                            </tr>
                            ))}
                        </tbody>
                          </table>
                   </div>
    );
  }
}
FormPrivilegesPreviewGrid.propTypes = {
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
const mapStateToProps = (state) => ({
  formUuid: state.formUuid,
});
