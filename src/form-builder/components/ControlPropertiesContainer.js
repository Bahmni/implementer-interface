import React, { Component, PropTypes } from 'react';
import { AutoComplete } from 'bahmni-form-controls';
import { formBuilderConstants as constants } from 'form-builder/constants';
import { connect } from 'react-redux';
import { selectSource } from 'form-builder/actions/control';

class ControlPropertiesContainer extends Component {
  constructor() {
    super();
    this.onSelect = this.onSelect.bind(this);
  }

  onSelect(concept) {
    this.props.dispatch(selectSource(concept, this.props.selectedControl.id));
  }

  displayAutoComplete() {
    const { selectedControl, conceptToControlMap } = this.props;
    if (selectedControl) {
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
        />);
    }
    return null;
  }

  render() {
    return (
      <div className="section-grid">
        <h2 className="header-title">Control Properties</h2>
        {this.displayAutoComplete()}
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
    selectedControl: state.controlDetails.selectedControl,
    conceptToControlMap: state.conceptToControlMap,
  };
}

export default connect(mapStateToProps)(ControlPropertiesContainer);
