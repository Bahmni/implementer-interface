import React from 'react';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import FormDetail from 'form-builder/components/FormDetail.jsx';
import { getStore } from 'test/utils/storeHelper';
import { Provider } from 'react-redux';
import { ComponentStore } from 'bahmni-form-controls';
import sinon from 'sinon';

chai.use(chaiEnzyme());

describe('FormDetails', () => {
  let wrapper;
  let getDesignerComponentStub;
  let getAllDesignerComponentsStub;
  const formData = {
    id: 1,
    name: 'someFormName',
    version: '1',
    uuid: 'someUuid',
    resources: [],
    published: false,
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

  it('should render form details when form data is present', () => {
    wrapper = mount(
      <Provider store={getStore()}>
        <FormDetail
          formData={formData}
          publishForm={() => {}}
          saveFormResource={() => {}}
          setError={() => {}}
        />
      </Provider>
    );
    expect(wrapper).to.have.exactly(1).descendants('ControlPool');
    expect(wrapper).to.have.exactly(1).descendants('ControlPropertiesContainer');
    expect(wrapper).to.have.exactly(1).descendants('Canvas');
    expect(wrapper.find('.header-title').at(0).text()).to.eql('someFormName v1 - Draft');
    expect(wrapper.find('Canvas').props().formUuid).to.eql('someUuid');
  });

  it('should render nothing when form data is not preset', () => {
    wrapper = shallow(
      <FormDetail
        publishForm={() => {}}
        saveFormResource={() => {}}
        setError={() => {}}
      />);
    expect(wrapper).to.be.blank();
  });

  it('should create the idGenerator and pass it as props to required children', () => {
    wrapper = mount(
      <Provider store={getStore()}>
        <FormDetail
          formData={formData}
          publishForm={() => {}}
          saveFormResource={() => {}}
          setError={() => {}}
        />
      </Provider>
    );
    const controlPoolProps = wrapper.find('ControlPool').props();
    const canvasProps = wrapper.find('Canvas').props();

    expect(controlPoolProps).to.have.property('idGenerator');
    expect(canvasProps).to.have.property('idGenerator');
    expect(canvasProps.idGenerator).to.be.equal(controlPoolProps.idGenerator);
  });
});
