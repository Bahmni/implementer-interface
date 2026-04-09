/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

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

