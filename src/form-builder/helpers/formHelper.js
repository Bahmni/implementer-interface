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

  static getObsControlEvents(control) {
    let obsControlEvents = [];
    if (control.type === 'obsControl' && control.concept !== undefined) {
      obsControlEvents = obsControlEvents.concat({
        id: control.id, name: control.concept.name,
        events: control.events,
      });
    } else if (control.controls !== undefined) {
      const childControls = control.controls;
      const obsControls = childControls.filter(ctrl => ctrl.type === 'obsControl');
      const nonObscontrols = childControls.filter(ctrl => ctrl.type !== 'obsControl');
      nonObscontrols.forEach(ctrl => {
        if (ctrl.controls !== undefined) {
          const childObsControlEvents = this.getObsControlEvents(ctrl);
          obsControlEvents = obsControlEvents.concat(childObsControlEvents);
        }
      });
      obsControlEvents = obsControlEvents.concat(obsControls.map(ctrl =>
        ({ id: ctrl.id, name: ctrl.concept.name, events: ctrl.events })));
    }
    return obsControlEvents;
  }

  static getFormDefinitionVersion(formData) {
    if (formData) {
      const { resources } = formData;
      const formResources = filter(resources,
        (resource) => resource.dataType === formBuilderConstants.formResourceDataType);
      const valueAsString = get(formResources, ['0', 'value']);
      if (valueAsString) {
        const formDefVersion = JSON.parse(valueAsString).formDefVersion;
        if (formDefVersion !== undefined) {
          return formDefVersion;
        }
      }
    }
    return 1.0;
  }

}
