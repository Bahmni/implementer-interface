import { expect } from 'chai';
import React from 'react';
import { componentMapper } from 'form-builder/helpers/componentMapper';

describe('componentMapper', () => {
  const getDescriptor = (id) =>
    ({ control: () => (<div></div>), metadata: { id, type: 'obsControl' } });

  it('should return descriptors as is when there are no concepts', () => {
    const obsControl1 = getDescriptor('1');
    const obsControl2 = getDescriptor('2');
    const descriptors = [obsControl1, obsControl2];

    const updatedDescriptors = componentMapper(descriptors, {});
    expect(updatedDescriptors).to.be.eql(descriptors);
  });

  it('should return descriptors as is when the concepts associated to controls is null', () => {
    const obsControl1 = getDescriptor('1');
    const obsControl2 = getDescriptor('2');
    const descriptors = [obsControl1, obsControl2];

    const updatedDescriptors = componentMapper(descriptors, { 1: null });
    expect(updatedDescriptors).to.be.eql(descriptors);
  });

  it('should return descriptors with sanitized concept if present', () => {
    const obsControl1 = getDescriptor('1');
    const obsControl2 = getDescriptor('2');
    const descriptors = [obsControl1, obsControl2];
    const conceptToControlMap = {
      2: {
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

    const expectedDescriptor2 = obsControl2;
    expectedDescriptor2.metadata.concept = {
      name: 'Temperature',
      uuid: 'c37bd733-3f10-11e4-adec-0800271c1b75',
    };
    expectedDescriptor2.metadata.displayType = 'Numeric';
    const updatedDescriptors = componentMapper(descriptors, conceptToControlMap);
    expect(updatedDescriptors).to.deep.eql([obsControl1, expectedDescriptor2]);
  });
});
