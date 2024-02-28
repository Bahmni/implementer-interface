import each from 'lodash/each';
import omit from 'lodash/omit';

const getLabelTranslations = (labelTranslations, data) => {
  const labels = labelTranslations || {};
  labels[data.translationKey] = data.value;
  return labels;
};

const getConceptTranslations = (conceptTranslations, data) => {
  const { label, concept } = data;
  const concepts = conceptTranslations || {};
  if (label) {
    concepts[label.translationKey] = label.value;
  }
  each(concept.answers, (answer) => {
    concepts[answer.translationKey] = answer.name.display;
  });
  if (concept.description) {
    concepts[concept.description.translationKey] = concept.description.value;
  }
  return concepts;
};

const getBooleanValueTranslations = (labelTranslations, data) => {
  const labels = labelTranslations || {};
  each(data.options, (option) => {
    labels[option.translationKey] = option.name;
  });
  return labels;
};

const createLocaleTranslations = (action, store) => {
  const { type, translationKey, value, locale } = action.control;
  const localeTranslations = store[locale] || {};
  const selectedTranslations = localeTranslations[type] || {};

  selectedTranslations[translationKey] = value;
  localeTranslations[type] = selectedTranslations;

  return localeTranslations;
};

const translations = (store = {}, action) => {
  switch (action.type) {
    case 'GENERATE_TRANSLATIONS': {
      const { type, label } = action.control;
      if (type === 'label' || type === 'section' || type === 'imageView' || type === 'link') {
        return Object.assign({}, store,
          { labels: getLabelTranslations(store.labels, (label || action.control)) });
      } else if (type === 'table') {
        let newLables = getLabelTranslations(store.labels, label);
        action.control.columnHeaders.forEach(columnHeader => {
          newLables = getLabelTranslations(newLables, columnHeader);
        });
        return Object.assign({}, store, { labels: newLables });
      }
      return Object.assign({}, store,
        {
          concepts: getConceptTranslations(store.concepts, action.control),
          labels: getBooleanValueTranslations(store.labels, action.control),
        });
    }

    case 'UPDATE_TRANSLATIONS': {
      const localeTranslations = createLocaleTranslations(action, store);
      const { locale } = action.control;
      return Object.assign({}, store, { [locale]: localeTranslations });
    }

    case 'REMOVE_LOCALE_TRANSLATIONS': {
      return omit(store, action.locale);
    }

    case 'CLEAR_TRANSLATIONS': {
      return {};
    }

    default:
      return store;
  }
};

export default translations;
