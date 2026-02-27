/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import _ from 'lodash';

export function setConceptToControls(descriptors, conceptToControlMap) {
  return _.map(descriptors, (descriptor) => {
    const concept = _.get(conceptToControlMap, descriptor.metadata.id);
    if (concept) {
      const descriptorClone = Object.assign({}, descriptor);
      descriptorClone.metadata.concept = {
        name: concept.name.name,
        uuid: concept.uuid,
        datatype: concept.datatype.name,
      };
      return descriptorClone;
    }
    return descriptor;
  });
}

export function getConceptFromControls(metatdatas) {
  const mapper = {};
  _.each(metatdatas, (metadata) => {
    const { concept, id } = metadata;
    if (concept) {
      const name = { name: concept.name };
      const datatype = { name: concept.datatype };
      mapper[id] = { datatype, display: concept.name, name, uuid: concept.uuid };
    }
  });
  return mapper;
}


export function getConceptFromMetadata(metadata) {
  const mapper = {};
  const { concept, id } = metadata;
  if (concept) {
    const name = { name: concept.name };
    const datatype = { name: concept.datatype };
    mapper[id] = { datatype, display: concept.name, name, uuid: concept.uuid };
  }
  return mapper;
}
