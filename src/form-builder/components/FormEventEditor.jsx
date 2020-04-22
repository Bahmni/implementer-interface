import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  formEventUpdate,
  formLoad,
  saveEventUpdate,
  sourceChangedProperty,
} from 'form-builder/actions/control';
import { setChangedProperty, formConditionsEventUpdate } from 'form-builder/actions/control';
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

const mapDispatchToProps = (dispatch) => ({
  closeEventEditor: (selectedControlId) => {
    dispatch(setChangedProperty({ formInitEvent: false }));
    dispatch(setChangedProperty({ formSaveEvent: false }));
    dispatch(setChangedProperty({ formConditionsEvent: false }));
    dispatch(setChangedProperty({ controlEvent: false }, selectedControlId));
  },
  updateScript: (script, property, selectedControlId) => {
    if (property.formSaveEvent) {
      dispatch(saveEventUpdate(script));
    } else if (property.formInitEvent) {
      dispatch(formEventUpdate(script));
    } else if (property.formConditionsEvent) {
      dispatch(formConditionsEventUpdate(script));
    }
    if (property.controlEvent) {
      dispatch(sourceChangedProperty(script, selectedControlId));
    }
  },
  updateAllScripts: ({ controlScripts, formSaveEventScript, formInitEventScript }) => {
    dispatch(saveEventUpdate(formSaveEventScript));
    dispatch(formEventUpdate(formInitEventScript));
    dispatch(formLoad(controlScripts));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(FormEventEditor);
