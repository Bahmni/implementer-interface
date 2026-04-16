/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { Property } from 'form-builder/components/Property.jsx';
import sinon from 'sinon';

chai.use(chaiEnzyme());

describe('Property', () => {
  let wrapper;

  it('should render property', () => {
    wrapper = shallow(<Property name="mandatory" onPropertyUpdate={() => {}} value={false} />);
    expect(wrapper.find('label').text()).to.eql('mandatory');
    expect(wrapper.find('input').props().type).to.eql('checkbox');
    expect(wrapper.find('input').props().checked).to.eql(false);
  });

  it('should call update property on selection of checkbox', () => {
    const spy = sinon.spy();

    wrapper = shallow(<Property name="mandatory" onPropertyUpdate={spy} value />);
    wrapper.find('input').props().onChange({ target: { checked: true } });
    sinon.assert.calledWith(spy, { mandatory: true });
  });

  it('should render button when given property with button type', () => {
    const type = 'button';

    wrapper = shallow(<Property
      elementType={type}
      name="control Event"
      onPropertyUpdate={() => {}}
      value={false}
    />);

    expect(wrapper).to.have.exactly(1).descendants('button');
    expect(wrapper.find('button').props().className).to.eql('control-event-button');
  });

  it('should call property update once click the editor button', () => {
    const spy = sinon.spy();

    wrapper = shallow(<Property
      elementName="Editor"
      elementType="button"
      name="controlEvent"
      onPropertyUpdate={spy}
      value
    />);

    wrapper.find('button').props().onClick({ target: { checked: true } });

    sinon.assert.calledWith(spy, { controlEvent: true });
  });

  it('should render text box when given property with text type', () => {
    const type = 'text';

    wrapper = shallow(<Property
      elementType={type}
      name="control Event"
      onPropertyUpdate={() => {}}
      value={'someText'}
    />);

    expect(wrapper).to.have.exactly(1).descendants('input');
    expect(wrapper.find('input').props().type).to.eql('text');
    expect(wrapper.find('input').props().defaultValue).to.eql('someText');
  });

  it('should call update property on change of text box', () => {
    const spy = sinon.spy();
    const type = 'text';

    wrapper = shallow(<Property
      elementType={type}
      name="someProperty"
      onPropertyUpdate={spy}
      value={false}
    />);
    wrapper.find('input').props().onChange({ target: { value: 'someText' } }, type);
    sinon.assert.calledWith(spy, { someProperty: 'someText' });
  });

  it('should call update property on blur of text box if the name is url', () => {
    const spy = sinon.spy();
    const type = 'text';

    wrapper = shallow(<Property
      elementType={type}
      name="url"
      onPropertyUpdate={spy}
      value={false}
    />);
    wrapper.find('input').props().onBlur({ target: { value: 'someText' } }, type);
    sinon.assert.calledWith(spy, { url: 'someText' });
  });

  it('should render select dropdown when given property with dropdown', () => {
    const type = 'dropdown';

    wrapper = shallow(<Property
      elementType={type}
      name="control Event"
      onPropertyUpdate={() => {}}
      options={['one', 'two']}
      value={'one'}
    />);

    expect(wrapper).to.have.exactly(1).descendants('select');
    expect(wrapper.find('option').at(0).text()).to.eql('one');
    expect(wrapper.find('option').at(1).text()).to.eql('two');
    expect(wrapper.find('select').props().defaultValue).to.eql('one');
  });

  it('should call update property on change of select dropdown', () => {
    const spy = sinon.spy();
    const type = 'dropdown';

    wrapper = shallow(<Property
      elementType={type}
      name="someProperty"
      onPropertyUpdate={spy}
      options={['one', 'two']}
      value={'one'}
    />);
    wrapper.find('select').props().onChange({ target: { value: 'two' } }, type);
    sinon.assert.calledWith(spy, { someProperty: 'two' });
  });
});
