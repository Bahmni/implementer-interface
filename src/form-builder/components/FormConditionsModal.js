import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ObsControlScriptEditorModal from 'form-builder/components/ObsControlScriptEditorModal';

export default class FormConditionsModal extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedControlEventTitleId: undefined,
      selectedControlEventTitleName: undefined, selectedControlScript: undefined };
    this.selectedControlOption = undefined;
    this.prevSelectedControlOption = undefined;
    this.selectedControlTitleId = undefined;
    this.selectedControlTitleName = undefined;
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
    this.selectedControlTitleId = selectedControlEventObj ? selectedControlEventObj.id : undefined;
    this.selectedControlTitleName = selectedControlEventObj ? selectedControlEventObj.name :
      undefined;
    this.selectedControlScript = selectedControlScriptObj ?
      selectedControlScriptObj.onValueChange : undefined;
    if (this.selectedControlOption !== this.prevSelectedControlOption) {
      this.setState({ selectedControlEventTitleId: this.selectedControlTitleId });
      this.setState({ selectedControlEventTitleName: this.selectedControlTitleName });
      this.setState({ selectedControlScript: this.selectedControlScript });
    }
  }

  showObsControlScriptEditorModal(controlScript, controlEventTitleId, controlEventTitleName) {
    if (controlEventTitleId !== undefined) {
      return (<ObsControlScriptEditorModal
        close={this.props.close}
        script={controlScript}
        titleId={controlEventTitleId}
        titleName={controlEventTitleName}
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
    const formDetailEvents = this.props.formDetails.events ? this.props.formDetails.events
      : { onFormInit: undefined, onFormSave: undefined };
    return (
        <div className="form-conditions-modal-container">
          <h2 className="header-title">{this.props.formTitle} - Form Conditions</h2>

            <div className="left-panel" >
              { this.showObsControlScriptEditorModal(formDetailEvents.onFormInit, null,
                'Form Event')}
              { this.showObsControlScriptEditorModal(formDetailEvents.onFormSave, null,
                'Save Event')}
            </div>
            <div className="right-panel" >
              <div className="control-events-header">
                <label className="label" >Control Events:</label>
                <select className="obs-dropdown" onChange={this.updateSelectedOption}>
                  <option key="0" value="0" >Select Control</option>)
                  {obsWithoutControlEvents.map((e) =>
                    <option key={e.id} value={e.id} >{e.name}</option>)}
                </select>
              </div>
              <div>
                {
                  ObsWithControlEvents.map((e) =>
                  this.showObsControlScriptEditorModal(e.events.onValueChange, e.id, e.name)
                  )
                }
              </div>
              {
                <div> {this.showObsControlScriptEditorModal(this.state.selectedControlScript,
                  this.state.selectedControlEventTitleId, this.state.selectedControlEventTitleName)}
                  <span className="line-break-2"></span>
                </div>
              }
            </div>

          <div className="button-wrapper" >
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

