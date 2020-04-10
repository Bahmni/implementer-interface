import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ObsControlScriptEditorModal from 'form-builder/components/ObsControlScriptEditorModal';
import _ from 'lodash';

export default class FormConditionsModal extends Component {
  constructor(props) {
    super(props);
    const controls = this.initialiseMaps();
    this.updateDropDownSelection = this.updateDropDownSelection.bind(this);
    this.showObsControlScriptEditorModal = this.showObsControlScriptEditorModal.bind(this);
    this.initialiseMaps = this.initialiseMaps.bind(this);
    this.addToMap = this.addToMap.bind(this);
    this.removeFromMap = this.removeFromMap.bind(this);
    props.controlEvents.forEach(control => {
      this[`${control.id}_ref`] = React.createRef();
    });
    this.formEventRef = React.createRef();
    this.saveEventRef = React.createRef();
    this.state = {
      controlsWithEvents: controls.controlsWithEvents,
      controlsWithoutEvents: controls.controlsWithoutEvents,
    };
  }

  initialiseMaps() {
    const controls = this.props.controlEvents ? this.props.controlEvents : [];
    const controlsWithEvents = new Map();
    const controlsWithoutEvents = new Map();
    _.each(controls, control => {
      const key = control.id.toString();
      if (control.events) controlsWithEvents.set(key, control);
      else controlsWithoutEvents.set(key, control);
    });
    return { controlsWithEvents, controlsWithoutEvents };
  }

  updateDropDownSelection(element) {
    const selectedControlId = element.target.value;
    const control = this.state.controlsWithoutEvents.get(selectedControlId);
    if (control) {
      this.addToMap('controlsWithEvents', control);
      this.removeFromMap('controlsWithoutEvents', control);
    }
  }

  addToMap(key, control) {
    const newState = Object.assign(this.state[key]);
    newState.set(control.id, control);
    this.setState({ [key]: newState });
  }

  removeFromMap(key, control) {
    const newState = Object.assign(this.state[key]);
    newState.delete(control.id);
    this.setState({ [key]: newState });
  }

  showObsControlScriptEditorModal(controlScript, controlEventTitleId,
                                  controlEventTitleName, editorRef) {
    if (controlEventTitleId !== undefined) {
      return (<ObsControlScriptEditorModal
        close={this.props.close}
        script={controlScript}
        textAreaRef={editorRef}
        titleId={controlEventTitleId}
        titleName={controlEventTitleName}
        updateScript={this.props.updateScript}
      />
      );
    }
    return null;
  }

  render() {
    const formDetailEvents = this.props.formDetails.events ? this.props.formDetails.events
      : { onFormInit: undefined, onFormSave: undefined };
    return (
        <div className="form-conditions-modal-container">
          <h2 className="header-title">{this.props.formTitle} - Form Conditions</h2>
            <div className="left-panel" >
              { this.showObsControlScriptEditorModal(formDetailEvents.onFormInit, null,
                'Form Event', this.formEventRef)}
              { this.showObsControlScriptEditorModal(formDetailEvents.onFormSave, null,
                'Save Event', this.saveEventRef)}
            </div>
            <div className="right-panel" >
              <div className="control-events-header">
                <label className="label" >Control Events:</label>

                {!_.isEmpty(this.state.controlsWithoutEvents) &&

                <select className="obs-dropdown" onChange={this.updateDropDownSelection}>
                  <option key="0" value="0">Select Control</option>
                  {[...this.state.controlsWithoutEvents.keys()].map(key =>
                      <option key={key} value={key}>{this.state.controlsWithoutEvents.get(key).name}
                      </option>)
                  }
                </select>}

                </div>
              <div>
                {[...this.state.controlsWithEvents.keys()].map(key => {
                  const value = this.state.controlsWithEvents.get(key);
                  return this.showObsControlScriptEditorModal(
                      value.events ? value.events.onValueChange : undefined, key,
                      value.name, this[`${key}_ref`]);
                })}
              </div>
            </div>

          <div className="button-wrapper" >
            <button className="button btn--highlight" type="submit">
              Save
            </button>
            <button className="btn" onClick={() => this.props.close()} type="reset">
              Cancel
            </button>
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
  updateScript: PropTypes.func.isRequired,
};

FormConditionsModal.defaultProps = {
  formDetails: { events: {} },
};

