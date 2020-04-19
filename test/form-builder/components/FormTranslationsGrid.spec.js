import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { getStore } from 'test/utils/storeHelper';
import { Provider } from 'react-redux';
import { updateTranslations } from 'form-builder/actions/control';
import sinon from 'sinon';


import FormTranslationsGrid from 'form-builder/components/FormTranslationsGrid.jsx';

chai.use(chaiEnzyme());

describe('FormTranslationsGrid', () => {
  let wrapper;
  const data = {
    headers: [
      'Translation Key',
      'Default Locale (Español)',
      'Français',
    ],
    data: [
      {
        concepts: {
          SEVERE_UNDERNUTRITION_13: [
            'Undernutrition es',
            'Undernutrition s',
          ],
          SUPINE_10: [
            'SUPINE_10',
          ],
        },
        labels: {
          SECTION_12: [
            'SECTION es',
          ],
        },
        formNames: {
          FORM_NAME: ['Sample Name ESPANOL'],
        },
        locale: 'es',
      },
      {
        concepts: {
          SEVERE_UNDERNUTRITION_13: [
            'Undernutrition',
          ],
          SUPINE_10: [
            'SUPINE_10',
          ],
        },
        labels: {
          SECTION_12: [
            'SECTION_12',
          ],
        },
        formNames: {
          FORM_NAME: ['Sample Name FRENCH'],
        },
        locale: 'fr',
      },
    ],
  };

  function getTableBody() {
    return wrapper.find('table').find('tbody');
  }

  function getItem(row, column) {
    return getTableBody().find('tr').at(row).find('td').at(column);
  }

  function getData(row, column) {
    return getItem(row, column).text();
  }

  it('should render locale translations in table', () => {
    wrapper = mount(
      <Provider store={getStore()}>
        <FormTranslationsGrid translationData={data} />
      </Provider>);

    expect(getTableBody()).to.have.exactly(4).descendants('tr');
    expect(wrapper.find('table').find('thead')).to.have.exactly(1).descendants('tr');
    expect(wrapper.find('table').find('thead')).to.have.exactly(3).descendants('th');

    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
      expect(getItem(rowIndex, 0)).not.to.have.descendants('FreeTextAutoComplete');
      expect(getItem(rowIndex, 2)).to.have.exactly(1).descendants('FreeTextAutoComplete');
      expect(getItem(rowIndex, 1)).to.have.exactly(1).descendants('FreeTextAutoComplete');
    }

    expect(getData(0, 0)).to.have.string('FORM_NAME');
    expect(getData(0, 1)).to.have.string('Sample Name ESPANOL');
    expect(getData(0, 2)).to.have.string('Sample Name FRENCH');
    expect(getData(1, 0)).to.have.string('SEVERE_UNDERNUTRITION_13');
    expect(getData(1, 1)).to.have.string('Undernutrition es');
    expect(getData(1, 2)).to.have.string('Undernutrition');
    expect(getData(3, 0)).to.have.string('SECTION_12');
    expect(getData(3, 1)).to.have.string('SECTION es');
    expect(getData(3, 2)).to.have.string('SECTION_12');
  });

  it('should update store on value change', () => {
    const store = getStore();
    wrapper = mount(
      <Provider store={store}>
        <FormTranslationsGrid translationData={data} />
      </Provider>);

    const freeTextAutocomplete = wrapper.find('table').find('tbody').find('tr')
      .at(0).find('td').at(1).find('FreeTextAutoComplete');
    const onChange = freeTextAutocomplete.props().onChange;
    expect(onChange).to.be.instanceOf(Function);
    onChange({ value: 'something' }, 'concepts', 'SEVERE_UNDERNUTRITION_13', 'en');
    onChange({ value: 'NEW NAME TRANSLATION' }, 'formNames', 'FORM_NAME', 'en');
    sinon.assert.calledOnce(store.dispatch.withArgs(updateTranslations(
      {
        value: 'something', type: 'concepts',
        translationKey: 'SEVERE_UNDERNUTRITION_13', locale: 'en',
      }
    )));
    sinon.assert.calledOnce(store.dispatch.withArgs(updateTranslations(
      {
        value: 'NEW NAME TRANSLATION', type: 'formNames',
        translationKey: 'FORM_NAME', locale: 'en',
      }
    )));
  });
});

