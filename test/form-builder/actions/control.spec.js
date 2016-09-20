import { expect } from 'chai';
import { selectSource, selectControl } from 'form-builder/actions/control';

describe('control', () => {
  describe('selectSource', () => {
    let action;
    it('should return the selected control id', () => {
      action = selectControl(1);
      expect(action.type).to.be.eql('SELECT_CONTROL');
      expect(action.id).to.be.eql(1);
    });
  });

  describe('selectSource', () => {
    let action;
    it('should return the selected control id', () => {
      const concept = {
        name: 'Pulse',
        uuid: 'someUuid',
      };
      action = selectSource(concept, 1);
      expect(action.type).to.be.eql('SELECT_SOURCE');
      expect(action.id).to.be.eql(1);
      expect(action.concept).to.be.eql(concept);
    });
  });
});
