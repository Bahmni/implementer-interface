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
    this.props.dispatch(selectSource(concept, this.props.selectedControlId));
  }

  displayAutoComplete() {
    const { selectedControlId, conceptToControlMap } = this.props;
    if (selectedControlId) {
      let value = (conceptToControlMap && conceptToControlMap[selectedControlId]);
      value = value ? [value] : [];
      const optionsUrl = `${constants.conceptUrl}?v=${constants.conceptRepresentation}&q=`;
      return (<AutoComplete onSelect={this.onSelect} optionsUrl={optionsUrl} value={value} />);
    }
    return null;
  }

  render() {
    return (
      <div>
        <div className="control-properties-title">Control Properties</div>
        {this.displayAutoComplete()}
      </div>
    );
  }
}

ControlPropertiesContainer.propTypes = {
  conceptToControlMap: PropTypes.object,
  dispatch: PropTypes.func,
  selectedControlId: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    selectedControlId: state.controlDetails.selectedControl,
    conceptToControlMap: state.conceptToControlMap,
  };
}

export default connect(mapStateToProps)(ControlPropertiesContainer);
