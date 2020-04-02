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
import ObsControlScriptEditorModal from 'form-builder/components/ObsControlScriptEditorModal';

window.JSHINT = JSHINT;

export default class FormConditionsModal extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedControlEventTitle: undefined, selectedControlScript: undefined };
    this.selectedControlOption = undefined;
    this.prevSelectedControlOption = undefined;
    this.selectedControlTitle = undefined;
    this.selectedControlScript = undefined;
    this.updateSelectedOption = this.updateSelectedOption.bind(this);
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

  showObsControlScriptEditorModal(controlScript, controlEventTitle) {
    if (controlEventTitle !== undefined) {
      return (<ObsControlScriptEditorModal
        close={this.props.close}
        script={controlScript}
        title={controlEventTitle}
        updateScript={this.props.updateScript}
      />
      );
    }
    return null;
  }
  render() {
    const obs = this.props.controlEvents !== undefined ? this.props.controlEvents : [];
    const ObsWithControlEvents = obs.filter(o => o.events !== undefined);
    const obsWithoutControlEvents = obs.filter(o => o.events === undefined);
    return (
      <div>
        <div className="dialog-wrapper"></div>
        <div className="dialog area-height--dialog form-conditions-modal-container">
          <h2 className="header-title">{this.props.formTitle} - Form Conditions</h2>
          <div className="body" >
            <div className="left-panel" >
              <br />
              { this.showObsControlScriptEditorModal(this.props.formDetails.events.onFormInit,
                'Form Event')}
              <br />
              { this.showObsControlScriptEditorModal(this.props.formDetails.events.onFormSave,
                'Save Event')}
              <br />
            </div>
            <div className="right-panel" >
              <br />
              <div>
                <label className="label" >Control Events:</label>
                <select className="obs-dropdown" onChange={this.updateSelectedOption}>
                  <option key="0" value="0" >Select Option</option>)
                  {obsWithoutControlEvents.map((e) =>
                    <option key={e.id} value={e.id} >{e.name}</option>)}
                </select>
              </div>
              <span className="line-break-3"></span>
              <div>
                {
                  ObsWithControlEvents.map((e) =>
                    this.showObsControlScriptEditorModal(e.events.onValueChange,
                      `Control Id: ${e.id}    Control Name: ${e.name}`)
                  )
                }
              </div>
              {
                <div> {this.showObsControlScriptEditorModal(this.state.selectedControlScript,
                  this.state.selectedControlEventTitle)}
                  <span className="line-break-2"></span>
                </div>
              }
            </div>
          </div>
          <div className="button-wrapper" >
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
  formTitle: PropTypes.string,
  script: PropTypes.string,
  selectedControlEventTitle: PropTypes.string,
  selectedControlScript: PropTypes.string,
  updateScript: PropTypes.func.isRequired,
};

FormConditionsModal.defaultProps = {
  script: '',
};
