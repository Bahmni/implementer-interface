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

  it('should pass value if present from conceptToControlMap to AutoCompleted component', () => {
    const state = {
      controlDetails: { selectedControl: '123' },
      conceptToControlMap: { 123: { name: 'someName' } },
    };
    const wrapper = mount(<ControlPropertiesContainer store={getStore(state)} />);
    expect(wrapper).to.have.descendants('AutoComplete');
    expect(wrapper.find('AutoComplete').props().value).to.eql([{ name: 'someName' }]);
  });

  it('should pass value as empty array when conceptToControlMap is undefined', () => {
    const state = { controlDetails: { selectedControl: '123' }, conceptToControlMap: undefined };
    const wrapper = mount(<ControlPropertiesContainer store={getStore(state)} />);
    expect(wrapper).to.have.descendants('AutoComplete');
    expect(wrapper.find('AutoComplete').props().value).to.eql([]);
  });

  it('should pass value as empty array when ' +
    'conceptToControlMap does not have value for selected control', () => {
    const state = {
      controlDetails: { selectedControl: '123' },
      conceptToControlMap: { 1: { name: 'someOtherName' } },
    };
    const wrapper = mount(<ControlPropertiesContainer store={getStore(state)} />);
    expect(wrapper).to.have.descendants('AutoComplete');
    expect(wrapper.find('AutoComplete').props().value).to.eql([]);
  });

  it('should pass disabled value as false when there is no value for Autocomplete', () => {
    const state = {
      controlDetails: { selectedControl: '123' },
      conceptToControlMap: { 1: { name: 'someOtherName' } },
    };
    const wrapper = mount(<ControlPropertiesContainer store={getStore(state)} />);
    expect(wrapper).to.have.descendants('AutoComplete');
    expect(wrapper.find('AutoComplete').props().disabled).to.eql(false);
  });

  it('should pass disabled value as true when there is a value for Autocomplete', () => {
    const state = {
      controlDetails: { selectedControl: '123' },
      conceptToControlMap: { 123: { name: 'someOtherName' } },
    };
    const wrapper = mount(<ControlPropertiesContainer store={getStore(state)} />);
    expect(wrapper).to.have.descendants('AutoComplete');
    expect(wrapper.find('AutoComplete').props().disabled).to.eql(true);
  });
});
