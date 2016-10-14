import { expect } from 'chai';
import { IDGenerator } from 'form-builder/helpers/idGenerator';

describe('idGenerator', () => {
  const controls = [
    {
      id: 1,
      controls: [],
    },
    {
      id: 2,
      controls: [
        {
          id: 23,
          controls: [
            {
              id: 235,
              controls: [],
            },
          ],
        },
      ],
    },
  ];
  describe('getId', () => {
    it('should return 1 when controls are empty', () => {
      const idGenerator = new IDGenerator();
      const controlId = idGenerator.getId();
      expect(controlId).to.be.eql(1);
    });
    it('should return all the max control Id', () => {
      const idGenerator = new IDGenerator(controls);
      const controlIds = idGenerator.getId();
      expect(controlIds).to.be.eql(236);
    });
  });
});

