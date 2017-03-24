import get from 'lodash/get';
import filter from 'lodash/filter';
import { formBuilderConstants } from 'form-builder/constants';

export default class FormHelper {
  static getFormResourceControls(formData) {
    if (formData) {
      const { resources } = formData;
      const formResources = filter(resources,
        (resource) => resource.dataType === formBuilderConstants.formResourceDataType);
      const valueAsString = get(formResources, ['0', 'value']);
      return (valueAsString && JSON.parse(valueAsString).controls) || [];
    }
    return [];
  }

  static validateFormName(formName) {
    const pattern = /^[^\.\/\-\^\s][^\.\/\-\^]*$/;
    return pattern.test(formName);
  }
}
