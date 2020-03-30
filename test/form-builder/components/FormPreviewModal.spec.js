import React from 'react';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import FormPreviewModal from 'form-builder/components/FormPreviewModal.jsx';


chai.use(chaiEnzyme());

describe('FormPreviewModal', () => {
  let wrapper;
  let closeSpy;
  let setErrorMessageSpy;
  let renderWithControlsCounter = 0;

  const formJson = {
    name: 'Groovy',
    id: 62,
    uuid: 'a70e3e5c-70cf-49a7-b73b-4dc6d70643a7',
    controls: [
      {
        type: 'obsControl',
        label: {
          translationKey: 'ANA,_HEIGHT_1',
          value: 'ANA, Height',
        },
        properties: {
          mandatory: false,
        },
        id: '1',
        concept: {
          name: 'ANA, Height',
          uuid: 'f17466a5-5d1a-11ea-9bb4-080027405b36',
          datatype: 'Numeric',
          properties: {
            allowDecimal: true,
          },
        },
        events: {
          onValueChange: 'function(form, interceptor) {\n  var x = form.get("ANA, Height")' +
              '.getValue();\n  var y = form.get("SA, Penicillin");\n  if (parseInt(x) > 5) {\n' +
              '    y.setHidden(true);\n  } else\n    y.setHidden(false);\n}',
        },
      },
    ],
    version: '43',
    events: {
      onFormSave: 'function(form){}',
    },
  };
  beforeEach(() => {
    closeSpy = sinon.spy();
    setErrorMessageSpy = sinon.spy();
    renderWithControlsCounter = 0;
    window.renderWithControls = function renderWithControls() {
      renderWithControlsCounter++;
      return 'container';
    };
  });

  function mountComponent(formJsonMetadata) {
    wrapper = mount(
      <FormPreviewModal
        close={closeSpy}
        formJson={formJsonMetadata}
        setErrorMessage={setErrorMessageSpy}
      />
    );
  }

  it('should render create form preview modal when form data exists', () => {
    mountComponent(formJson);
    const container = wrapper.find('.preview-container');
    expect(container).to.have.length(1);
    expect(container.children().length).to.be.equal(3);
    expect(renderWithControlsCounter).to.be.equal(1);
  });

  it('should not render create form modal when form data doesnot exist', () => {
    mountComponent(undefined);
    const modal = wrapper.find('.preview-container');
    const container = wrapper.find('Container');
    expect(container).to.be.length(0);
    expect(modal).to.be.length(0);
    expect(renderWithControlsCounter).to.be.equal(0);
  });

  it('should call close modal function when close button is clicked', () => {
    mountComponent(formJson);
    const button = wrapper.find('.preview-close-btn');
    button.simulate('click');
    sinon.assert.calledOnce(closeSpy);
  });

  it('should call close modal function when close icon is clicked', () => {
    mountComponent(formJson);
    const button = wrapper.find('.fa-times');
    button.simulate('click');
    sinon.assert.calledOnce(closeSpy);
  });

  it('should render save button in footer', () => {
    mountComponent(formJson);
    const saveButton = wrapper.find('.btn--highlight');
    expect(saveButton).to.have.length(1);
  });

  it('should call 3 window methods and set container to state on click of save button', () => {
    mountComponent(formJson);
    const button = wrapper.find('.btn--highlight');
    wrapper.setState({ container: { state: { data: {} } } });
    let runEventScriptCounter = 0;
    let unMountFormCounter = 0;
    let getObservationsCounter = 0;
    window.runEventScript = function runEventScript() {
      runEventScriptCounter++;
    };
    window.unMountForm = function unMountForm() {
      unMountFormCounter++;
    };
    window.getObservations = function getObservations() {
      getObservationsCounter++;
    };

    button.simulate('click');

    expect(runEventScriptCounter).to.equal(1);
    expect(unMountFormCounter).to.equal(1);
    expect(getObservationsCounter).to.equal(1);
  });

  it('should set renderWithControls return value to state variable container on componentDidMount',
    () => {
      mountComponent(formJson);
      expect(renderWithControlsCounter).to.be.equal(1);
      expect(wrapper.state().container).to.equal('container');
    });

  it('should return error message for single error object', () => {
    const errorMessage = FormPreviewModal.formatErrors({ message: 'It is an error' });

    expect(errorMessage).to.equal('It is an error');
  });

  it('should return pipe separated error messages for array of errors', () => {
    const errorMessage = FormPreviewModal.formatErrors([{ message: 'It is an error1' },
      { message: 'It is an error2' }]);

    expect(errorMessage).to.equal('It is an error1 | It is an error2');
  });

  it('should return [ERROR] when message key is not present in error object(s)', () => {
    const errorMessageObject = FormPreviewModal.formatErrors({ mesage: 'It is an error' });
    const errorMessagesArray = FormPreviewModal.formatErrors([{ message: 'It is an error1' },
      { mesage: 'It is an error2' }]);

    expect(errorMessageObject).to.equal('[ERROR]');
    expect(errorMessagesArray).to.equal('It is an error1 | [ERROR]');
  });

  it('should call setErrorMessage when runEventScript throws exception', () => {
    mountComponent(formJson);
    const button = wrapper.find('.btn--highlight');
    wrapper.setState({ container: { state: { data: {} } } });
    window.runEventScript = function runEventScript() {
      throw Object.assign(new Error('Error'));
    };
    window.unMountForm = function unMountForm() {
    };
    window.getObservations = function getObservations() {
    };

    button.simulate('click');

    sinon.assert.calledOnce(setErrorMessageSpy);
    sinon.assert.calledWith(setErrorMessageSpy, { type: 'Exception', message: 'Error' });
  });
});
