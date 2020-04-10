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
    this.removeControlEvent = this.removeControlEvent.bind(this);
    props.controlEvents.forEach(control => {
      this[`${control.id}_ref`] = React.createRef();
    });
    this.formEventRef = React.createRef();
    this.saveEventRef = React.createRef();
    this.state = {
      controlsWithEvents: controls.controlsWithEvents,
      controlsWithoutEvents: controls.controlsWithoutEvents,
    };
    this.formConditionsSave = this.formConditionsSave.bind(this);
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

  removeControlEvent(controlId) {
    const control = this.state.controlsWithEvents.get(controlId);
    if (control && control.events) {
      control.events.onValueChange = undefined;
    }
    this.removeFromMap('controlsWithEvents', control);
    this.addToMap('controlsWithoutEvents', control);
  }

  showObsControlScriptEditorModal(controlScript, controlEventTitleId,
                                  controlEventTitleName, editorRef) {
    if (controlEventTitleId !== undefined) {
      return (<ObsControlScriptEditorModal
        close={this.props.close}
        removeControlEvent={this.removeControlEvent}
        script={controlScript}
        textAreaRef={editorRef}
        titleId={controlEventTitleId}
        titleName={controlEventTitleName}
      />
      );
    }
    return null;
  }

  formConditionsSave() {
    const controlScripts = [];
    this.props.controlEvents.forEach(control => {
      const eventScript = this[`${control.id}_ref`].current
        && this[`${control.id}_ref`].current.value;
      if (eventScript) {
        controlScripts.push({
          id: control.id,
          name: control.name,
          events: { onValueChange: eventScript },
        });
      } else {
        controlScripts.push({
          id: control.id,
          name: control.name,
        });
      }
    });
    const formSaveEventScript = this.saveEventRef.current.value;
    const formInitEventScript = this.formEventRef.current.value;
    this.props.updateAllScripts({ controlScripts, formSaveEventScript, formInitEventScript });
    this.props.close();
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
                      <option key={key} value={key}>
                        {`${key} - ${this.state.controlsWithoutEvents.get(key).name}`}
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
            <button className="button btn--highlight" onClick={this.formConditionsSave}
              type="submit"
            >
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
  updateAllScripts: PropTypes.func.isRequired,
};

FormConditionsModal.defaultProps = {
  formDetails: { events: {} },
};

