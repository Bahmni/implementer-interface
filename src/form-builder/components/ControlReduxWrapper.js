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

  componentWillUpdate(newProps) {
    const concept = get(newProps.conceptToControlMap, this.metadata.id);
    if (concept && !this.metadata.concept) {
      const newMetadata = this.control.injectConceptToMetadata(this.metadata, concept);
      this.metadata = newMetadata;
    } else if (this.metadata.id !== newProps.metadata.id) {
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
  metadata: PropTypes.object,
};

function mapStateToProps(state) {
  return { conceptToControlMap: state.conceptToControlMap };
}

export default connect(mapStateToProps, null, null, { withRef: true })(ControlWrapper);
