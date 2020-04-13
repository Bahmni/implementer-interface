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
import _ from 'lodash';
import RemoveControlEventConfirmation from
      'form-builder/components/RemoveControlEventConfirmation.jsx';
import jsBeautifier from 'js-beautify';

window.JSHINT = JSHINT;

export default class ObsControlScriptEditorModal extends Component {
  constructor(props) {
    super(props);
    this.state = { notification: {}, codeMirrorEditor: {}, displayConfirmationPopup: false };
    this.codeMirrorEditor = null;
    this.closeEditor = this.closeEditor.bind(this);
    this.showConfirmationPopup = this.showConfirmationPopup.bind(this);
    this.closeConfirmationPopup = this.closeConfirmationPopup.bind(this);
    this.format = this.format.bind(this);
    this.getLabelForControl = this.getLabelForControl.bind(this);
    this.getLabel = this.getLabel.bind(this);
  }

  componentDidMount() {
    const scriptEditorTextArea = this.props.textAreaRef && this.props.textAreaRef.current;
    if (!_.isNil(scriptEditorTextArea)) {
      scriptEditorTextArea.value = jsBeautifier.js_beautify(scriptEditorTextArea.value,
          { indent_size: 2, space_in_empty_paren: true });
      this.codeMirrorEditor = CodeMirror.fromTextArea(scriptEditorTextArea, {
        mode: { name: 'javascript', globalVars: true },
        lineNumbers: true,
        autofocus: false,
        autoCloseBrackets: true,
        gutters: ['CodeMirror-lint-markers'],
        lint: true,
        extraKeys: { 'Ctrl-Space': 'autocomplete' },
      });
      this.codeMirrorEditor.on('change', () => {
        this.codeMirrorEditor.save();
      });
    }
  }

  componentWillUnmount() {
    // eslint-disable-next-line no-unused-expressions
    this.codeMirrorEditor && this.codeMirrorEditor.off('change');
  }

  getLabel() {
    return (<div className="control-event-label">
      <label className="label-key">{this.props.titleName}</label>
      <i className="fa fa-file-code-o" onClick={this.format} />
    </div>);
  }

  getLabelForControl() {
    return (<div className="control-event-label">
      <div>
        <label className="label-key">Control Id</label>
        <label className="label-value">{this.props.titleId}</label>
        <label className="label-key">Name</label>
        <label className="label-value">{this.props.titleName}</label>
      </div>
      <div>
        <i className="fa fa-file-code-o" onClick={this.format} />
        <i className="fa fa-times" onClick={this.closeEditor} />
      </div>
    </div>);
  }

  format() {
    const beautifiedData = jsBeautifier.js_beautify(this.codeMirrorEditor.getValue(),
        { indent_size: 2, space_in_empty_paren: true });
    this.codeMirrorEditor.setValue(beautifiedData);
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
    const editorClassNames = this.props.hasError ? 'text-div error-editor' : 'text-div';
    return (
      <div className="control-modal">
        {this.props.titleId ? this.getLabelForControl() : this.getLabel()}
        <div className={editorClassNames} >
          <textarea autoFocus className="editor-wrapper area-height--textarea"
            defaultValue={this.props.script} ref={this.props.textAreaRef}
          />
        </div>
        <span className="line-break-2" />
        {this.showConfirmationPopup()}
      </div>
    );
  }
}

ObsControlScriptEditorModal.propTypes = {
  hasError: PropTypes.bool,
  removeControlEvent: PropTypes.func.isRequired,
  script: PropTypes.string,
  textAreaRef: PropTypes.object.isRequired,
  titleId: PropTypes.string,
  titleName: PropTypes.string,
};
