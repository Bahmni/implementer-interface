import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { selectControl } from 'form-builder/actions/control';
import { Draggable } from 'bahmni-form-controls';
import get from 'lodash/get';

class ControlWrapper extends Draggable {
  constructor(props) {
    super(props);
    this.control = window.componentStore.getDesignerComponent(props.metadata.type).control;
    this.props = props;
    this.metadata = Object.assign({}, props.metadata);
    this.onSelected = this.onSelected.bind(this);
    this.childControl = undefined;
    this.storeChildRef = this.storeChildRef.bind(this);
    this.getJsonDefinition = this.getJsonDefinition.bind(this);
    this.processDragStart = this.processDragStart.bind(this);
  }

  onSelected(event, metadata) {
    this.props.dispatch(selectControl(metadata));
    event.stopPropagation();
  }

  conditionallyAddConcept(newProps) {
    const concept = get(newProps.conceptToControlMap, this.metadata.id);
    if (concept && !this.metadata.concept) {
      const newMetadata = this.control.injectConceptToMetadata(this.metadata, concept);
      this.metadata = newMetadata;
      this.props.dispatch(selectControl(this.metadata));
    }
  }

  updateProperties(newProps) {
    const controlProperty = newProps.controlProperty;
    if (controlProperty && this.metadata.id === controlProperty.id) {
      const childMetadata = this.childControl.getJsonDefinition();
      const childProperties = childMetadata.properties;
      const updatedProperties = Object.assign({}, childProperties, controlProperty.property);
      this.metadata = Object.assign({}, this.metadata, { properties: updatedProperties });
      this.props.dispatch(selectControl(this.metadata));
    }
  }

  componentWillUpdate(newProps) {
    this.conditionallyAddConcept(newProps);
    this.updateProperties(newProps);
    if (this.metadata.id !== newProps.metadata.id) {
      this.metadata = Object.assign({}, this.metadata, newProps.metadata);
      this.control = window.componentStore.getDesignerComponent(this.metadata.type).control;
    }
  }

  getJsonDefinition() {
    if (this.childControl) {
      return this.childControl.getJsonDefinition();
    }
    return undefined;
  }

  processDragStart() {
    return this.getJsonDefinition();
  }

  storeChildRef(ref) {
    if (ref) {
      this.childControl = ref;
    }
  }

  render() {
    const onDragEndFunc = this.onDragEnd(this.metadata);
    return (
      <div
        className="control-wrapper"
        draggable="true"
        onDragEnd={ (e) => onDragEndFunc(e) }
        onDragStart={ this.onDragStart(this.metadata) }
      >
        <this.control metadata={ this.metadata }
          onSelect={ this.onSelected }
          ref={this.storeChildRef}
        />
      </div>
    );
  }
}

ControlWrapper.propTypes = {
  controlProperty: PropTypes.shape({
    id: PropTypes.string,
    property: PropTypes.object,
  }),
  metadata: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    conceptToControlMap: state.conceptToControlMap,
    controlProperty: state.controlProperty,
  };
}

export default connect(mapStateToProps, null, null, { withRef: true })(ControlWrapper);
