import React, { Component, PropTypes } from 'react';
import { AutoComplete } from 'bahmni-form-controls';
import { formBuilderConstants as constants } from 'form-builder/constants';
import { connect } from 'react-redux';
import { selectSource, setChangedProperty } from 'form-builder/actions/control';
import { PropertyEditor } from 'form-builder/components/PropertyEditor.jsx';
import { httpInterceptor } from 'common/utils/httpInterceptor';
import { formBuilderConstants } from 'form-builder/constants';
import { commonConstants } from 'common/constants';

class ControlPropertiesContainer extends Component {
  constructor() {
    super();
    this.onSelect = this.onSelect.bind(this);
  }

  onSelect(concept) {
    const conceptName = concept.name.name;
    httpInterceptor
      .get(formBuilderConstants.getFullConceptRepresentation(conceptName))
      .then((data) => {
        const result = data.results[0];
        result.display = result.name.name;
        this.props.dispatch(selectSource(result, this.props.selectedControl.id));
      })
      .catch((error) => this.setErrorMessage(error));
  }

  onPropertyUpdate(properties, id) {
    this.props.dispatch(setChangedProperty(properties, id));
  }

  setErrorMessage(error) {
    const errorNotification = { message: error.message, type: commonConstants.responseType.error };
    const notificationsClone = this.state.notifications.slice(0);
    notificationsClone.push(errorNotification);
    this.setState({ notifications: notificationsClone });
  }

  displayAutoComplete() {
    const { selectedControl, conceptToControlMap } = this.props;
    const value = (conceptToControlMap && conceptToControlMap[selectedControl.id]);
    const disableAutoComplete = value !== undefined;
    const dataTypesQueryParam = `dataTypes=${constants.supportedDataTypes}`;
    const representation = `v=${constants.conceptRepresentation}&name=`;
    const queryParams = `?s=byDataType&${dataTypesQueryParam}&${representation}`;
    const optionsUrl = `${constants.conceptUrl}${queryParams}`;
    return (
      <AutoComplete
        autofocus
        disabled={disableAutoComplete}
        onValueChange={this.onSelect}
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
