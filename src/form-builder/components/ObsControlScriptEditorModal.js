import React, { Component } from 'react';
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

window.JSHINT = JSHINT;

export default class ObsControlScriptEditorModal extends Component {
  constructor(props) {
    super(props);
    this.state = { notification: {}, codeMirrorEditor: {} };
    this.codeMirrorEditor = null;
    this.scriptEditorTextArea = null;
    this.prevScriptEditorTextArea = null;
    this.setScriptEditorTextArea = element => {
      this.scriptEditorTextArea = element;
    };
  }

  componentDidMount() {
    const scriptEditorTextArea = this.scriptEditorTextArea;
    if (scriptEditorTextArea !== null) {
      this.codeMirrorEditor = CodeMirror.fromTextArea(scriptEditorTextArea, {
        mode: { name: 'javascript', globalVars: true },
        lineNumbers: true,
        autofocus: false,
        autoCloseBrackets: true,
        readOnly: true,
        gutters: ['CodeMirror-lint-markers'],
        lint: true,
        extraKeys: { 'Ctrl-Space': 'autocomplete' },
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

  getLabel() {
    if (this.props.titleId === null) {
      return (<label className="label-key">{this.props.titleName}</label>);
      // eslint-disable-next-line no-else-return
    }
    return (
      <div className="control-event-label">
        <div>
          <label className="label-key">Control Id</label>
          <label className="label-value">{this.props.titleId}</label>
          <label className="label-key">Name</label>
          <label className="label-value">{this.props.titleName}</label>
        </div>
        <i className="fa fa-times"></i>
      </div>);
  }

  render() {
    if (this.props.titleId === undefined) {
      return null;
    }
    // eslint-disable-next-line consistent-return
    return (
      <div className="control-modal">
        {this.getLabel()}
        <div className="text-div" >
          <textarea autoFocus className="editor-wrapper area-height--textarea"
            defaultValue={this.props.script} ref={this.setScriptEditorTextArea}
          >
          </textarea>
        </div>
        <span className="line-break-2"></span>
      </div>
    );
  }
}

ObsControlScriptEditorModal.propTypes = {
  close: PropTypes.func.isRequired,
  script: PropTypes.string,
  titleId: PropTypes.string,
  titleName: PropTypes.string,
  updateScript: PropTypes.func.isRequired,
};
