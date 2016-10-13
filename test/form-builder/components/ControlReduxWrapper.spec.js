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
  const context = {
    type: 'testType',
    data: {
      type: 'testType',
      value: 'testValue',
    },
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
        context={ context }
        onUpdateMetadata={ () => {} }
        store={ getStore() }
      />);
    expect(controlWrapper.find('.control-wrapper').children().text()).to.eql(context.data.value);
  });

  it('should be draggable', () => {
    const controlWrapper = mount(
      <ControlWrapper
        context={ context }
        onUpdateMetadata={ () => {} }
        store={ getStore() }
      />);

    expect(controlWrapper.find('.control-wrapper')).to.have.prop('onDragStart');
    expect(controlWrapper.find('.control-wrapper')).to.have.prop('onDragEnd');
    expect(controlWrapper.find('.control-wrapper').children()).to.have.prop('onSelect');
  });

  it('should update context with concepts on change of conceptToControlMap', () => {
    const controlWrapper = shallow(
      <ControlWrapper
        context={ context }
        onUpdateMetadata={ () => {} }
        store={ getStore() }
      />).shallow();

    // const controlWrapper = wrapper.instance();
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
  });

  it('should dispatch selectControlId', () => {
    const store = getStore();
    const controlWrapper = shallow(
      <ControlWrapper
        context={ context }
        onUpdateMetadata={ () => {} }
        store={ store }
      />).shallow();

    controlWrapper.instance().onSelected({ stopPropagation: () => {} }, '1');
    sinon.assert.calledOnce(store.dispatch.withArgs(selectControl('1')));
  });
});
