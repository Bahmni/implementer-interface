import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import ControlPropertiesContainer from 'form-builder/components/ControlPropertiesContainer';
import { getStore } from 'test/utils/storeHelper';

chai.use(chaiEnzyme());

describe('ControlPropertiesContainer', () => {
  it('should display Control Properties title', () => {
    const wrapper = mount(<ControlPropertiesContainer store={getStore()} />);
    expect(wrapper.find('.control-properties-title').text()).to.eql('Control Properties');
  });

  it('should not display autocomplete component when no control is selected', () => {
    const wrapper = mount(<ControlPropertiesContainer store={getStore()} />);
    expect(wrapper).to.not.have.descendants('AutoComplete');
  });

  it('should display autocomplete component when control is selected', () => {
    const state = { controlDetails: { selectedControl: '123' } };
    const wrapper = mount(<ControlPropertiesContainer store={getStore(state)} />);
    expect(wrapper).to.have.descendants('AutoComplete');
  });
});
