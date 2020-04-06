import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ControlPool } from 'form-builder/components/ControlPool.jsx';
import Canvas from 'form-builder/components/Canvas.jsx';
import classNames from 'classnames';
import ControlPropertiesContainer from 'form-builder/components/ControlPropertiesContainer.jsx';
import FormEventContainer from 'form-builder/components/FormEventContainer.jsx';
import { IDGenerator } from 'form-builder/helpers/idGenerator';
import FormHelper from 'form-builder/helpers/formHelper';
import FormEventEditor from 'form-builder/components/FormEventEditor.jsx';
import ScriptEditorModal from 'form-builder/components/ScriptEditorModal';
import Popup from 'reactjs-popup';
import FormConditionsModal from 'form-builder/components/FormConditionsModal';


export default class FormDetail extends Component {
  constructor() {
    super();
    this.canvasRef = this.canvasRef.bind(this);
    this.canvas = undefined;
    window.onscroll = () => {
      const getByClass = (elementClassName) => document.getElementsByClassName(elementClassName);
      const isViewMode = getByClass('info-view-mode-wrap').length === 1;
      const heightCheck = isViewMode ? 120 : 66;
      const element = getByClass('column-side');
      const isPresent = element.length === 1;
      if (isPresent && window.scrollY > heightCheck) {
        element[0].className = 'column-side scrolled';
      } else {
        element[0].className = 'column-side';
      }
    };
  }

  getFormJson() {
    if (this.canvas) {
      return this.canvas.prepareJson();
    }
    return null;
  }

  getIdGenerator(formResourceControls) {
    if (!this.idGenerator) {
      this.idGenerator = new IDGenerator(formResourceControls);
    }
    return this.idGenerator;
  }

  canvasRef(ref) {
    this.canvas = ref;
  }

  formTitle(name, version, published, editable) {
    const status = published && !editable ? 'Published' : 'Draft';
    const versionNumber = version ? `v${version}` : '';
    return `${name} ${versionNumber} - ${status}`;
  }

  render() {
    const { formData, defaultLocale } = this.props;
    if (formData) {
      const { name, uuid, id, version, published, editable } = this.props.formData;
      const formResourceControls = FormHelper.getFormResourceControls(this.props.formData);
      const idGenerator = this.getIdGenerator(formResourceControls);
      const getScript = (property, formDetails) => {
        const isSaveEvent = property.formSaveEvent;
        return formDetails.events && (isSaveEvent ? formDetails.events.onFormSave
          : formDetails.events.onFormInit);
      };
      const FormEventEditorContent = (props) => {
        const script = props.property ? getScript(props.property, props.formDetails) : '';
        const showEditor = props.property && (props.property.formInitEvent
          || props.property.formSaveEvent || props.property.formConditionsEvent);
        if (!showEditor) {
          return (<div></div>);
        }
        if (props.property.formConditionsEvent) {
          return (<div>
            {showEditor &&
            <Popup className="form-event-popup" closeOnDocumentClick={false}
              closeOnEscape={false}
              open={showEditor} position="top center"
            >
              <FormConditionsModal
                close={props.closeEventEditor}
                controlEvents={props.formControlEvents}
                formDetails={props.formDetails}
                formTitle={this.formTitle(name, version, published, editable)}
                updateScript={(scriptToUpdate) => {
                  props.updateScript(scriptToUpdate);
                  props.closeEventEditor();
                }}
              />
            </Popup>
            }
          </div>);
        }
        return (<div>
          {showEditor &&
          <Popup className="form-event-popup" closeOnDocumentClick={false}
            closeOnEscape={false}
            open={showEditor} position="top center"
          >
          <ScriptEditorModal close={props.closeEventEditor} script={script}
            updateScript={(scriptToUpdate) => {
              props.updateScript(scriptToUpdate);
              props.closeEventEditor();
            }}
          />
            </Popup>
          }
       </div>);
      };
      return (
                <div>
                    <FormEventEditor children={<FormEventEditorContent />} />
                    <div className="button-wrapper">
                    </div>
                    <div className={ classNames('container-main',
                        { published: (published && !editable) }) }>
                        <h2 className="header-title">
                            {this.formTitle(name, version, published, editable)}</h2>
                        <div className="container-columns">
                            <div className="column-side">
                                <ControlPool
                                  formResourceControls={formResourceControls}
                                  idGenerator={idGenerator}
                                />
                                <ControlPropertiesContainer />
                                <FormEventContainer
                                  eventProperty={'formInitEvent'}
                                  label={'Form Event'}
                                  updateFormEvents={this.props.updateFormEvents}
                                />
                                <FormEventContainer
                                  eventProperty={'formSaveEvent'}
                                  label={'Save Event'}
                                  updateFormEvents={this.props.updateFormEvents}
                                />
                                <FormEventContainer
                                  eventProperty={'formConditionsEvent'}
                                  formTitle={this.props.formData.name}
                                  label={'Form Conditions'}
                                  updateFormEvents={this.props.updateFormEvents}
                                />
                            </div>
                            <div className="container-column-main">
                                <div className="column-main">
                                    <Canvas
                                      defaultLocale={defaultLocale}
                                      formId={id}
                                      formName={name}
                                      formResourceControls={formResourceControls}
                                      formUuid={ uuid }
                                      idGenerator={idGenerator}
                                      ref={this.canvasRef}
                                      setError={this.props.setError}
                                      updateFormName = {this.props.updateFormName}
                                      validateNameLength = {this.props.validateNameLength}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
      );
    }
    return null;
  }
}

FormDetail.propTypes = {
  defaultLocale: PropTypes.string,
  formControlEvents: PropTypes.Array,
  formData: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string.isRequired,
    published: PropTypes.bool.isRequired,
    resources: PropTypes.array,
    uuid: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired,
    editable: PropTypes.bool,
  }),
  formDetails: PropTypes.shape({
    events: PropTypes.object,
  }),
  setError: PropTypes.func.isRequired,
  updateFormEvents: PropTypes.func,
  updateFormName: PropTypes.func,
  validateNameLength: PropTypes.func,
};
