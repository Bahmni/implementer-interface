import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  formEventUpdate,
  formLoad,
  saveEventUpdate,
  sourceChangedProperty,
  formDefVersionUpdate,
} from 'form-builder/actions/control';
import { setChangedProperty, formConditionsEventUpdate } from 'form-builder/actions/control';
import { formBuilderConstants } from 'form-builder/constants';
import { utf8ToBase64 } from 'common/utils/encodingUtils';
export const FormEventEditor = (props) => {
  const { property, formDetails, formControlEvents,
    updateAllScripts, selectedControlId } = props;
  const updateScript = (script) => {
    props.updateScript(script, property, selectedControlId);
  };
  const closeEventEditor = () => {
    props.closeEventEditor(selectedControlId);
  };
  return (
    <div>
      {React.cloneElement(props.children, { property, formDetails,
        closeEventEditor, selectedControlId,
        formControlEvents, updateScript, updateAllScripts })}
    </div>
  );
};

FormEventEditor.propTypes = {
  children: PropTypes.element.isRequired,
  closeEventEditor: PropTypes.func.isRequired,
  formControlEvents: PropTypes.Array,
  formDetails: PropTypes.shape({
    events: PropTypes.shape({
      onFormInit: PropTypes.string,
      onFormSave: PropTypes.string,
      onFormConditionsUpdate: PropTypes.string,
    }),
  }),
  property: PropTypes.shape({
    formInitEvent: PropTypes.bool,
    formSaveEvent: PropTypes.bool,
    formConditionsEvent: PropTypes.bool,
  }),
  selectedControlId: PropTypes.string,
  updateAllScripts: PropTypes.func.isRequired,
  updateScript: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  property: state.controlProperty ? state.controlProperty.property : undefined,
  formDetails: state.formDetails, formControlEvents: state.controlDetails.allObsControlEvents,
  selectedControlId: state.controlDetails.selectedControl
    && state.controlDetails.selectedControl.id,
});

function encodeControlScipts(controlScripts) {
  if (!controlScripts) {
    return [];
  }
  return controlScripts.map(control => {
    if (control.events) {
      const encodedEvents = {};
      Object.keys(control.events).forEach(eventKey => {
        encodedEvents[eventKey] = utf8ToBase64(control.events[eventKey]);
      });
      const _ctrl = Object.assign({}, control, { events: encodedEvents });
      return _ctrl;
    }
    return control;
  });
}

const mapDispatchToProps = (dispatch) => ({
  closeEventEditor: (selectedControlId) => {
    dispatch(setChangedProperty({ formInitEvent: false }));
    dispatch(setChangedProperty({ formSaveEvent: false }));
    dispatch(setChangedProperty({ formConditionsEvent: false }));
    dispatch(setChangedProperty({ controlEvent: false }, selectedControlId));
  },
  updateScript: (script, property, selectedControlId) => {
    if (property.formSaveEvent) {
      dispatch(saveEventUpdate(utf8ToBase64(script)));
    } else if (property.formInitEvent) {
      dispatch(formEventUpdate(utf8ToBase64(script)));
    } else if (property.formConditionsEvent) {
      dispatch(formConditionsEventUpdate(utf8ToBase64(script)));
    }
    if (property.controlEvent) {
      dispatch(sourceChangedProperty(script, selectedControlId));
    }
  },
  updateAllScripts: ({ controlScripts, formSaveEventScript, formInitEventScript }) => {
    dispatch(saveEventUpdate(utf8ToBase64(formSaveEventScript)));
    dispatch(formEventUpdate(utf8ToBase64(formInitEventScript)));
    dispatch(formLoad(encodeControlScipts(controlScripts)));
    dispatch(formDefVersionUpdate(formBuilderConstants.formDefinitionVersion));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(FormEventEditor);
