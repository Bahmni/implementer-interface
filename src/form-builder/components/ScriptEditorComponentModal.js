import React, { Component } from 'react';
import PropTypes from 'prop-types';
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

window.JSHINT = JSHINT;

export default class ScriptEditorComponentModal extends Component {
  constructor(props) {
    super(props);
    this.validateScript = this.validateScript.bind(this);
    this.state = { notification: {}, codeMirrorEditor: {} };
    this.codeMirrorEditor = null;
    this.scriptEditorTextArea = null;
    this.prevScriptEditorTextArea = null;
    this.setScriptEditorTextArea = element => {
      this.scriptEditorTextArea = element;
    };
    this.format = this.format.bind(this);
  }

  componentDidMount() {
    const scriptEditorTextArea = this.scriptEditorTextArea;
    if (scriptEditorTextArea !== null) {
      this.codeMirrorEditor = CodeMirror.fromTextArea(scriptEditorTextArea, {
        mode: { name: 'javascript', globalVars: true },
        autoCloseBrackets: true,
        readOnly: true,
        indentWithTabs: true,
        tabSize: 2,
      });
    }
  }
  componentDidUpdate() {
    if (this.prevScriptEditorTextArea !== this.props.script) {
      const script = this.props.script === undefined ? '' : this.props.script;
      this.codeMirrorEditor.setValue(script);
      this.prevScriptEditorTextArea = script;
    }
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
    if (this.props.title === undefined) {
      return null;
    }
    // eslint-disable-next-line consistent-return
    return (
      <div style={{ paddingLeft: '10px' }}>
        <label style={{ fontWeight: 'bolder' }}>{this.props.title}</label><br /><br />
        <div className="comp1" style={{ borderStyle: 'solid', borderWidth: 'thin' }}>
          <textarea autoFocus className="editor-wrapper area-height--textarea"
            defaultValue={this.props.script} ref={this.setScriptEditorTextArea}
          >
          </textarea>
        </div>
      </div>
    );
  }
}

ScriptEditorComponentModal.propTypes = {
  close: PropTypes.func.isRequired,
  script: PropTypes.string,
  title: PropTypes.string,
  updateScript: PropTypes.func.isRequired,
};
