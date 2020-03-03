import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ControlPool } from 'form-builder/components/ControlPool.jsx';
import Canvas from 'form-builder/components/Canvas.jsx';
import classNames from 'classnames';
import ControlPropertiesContainer from 'form-builder/components/ControlPropertiesContainer.jsx';
import FormEventContainer from 'form-builder/components/FormEventContainer.jsx';
import { IDGenerator } from 'form-builder/helpers/idGenerator';
import FormHelper from 'form-builder/helpers/formHelper';

export default class FormDetail extends Component {
  constructor() {
    super();
    this.canvasRef = this.canvasRef.bind(this);
    this.canvas = undefined;
    window.onscroll = () => {
      if (document.getElementsByClassName('column-side').length === 1) {
        if (window.scrollY <= 62) {
          const element = document.getElementsByClassName('column-side');
          element[0].className = 'column-side';
        }
        if (window.scrollY >= 63 && window.scrollY <= 500) {
          const element = document.getElementsByClassName('column-side');
          element[0].className = 'column-side scrolled';
        }
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
      return (
                <div>
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
  formData: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string.isRequired,
    published: PropTypes.bool.isRequired,
    resources: PropTypes.array,
    uuid: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired,
    editable: PropTypes.bool,
  }),
  setError: PropTypes.func.isRequired,
  updateFormEvents: PropTypes.func,
  updateFormName: PropTypes.func,
  validateNameLength: PropTypes.func,
};
