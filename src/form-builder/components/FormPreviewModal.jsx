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
    if (this.props.formData) {
      const metadata = JSON.parse(this.props.formData.resources[0].value);
      metadata.version = this.props.formData.version;
      return (
                <div className="preview-container">
                    <div className="preview-header">
                        <div>{this.props.formData.name}</div>
                        <i className="fa fa-times" onClick={this.props.close}></i>
                    </div>
                    <div className="preview-body">
                        {this.getContainer(metadata)}
                    </div>
                    <div className="preview-footer">
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
  formData: PropTypes.object,
};
