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
        <i className="fa fa-times" onClick={this.closeEditor} />
      </div>);
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
    return (
      <div className="control-modal">
        {this.getLabel()}
        <div className="text-div" >
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
  removeControlEvent: PropTypes.func.isRequired,
  script: PropTypes.string,
  textAreaRef: PropTypes.object.isRequired,
  titleId: PropTypes.string,
  titleName: PropTypes.string,
};
