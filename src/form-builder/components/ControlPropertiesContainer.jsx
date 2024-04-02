import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AutoComplete } from 'bahmni-form-controls';
import { formBuilderConstants as constants } from 'form-builder/constants';
import { connect } from 'react-redux';
import { selectSource, setChangedProperty } from 'form-builder/actions/control';
import { PropertyEditor } from 'form-builder/components/PropertyEditor.jsx';
import { httpInterceptor } from 'common/utils/httpInterceptor';
import { commonConstants } from 'common/constants';
import { UrlHelper } from 'form-builder/helpers/UrlHelper';
import filter from 'lodash/filter';

export class ControlPropertiesContainer extends Component {
  constructor() {
    super();
    this.onSelect = this.onSelect.bind(this);
    this.filterOptions = this.filterOptions.bind(this);
  }

  onSelect(concept) {
    const conceptName = concept.name.name;
    httpInterceptor
      .get(new UrlHelper().getFullConceptRepresentation(conceptName))
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
    this.setState({ notification: errorNotification });
    setTimeout(() => {
      this.setState({ notification: {} });
    }, commonConstants.toastTimeout);
  }

  filterOptions(options) {
    return filter(options, (option) => {
      const datatype = option.datatype && option.datatype.name;
      return !(datatype === 'N/A' && !option.set);
    });
  }

  displayAutoComplete() {
    const { selectedControl, conceptToControlMap } = this.props;
    const value = (conceptToControlMap && conceptToControlMap[selectedControl.id]);
    const disableAutoComplete = value !== undefined;
    const supportedDataTypes = (selectedControl.type === 'obsControl') ?
      constants.supportedObsDataTypes : constants.supportedObsGroupDataTypes;
    const dataTypesQueryParam = `dataTypes=${supportedDataTypes}`;
    const representation = `v=${constants.conceptRepresentation}&name=`;
    const queryParams = `?s=byDataType&${dataTypesQueryParam}&${representation}`;
    const optionsUrl = `${constants.conceptUrl}${queryParams}`;
    return (
      <AutoComplete
        autofocus
        enabled={!disableAutoComplete}
        filterOptions={this.filterOptions}
        onValueChange={this.onSelect}
        optionsUrl={optionsUrl}
        value={value}
      />
    );
  }

  displayPropertyEditor() {
    const { selectedControl, selectedControl: { id, concept } } = this.props;
    if (concept || selectedControl.type === 'section' || selectedControl.type === 'imageView') {
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
          {this.isObsOrObsGroupControl(selectedControl) && this.displayAutoComplete()}
          <div>Control ID<span className="control-id">{selectedControl.id}</span></div>
          {this.displayPropertyEditor()}
        </div>
      );
    }
    return null;
  }

  isObsOrObsGroupControl(selectedControl) {
    return selectedControl && (selectedControl.type === 'obsControl' ||
      selectedControl.type === 'obsGroupControl');
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
