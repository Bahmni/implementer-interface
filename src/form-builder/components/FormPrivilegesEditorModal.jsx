import React, { Component } from 'react';
import Popup from 'reactjs-popup';
import PropTypes from 'prop-types';
import CodeMirror from 'codemirror';
import { JSHINT } from 'jshint';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/addon/lint/lint.js';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/lint/javascript-lint.js';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/javascript-hint.js';
import 'codemirror/addon/edit/closebrackets.js';
import FormPrivilegeTable from 'form-builder/components/FormPrivilegeTable.jsx'
import _ from 'lodash';
import RemoveControlEventConfirmation from
      'form-builder/components/RemoveControlEventConfirmation.jsx';
import jsBeautifier from 'js-beautify';
import { connect } from 'react-redux';
window.JSHINT = JSHINT;

export class FormPrivilegesEditorModal extends Component {
  constructor(props) {
    super(props);
    this.state = { notification: {},
                    codeMirrorEditor: {},
                    displayConfirmationPopup: false ,
                    formPrivileges: {},
                    formDetails: undefined,
                    formData: undefined,
                    formName:'',
                    formId:'',
    };
    this.codeMirrorEditor = null;
    this.closeEditor = this.closeEditor.bind(this);
    this.showConfirmationPopup = this.showConfirmationPopup.bind(this);
    this.closeConfirmationPopup = this.closeConfirmationPopup.bind(this);
  }

  componentDidMount() {
  }
  componentWillUnmount() {

  }

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
   const formPrivileges = this.props.formDetails.privileges ? this.props.formDetails.privileges
        : { formPrivileges: {}};
    const {formData,formId,formName,formUuid,formDetails} = this.props;
    return (
      <div className="form-privileges-modal-container">
         <label>Manage Privileges</label>
        <div className="form-privileges-container" >
           <FormPrivilegeTable
           formPrivileges = {formPrivileges}
            formData = {formData}
            formId={formId}
            formName={formName}
            formUuid={ formUuid }
            formDetails={formDetails}
           />
        </div>
        <span className="line-break-2" />
        {this.showConfirmationPopup()}
      </div>
    );
  }
}

FormPrivilegesEditorModal.propTypes = {
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
  formPrivileges: PropTypes.Array,
  formPrivilege: PropTypes.shape({
        uuid: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        isEditable: PropTypes.bool,
        isViewable: PropTypes.bool,
      }),

};
function mapStateToProps(state) {
  return {
    formDetails: state.formDetails,
    formPrivileges: state.formPrivileges,
    formData: state.formData,

    formId:state.formName,
    formName: state.formName,
  };
}
FormPrivilegesEditorModal.defaultProps = {
  formDetails: { privileges: {} },
};
export default connect(mapStateToProps)(FormPrivilegesEditorModal);
