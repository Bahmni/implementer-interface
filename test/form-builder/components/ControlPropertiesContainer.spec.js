import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import ControlPropertiesContainer from 'form-builder/components/ControlPropertiesContainer';
import { getStore } from 'test/utils/storeHelper';
import { setChangedProperty } from 'form-builder/actions/control';
import sinon from 'sinon';

chai.use(chaiEnzyme());

describe('ControlPropertiesContainer', () => {
  let controlMetadata;

  beforeEach(() => {
    const controlDescriptor = {
      metadata: { attributes: [{ name: 'properties', type: 'complex', attributes: [] }] },
    };
    window.componentStore = {
      getDesignerComponent: () => controlDescriptor,
    };
  });

  it('should display Control Properties title', () => {
    const wrapper = mount(<ControlPropertiesContainer store={getStore()} />);
    expect(wrapper.find('.header-title').text()).to.eql('Control Properties');
  });

  describe('AutoComplete', () => {
    beforeEach(() => {
      controlMetadata = { id: '123', type: 'obsControl', properties: {} };
    });

    it('should not display autocomplete component when no control is selected', () => {
      const wrapper = mount(<ControlPropertiesContainer store={getStore()} />);
      expect(wrapper).to.not.have.descendants('AutoComplete');
    });

    it('should display autocomplete component when control is selected', () => {
      const state = { controlDetails: { selectedControl: controlMetadata } };
      const wrapper = mount(<ControlPropertiesContainer store={getStore(state)} />);
      expect(wrapper).to.have.descendants('AutoComplete');
    });

    it('should pass value if present from conceptToControlMap to AutoComplete component', () => {
      const state = {
        controlDetails: { selectedControl: controlMetadata },
        conceptToControlMap: { 123: { name: 'someName' } },
      };
      const wrapper = mount(<ControlPropertiesContainer store={getStore(state)} />);
      expect(wrapper).to.have.descendants('AutoComplete');
      expect(wrapper.find('AutoComplete').props().value).to.eql([{ name: 'someName' }]);
    });

    it('should pass value as empty array when conceptToControlMap is undefined', () => {
      const state = {
        controlDetails: { selectedControl: controlMetadata },
        conceptToControlMap: undefined,
      };
      const wrapper = mount(<ControlPropertiesContainer store={getStore(state)} />);
      expect(wrapper).to.have.descendants('AutoComplete');
      expect(wrapper.find('AutoComplete').props().value).to.eql([]);
    });

    it('should pass value as empty array when ' +
      'conceptToControlMap does not have value for selected control', () => {
      const state = {
        controlDetails: { selectedControl: controlMetadata },
        conceptToControlMap: { 1: { name: 'someOtherName' } },
      };
      const wrapper = mount(<ControlPropertiesContainer store={getStore(state)} />);
      expect(wrapper).to.have.descendants('AutoComplete');
      expect(wrapper.find('AutoComplete').props().value).to.eql([]);
    });

    it('should pass disabled value as false when there is no value for Autocomplete', () => {
      const state = {
        controlDetails: { selectedControl: controlMetadata },
        conceptToControlMap: { 1: { name: 'someOtherName' } },
      };
      const wrapper = mount(<ControlPropertiesContainer store={getStore(state)} />);
      expect(wrapper).to.have.descendants('AutoComplete');
      expect(wrapper.find('AutoComplete').props().disabled).to.eql(false);
    });

    it('should pass disabled value as true when there is a value for Autocomplete', () => {
      const state = {
        controlDetails: { selectedControl: controlMetadata },
        conceptToControlMap: { 123: { name: 'someOtherName' } },
      };
      const wrapper = mount(<ControlPropertiesContainer store={getStore(state)} />);
      expect(wrapper).to.have.descendants('AutoComplete');
      expect(wrapper.find('AutoComplete').props().disabled).to.eql(true);
    });
  });

  describe('PropertyEditor', () => {
    beforeEach(() => {
      controlMetadata = {
        id: '123',
        type: 'obsControl',
        properties: {},
        concept: { name: 'someName', uuid: 'someUuid' },
      };
    });

    it('should not display property editor component when no control is selected', () => {
      const wrapper = mount(<ControlPropertiesContainer store={getStore()} />);
      expect(wrapper).to.not.have.descendants('PropertyEditor');
    });

    it('should display property editor component when control is selected', () => {
      const state = { controlDetails: { selectedControl: controlMetadata } };
      const wrapper = mount(<ControlPropertiesContainer store={getStore(state)} />);
      expect(wrapper).to.have.descendants('PropertyEditor');
    });

    it('should not display property editor when selected control does not have concept', () => {
      controlMetadata = { id: '123', type: 'obsControl', properties: {} };
      const state = { controlDetails: { selectedControl: controlMetadata } };
      const wrapper = mount(<ControlPropertiesContainer store={getStore(state)} />);
      expect(wrapper).to.not.have.descendants('PropertyEditor');
    });

    it('should pass appropriate props to property editor component', () => {
      const state = { controlDetails: { selectedControl: controlMetadata } };
      const wrapper = mount(<ControlPropertiesContainer store={getStore(state)} />);
      expect(wrapper).to.have.descendants('PropertyEditor');
      expect(wrapper.find('PropertyEditor').props().metadata).to.deep.eql(controlMetadata);
    });

    it('should dispatch action on metadata update', () => {
      const updatedProperty = { mandatory: true };
      const state = { controlDetails: { selectedControl: controlMetadata } };
      const store = getStore(state);
      const wrapper = mount(<ControlPropertiesContainer store={store} />);
      expect(wrapper).to.have.descendants('PropertyEditor');

      wrapper.find('PropertyEditor').props().onPropertyUpdate(updatedProperty);
      sinon.assert.calledOnce(store.dispatch.withArgs(setChangedProperty(updatedProperty, '123')));
    });
  });
});
