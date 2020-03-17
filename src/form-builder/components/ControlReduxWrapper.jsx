import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { focusControl, selectControl, dragSourceUpdate } from 'form-builder/actions/control';
import { blurControl, deselectControl, formEventUpdate, saveEventUpdate }
  from 'form-builder/actions/control';
import { Draggable } from 'bahmni-form-controls';
import { ComponentStore } from 'bahmni-form-controls';
import { Exception } from 'form-builder/helpers/Exception';
import { formBuilderConstants } from 'form-builder/constants';
import { addSourceMap, setChangedProperty,
  sourceChangedProperty, generateTranslations } from 'form-builder/actions/control';
import { getConceptFromMetadata } from 'form-builder/helpers/componentMapper';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';
import DeleteControlModal from 'form-builder/components/DeleteControlModal.jsx';
import ScriptEditorModal from './ScriptEditorModal';
import DragDropHelper from '../helpers/dragDropHelper.js';
import Popup from 'reactjs-popup';

export class ControlWrapper extends Draggable {
  constructor(props) {
    super(props);
    this.control = ComponentStore.getDesignerComponent(props.metadata.type).control;
    this.props = props;
    this.metadata = Object.assign({}, props.metadata);
    this.onSelected = this.onSelected.bind(this);
    this.childControl = undefined;
    const isBeingDragged = props.parentRef ? props.parentRef.props.isBeingDragged : false;
    this.state = { active: false, showDeleteModal: false, isBeingDragged };
    this.storeChildRef = this.storeChildRef.bind(this);
    this.getJsonDefinition = this.getJsonDefinition.bind(this);
    this.processDragStart = this.processDragStart.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.clearSelectedControl = this.clearSelectedControl.bind(this);
    this.clearControlProperties = this.clearControlProperties.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.closeDeleteModal = this.closeDeleteModal.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleControlDrop = this.handleControlDrop.bind(this);
  }

  onSelected(event, metadata) {
    this.props.dispatch(selectControl(metadata));
    event.stopPropagation();
  }

  clearSelectedControl(event) {
    this.props.dispatch(deselectControl());
    this.props.dispatch(blurControl());
    event.stopPropagation();
  }

  componentWillReceiveProps(nextProps) {
    const activeControl = (this.metadata.id === nextProps.focusedControl);
    if (!activeControl && nextProps.parentRef) {
      this.setState({ isBeingDragged: nextProps.parentRef.props.isBeingDragged });
    }
    this.setState({ active: activeControl });
  }

  conditionallyAddConcept(newProps) {
    const concept = get(newProps.conceptToControlMap, this.metadata.id);
    if (concept && !this.metadata.concept && this.control.injectConceptToMetadata) {
      const newMetadata = this.control.injectConceptToMetadata(
        this.metadata,
        concept,
        this.props.idGenerator
      );
      this.metadata = newMetadata;
      this.props.dispatch(selectControl(this.metadata));
    }
  }

  updateProperties(newProps) {
    const controlProperty = newProps.controlProperty;
    if (controlProperty && this.metadata.id === controlProperty.id) {
      const childMetadata = (this.metadata.type === 'section') ?
        this.metadata : this.childControl.getJsonDefinition();
      const childProperties = childMetadata.properties;
      const updatedProperties = Object.assign({}, childProperties, controlProperty.property);
      if (!isEqual(this.metadata.properties, updatedProperties)) {
        this.metadata = Object.assign({}, this.metadata, { properties: updatedProperties });
        this.props.dispatch(selectControl(this.metadata));
      }
    }
  }

  componentDidMount() {
    if (this.props.metadata && this.props.metadata.id && this.props.metadata.concept) {
      this.props.dispatch(addSourceMap(getConceptFromMetadata(this.props.metadata)));
    }
  }

  componentWillUpdate(newProps) {
    if (this.metadata.id !== newProps.metadata.id
      || this.metadata.controls !== newProps.metadata.controls) {
      this.metadata = Object.assign({}, this.metadata, { controls: newProps.metadata.controls });
      this.control = ComponentStore.getDesignerComponent(this.metadata.type).control;
    }
    this.conditionallyAddConcept(newProps);
    this.updateProperties(newProps);
  }

  getJsonDefinition(isBeingMoved) {
    if (this.childControl) {
      const jsonDefinition = this.childControl.getJsonDefinition();
      if (jsonDefinition === undefined && !isBeingMoved) {
        const conceptMissingMessage = formBuilderConstants.exceptionMessages.conceptMissing;
        throw new Exception(conceptMissingMessage);
      }
      this.props.dispatch(generateTranslations(jsonDefinition));
      return jsonDefinition;
    }
    return undefined;
  }

  processDragStart() {
    const metadata = this.getJsonDefinition(true);
    return metadata || this.props.metadata;
  }

  storeChildRef(ref) {
    if (ref) {
      this.childControl = ref;
    }
  }

  onFocus(event) {
    this.props.dispatch(focusControl(this.metadata.id));
    event.stopPropagation();
  }

  clearControlProperties() {
    this.props.dispatch(deselectControl());
  }

  confirmDelete() {
    this.setState({ showDeleteModal: true });
  }

  closeDeleteModal() {
    this.setState({ showDeleteModal: false });
  }

  showDeleteControlModal() {
    if (this.state.showDeleteModal) {
      return (
        <DeleteControlModal
          closeModal={() => this.closeDeleteModal()}
          controlId={this.props.metadata.id}
          controlName={this.props.metadata.name}
          deleteControl={this.props.deleteControl}
        />
      );
    }
    return null;
  }

  updateScript(script, properties) {
    if (properties.id) {
      this.props.dispatch(selectControl(this.metadata));
      this.props.dispatch(sourceChangedProperty(script));
    } else {
      const isSaveEvent = properties.property.formSaveEvent;
      if (isSaveEvent) {
        this.props.dispatch(saveEventUpdate(script));
      } else {
        this.props.dispatch(formEventUpdate(script));
      }
    }
    this.closeScriptEditorDialog(properties.id);
  }

  closeScriptEditorDialog(id) {
    if (id) {
      this.props.dispatch(setChangedProperty({ controlEvent: false }, id));
    } else {
      this.props.dispatch(setChangedProperty({ formInitEvent: false }));
      this.props.dispatch(setChangedProperty({ formSaveEvent: false }));
    }
  }

  getScript(properties) {
    const selectedControl = this.props.selectedControl;
    if (properties.id && selectedControl) {
      return selectedControl.events && selectedControl.events.onValueChange;
    }
    const formDetails = this.props.formDetails;
    const isSaveEvent = properties.property.formSaveEvent;
    return formDetails.events
      && (isSaveEvent ? formDetails.events.onFormSave : formDetails.events.onFormInit);
  }

  showScriptEditorDialog() {
    const properties = this.props.controlProperty;
    if (properties && properties.property &&
      (properties.id === this.metadata.id && properties.property.controlEvent)) {
      return (
        <Popup className="form-event-popup"
          open={properties.id === this.metadata.id && properties.property.controlEvent}
          position="top center"
        >
        <ScriptEditorModal
          close={() => this.closeScriptEditorDialog(properties.id)}
          script={this.getScript(properties)}
          updateScript={(script) => this.updateScript(script, properties)}
        />
        </Popup>
      );
    }
    return null;
  }

  handleDragStart(e, onDragStart) {
    this.setState({ isBeingDragged: true });
    this.props.dispatch(dragSourceUpdate(this.props.parentRef));
    onDragStart(e);
  }

  handleControlDrop({ metadata, successCallback, dropCell }) {
    DragDropHelper.processControlDrop({ dragSourceCell: this.props.dragSourceCell,
      successfulDropCallback: successCallback, dropCell, metadata });
    this.props.dispatch(dragSourceUpdate(undefined));
  }

  render() {
    const onDragStart = this.onDragStart(this.metadata);
    const draggable = this.props.dragAllowed !== undefined ?
      this.props.dragAllowed.toString() : true;
    return (
      <div
        className={
          classNames('control-wrapper', { 'control-selected': this.state.active }, 'clearfix')
        }
        draggable={draggable}
        onDragStart={ (e) => this.handleDragStart(e, onDragStart)}
        onFocus={(e) => this.onFocus(e)}
        tabIndex="1"
      >
        <this.control
          clearSelectedControl={ this.clearSelectedControl}
          deleteControl={ this.confirmDelete }
          dispatch={this.clearControlProperties}
          dragSourceCell= {this.props.dragSourceCell}
          idGenerator={ this.props.idGenerator}
          isBeingDragged= {this.state.isBeingDragged}
          metadata={ this.metadata }
          onControlDrop={this.handleControlDrop}
          onSelect={ this.onSelected }
          ref={ this.storeChildRef }
          setError={this.props.setError}
          showDeleteButton={ this.props.showDeleteButton && this.state.active }
          wrapper={ this.props.wrapper }

        />
        { this.showDeleteControlModal() }
        { this.showScriptEditorDialog() }
      </div>
    );
  }
}

ControlWrapper.propTypes = {
  controlProperty: PropTypes.shape({
    id: PropTypes.string,
    property: PropTypes.object,
  }),
  deleteControl: PropTypes.func,
  dragSourceCell: PropTypes.object,
  formDetails: PropTypes.shape({
    events: PropTypes.object,
  }),
  metadata: PropTypes.object,
  setError: PropTypes.func,
  showDeleteButton: PropTypes.bool,
  wrapper: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    conceptToControlMap: state.conceptToControlMap,
    controlProperty: state.controlProperty,
    formDetails: state.formDetails,
    focusedControl: state.controlDetails.focusedControl,
    selectedControl: state.controlDetails.selectedControl,
    dragSourceCell: state.controlDetails.dragSourceCell,
  };
}

export default connect(mapStateToProps, null, null, { forwardRef: true })(ControlWrapper);
