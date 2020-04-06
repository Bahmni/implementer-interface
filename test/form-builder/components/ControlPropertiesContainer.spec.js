import React from 'react';
import { mount, shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import ControlPropertiesContainerWithRedux, { ControlPropertiesContainer } from
    'form-builder/components/ControlPropertiesContainer.jsx';
import { getStore } from 'test/utils/storeHelper';
import { setChangedProperty } from 'form-builder/actions/control';
import sinon from 'sinon';
import { ComponentStore } from 'bahmni-form-controls';
import { formBuilderConstants as constants } from 'form-builder/constants';

chai.use(chaiEnzyme());

describe('ControlPropertiesContainer', () => {
  let controlMetadata;
  let componentStoreStub;
  const store = getStore();
  before(() => {
    const controlDescriptor = {
      metadata: { attributes: [{ name: 'properties', type: 'complex', attributes: [] }] },
    };
    componentStoreStub = sinon.stub(ComponentStore, 'getDesignerComponent');
    componentStoreStub.returns(controlDescriptor);
  });

  after(() => {
    componentStoreStub.restore();
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
      const wrapper = mount(<ControlPropertiesContainerWithRedux store={getStore()} />);
      expect(wrapper).to.not.have.descendants('AutoComplete');
    });

    it('should display autocomplete component when obs control is selected', () => {
      const state = { controlDetails: { selectedControl: controlMetadata } };
      const wrapper = mount(<ControlPropertiesContainerWithRedux store={getStore(state)} />);
      expect(wrapper).to.have.descendants('AutoComplete');
      expect(wrapper.find(('AutoComplete')).props()
        .optionsUrl.includes(constants.supportedObsDataTypes)).to.eql(true);
      expect(wrapper.find(('AutoComplete')).props()
        .optionsUrl.includes(constants.supportedObsGroupDataTypes)).to.eql(false);
    });

    it('should not display autocomplete component when section control is selected', () => {
      controlMetadata = { id: '123', type: 'section', properties: {} };
      const state = { controlDetails: { selectedControl: controlMetadata } };
      const wrapper = mount(<ControlPropertiesContainerWithRedux store={getStore(state)} />);
      expect(wrapper).to.not.have.descendants('AutoComplete');
    });

    it('should display control ID when obs control is selected', () => {
      const state = { controlDetails: { selectedControl: controlMetadata } };
      const wrapper = mount(<ControlPropertiesContainerWithRedux store={getStore(state)} />);
      expect(wrapper.find('.control-id')).text().to.eql('123');
    });

    it('should display control ID when selected control is section', () => {
      controlMetadata = { id: '143', type: 'section', properties: {} };
      const state = { controlDetails: { selectedControl: controlMetadata } };
      const wrapper = mount(<ControlPropertiesContainerWithRedux store={getStore(state)} />);
      expect(wrapper.find('.control-id')).text().to.eql('143');
    });

    it('should display autocomplete component when obsGroup control is selected', () => {
      controlMetadata.type = 'obsGroupControl';
      const state = { controlDetails: { selectedControl: controlMetadata } };
      const wrapper = mount(<ControlPropertiesContainerWithRedux store={getStore(state)} />);
      expect(wrapper).to.have.descendants('AutoComplete');
      expect(wrapper.find(('AutoComplete')).props()
        .optionsUrl.includes(constants.supportedObsGroupDataTypes)).to.eql(true);
      expect(wrapper.find(('AutoComplete')).props()
        .optionsUrl.includes(constants.supportedObsDataTypes)).to.eql(false);
    });

    it('should pass value if present from conceptToControlMap to AutoComplete component', () => {
      const state = {
        controlDetails: { selectedControl: controlMetadata },
        conceptToControlMap: { 123: { name: 'someName' } },
      };
      const wrapper = mount(<ControlPropertiesContainerWithRedux store={getStore(state)} />);
      expect(wrapper).to.have.descendants('AutoComplete');
      expect(wrapper.find('AutoComplete').props().value).to.eql({ name: 'someName' });
    });

    it('should pass value as undefined when conceptToControlMap is undefined', () => {
      const state = {
        controlDetails: { selectedControl: controlMetadata },
        conceptToControlMap: undefined,
      };
      const wrapper = mount(<ControlPropertiesContainerWithRedux store={getStore(state)} />);
      expect(wrapper).to.have.descendants('AutoComplete');
      expect(wrapper.find('AutoComplete').props().value).to.eql(undefined);
    });

    it('should pass value as undefined when ' +
      'conceptToControlMap does not have value for selected control', () => {
      const state = {
        controlDetails: { selectedControl: controlMetadata },
        conceptToControlMap: { 1: { name: 'someOtherName' } },
      };
      const wrapper = mount(<ControlPropertiesContainerWithRedux store={getStore(state)} />);
      expect(wrapper).to.have.descendants('AutoComplete');
      expect(wrapper.find('AutoComplete').props().value).to.eql(undefined);
    });

    it('should pass enabled value as true when there is no value for Autocomplete', () => {
      const state = {
        controlDetails: { selectedControl: controlMetadata },
        conceptToControlMap: { 1: { name: 'someOtherName' } },
      };
      const wrapper = mount(<ControlPropertiesContainerWithRedux store={getStore(state)} />);
      expect(wrapper).to.have.descendants('AutoComplete');
      expect(wrapper.find('AutoComplete').props().enabled).to.eql(true);
    });

    it('should pass enabled value as false when there is a value for Autocomplete', () => {
      const state = {
        controlDetails: { selectedControl: controlMetadata },
        conceptToControlMap: { 123: { name: 'someOtherName' } },
      };
      const wrapper = mount(<ControlPropertiesContainerWithRedux store={getStore(state)} />);
      expect(wrapper).to.have.descendants('AutoComplete');
      expect(wrapper.find('AutoComplete').props().enabled).to.eql(false);
    });

    it('should filter concepts with datatype N/A and is set', () => {
      const concepts = [
        {
          id: 'someId-1',
          datatype: { name: 'N/A' },
          name: { name: 'someName-1' },
          set: false,
        },
        {
          id: 'someId-2',
          datatype: { name: 'N/A' },
          name: { name: 'someName-2' },
          set: true,
        },
      ];
      const wrapper = shallow(<ControlPropertiesContainer dispatch={store.dispatch} />);
      const instance = wrapper.instance();
      expect(instance.filterOptions(concepts)).to.deep.eql([concepts[1]]);
    });
  });

  describe('PropertyEditor', () => {
    beforeEach(() => {
      controlMetadata = {
        id: '123',
        type: 'obsControl',
        properties: {},
        concept: { name: 'someName', uuid: 'someUuid', datatype: 'text' },
      };
    });

    it('should not display property editor component when no control is selected', () => {
      const wrapper = mount(<ControlPropertiesContainerWithRedux store={getStore()} />);
      expect(wrapper).to.not.have.descendants('PropertyEditor');
    });

    it('should display property editor component when control is selected and it has concept',
      () => {
        const state = { controlDetails: { selectedControl: controlMetadata } };
        const wrapper = mount(<ControlPropertiesContainerWithRedux store={getStore(state)} />);
        expect(wrapper).to.have.descendants('PropertyEditor');
      });

    it('should display property editor component when selected control type is section', () => {
      controlMetadata = {
        id: '123',
        type: 'section',
        properties: {},
      };
      const state = { controlDetails: { selectedControl: controlMetadata } };
      const wrapper = mount(<ControlPropertiesContainerWithRedux store={getStore(state)} />);
      expect(wrapper).to.have.descendants('PropertyEditor');
    });

    it('should not display property editor when selected control does not have concept and' +
      ' seletedControl is not a section', () => {
      controlMetadata = { id: '123', type: 'obsControl', properties: {} };
      const state = { controlDetails: { selectedControl: controlMetadata } };
      const wrapper = mount(<ControlPropertiesContainerWithRedux store={getStore(state)} />);
      expect(wrapper).to.not.have.descendants('PropertyEditor');
    });

    it('should pass appropriate props to property editor component', () => {
      const state = { controlDetails: { selectedControl: controlMetadata } };
      const wrapper = mount(<ControlPropertiesContainerWithRedux store={getStore(state)} />);
      expect(wrapper).to.have.descendants('PropertyEditor');
      expect(wrapper.find('PropertyEditor').props().metadata).to.deep.eql(controlMetadata);
    });

    it('should dispatch action on metadata update', () => {
      const updatedProperty = { mandatory: true };
      const state = { controlDetails: { selectedControl: controlMetadata } };
      const localStore = getStore(state);
      const wrapper = mount(<ControlPropertiesContainerWithRedux store={localStore} />);
      expect(wrapper).to.have.descendants('PropertyEditor');

      wrapper.find('PropertyEditor').props().onPropertyUpdate(updatedProperty);
      sinon.assert.calledOnce(localStore.dispatch
        .withArgs(setChangedProperty(updatedProperty, '123')));
    });
  });
});
