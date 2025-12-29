import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ObsControlScriptEditorModal from 'form-builder/components/ObsControlScriptEditorModal';
import _ from 'lodash';
import NotificationContainer from 'common/Notification';
import { commonConstants } from 'common/constants';
import { base64ToUtf8 } from 'common/utils/encodingUtils';

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
    this.formDefVersion = props.formDefVersion || 1.0;
    props.controlEvents.forEach(control => {
      this[`${control.id}_ref`] = React.createRef();
    });
    this.formEventRef = React.createRef();
    this.saveEventRef = React.createRef();
    this.state = {
      controlsWithEvents: controls.controlsWithEvents,
      controlsWithoutEvents: controls.controlsWithoutEvents,
      errorMessage: {},
      formEventsErrors: { hasFormSaveError: false, hasFormInitError: false },
    };
    this.formConditionsSave = this.formConditionsSave.bind(this);
    this.updateErrorInMap = this.updateErrorInMap.bind(this);
    this.setErrorMessage = this.setErrorMessage.bind(this);
    this.rightPanelRef = React.createRef();
  }

  componentDidMount() {
    this.rightPanelRef.current.scrollTo(0, 0);
  }

  setErrorMessage(errorMessage) {
    const errorNotification = {
      message: errorMessage,
      type: commonConstants.responseType.error,
    };
    this.setState({ errorMessage: errorNotification });
    setTimeout(() => {
      this.setState({ errorMessage: {} });
    }, commonConstants.toastTimeout);
  }

  initialiseMaps() {
    const controls = this.props.controlEvents ? this.props.controlEvents : [];
    const controlsWithEvents = new Map();
    const controlsWithoutEvents = new Map();
    _.each(controls, control => {
      const key = control.id.toString();
      if (control.events) {
        const controlWithError = Object.assign({}, control, { hasError: false });
        controlsWithEvents.set(key, controlWithError);
      } else controlsWithoutEvents.set(key, control);
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
    const newState = new Map(this.state[key]);
    newState.set(control.id, control);
    this.setState({ [key]: newState });
  }

  removeFromMap(key, control) {
    const newState = new Map(this.state[key]);
    newState.delete(control.id);
    this.setState({ [key]: newState });
  }

  removeControlEvent(controlId) {
    const control = _.cloneDeep(this.state.controlsWithEvents.get(controlId));
    if (control && control.events) {
      this[`${controlId}_ref`].current = { value: undefined };
      control.events.onValueChange = undefined;
    }
    this.removeFromMap('controlsWithEvents', control);
    this.addToMap('controlsWithoutEvents', control);
  }

  decodeEventScript(controlScript) {
    if (this.formDefVersion < 2.0) {
      return controlScript;
    }
    return base64ToUtf8(controlScript);
  }

  showObsControlScriptEditorModal(controlScript, controlEventTitleId,
                                  controlEventTitleName, editorRef, hasError) {
    const eventScript = (controlEventTitleId == undefined && controlEventTitleName == undefined) ? '' : this.decodeEventScript(controlScript);
    return (<ObsControlScriptEditorModal
      close={this.props.close}
      hasError={hasError}
      key={`${controlEventTitleName}_${controlEventTitleId}`}
      removeControlEvent={this.removeControlEvent}
      script={eventScript}
      textAreaRef={editorRef}
      titleId={controlEventTitleId}
      titleName={controlEventTitleName}
    />
    );
  }

  updateErrorInMap(control, hasError) {
    const newState = this.state.controlsWithEvents;
    newState.set(control.id, Object.assign({}, control, { hasError }));
    this.setState({ controlsWithEvents: newState });
  }

  formConditionsSave() {
    const controlScripts = [];
    let hasErrors = false;
    this.props.controlEvents.forEach(control => {
      const eventScript = this[`${control.id}_ref`].current
        && this[`${control.id}_ref`].current.value;
      if (eventScript) {
        if (!this.isValid(eventScript)) {
          hasErrors = true;
          this.updateErrorInMap(control, true);
        } else {
          this.updateErrorInMap(control, false);
        }
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
    const formSaveEventScript = this.saveEventRef.current && this.saveEventRef.current.value;
    const formInitEventScript = this.formEventRef.current && this.formEventRef.current.value;
    const formEventsErrors = { hasFormSaveError: false, hasFormInitError: false };
    formEventsErrors.hasFormInitError = !this.isValid(formInitEventScript);
    formEventsErrors.hasFormSaveError = !this.isValid(formSaveEventScript);
    hasErrors = hasErrors || formEventsErrors.hasFormInitError || formEventsErrors.hasFormSaveError;
    this.setState({ formEventsErrors });
    if (!hasErrors) {
      this.props.updateAllScripts({ controlScripts, formSaveEventScript, formInitEventScript });
      this.props.close();
    } else {
      this.setErrorMessage('Please enter valid javascript function(s)');
    }
  }

  isValid(eventScript) {
    try {
      /* eslint-disable no-eval*/
      if (!_.isEmpty(eventScript)) {
        eval(`(${eventScript})`);
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  render() {
    const formDetailEvents = this.props.formDetails.events ? this.props.formDetails.events
      : { onFormInit: undefined, onFormSave: undefined };
    return (
        <div className="form-conditions-modal-container">
          <NotificationContainer notification={this.state.errorMessage} />
          <h2 className="header-title">{this.props.formTitle} - Form Conditions</h2>
            <div className="left-panel" >
              { this.showObsControlScriptEditorModal(formDetailEvents.onFormInit, null,
                'Form Event', this.formEventRef, this.state.formEventsErrors.hasFormInitError)}
              { this.showObsControlScriptEditorModal(formDetailEvents.onFormSave, null,
                'Save Event', this.saveEventRef, this.state.formEventsErrors.hasFormSaveError)}
            </div>
            <div className="right-panel" ref={this.rightPanelRef}>
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
                      value.name, this[`${key}_ref`], value.hasError);
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
  formDefVersion: PropTypes.number,
};

FormConditionsModal.defaultProps = {
  formDetails: { events: {} },
};

