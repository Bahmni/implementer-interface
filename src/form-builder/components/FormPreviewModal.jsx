import React from 'react';
import PropTypes from 'prop-types';
import { Container as Container } from 'bahmni-form-controls';
import 'bahmni-form-controls/dist/helpers.js';


export default class FormPreviewModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      observations: [],
    };
    this.getContainer = this.getContainer.bind(this);
  }

  getContainer(metadata) {
    if (metadata) {
      return (<Container
        collapse={false}
        metadata={metadata}
        observations={this.state.observations}
        patient={{}}
        translations={{ labels: {}, concepts: {} }}
        validate={false}
        validateForm={false}
      />);
    }
    return null;
  }

  render() {
    if (this.props.formJson) {
      const metadata = this.props.formJson;
      return (
                <div className="preview-container">
                    <div className="preview-header">
                        <div>Preview</div>
                        <i className="fa fa-times" onClick={this.props.close}></i>
                    </div>
                    <div className="preview-body">
                        {this.getContainer(metadata)}
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
