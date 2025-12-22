import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ControlPool } from 'form-builder/components/ControlPool.jsx';
import Canvas from 'form-builder/components/Canvas.jsx';
import classNames from 'classnames';
import FormPrivilegesEditorModal from 'form-builder/components/FormPrivilegesEditorModal.js';
import FormPrivilegesContainer from 'form-builder/components/FormPrivilegesContainer.jsx';
import ControlPropertiesContainer from 'form-builder/components/ControlPropertiesContainer.jsx';
import FormEventContainer from 'form-builder/components/FormEventContainer.jsx';
import { IDGenerator } from 'form-builder/helpers/idGenerator';
import FormHelper from 'form-builder/helpers/formHelper';
import FormEventEditor from 'form-builder/components/FormEventEditor.jsx';
import ScriptEditorModal from 'form-builder/components/ScriptEditorModal';
import Popup from 'reactjs-popup';
import FormConditionsModal from 'form-builder/components/FormConditionsModal';
import { commonConstants } from 'common/constants';
import NotificationContainer from 'common/Notification';
import { base64ToUtf8, utf8ToBase64 } from 'common/utils/encodingUtils';


export default class FormDetail extends Component {
  constructor() {
    super();
    this.state = { errorMessage: {} };
    this.canvasRef = this.canvasRef.bind(this);
    this.canvas = undefined;
    this.setErrorMessage = this.setErrorMessage.bind(this);
    this.handleFormConditionsLoad = this.handleFormConditionsLoad.bind(this);
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

  setErrorMessage(errorMessage) {
    const errorNotification = {
      message: errorMessage,
      type: commonConstants.responseType.error,
    };
    this.setState({ errorMessage: errorNotification });
    setTimeout(() => {
      this.setState({ errorMessage: {} });
    }, commonConstants.toastTimeout);
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

  handleFormConditionsLoad() {
    try {
      const formJson = this.getFormJson();
      this.props.updateFormControlEvents(formJson);
    } catch (e) {
      this.setErrorMessage(e.message);
      throw e;
    }
  }

  getScript(property, formDetails, controlEvents, selectedControlId, formDefinitionVersion) {
    const definitionVersion = formDefinitionVersion || 1.0;
    const isControlEvent = property.controlEvent;
    if (isControlEvent) {
      const selectedFormControlEvent = controlEvents
        .find(control => control.id === selectedControlId);
      const controlEventScript = selectedFormControlEvent && selectedFormControlEvent.events
        && selectedFormControlEvent.events.onValueChange;
      if (controlEventScript == undefined) {
        return '';
      }
      return definitionVersion > 1.0 ? base64ToUtf8(controlEventScript) : controlEventScript;
    }
    if (property.formSaveEvent === undefined && property.formInitEvent === undefined) {
      return '';
    }
    const isSaveEvent = property.formSaveEvent;
    const formEventScript = formDetails.events && (isSaveEvent ? formDetails.events.onFormSave
      : formDetails.events.onFormInit);
    if (formEventScript == undefined) {
      return '';
    }
    return definitionVersion > 1.0 ? base64ToUtf8(formEventScript) : formEventScript;
  }

  render() {
    const { formData, defaultLocale, formControlEvents } = this.props;
    if (formData) {
      const { name, uuid, id, version, published, editable } = this.props.formData;
      const formResourceControls = FormHelper.getFormResourceControls(this.props.formData);
      const formDefVersion = this.props.formDetails && this.props.formDetails.formDefVersion;
      const idGenerator = this.getIdGenerator(formResourceControls);
      const FormEventEditorContent = (props) => {
        const script = props.property ? this.getScript(props.property,
          props.formDetails, formControlEvents, props.selectedControlId, formDefVersion) : '';
        const showEditor = props.property && (props.property.formInitEvent
          || props.property.formSaveEvent || props.property.formConditionsEvent
          || props.property.controlEvent || props.property.formPrivilegesEventUpdate);
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
                updateAllScripts={props.updateAllScripts}
                formDefVersion={formDefVersion}
              />
            </Popup>
            }
          </div>);
        } if (props.property.formPrivilegesEventUpdate) {
          return (<div>
                    {
                    <Popup className="form-event-popup" closeOnDocumentClick={false}
                      closeOnEscape={false}
                      open={showEditor} position="top center"
                    >
                      <FormPrivilegesEditorModal
                        close={props.closeEventEditor}
                        formId={formData.id}
                        formName={name}
                        formUuid={ uuid }
                        formData = {this.props.formData}
                        formPrivileges = {this.props.formPrivileges}
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
                   <NotificationContainer notification={this.state.errorMessage} />
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
                                  onEventLoad={this.handleFormConditionsLoad}
                                  updateFormEvents={this.props.updateFormEvents}
                                />
                                <FormPrivilegesContainer
                                  eventProperty={'formPrivilegesEventUpdate'}
                                  formData = {formData}
                                  formId={id}
                                  formName={name}
                                  formUuid={ uuid }
                                  formPrivileges = {this.props.formPrivileges}
                                  formDetails = {this.props.formDetails}

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
  formId: PropTypes.number,
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
  formPrivileges: PropTypes.array,
  setError: PropTypes.func.isRequired,
  updateFormControlEvents: PropTypes.func,
  updateFormEvents: PropTypes.func,
  updateFormName: PropTypes.func,
  validateNameLength: PropTypes.func,
};
