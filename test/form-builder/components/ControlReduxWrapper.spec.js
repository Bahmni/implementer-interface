import React from 'react';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import ControlWrapper from 'form-builder/components/ControlReduxWrapper';
import sinon from 'sinon';
import { getStore } from 'test/utils/storeHelper';
import { selectControl } from 'form-builder/actions/control';

chai.use(chaiEnzyme());

describe('ControlWrapper', () => {
  // eslint-disable-next-line
  const testControl = (props) => (<div>{ props.metadata.value }</div>);
  testControl.injectConceptToMetadata = (metadata, concept) => Object.assign({}, metadata, {
    concept: {
      name: concept.name.name,
      uuid: concept.uuid,
      datatype: concept.datatype.name,
    },
  });
  const componentStore = window.componentStore;
  const bahmniIDGenerator = window.bahmniIDGenerator;
  const metadata = {
    id: '1',
    type: 'testType',
    value: 'testValue',
  };
  before(() => {
    window.componentStore = {
      getDesignerComponent: () => ({ control: testControl }),
    };

    window.bahmniIDGenerator = {
      getId: () => 1,
    };
  });

  after(() => {
    window.componentStore = componentStore;
    window.bahmniIDGenerator = bahmniIDGenerator;
  });

  it('should render a control with the given metadata', () => {
    const controlWrapper = mount(
      <ControlWrapper
        metadata={ metadata }
        onUpdateMetadata={ () => {} }
        store={ getStore() }
      />);
    expect(controlWrapper.find('.control-wrapper').children().text()).to.eql(metadata.value);
  });

  it('should be draggable', () => {
    const controlWrapper = mount(
      <ControlWrapper
        metadata={ metadata }
        onUpdateMetadata={ () => {} }
        store={ getStore() }
      />);

    expect(controlWrapper.find('.control-wrapper')).to.have.prop('onDragStart');
    expect(controlWrapper.find('.control-wrapper')).to.have.prop('onDragEnd');
    expect(controlWrapper.find('.control-wrapper').children()).to.have.prop('onSelect');
  });

  it('should update context with concepts on change of conceptToControlMap', () => {
    const store = getStore();
    const controlWrapper = shallow(
      <ControlWrapper
        metadata={ metadata }
        onUpdateMetadata={ () => {} }
        store={ store }
      />).shallow();

    const conceptToControlMap = {
      1: {
        uuid: 'c37bd733-3f10-11e4-adec-0800271c1b75',
        display: 'Temperature',
        name: {
          uuid: 'c37bdec5-3f10-11e4-adec-0800271c1b75',
          name: 'Temperature',
        },
        conceptClass: {
          uuid: '8d492774-c2cc-11de-8d13-0010c6dffd0f',
          name: 'Misc',
        },
        datatype: {
          uuid: '8d4a4488-c2cc-11de-8d13-0010c6dffd0f',
          name: 'Numeric',
        },
        setMembers: [],
      },
    };

    controlWrapper.setProps({ conceptToControlMap });
    const concept = {
      name: 'Temperature',
      uuid: 'c37bd733-3f10-11e4-adec-0800271c1b75',
      datatype: 'Numeric',
    };


    const expectedMetadata = {
      id: '1',
      type: 'testType',
      value: 'testValue',
      concept,
    };
    const actualMetadata = controlWrapper.find('.control-wrapper').children().prop('metadata');
    expect(actualMetadata).to.deep.eql(expectedMetadata);
    sinon.assert.calledOnce(store.dispatch.withArgs(selectControl(expectedMetadata)));
  });

  it('should update properties when changed', () => {
    const store = getStore();
    const controlWrapper = shallow(
      <ControlWrapper
        metadata={ metadata }
        onUpdateMetadata={ () => {} }
        store={ store }
      />).shallow();
    const instance = controlWrapper.instance();
    instance.childControl = { getJsonDefinition: () => metadata };
    const controlProperty = { id: '1', property: { mandatory: true } };
    controlWrapper.setProps({ controlProperty });

    const expectedMetadata = Object.assign({}, metadata, { properties: { mandatory: true } });
    const actualMetadata = controlWrapper.find('.control-wrapper').children().prop('metadata');
    expect(actualMetadata).to.deep.eql(expectedMetadata);
    sinon.assert.calledOnce(store.dispatch.withArgs(selectControl(expectedMetadata)));
  });

  it('should not update properties when metadata id is different', () => {
    const store = getStore();
    const controlWrapper = shallow(
      <ControlWrapper
        metadata={ metadata }
        onUpdateMetadata={ () => {} }
        store={ store }
      />).shallow();
    const instance = controlWrapper.instance();
    instance.childControl = { getJsonDefinition: () => metadata };
    const controlProperty = { id: 'someOtherId', property: { mandatory: true } };
    controlWrapper.setProps({ controlProperty });

    const actualMetadata = controlWrapper.find('.control-wrapper').children().prop('metadata');
    expect(actualMetadata).to.deep.eql(metadata);
    sinon.assert.callCount(store.dispatch, 0);
  });

  it('should dispatch selectControlId', () => {
    const store = getStore();
    const controlWrapper = shallow(
      <ControlWrapper
        metadata={ metadata }
        onUpdateMetadata={ () => {} }
        store={ store }
      />).shallow();

    controlWrapper.instance().onSelected({ stopPropagation: () => {} }, '1');
    sinon.assert.calledOnce(store.dispatch.withArgs(selectControl('1')));
  });

  it('should set the updated metadata as the drag data', () => {
    const store = getStore();
    const controlWrapperShallow = shallow(
      <ControlWrapper
        metadata={ metadata }
        onUpdateMetadata={ () => {} }
        store={ store }
      />).shallow();
    const controlWrapper = controlWrapperShallow.instance();
    sinon.stub(controlWrapper, 'getJsonDefinition');

    controlWrapper.processDragStart();
    sinon.assert.calledOnce(controlWrapper.getJsonDefinition);
  });
});
