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
import { ControlPoolElement } from 'form-builder/components/ControlPoolElement.jsx';
import { IDGenerator } from 'form-builder/helpers/idGenerator';

chai.use(chaiEnzyme());

describe('ControlPoolElement', () => {
  it('should render a component using display name', () => {
    const fakeMetaData = { label: 'control1' };
    const idGenerator = new IDGenerator([]);
    const controlPoolElement = shallow(
      <ControlPoolElement
        displayName="control1"
        idGenerator={ idGenerator }
        metadata={ fakeMetaData }
      />);
    expect(controlPoolElement.find('.control-list').text()).to.eql('control1');
  });

  it('should add draggable properties', () => {
    const fakeMetaData = { label: 'control1' };
    const idGenerator = new IDGenerator([]);
    const controlPoolElement = shallow(
      <ControlPoolElement
        displayName="control1"
        idGenerator={ idGenerator }
        metadata={ fakeMetaData }
      />);

    const eventData = {
      stopPropagation() {},
      dataTransfer: {
        dragData: {},
        setData: function setData(type, data) {
          this.dragData = data;
        },
      },
    };
    controlPoolElement.find('.control-list').props().onDragStart(eventData);
    expect(controlPoolElement.find('.control-list')).to.have.prop('onDragStart');
    expect(controlPoolElement.find('.control-list').props().draggable).to.eql('true');
  });

  describe('processDragStart', () => {
    it('should update the metadata with generated id', () => {
      const data = { label: 'control1' };
      const expectedData = { label: 'control1', id: '1' };
      const idGenerator = new IDGenerator([]);
      const controlPoolElement = shallow(
        <ControlPoolElement
          displayName="control1"
          idGenerator={ idGenerator }
          metadata={ data }
        />);
      const updatedData = controlPoolElement.instance().processDragStart(data);
      expect(updatedData).to.deep.eql(expectedData);
    });
  });
});
