import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai from 'chai';
import FormDetail from 'form-builder/components/FormDetail.jsx';
import { getStore } from 'test/utils/storeHelper';
import { Provider } from 'react-redux';
import { ComponentStore } from 'bahmni-form-controls';
import sinon from 'sinon';

chai.use(chaiEnzyme());

describe.skip('FormDetailContainer', () => {
  let wrapper;
  let getDesignerComponentStub;
  let getAllDesignerComponentsStub;
  const formData = {
    id: 1,
    name: 'someFormName',
    version: '1',
    uuid: 'someUuid',
    resources: [],
  };
  const control = () => (<div></div>);

  before(() => {
    getDesignerComponentStub = sinon.stub(ComponentStore, 'getDesignerComponent');
    getDesignerComponentStub.returns({
      metadata: {
        attributes: [{ name: 'properties', dataType: 'complex', attributes: [] }],
      },
      control,
    });
    getAllDesignerComponentsStub = sinon.stub(ComponentStore, 'getAllDesignerComponents');
    getAllDesignerComponentsStub.returns({});
  });

  after(() => {
    getDesignerComponentStub.restore();
    getAllDesignerComponentsStub.restore();
  });

  it('should save the form on save button press', () => {
    const mockSaveFormResource = {
      saveFormResource: () => {
      },
    };
    const mockFunc = sinon.mock(mockSaveFormResource);
    mockFunc.expects('saveFormResource').once().withArgs('someUuid',
      sinon.match.has('form', {
        name: 'someFormName',
        uuid: 'someUuid',
      }));
    wrapper = mount(
      <Provider store={getStore()}>
        <FormDetail
          formData={formData}
          publishForm={() => {}}
          saveFormResource={mockSaveFormResource.saveFormResource}
          setError={() => {}}
        />
      </Provider>
    );

    wrapper.find('.save-button').simulate('click');
    mockFunc.verify();
  });

  it('should set error on failure to save form', () => {
    const mockSetError = {
      setError: () => {
      },
    };
    const mockError = sinon.mock(mockSetError);
    mockError.expects('setError').once();

    wrapper = mount(
      <Provider store={getStore()}>
        <FormDetail
          formData={formData}
          publishForm={() => {}}
          // eslint-disable-next-line
          saveFormResource={() => {throw { getException: function () {} };}}
          setError={mockSetError.setError}
        />
      </Provider>
    );

    wrapper.find('.save-button').simulate('click');
    mockError.verify();
  });

  it('should publish form on click of Publish button', () => {
    const mockPublishForm = {
      publishForm: () => {
      },
    };
    const mockPublish = sinon.mock(mockPublishForm);
    mockPublish.expects('publishForm').once().withArgs('someUuid');

    wrapper = mount(
      <Provider store={getStore()}>
        <FormDetail
          formData={formData}
          publishForm={mockPublishForm.publishForm}
          saveFormResource={() => {}}
          setError={() => {}}
        />
      </Provider>
    );

    wrapper.find('.publish-button').simulate('click');
    mockPublish.verify();
  });

  it('should set error on failure to Publish form', () => {
    const mockSetError = {
      setError: () => {
      },
    };
    const mockError = sinon.mock(mockSetError);
    mockError.expects('setError').once();

    wrapper = mount(
      <Provider store={getStore()}>
        <FormDetail
          formData={formData}
          // eslint-disable-next-line
          publishForm={() => { throw { getException: function () {} };} }
          saveFormResource={() => {}}
          setError={mockSetError.setError}
        />
      </Provider>
    );

    wrapper.find('.publish-button').simulate('click');
    mockError.verify();
  });
});
