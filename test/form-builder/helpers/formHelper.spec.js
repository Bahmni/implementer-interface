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
        value: '{"controls": [{"control1": "value1"}]}',
      }],
    };
    const controls = FormHelper.getFormResourceControls(formData);

    expect(controls).to.be.eql([{ control1: 'value1' }]);
  });

  it('should return correct locale data when locale data is not empty', () => {
    const formData = {
      resources: [{
        dataType: formBuilderConstants.formResourceDataType,
        value: '{"locale":{"en":{"LABEL_1":"label"}},"controls": [{"control1": "value1"}]}',
      }],
    };
    const locale = FormHelper.getFormResourceLocaleData(formData);

    expect(locale).to.be.eql({ en: { LABEL_1: 'label' } });
  });
});

