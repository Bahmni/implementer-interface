import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { selectControl } from 'form-builder/actions/control';
import { componentMapper } from 'form-builder/helpers/componentMapper';
import { Draggable } from 'bahmni-form-controls';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual'

class ControlWrapper extends Draggable {
  constructor(props) {
    super(props);
    this.control = window.componentStore.getDesignerComponent(props.context.type).control;
    this.props = props;
    this.controlContext = Object.assign({},props.context);
    this.onSelected = this.onSelected.bind(this);
    this.updateMetadata = this.updateMetadata.bind(this);
  }

  onSelected(event, id) {
    this.props.dispatch(selectControl(id));
    event.stopPropagation();
  }

  componentWillUpdate(newProps) {
    const concept = get(newProps.conceptToControlMap, this.props.context.data.id);
    if (concept && !this.controlContext.data.concept) {
      this.controlContext.data = this.control.injectConceptToMetadata(this.controlContext.data, concept);
      this.props.onUpdateMetadata(this.controlContext.data);
    }
  }

  updateMetadata(newData) {
    this.controlContext.data = Object.assign({}, this.controlContext.data, newData);
    this.props.onUpdateMetadata(this.controlContext.data);
  }

  render() {
    return (
      <div onDragEnd={ this.onDragEnd(this.controlContext) } onDragStart={ this.onDragStart(this.controlContext) } >
        <this.control metadata={ this.controlContext.data } onSelect={ this.onSelected } onUpdateMetadata={ this.updateMetadata } />
      </div>
    );
  }
}

ControlWrapper.propTypes = {
  context: PropTypes.shape({
    type: PropTypes.string,
    metadata: PropTypes.object,
  }),
  idGenerator: PropTypes.func.isRequired,
  onUpdateMetadata: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return { conceptToControlMap: state.conceptToControlMap };
}

export default connect(mapStateToProps)(ControlWrapper);
