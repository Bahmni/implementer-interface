import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formEventUpdate, saveEventUpdate, setChangedProperty } from 'form-builder/actions/control';

export const FormEventEditor = (props) => {
  const { property, formDetails, closeEventEditor } = props;
  const updateScript = (script) => {
    props.updateScript(script, property);
  };

  return (
    <div>
      {React.cloneElement(props.children, { property, formDetails, closeEventEditor,
        updateScript })}
    </div>
  );
};

FormEventEditor.propTypes = {
  children: PropTypes.element.isRequired,
  closeEventEditor: PropTypes.func.isRequired,
  formDetails: PropTypes.shape({
    events: PropTypes.shape({
      onFormInit: PropTypes.string,
      onFormSave: PropTypes.string,
    }),
  }),
  property: PropTypes.shape({
    formInitEvent: PropTypes.bool,
    formSaveEvent: PropTypes.bool,
  }),
  updateScript: PropTypes.func.isRequired,

};

const mapStateToProps = (state) => ({
  property: state.controlProperty ? state.controlProperty.property : undefined,
  formDetails: state.formDetails,
});

const mapDispatchToProps = (dispatch) => ({
  closeEventEditor: () => {
    dispatch(setChangedProperty({ formInitEvent: false }));
    dispatch(setChangedProperty({ formSaveEvent: false }));
  },
  updateScript: (script, property) => {
    const isSaveEvent = property.formSaveEvent;
    if (isSaveEvent) {
      dispatch(saveEventUpdate(script));
    } else {
      dispatch(formEventUpdate(script));
    }
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(FormEventEditor);
