import { expect } from 'chai';
import FormHelper from 'form-builder/helpers/formHelper';
import { formBuilderConstants } from 'form-builder/constants';

describe('formHelper', () => {
  it('should return the empty formResource when formData is empty', () => {
    const resources = FormHelper.getFormResourceControls({});
    expect(resources).to.be.eql([]);
  });

  it('should return correct controls when the formData is not empty', () => {
    const formData = {
      resources: [{
        dataType: formBuilderConstants.formResourceDataType,
        valueReference: '{"controls": [{"control1": "value1"}]}',
      }],
    };
    const controls = FormHelper.getFormResourceControls(formData);

    expect(controls).to.be.eql([{ control1: 'value1' }]);
  });
});

