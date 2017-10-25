import each from 'lodash/each';

const getLabelTranslations = (labelTranslations, data) => {
  const labels = labelTranslations || {};
  labels[data.translationKey] = data.value;
  return labels;
};

const getConceptTranslations = (conceptTranslations, data) => {
  const { label, concept } = data;
  const concepts = conceptTranslations || {};
  concepts[label.translationKey] = label.value;
  each(concept.answers, (answer) => {
    concepts[answer.translationKey] = answer.name.display;
  });
  if (concept.description) {
    concepts[concept.description.translationKey] = concept.description.value;
  }
  return concepts;
};

const translations = (store = {}, action) => {
  switch (action.type) {
    case 'GENERATE_TRANSLATIONS': {
      const { type, label } = action.control;
      if (type === 'label' || type === 'section') {
        return Object.assign({}, store,
          { labels: getLabelTranslations(store.labels, (label || action.control)) });
      }
      return Object.assign({}, store,
        { concepts: getConceptTranslations(store.concepts, action.control) });
    }

    case 'CLEAR_TRANSLATIONS': {
      return {};
    }

    default:
      return store;
  }
};

export default translations;
