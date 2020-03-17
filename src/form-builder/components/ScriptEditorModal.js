import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NotificationContainer from 'common/Notification';
import { commonConstants } from 'common/constants';
import CodeMirror from 'codemirror';
import { JSHINT } from 'jshint';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/addon/lint/lint.js';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/lint/javascript-lint.js';
import jsBeautifier from 'js-beautify';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/javascript-hint.js';
import 'codemirror/addon/edit/closebrackets.js';

// Required for CodeMirror
// https://stackoverflow.com/questions/44778262/cannot-get-codemirror-linting-and-jshint-to-work-in-angular-2-application
window.JSHINT = JSHINT;

export default class ScriptEditorModal extends Component {
  constructor(props) {
    super(props);
    this.validateScript = this.validateScript.bind(this);
    this.state = { script: this.props.script, notification: {}, codeMirrorEditor: {} };
    this.codeMirrorEditor = null;
    this.scriptEditorTextArea = null;
    this.setScriptEditorTextArea = element => {
      this.scriptEditorTextArea = element;
    };
    this.format = this.format.bind(this);
  }

  componentDidMount() {
    const scriptEditorTextArea = this.scriptEditorTextArea;
    this.codeMirrorEditor = CodeMirror.fromTextArea(scriptEditorTextArea, {
      lineNumbers: true,
      mode: { name: 'javascript', globalVars: true },
      gutters: ['CodeMirror-lint-markers'],
      lint: true,
      extraKeys: { 'Ctrl-Space': 'autocomplete' },
      autoCloseBrackets: true,
    });
  }

  validateScript() {
    try {
      this.format();
      const script = this.codeMirrorEditor.getValue().trim();
      /* eslint-disable no-eval*/
      if (script.trim().length > 0) eval(`(${script})`);
      this.props.updateScript(script);
    } catch (ex) {
      const errorNotification = {
        message: 'Please Enter valid javascript function',
        type: commonConstants.responseType.error,
      };
      this.setState({ notification: errorNotification });

      setTimeout(() => {
        this.setState({ notification: {} });
      }, commonConstants.toastTimeout);
    }
  }

  format() {
    const beautifiedData = jsBeautifier.js_beautify(this.codeMirrorEditor.getValue(),
      { indent_size: 2, space_in_empty_paren: true });
    this.codeMirrorEditor.setValue(beautifiedData);
  }

  render() {
    return (
      <div className="script-editor-container">
        <NotificationContainer
          notification={this.state.notification}
        />
         <h2 className="header-title">Editor</h2>
          <textarea autoFocus className="editor-wrapper area-height--textarea"
            defaultValue={this.state.script} ref={this.setScriptEditorTextArea}
          >
          </textarea>
          <div className="script-editor-button-wrapper">
            <button className="btn" onClick={() => this.format()}>Format</button>
            <button className="button btn--highlight"
              onClick={() => this.validateScript(this.state.script)}
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
      </div>
    );
  }
}

ScriptEditorModal.propTypes = {
  close: PropTypes.func.isRequired,
  script: PropTypes.string,
  updateScript: PropTypes.func.isRequired,
};

ScriptEditorModal.defaultProps = {
  script: '',
};
