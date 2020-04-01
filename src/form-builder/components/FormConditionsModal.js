import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
import ScriptEditorComponentModal from 'form-builder/components/ScriptEditorComponentModal';

window.JSHINT = JSHINT;

export default class FormConditionsModal extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedControlEventTitle: undefined, selectedControlScript: undefined };
    this.setState = this.setState.bind(this);
    this.selectedControlOption = undefined;
    this.prevSelectedControlOption = undefined;
    this.selectedControlTitle = undefined;
    this.selectedControlScript = undefined;
    this.updateSelectedOption = this.updateSelectedOption.bind(this);
  }

  componentDidMount() {

  }

  updateSelectedOption(element) {
    this.prevSelectedControlOption = this.selectedControlOption;
    this.selectedControlOption = element.target.value;
    const selectedControlEventObj = this.props.controlEvents.find(control =>
      control.id === this.selectedControlOption);
    const selectedControlScriptObj = selectedControlEventObj ?
      selectedControlEventObj.events : undefined;
    this.selectedControlTitle = !selectedControlEventObj ? undefined
      : `Control Id: ${selectedControlEventObj.id}    Control Name: ${
        selectedControlEventObj.name}`;
    this.selectedControlScript = selectedControlScriptObj ?
      selectedControlScriptObj.onValueChange : undefined;
    if (this.selectedControlOption !== this.prevSelectedControlOption) {
      this.setState({ selectedControlEventTitle: this.selectedControlTitle });
      this.setState({ selectedControlScript: this.selectedControlScript });
    }
  }

  showControlEventScript() {
    if (this.state.selectedControlEventTitle !== undefined) {
      return (<ScriptEditorComponentModal
          close={this.props.close}
          script={this.state.selectedControlScript}
          selectedControlOption={this.selectedControlOption}
          title={this.state.selectedControlEventTitle}
          updateScript={this.props.updateScript}
        />
      );
    }
    return null;
  }
  render() {
    const controlEvents = this.props.controlEvents !== undefined ? this.props.controlEvents : [];
    return (
      <div>
        <div className="dialog-wrapper"></div>
        <div className="dialog area-height--dialog script-conditions-editor-container">
          <h2 className="header-title">Form Conditions Modal</h2>
          <div style={{ width: '100%', height: '90%' }}>
            <div className="form-conditions-left-panel" style={{ width: '50%', float: 'left' }}>
              <br />
              <ScriptEditorComponentModal
                close={this.props.close}
                script={this.props.formDetails.events.onFormInit}
                title={'Form Event'}
                updateScript={this.props.updateScript}
              />
              <br />
              <ScriptEditorComponentModal
                close={this.props.close}
                script={this.props.formDetails.events.onFormSave}
                title={ 'Save Event' }
                updateScript={this.props.updateScript}
              />
              <br />
            </div>
            <div className="form-conditions-right-panel" style={{ marginLeft: '50%' }}>
              <br />
              <div>
                <label style={{ float: 'left', fontWeight: 'bolder' }}>Control Events:</label>
                <select onChange={this.updateSelectedOption} style={{ float: 'right' }} >
                  <option key="0" value="0">Select Option</option>
                  {controlEvents.map((e) => <option key={e.id} value={e.id} >{e.name}</option>)}
                </select>
              </div><br /><br /><br /><br />
              {
                <div> {this.showControlEventScript()}<br /><br /> </div>
              }
            </div>
          </div>
          <div className="script-editor-button-wrapper" >
            <button className="btn" onClick={() => this.props.close()} type="reset">
              Cancel
            </button>
          </div>

        </div>
      </div>
    );
  }
}

FormConditionsModal.propTypes = {
  close: PropTypes.func.isRequired,
  controlEvents: PropTypes.array,
  formDetails: PropTypes.shape({
    events: PropTypes.object,
  }),
  script: PropTypes.string,
  selectedControlEventTitle: PropTypes.string,
  selectedControlScript: PropTypes.string,
  updateScript: PropTypes.func.isRequired,
};

FormConditionsModal.defaultProps = {
  script: '',
};
