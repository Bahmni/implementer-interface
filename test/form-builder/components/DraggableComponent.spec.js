/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { DraggableComponent } from 'form-builder/components/DraggableComponent.jsx';
import sinon from 'sinon';

chai.use(chaiEnzyme());

describe('DraggableComponent', () => {
  it('should call appropriate functions on drop', () => {
    const draggableComponent = new DraggableComponent({});
    const event = {
      preventDefault: () => {},
      dataTransfer: { getData: () => {} },
    };
    sinon.spy(event, 'preventDefault');
    sinon.spy(event.dataTransfer, 'getData');
    sinon.spy(draggableComponent, 'postDragProcess');

    draggableComponent.onDrop(event);
    sinon.assert.calledOnce(event.preventDefault);
    sinon.assert.calledOnce(event.dataTransfer.getData);
    sinon.assert.calledWith(event.dataTransfer.getData, 'data');
    sinon.assert.calledOnce(draggableComponent.postDragProcess);
  });

  it('should call appropriate functions on drag enter', () => {
    const draggableComponent = new DraggableComponent({});
    const event = {
      preventDefault: () => {},
      dataTransfer: {},
    };
    sinon.spy(event, 'preventDefault');

    draggableComponent.onDragOver(event);
    sinon.assert.calledOnce(event.preventDefault);
    expect(event.dataTransfer.dropEffect).to.eql('copy');
  });
});
