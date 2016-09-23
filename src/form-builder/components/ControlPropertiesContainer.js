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
    if (this.props.selectedControlId) {
      const optionsUrl = `${constants.conceptUrl}?v=${constants.conceptRepresentation}&q=`;
      return (<AutoComplete onSelect={this.onSelect} optionsUrl={optionsUrl} />);
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
  dispatch: PropTypes.func,
  selectedControlId: PropTypes.string,
};

function mapStateToProps(state) {
  return { selectedControlId: state.controlDetails.selectedControl };
}

export default connect(mapStateToProps)(ControlPropertiesContainer);
