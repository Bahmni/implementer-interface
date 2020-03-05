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

  it('should store table translations', () => {
    const control = {
      type: 'table',
      label: {
        translationKey: 'TABLE_1',
        type: 'label',
        value: 'Vitals Table',
        id: '2',
      },
      columnHeaders: [
        {
          translationKey: 'COLUMN_1',
          type: 'label',
          value: 'Column 1',
          id: '2',
        },
        {
          translationKey: 'COLUMN_2',
          type: 'label',
          value: 'Column 2',
          id: '2',
        },
      ],
      id: '2',
    };
    const action = { control, type: 'GENERATE_TRANSLATIONS' };
    const expectedStoreState = { labels: { TABLE_1: 'Vitals Table',
      COLUMN_1: 'Column 1', COLUMN_2: 'Column 2' } };

    const state = translations({}, action);
    expect(state).to.be.eql(expectedStoreState);
  });

  describe('Update Translations', () => {
    it('should update the translations', () => {
      const action = {
        type: 'UPDATE_TRANSLATIONS', control: {
          value: 'severe undernutrition',
          type: 'concepts', translationKey: 'SEVERE_UNDERNUTRITION_13', locale: 'en',
        },
      };
      const expectedStoreState = {
        en: {
          concepts: {
            SEVERE_UNDERNUTRITION_13: 'severe undernutrition',
          },
        },
      };

      const state = translations({}, action);
      expect(state).to.be.eql(expectedStoreState);
    });

    it('should update the translations for different locale', () => {
      const action = {
        type: 'UPDATE_TRANSLATIONS', control: {
          value: 'severe undernutrition fr',
          type: 'concepts', translationKey: 'SEVERE_UNDERNUTRITION_13', locale: 'fr',
        },
      };
      const store = {
        en: {
          concepts: {
            SEVERE_UNDERNUTRITION_13: 'severe undernutrition',
          },
        },
      };
      const expectedStoreState = Object.assign({}, store, {
        fr: {
          concepts: {
            SEVERE_UNDERNUTRITION_13:
              'severe undernutrition fr',
          },
        },
      });

      const state = translations(store, action);
      expect(state).to.be.eql(expectedStoreState);
    });

    it('should update concept translations for a locale, which is already present in store', () => {
      const action = {
        type: 'UPDATE_TRANSLATIONS', control: {
          value: 'headache fr',
          type: 'concepts', translationKey: 'HEADACHE_23', locale: 'fr',
        },
      };
      const store = {
        en: {
          concepts: {
            SEVERE_UNDERNUTRITION_13: 'severe undernutrition',
          },
        },
        fr: {
          concepts: {
            SEVERE_UNDERNUTRITION_13: 'severe undernutrition fr',
          },
        },
      };
      const expectedStoreState = Object.assign({}, store, {
        fr: {
          concepts: {
            SEVERE_UNDERNUTRITION_13: 'severe undernutrition fr',
            HEADACHE_23: 'headache fr',
          },
        },
      });

      const state = translations(store, action);
      expect(state).to.be.eql(expectedStoreState);
    });

    it('should update label translations for a locale, which is already present in store', () => {
      const action = {
        type: 'UPDATE_TRANSLATIONS', control: {
          value: 'headache fr',
          type: 'labels', translationKey: 'HEADACHE_23', locale: 'fr',
        },
      };
      const store = {
        en: {
          concepts: {
            SEVERE_UNDERNUTRITION_13: 'severe undernutrition',
          },
        },
        fr: {
          concepts: {
            SEVERE_UNDERNUTRITION_13: 'severe undernutrition fr',
          },
        },
      };
      const expectedStoreState = Object.assign({}, store, {
        fr: {
          concepts: {
            SEVERE_UNDERNUTRITION_13: 'severe undernutrition fr',
          },
          labels: {
            HEADACHE_23: 'headache fr',
          },
        },
      });

      const state = translations(store, action);
      expect(state).to.be.eql(expectedStoreState);
    });
  });

  it('should remove translations from store for given locale', () => {
    const action = { locale: 'fr', type: 'REMOVE_LOCALE_TRANSLATIONS' };
    const expectedStoreState = {
      en: {
        concepts: {
          SEVERE_UNDERNUTRITION_13: 'severe undernutrition',
        },
      },
    };
    const store = {
      en: {
        concepts: {
          SEVERE_UNDERNUTRITION_13: 'severe undernutrition',
        },
      },
      fr: {
        concepts: {
          SEVERE_UNDERNUTRITION_13: 'severe undernutrition fr',
        },
      },
    };

    const state = translations(store, action);
    expect(state).to.be.eql(expectedStoreState);
  });
  it('should not break if the concept does not have a label and we try to get translations', () => {
    const control = {
      type: 'obsControl',
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
      concepts: {},
      labels: { BOOLEAN_YES: 'Yes', BOOLEAN_NO: 'No' },
    };

    const state = translations({}, action);
    expect(state).to.be.eql(expectedStoreState);
  });
});
