/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { expect } from 'chai';
import { DescriptorParser } from 'form-builder/helpers/descriptorParser';

describe('DescriptorParser', () => {
  it('should create metadata json', () => {
    const descriptorMetadata = {
      metadata: {
        attributes: [
          { dataType: 'text', defaultValue: 'obsControl', name: 'type' },
          { dataType: 'text', defaultValue: 'numeric', name: 'displayType' },
          {
            attributes: [
              { dataType: 'boolean', name: 'mandatory' },
              { name: 'validations', dataType: 'complex', attributes: [] },
              {
                name: 'i18N',
                dataType: 'complex',
                attributes: [{ dataType: 'text', name: 'key' }],
              },
            ],
            dataType: 'complex',
            name: 'properties',
          },
        ],
      },
    };

    const expectedMetadata = {
      type: 'obsControl',
      displayType: 'numeric',
      properties: {
        mandatory: false,
        validations: {},
        i18N: {
          key: '',
        },
      },
    };

    const descriptorParser = new DescriptorParser('someType', descriptorMetadata);
    const metadata = descriptorParser.metadata();

    expect(metadata).to.deep.eql(expectedMetadata);
  });

  it('should return empty metadata json when attributes are empty', () => {
    const descriptorMetadata = { metadata: { attributes: [] } };
    const descriptorParser = new DescriptorParser('someType', descriptorMetadata);
    const metadata = descriptorParser.metadata();
    expect(metadata).to.deep.eql({});
  });

  it('should return control', () => {
    const descriptorMetadata = { control: 'someControl', metadata: { attributes: [] } };
    const descriptorParser = new DescriptorParser('someType', descriptorMetadata);
    expect(descriptorParser.control()).to.deep.eql('someControl');
  });

  it('should return designAttributes', () => {
    const descriptorMetadata = {
      designProperties: { isTopLevelComponent: true },
      metadata: { attributes: [] },
    };
    const descriptorParser = new DescriptorParser('someType', descriptorMetadata);
    expect(descriptorParser.designProperties()).to.deep.eql({ isTopLevelComponent: true });
  });

  it('should give default value based on type', () => {
    const descriptorParser = new DescriptorParser('someType', { metadata: { attributes: [] } });
    expect(descriptorParser.getDefaultValueByType('text')).to.eql('');
    expect(descriptorParser.getDefaultValueByType('numeric')).to.eql(0);
    expect(descriptorParser.getDefaultValueByType('boolean')).to.eql(false);
    expect(descriptorParser.getDefaultValueByType('complex')).to.eql({});
    expect(descriptorParser.getDefaultValueByType('aggregate')).to.eql([]);
    expect(descriptorParser.getDefaultValueByType('somethingRandom')).to.eql(null);
  });
});
