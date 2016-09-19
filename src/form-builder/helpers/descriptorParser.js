export class DescriptorParser {
  constructor(type, descriptor) {
    this.type = type;
    this.descriptor = descriptor;
    this.metadata = this.metadata.bind(this);
    this.data = this.data.bind(this);
    this.getType = this.getType.bind(this);
    this.parsedMetadata = this.metadata();
  }

  getDefaultValueByType(type) {
    switch (type) {
      case 'text':
        return '';
      case 'boolean':
        return false;
      case 'numeric':
        return 0;
      case 'complex':
        return {};
      case 'aggregate':
        return [];
      default:
        return null;
    }
  }

  metadata() {
    const parseAttributes = (accumulator, attributes) => {
      for (const attribute of attributes) {
        let value = {};
        const { dataType, defaultValue, attributes: childAttributes, name } = attribute;

        if (dataType === 'complex') parseAttributes(value, childAttributes);
        else value = defaultValue || this.getDefaultValueByType(dataType);

        Object.assign(accumulator, { [name]: value });
      }
    };
    const parsedMetadata = {};
    const { metadata: { attributes } } = this.descriptor;
    parseAttributes(parsedMetadata, attributes);
    return parsedMetadata;
  }

  control() {
    return this.descriptor.control;
  }

  designProperties() {
    return this.descriptor.designProperties;
  }

  data() {
    return {
      designProperties: this.descriptor.designProperties,
      metadata: this.parsedMetadata,
      control: this.descriptor.control,
      designerControl: this.descriptor.designerControl,
    };
  }

  getType() {
    return this.type;
  }
}
