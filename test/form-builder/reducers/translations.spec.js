import { expect } from 'chai';
import translations from 'form-builder/reducers/translations';

describe('translations', () => {
  it('should clear translations', () => {
    const action = { type: 'CLEAR_TRANSLATIONS' };
    const state = translations({}, action);
    expect(state).to.be.eql({});
  });

  it('should store section translations', () => {
    const control = {
      type: 'section',
      label: {
        translationKey: 'SECTION_2',
        type: 'label',
        value: 'Vitals Section',
        id: '2',
      },
      id: '2',
    };
    const action = { control, type: 'GENERATE_TRANSLATIONS' };
    const expectedStoreState = { labels: { SECTION_2: 'Vitals Section' } };

    const state = translations({}, action);
    expect(state).to.be.eql(expectedStoreState);
  });

  it('should store labels translations', () => {
    const control = {
      type: 'label',
      translationKey: 'SECTION_2',
      value: 'Vitals Section',
      id: '2',
    };
    const action = { control, type: 'GENERATE_TRANSLATIONS' };
    const expectedStoreState = { labels: { SECTION_2: 'Vitals Section' } };

    const state = translations({}, action);
    expect(state).to.be.eql(expectedStoreState);
  });

  it('should store concept translations', () => {
    const control = {
      type: 'obsControl',
      label: {
        translationKey: 'POSTURE_1',
        id: '1',
        type: 'label',
        value: 'Posture',
      },
      id: '1',
      concept: {
        name: 'Posture',
        answers: [
          {
            name: {
              display: 'Sitting',
              name: 'Sitting',
            },
            displayString: 'Sitting',
            translationKey: 'SITTING_1',
          },
          {
            name: {
              display: 'Supine',
              name: 'Supine',
            },
            displayString: 'Supine',
            translationKey: 'SUPINE_1',
          },
        ],
      },
    };

    const action = { control, type: 'GENERATE_TRANSLATIONS' };
    const expectedStoreState = {
      concepts: { POSTURE_1: 'Posture', SITTING_1: 'Sitting', SUPINE_1: 'Supine' },
      labels: {},
    };
    const state = translations({}, action);
    expect(state).to.be.eql(expectedStoreState);
  });

  it('should store boolean concept translations', () => {
    const control = {
      type: 'obsControl',
      label: {
        translationKey: 'SMOKING_HISTORY_1',
        id: '1',
        type: 'label',
        value: 'Smoking History',
      },
      id: '1',
      options: [
        {
          name: 'Yes',
          value: true,
          translationKey: 'BOOLEAN_YES',
        },
        {
          name: 'No',
          translationKey: 'BOOLEAN_NO',
        },
      ],
      concept: {
        name: 'Smoking History',
        uuid: 'someUuid',
      },
    };

    const action = { control, type: 'GENERATE_TRANSLATIONS' };
    const expectedStoreState = {
      concepts: { SMOKING_HISTORY_1: 'Smoking History' },
      labels: { BOOLEAN_YES: 'Yes', BOOLEAN_NO: 'No' },
    };

    const state = translations({}, action);
    expect(state).to.be.eql(expectedStoreState);
  });
});
