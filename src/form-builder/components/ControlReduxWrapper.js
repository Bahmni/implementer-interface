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
    this.updateMetadata = this.updateMetadata.bind(this);
  }

  onSelected(event, id) {
    this.props.dispatch(selectControl(id));
    event.stopPropagation();
  }

  componentWillUpdate(newProps) {
    const concept = get(newProps.conceptToControlMap, this.metadata.id);
    if (concept && !this.metadata.concept) {
      const newMetadata = this.control.injectConceptToMetadata(this.metadata, concept);
      this.metadata = newMetadata;
      this.props.onUpdateMetadata(newMetadata);
    } else if (this.metadata.id !== newProps.metadata.id) {
      this.metadata = Object.assign({}, this.metadata, newProps.metadata);
    }
  }

  updateMetadata(newData) {
    this.metadata = Object.assign({}, this.metadata, newData);
    this.props.onUpdateMetadata(this.metadata);
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
          onUpdateMetadata={ this.updateMetadata }
        />
      </div>
    );
  }
}

ControlWrapper.propTypes = {
  metadata: PropTypes.object,
  onUpdateMetadata: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return { conceptToControlMap: state.conceptToControlMap };
}

export default connect(mapStateToProps)(ControlWrapper);
