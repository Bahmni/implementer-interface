import React from 'react';
import PropTypes from 'prop-types';
import 'bahmni-form-controls/dist/helpers.js';
import { Exception } from 'form-builder/helpers/Exception';


export default class FormPreviewModal extends React.Component {

  static formatErrors(error) {
    if (Array.isArray(error)) {
      return error.map(e => e.message || '[ERROR]').join(' | ');
    }
    return error.message || '[ERROR]';
  }

  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      container: {},
      defaultLocale: localStorage.getItem('openmrsDefaultLocale'),
    };
    this.onSave = this.onSave.bind(this);
    this.setContainer = this.setContainer.bind(this);
  }

  componentDidMount() {
    try {
      this.setContainer([]);
    } catch (e) {
      this.props.setErrorMessage(new Exception(FormPreviewModal.formatErrors(e)).getException());
    }
  }

  onSave() {
    const formJson = this.props.formJson;
    if (this.state.container.state && formJson.events.onFormSave) {
      /* eslint-disable no-undef */
      try {
        const records = runEventScript(this.state.container.state.data, formJson.events.onFormSave);
        unMountForm(document.getElementById('form-container'));
        this.setContainer(getObservations(records));
      } catch (e) {
        this.props.setErrorMessage(new Exception(FormPreviewModal.formatErrors(e)).getException());
      }
    }
  }

  setContainer(observations) {
    const metadata = this.props.formJson;
    if (metadata) {
      const container = renderWithControls(metadata, observations, 'form-container', false, null,
        false, this.state.defaultLocale, '');
      this.setState({ container });
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
                        <button className="button btn--highlight" onClick={this.onSave}
                          type="submit"
                        >
                          Save
                        </button>
                        <button className="btn preview-close-btn"
                          onClick={this.props.close}
                          type="reset"
                        >
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
