import React, { Component, PropTypes } from 'react';
import { AutoComplete } from 'bahmni-form-controls';
import { formBuilderConstants as constants } from 'form-builder/constants';
import { connect } from 'react-redux';
import { selectSource, setChangedProperty } from 'form-builder/actions/control';
import { PropertyEditor } from 'form-builder/components/PropertyEditor';

class ControlPropertiesContainer extends Component {
  constructor() {
    super();
    this.onSelect = this.onSelect.bind(this);
  }

  onSelect(concept) {
    this.props.dispatch(selectSource(concept, this.props.selectedControl.id));
  }

  onPropertyUpdate(properties, id) {
    this.props.dispatch(setChangedProperty(properties, id));
  }

  displayAutoComplete() {
    const { selectedControl, conceptToControlMap } = this.props;
    let value = (conceptToControlMap && conceptToControlMap[selectedControl.id]);
    value = value ? [value] : [];
    const disableAutoComplete = (value.length > 0);
    const optionsUrl = `${constants.conceptUrl}?v=${constants.conceptRepresentation}&q=`;
    return (
      <AutoComplete
        disabled={disableAutoComplete}
        onSelect={this.onSelect}
        optionsUrl={optionsUrl}
        value={value}
      />
    );
  }

  displayPropertyEditor() {
    const { selectedControl, selectedControl: { id, concept } } = this.props;
    if (concept) {
      return (
        <PropertyEditor
          metadata={selectedControl}
          onPropertyUpdate={(property) => this.onPropertyUpdate(property, id)}
        />
      );
    }
    return null;
  }

  displayControlPropertyDetails() {
    const { selectedControl } = this.props;
    if (selectedControl) {
      return (
        <div className="obs-control-wrap">
          {this.displayAutoComplete()}
          {this.displayPropertyEditor()}
        </div>
      );
    }
    return null;
  }

  render() {
    return (
      <div className="section-grid">
        <h2 className="header-title">Control Properties</h2>
        {this.displayControlPropertyDetails()}
      </div>
    );
  }
}

ControlPropertiesContainer.propTypes = {
  conceptToControlMap: PropTypes.object,
  dispatch: PropTypes.func,
  selectedControl: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    conceptToControlMap: state.conceptToControlMap,
    selectedControl: state.controlDetails.selectedControl,
  };
}

export default connect(mapStateToProps)(ControlPropertiesContainer);
