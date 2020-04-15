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

  it('should return Obs Control Events when formJsonData is passed', () => {
    const formJsonData = {
      name: 'SectionForm',
      id: 1,
      type: 'section',
      controls: [
        {
          type: 'section',
          id: 4,
          controls: [
            {
              type: 'obsControl',
              id: 2,
              concept: {
                name: 'obs1',
              },
            },
          ],
        },
        {
          type: 'obsControl',
          id: 3,
          concept: {
            name: 'obs2',
          },
          events: { onValueChange: 'func(){}' },
        },
      ],
    };
    const estimatedObsControlEvents = [
      { id: 2,
        name: 'obs1',
        events: undefined,
      },
      { id: 3,
        name: 'obs2',
        events: { onValueChange: 'func(){}' },
      },
    ];

    const obsControlEvents = FormHelper.getObsControlEvents(formJsonData);

    expect(JSON.stringify(estimatedObsControlEvents)).to.equal(JSON.stringify(obsControlEvents));
  });

  it('should return empty Obs Control Events when control without obsControl  is passed', () => {
    const control = {
      name: 'SectionForm',
      id: 1,
      type: 'section',
    };
    const estimatedObsControlEvents = [];

    const obsControlEvents = FormHelper.getObsControlEvents(control);

    expect(JSON.stringify(estimatedObsControlEvents)).to.equal(JSON.stringify(obsControlEvents));
  });

  it('should return empty Obs Control Events when non obs control ' +
    'without controls is passed', () => {
    const control = {
      name: 'SectionForm',
      id: 1,
      type: 'section',
      controls: [
        {
          id: 2,
          type: 'section',
        },
      ],
    };
    const estimatedObsControlEvents = [];

    const obsControlEvents = FormHelper.getObsControlEvents(control);

    expect(JSON.stringify(estimatedObsControlEvents)).to.equal(JSON.stringify(obsControlEvents));
  });
});

