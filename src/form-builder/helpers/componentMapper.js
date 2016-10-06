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

export function getConceptFromControls(descriptors) {
  const mapper = {};
  _.each(descriptors, (descriptor) => {
    const { concept, id } = descriptor.metadata;
    if (concept) {
      const name = { name: concept.name };
      const datatype = { name: concept.datatype };
      mapper[id] = { datatype, display: concept.name, name, uuid: concept.uuid };
    }
  });
  return mapper;
}
