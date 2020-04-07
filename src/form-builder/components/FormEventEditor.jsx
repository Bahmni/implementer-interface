import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formEventUpdate, saveEventUpdate } from 'form-builder/actions/control';
import { setChangedProperty, formConditionsEventUpdate } from 'form-builder/actions/control';
export const FormEventEditor = (props) => {
  const { property, formDetails, closeEventEditor, formControlEvents } = props;
  const updateScript = (script) => {
    props.updateScript(script, property);
  };

  return (
    <div>
      {React.cloneElement(props.children, { property, formDetails, closeEventEditor,
        formControlEvents, updateScript })}
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
  updateScript: PropTypes.func.isRequired,

};

const mapStateToProps = (state) => ({
  property: state.controlProperty ? state.controlProperty.property : undefined,
  formDetails: state.formDetails, formControlEvents: state.controlDetails.allObsControlEvents,
});

const mapDispatchToProps = (dispatch) => ({
  closeEventEditor: () => {
    dispatch(setChangedProperty({ formInitEvent: false }));
    dispatch(setChangedProperty({ formSaveEvent: false }));
    dispatch(setChangedProperty({ formConditionsEvent: false }));
  },
  updateScript: (script, property) => {
    if (property.formSaveEvent) {
      dispatch(saveEventUpdate(script));
    } else if (property.formInitEvent) {
      dispatch(formEventUpdate(script));
    } else if (property.formConditionsEvent) {
      dispatch(formConditionsEventUpdate(script));
    }
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(FormEventEditor);
