import _ from 'lodash';

export function componentMapper(descriptors, conceptToControlMap) {
  return _.map(descriptors, (descriptor) => {
    const concept = _.get(conceptToControlMap, descriptor.metadata.id);
    if (concept) {
      const descriptorClone = Object.assign({}, descriptor);
      descriptorClone.metadata.concept = {
        name: concept.name.name,
        uuid: concept.uuid,
      };
      descriptorClone.metadata.displayType = concept.datatype.name;
      return descriptorClone;
    }
    return descriptor;
  });
}
