import React, { Component, PropTypes } from 'react';
import { AutoComplete } from 'bahmni-form-controls';
import { formBuilderConstants as constants } from 'form-builder/constants';
import { connect } from 'react-redux';

class ControlPropertiesContainer extends Component {
  displayAutoComplete() {
    if (this.props.selectedControlId) {
      const optionsUrl = `${constants.conceptUrl}?v=${constants.conceptRepresentation}&q=`;
      return (<AutoComplete optionsUrl={optionsUrl} />);
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
  selectedControlId: PropTypes.string,
};

function mapStateToProps(state) {
  return { selectedControlId: state.controlDetails.selectedControl };
}

export default connect(mapStateToProps)(ControlPropertiesContainer);
