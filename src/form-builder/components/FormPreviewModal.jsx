import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import 'bahmni-form-controls/dist/helpers.js';
import { Exception } from 'form-builder/helpers/Exception';
import { Container } from 'bahmni-form-controls';


export default class FormPreviewModal extends React.Component {

  static formatErrors(error) {
    if (Array.isArray(error)) {
      return error.map(e => e.message || '[ERROR]').join(' | ');
    }
    return error.message || '[ERROR]';
  }

  constructor(props) {
    super(props);
    const defaultLocale = (window.localStorage
      && window.localStorage.getItem('openmrsDefaultLocale')) || 'en';
    this.state = {
      defaultLocale,
      recordTree: {},
    };
    this.onSave = this.onSave.bind(this);
    this.updateContainer = this.updateContainer.bind(this);
    this.onValueUpdated = this.onValueUpdated.bind(this);
  }

  componentDidMount() {
    try {
      this.updateContainer([]);
    } catch (e) {
      this.props.setErrorMessage(new Exception(FormPreviewModal.formatErrors(e)).getException());
    }
  }

  onSave() {
    const formJson = this.props.formJson;
    if (Object.keys(this.state.recordTree).length > 0 && formJson.events.onFormSave) {
      /* eslint-disable no-undef */
      try {
        const records = runEventScript(this.state.recordTree, formJson.events.onFormSave);
        unMountForm(document.getElementById('form-container'));
        this.updateContainer(getObservations(records));
      } catch (e) {
        this.props.setErrorMessage(new Exception(FormPreviewModal.formatErrors(e)).getException());
      }
    }
  }

  onValueUpdated(data) {
    this.setState({ recordTree: data });
  }

  updateContainer(observations) {
    const metadata = this.props.formJson;
    if (metadata) {
      const container = React.createElement(Container,
        { metadata, observations, validate: true, validateForm: false,
          collapse: false, patient: null, locale: this.state.defaultLocale, translations: '',
          onValueUpdated: this.onValueUpdated });
      ReactDOM.render(container, document.getElementById('form-container'));
    }
  }

  render() {
    if (this.props.formJson) {
      return (
        <div className="preview-container">
          <div className="preview-header">
            <div>Preview</div>
            <i className="fa fa-times" onClick={this.props.close}></i>
          </div>
          <div className="preview-body">
            <div className="disable-image-and-video-upload" id="form-container"> </div>
          </div>
          <div className="preview-footer">
            <button className="button btn--highlight" onClick={this.onSave} type="submit">
              Save
            </button>
            <button className="btn preview-close-btn" onClick={this.props.close} type="reset">
              Close
            </button>
          </div>
        </div>);
    }
    return null;
  }
}

FormPreviewModal.propTypes = {
  close: PropTypes.func.isRequired,
  formJson: PropTypes.object,
  setErrorMessage: PropTypes.func.isRequired,
};
