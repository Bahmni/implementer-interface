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
import FormPrivilegesPreviewGrid from 'form-builder/components/FormPrivilegesPreviewGrid.jsx';
import FormBuilderBreadcrumbs from 'form-builder/components/FormBuilderBreadcrumbs.jsx';
import FormBuilderHeader from 'form-builder/components/FormBuilderHeader.jsx';
import NotificationContainer from 'common/Notification';
import Spinner from 'common/Spinner';

class FormPrivilegesPreviewContainer extends Component {
constructor(props){
super(props);
this.state ={formPrivileges: {}, notification: {}, loading: true,};
}
componentWillMount(){
   // this.fetchFormData();
}
componentDidMount() {
   // this.fetchFormPrivilegesFromProps();
  }
render() {
  const { formPrivileges } = this.state;
    return (<div>
      <NotificationContainer
        notification={this.state.notification}
      />
      <FormBuilderHeader />
      <div className="breadcrumb-wrap">
        <div className="breadcrumb-inner">
          <div className="fl">
            <FormBuilderBreadcrumbs match={this.props.match} routes={this.props.routes} />
          </div>
        </div>
      </div>
      <div className="container-content-wrap">
        <div className="info-view-mode-wrap">
          <div className="info-view-mode">
            <i className="fa fa-info-circle fl"></i>
            <span className="info-message">
             Please save the changes before selecting a locale.
            </span>
          </div>
        </div>
         <FormPrivilegesPreviewGrid formUuid={ this.props.match.params.formUuid }/>
      </div>
    </div>);
  }
}
FormPrivilegesPreviewContainer.propTypes = {
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
export default connect(mapStateToProps)(FormPrivilegesPreviewContainer);

