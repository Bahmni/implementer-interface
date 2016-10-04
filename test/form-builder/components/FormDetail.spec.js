import React from 'react';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import FormDetail from 'form-builder/components/FormDetail';
import { getStore } from 'test/utils/storeHelper';
import { Provider } from 'react-redux';

chai.use(chaiEnzyme());

describe('FormDetails', () => {
  let wrapper;
  const formData = {
    id: 1,
    name: 'someFormName',
    version: '1.0',
    uuid: 'someUuid',
  };
  const control = () => (<div></div>);
  const componentStore = window.componentStore;

  before(() => {
    window.componentStore = {
      getDesignerComponent: () => ({
        metadata: {
          attributes: [{ name: 'properties', dataType: 'complex', attributes: [] }],
        },
        control,
      }),
      getAllDesignerComponents: () => ({}),
    };
  });

  after(() => {
    window.componentStore = componentStore;
  });

  it('should render form details when form data is present', () => {
    wrapper = mount(<Provider store={getStore()}><FormDetail formData={formData} /></Provider>);
    expect(wrapper).to.have.exactly(1).descendants('ControlPool');
    expect(wrapper).to.have.exactly(1).descendants('ControlPropertiesContainer');
    expect(wrapper).to.have.exactly(1).descendants('Canvas');
    expect(wrapper.find('Canvas').props().formUuid).to.eql('someUuid');
  });

  it('should render nothing when form data is not preset', () => {
    wrapper = shallow(<FormDetail />);
    expect(wrapper).to.be.blank();
  });
});
