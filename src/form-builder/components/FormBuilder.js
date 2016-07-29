import React, { Component, PropTypes } from 'react';
import FormList from 'form-builder/components/FormList';
import CreateForm from 'form-builder/components/CreateForm';
import Error from 'common/Error';

export default class FormBuilder extends Component {

  constructor() {
    super();
    this.state = { showModal: false };
    this.setState = this.setState.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({ error: props.error });
  }

  openFormModal() {
    this.setState({ showModal: true });
  }

  closeFormModal() {
    this.setState({ showModal: false });
  }

  createForm(formName) {
    const form = {
      name: formName,
      version: '1.0',
      published: false,
    };

    this.props.saveForm(form);
  }

  closeErrorMessage() {
    this.setState({ error: undefined });
  }

  render() {
    return (
      <div>
        <Error closeErrorMessage={() => this.closeErrorMessage()} error={this.state.error} />
        <div>
          <button onClick={() => this.openFormModal()}>Create a form</button>
          <CreateForm
            closeModal={() => this.closeFormModal()}
            createForm={(formName) => this.createForm(formName)}
            showModal={this.state.showModal}
          />
          <FormList data={this.props.data} />
        </div>
      </div>
    );
  }
}

FormBuilder.propTypes = {
  data: PropTypes.array.isRequired,
  error: PropTypes.object,
  saveForm: PropTypes.func.isRequired,
};
