import { expect } from 'chai';
import React from 'react';
import { getConceptFromControls, setConceptToControls, getConceptFromMetadata } from 'form-builder/helpers/componentMapper';

describe('componentMapper', () => {
  const getDescriptor = (id) =>
    ({ control: () => (<div></div>), metadata: { id, type: 'obsControl' } });

  const getConceptFrom = (uuid, name, datatype) =>
    ({
      datatype: { name: datatype },
      display: name,
      name: { name },
      uuid,
    });

  describe('setConceptToControls', () => {
    it('should return descriptors as is when there are no concepts', () => {
      const obsControl1 = getDescriptor('1');
      const obsControl2 = getDescriptor('2');
      const descriptors = [obsControl1, obsControl2];

      const updatedDescriptors = setConceptToControls(descriptors, {});
      expect(updatedDescriptors).to.be.eql(descriptors);
    });

    it('should return descriptors as is when the concepts associated to controls is null', () => {
      const obsControl1 = getDescriptor('1');
      const obsControl2 = getDescriptor('2');
      const descriptors = [obsControl1, obsControl2];

      const updatedDescriptors = setConceptToControls(descriptors, { 1: null });
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
        datatype: 'Numeric',
      };
      const updatedDescriptors = setConceptToControls(descriptors, conceptToControlMap);
      expect(updatedDescriptors).to.deep.eql([obsControl1, expectedDescriptor2]);
    });
  });

  describe('getConceptFromControls', () => {
    it('should return empty object when there are no concepts in descriptors', () => {
      const metadata1 = { id: '1' };
      const metadata2 = { id: '2' };

      const conceptToControlMap = getConceptFromControls([metadata1, metadata2]);
      expect(conceptToControlMap).to.be.eql({});
    });

    it('should return controlId-Concept map when there are concepts in descriptors', () => {
      const concept1 = { name: 'someName-1', datatype: 'text', uuid: 'someUuid-1' };
      const concept2 = { name: 'someName-2', datatype: 'text', uuid: 'someUuid-2' };
      const metadata1 = { concept: concept1, id: '1' };
      const metadata2 = { concept: concept2, id: '2' };

      const expectedMap = {
        1: getConceptFrom('someUuid-1', 'someName-1', 'text'),
        2: getConceptFrom('someUuid-2', 'someName-2', 'text'),
      };

      const conceptToControlMap = getConceptFromControls([metadata1, metadata2]);
      expect(conceptToControlMap).to.be.eql(expectedMap);
    });
  });

  describe('getConceptFromMetadata', () => {
    it('should return empty map if the concept is absent', () => {
      const metadata1 = { id: '1' };

      const conceptToControlMap = getConceptFromMetadata(metadata1);

      expect(conceptToControlMap).to.be.eql({});
    });

    it('should return the map of controlid-to-concept', () => {
      const concept1 = { name: 'someName-1', datatype: 'text', uuid: 'someUuid-1' };
      const metadata1 = { concept: concept1, id: '1' };

      const conceptToControlMap = getConceptFromMetadata(metadata1);
      const expectedMap = { ['1']: getConceptFrom('someUuid-1', 'someName-1', 'text') };
      expect(conceptToControlMap).to.be.eql(expectedMap);
    });
  });
});

