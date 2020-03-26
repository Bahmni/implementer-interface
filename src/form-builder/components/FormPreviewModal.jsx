import React from 'react';
import PropTypes from 'prop-types';
import 'bahmni-form-controls/dist/helpers.js';


export default class FormPreviewModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      container: {},
      defaultLocale: localStorage.getItem('openmrsDefaultLocale'),
    };
    this.setContainer = this.setContainer.bind(this);
  }

  componentDidMount() {
    this.setContainer([]);
  }

  setContainer(observations) {
    const metadata = this.props.formJson;
    if (metadata) {
      /* eslint-disable no-undef */
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
                      <div id="form-container"> </div>
                    </div>
                    <div className="preview-footer">
                        <button className="button btn--highlight" type="submit">
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
};
