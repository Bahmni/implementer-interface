import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ObsControlScriptEditorModal from 'form-builder/components/ObsControlScriptEditorModal';
import _ from 'lodash';

export default class FormConditionsModal extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedControl: {
      id: undefined,
      name: undefined,
      controlEvent: undefined,
    } };
    props.controlEvents.forEach(control => {this[`${control.id}_ref`] = React.createRef();});
    this.formEventRef = React.createRef();
    this.saveEventRef = React.createRef();
    this.prevSelectedControlId = undefined;
    this.selectedControlId = undefined;
    this.updateDropDownSelection = this.updateDropDownSelection.bind(this);
  }

  updateDropDownSelection(element) {
    this.prevSelectedControlId = this.selectedControlId;
    this.selectedControlId = element.target.value;
    const selectedControl = this.props.controlEvents
        .find(control => control.id === this.selectedControlId);
    if (selectedControl && selectedControl.events && selectedControl.events.onValueChange) {
      selectedControl.controlEvent = selectedControl.events.onValueChange;
      delete(selectedControl.events);
    }
    if (this.selectedControlId !== this.prevSelectedControlId) {
      this.setState({ selectedControl });
    }
  }

  showObsControlScriptEditorModal(controlScript, controlEventTitleId, controlEventTitleName,
                                  editorRef) {
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
    const obs = this.props.controlEvents ? this.props.controlEvents : [];
    const obsWithControlEvents = obs.filter(o => o.events !== undefined);
    const obsWithoutControlEvents = obs.filter(o => o.events === undefined);
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
                <select className="obs-dropdown" onChange={this.updateDropDownSelection}>
                  <option key="0" value="0" >Select Control</option>)
                  {obsWithoutControlEvents.map((e) =>
                    <option key={e.id} value={e.id} >{e.name}</option>)}
                </select>
              </div>
              <div>
                {
                  obsWithControlEvents.map((e) =>
                  this.showObsControlScriptEditorModal(e.events.onValueChange, e.id, e.name,
                    this[`${e.id}_ref`]))
                }
              </div>
              {
                <div> {this.showObsControlScriptEditorModal(this.state.selectedControl.controlEvent,
                  this.state.selectedControl.id, this.state.selectedControl.name)}
                  <span className="line-break-2" />
                </div>
              }
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
  selectedControlEventTitleId: PropTypes.string,
  selectedControlEventTitleName: PropTypes.string,
  selectedControlScript: PropTypes.string,
  updateScript: PropTypes.func.isRequired,
};

FormConditionsModal.defaultProps = {
  formDetails: { events: {} },
};

