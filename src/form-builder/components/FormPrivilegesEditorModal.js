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
import FormPrivilegeTable from 'form-builder/components/FormPrivilegeTable.jsx';
import _ from 'lodash';
import RemoveControlEventConfirmation from
      'form-builder/components/RemoveControlEventConfirmation.jsx';
import jsBeautifier from 'js-beautify';
import { connect } from 'react-redux';
window.JSHINT = JSHINT;

export default class FormPrivilegesEditorModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notification: {},
      codeMirrorEditor: {},
      displayConfirmationPopup: false,
      formName: '',
      formId: '',
      formUuid: '',
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
    const { formId, formName, formUuid, formPrivileges, formData } = this.props;
    if (formData.published) {
      return (
        <div className="dialog dialog--no-header">
          <div className="dialog--container">
              Please save the form first to create a new version to manage privileges.
          </div>
          <div>
              <button className="btn" onClick={this.props.close} type="reset"> Close </button>
           </div>
      </div>
      );
    }
    return (
      <div className="form-privileges-modal-container">
         <h2 className="header-title">Manage Privileges</h2>
         <div className="form-privileges-container" >
           <FormPrivilegeTable
             close={this.props.close}
             formId={formId}
             formName={formName}
             formUuid={ formUuid }
             formPrivileges={formPrivileges}
             formData={formData}

           />
        </div>

      </div>
    );
  }
}

FormPrivilegesEditorModal.propTypes = {
  close: PropTypes.func.isRequired,
  formId: PropTypes.number,
  formName: PropTypes.string.isRequired,
  formUuid: PropTypes.string.isRequired,
  formPrivileges: PropTypes.array,
  formData: PropTypes.formData,
};
function mapStateToProps(state) {
  return {
    formUuid: state.formUuid,
    formId: state.formId,
    formName: state.formName,
    formData: state.formData,
  };
}
FormPrivilegesEditorModal.defaultProps = {
  formDetails: { privileges: {} },
};

