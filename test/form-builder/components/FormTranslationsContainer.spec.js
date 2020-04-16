import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { httpInterceptor } from 'common/utils/httpInterceptor';
import { getStore } from 'test/utils/storeHelper';
import FormTranslationsContainer from 'form-builder/components/FormTranslationsContainer.jsx';
import { Provider } from 'react-redux';
import { removeLocaleTranslation } from 'form-builder/actions/control';
import { updateTranslations } from 'form-builder/actions/control';
import * as FormBuilderBreadcrumbs from 'form-builder/components/FormBuilderBreadcrumbs.jsx';

chai.use(chaiEnzyme());

describe('FormTranslationContainer', () => {
  const locales = {
    locales: [{ code: 'es', nativeName: 'Español' }, {
      code: 'fr',
      nativeName: 'Français',
    }, { code: 'en', nativeName: 'English' }],
  };

  const formData = { id: 56, uuid: 'form_uuid', name: 'form_name', version: '2' };

  const translationData = {
    concepts: {
      EXAMINATION_NOTES_18_DESC: [
        'desc Examination Notes',
      ],
      SEVERE_UNDERNUTRITION_13: [
        'Severe Undernutrition',
      ],
    },
    labels: {
      SECTION_12: [
        'Vitals Section',
      ],
      LABEL_1: [
        'Vitals Label',
      ],
    },
    locale: 'en',
  };


  const defaultProps = {
    match: { params: { formUuid: 'form_uuid' } },
    routes: [],
    defaultLocale: 'en',
  };

  let mockHttp;
  let breadcrumbsStub;
  beforeEach(() => {
    window.localStorage = {
      getItem: sinon.stub(),
    };
    localStorage.getItem.returns('en');

    mockHttp = sinon.stub(httpInterceptor);
    mockHttp.get.withArgs('/openmrs/ws/rest/v1/form/form_uuid?v=custom:(id,uuid,name,version)')
      .returns(Promise.resolve(formData));
    mockHttp.get.withArgs('/bahmni_config/openmrs/apps/home/locale_languages.json')
      .returns(Promise.resolve(locales));
    mockHttp.get.withArgs('/openmrs/ws/rest/v1/bahmniie/form/translate?formName=' +
      'form_name&formVersion=2&locale=en&formUuid=form_uuid')
      .returns(Promise.resolve(translationData));

    breadcrumbsStub = sinon.stub(FormBuilderBreadcrumbs, 'default').returns(<div>A stub</div>);
  });

  afterEach(() => {
    mockHttp.get.restore();
    mockHttp.post.restore();
    breadcrumbsStub.restore();
  });

  it('should render form translations and locale options on page load', (done) => {
    const expectedLocaleOptions = '<select><option value="en">English</option>' +
      '<option value="es">Español</option><option value="fr">Français</option>' +
      '</select>';
    const expectedTranslationData = {
      headers: [
        'Translation Key',
        'Default Locale (English)',
      ],
      data: [
        translationData,
      ],
    };

    const store = getStore();

    const wrapper = mount(
      <Provider store={store}>

        <FormTranslationsContainer
          {...defaultProps}
        />
      </Provider>
    );
    setTimeout(() => {
      const localeOptions = wrapper.find('.breadcrumb-inner').find('#locale-options');
      expect(expectedLocaleOptions, localeOptions.find('select').html());

      const formTranslationContainer = wrapper.find('FormTranslationsContainer');

      sinon.assert.callOrder(store.dispatch.withArgs(
        updateTranslations({
          value: 'desc Examination Notes',
          type: 'concepts',
          translationKey: 'EXAMINATION_NOTES_18_DESC',
          locale: 'en',
        })),
        store.dispatch.withArgs(updateTranslations({
          value: 'Severe Undernutrition',
          type: 'concepts',
          translationKey: 'SEVERE_UNDERNUTRITION_13',
          locale: 'en',
        })));

      expect(formTranslationContainer.find('.info-message').text()).to
        .have.string('Please save the changes before selecting a locale.');
      formTranslationContainer.update();
      formTranslationContainer.find('FormTranslationsGrid').update();
      expect(formTranslationContainer.find('FormTranslationsGrid').instance().props
        .translationData).to.eql(expectedTranslationData);
      sinon.assert.callOrder(
        mockHttp.get.withArgs('/bahmni_config/openmrs/apps/home/locale_languages.json'),
        mockHttp.get.withArgs('/openmrs/ws/rest/v1/form/form_uuid?v=custom:(id,uuid,name,version)'),
        mockHttp.get.withArgs('/openmrs/ws/rest/v1/bahmniie/form/translate?formName=' +
          'form_name&formVersion=2&locale=en&formUuid=form_uuid')
      );
      done();
    }, 50);
  });

  it('should render form translations on locale change', (done) => {
    const store = getStore();
    const localeTranslations = Object.assign({}, translationData);
    localeTranslations.locale = 'es';
    localeTranslations.concepts.SEVERE_UNDERNUTRITION_13 = ['Severe Undernutrition es'];
    mockHttp.get.withArgs('/openmrs/ws/rest/v1/bahmniie/form/translate?formName=' +
      'form_name&formVersion=2&locale=es&formUuid=form_uuid')
      .returns(Promise.resolve(localeTranslations));


    const expectedTranslationData = {
      headers: [
        'Translation Key',
        'Default Locale (English)',
        'Español',
      ],
      data: [
        translationData,
        localeTranslations,
      ],
    };


    const wrapper = mount(
      <Provider store={store}>

        <FormTranslationsContainer
          {...defaultProps}
        />
      </Provider>
    );


    setTimeout(() => {
      setTimeout(() => {
        const formTranslationContainer = wrapper.find('FormTranslationsContainer');
        formTranslationContainer.update();
        expect(formTranslationContainer.find('FormTranslationsGrid').instance().props
          .translationData).to.eql(expectedTranslationData);
        sinon.assert.callOrder(
          mockHttp.get.withArgs('/bahmni_config/openmrs/apps/home/locale_languages.json'),
          mockHttp.get.withArgs('/openmrs/ws/rest/v1/form/form_uuid?v=custom:' +
            '(id,uuid,name,version)'),
          mockHttp.get.withArgs('/openmrs/ws/rest/v1/bahmniie/form/translate?formName=' +
            'form_name&formVersion=2&locale=en&formUuid=form_uuid'),
          mockHttp.get.withArgs('/openmrs/ws/rest/v1/bahmniie/form/translate?formName=' +
            'form_name&formVersion=2&locale=es&formUuid=form_uuid')
        );
        sinon.assert.calledOnce(store.dispatch.withArgs(removeLocaleTranslation()));
        done();
      }, 50);
      wrapper.find('#locale-options').find('select')
        .simulate('change', { target: { value: 'es' } });
    }, 50);
  });

  it('should replace translations on locale change', (done) => {
    const store = getStore();
    const esLocaleTranslations = Object.assign({}, translationData);
    esLocaleTranslations.locale = 'es';
    esLocaleTranslations.concepts.SEVERE_UNDERNUTRITION_13 = ['Severe Undernutrition es'];
    mockHttp.get.withArgs('/openmrs/ws/rest/v1/bahmniie/form/translate?formName=' +
      'form_name&formVersion=2&locale=es&formUuid=form_uuid')
      .returns(Promise.resolve(esLocaleTranslations));
    const localeTranslations = Object.assign({}, translationData);
    localeTranslations.locale = 'fr';
    localeTranslations.concepts.SEVERE_UNDERNUTRITION_13 = ['Severe Undernutrition fr'];
    mockHttp.get.withArgs('/openmrs/ws/rest/v1/bahmniie/form/translate?formName=' +
      'form_name&formVersion=2&locale=fr&formUuid=form_uuid')
      .returns(Promise.resolve(localeTranslations));


    const expectedTranslationData = {
      headers: [
        'Translation Key',
        'Default Locale (English)',
        'Français',
      ],
      data: [
        translationData,
        localeTranslations,
      ],
    };


    const wrapper = mount(
      <Provider store={store}>

        <FormTranslationsContainer
          {...defaultProps}
        />
      </Provider>
    );


    setTimeout(() => {
      setTimeout(() => {
        setTimeout(() => {
          const formTranslationContainer = wrapper.find('FormTranslationsContainer');
          formTranslationContainer.update();
          expect(formTranslationContainer.find('FormTranslationsGrid').instance().props
            .translationData).to.eql(expectedTranslationData);

          sinon.assert.callOrder(
            mockHttp.get.withArgs('/bahmni_config/openmrs/apps/home/locale_languages.json'),
            mockHttp.get.withArgs('/openmrs/ws/rest/v1/form/form_uuid?v=custom:' +
              '(id,uuid,name,version)'),
            mockHttp.get.withArgs('/openmrs/ws/rest/v1/bahmniie/form/translate?formName=' +
              'form_name&formVersion=2&locale=en&formUuid=form_uuid'),
            mockHttp.get.withArgs('/openmrs/ws/rest/v1/bahmniie/form/translate?formName=' +
              'form_name&formVersion=2&locale=es&formUuid=form_uuid'),
            mockHttp.get.withArgs('/openmrs/ws/rest/v1/bahmniie/form/translate?formName=' +
              'form_name&formVersion=2&locale=fr&formUuid=form_uuid')
          );
          sinon.assert.calledOnce(store.dispatch.withArgs(removeLocaleTranslation('es')));
          sinon.assert.calledOnce(store.dispatch.withArgs(removeLocaleTranslation()));
          done();
        }, 50);
        wrapper.find('#locale-options').find('select')
          .simulate('change', { target: { value: 'fr' } });
      }, 50);
      wrapper.find('#locale-options').find('select')
        .simulate('change', { target: { value: 'es' } });
    }, 50);
  });

  it('should save generated translations', (done) => {
    const localeTranslations = Object.assign({}, translationData);

    mockHttp.post.withArgs('/openmrs/ws/rest/v1/bahmniie/form/saveTranslation')
      .returns(Promise.resolve({}));
    localeTranslations.locale = 'es';
    localeTranslations.concepts.SEVERE_UNDERNUTRITION_13 = ['Severe Undernutrition es'];
    mockHttp.get.withArgs('/openmrs/ws/rest/v1/bahmniie/form/translate?formName=' +
      'form_name&formVersion=2&locale=es&formUuid=form_uuid')
      .returns(Promise.resolve(localeTranslations));

    localeTranslations.formName = 'form_name';
    localeTranslations.formUuid = 'form_uuid';
    localeTranslations.version = '2';
    const wrapper = mount(
      <Provider store={getStore({ translations: { es: localeTranslations } })}>

        <FormTranslationsContainer
          {...defaultProps}
        />
      </Provider>
    );

    setTimeout(() => {
      setTimeout(() => {
        wrapper.find('#save-translations-button').simulate('click');
        sinon.assert.calledOnce(mockHttp.post.withArgs(
          '/openmrs/ws/rest/v1/bahmniie/form/saveTranslation', [localeTranslations]));

        setTimeout(() => {
          const formTranslationContainer = wrapper.find('FormTranslationsContainer');
          formTranslationContainer.update();
          expect(wrapper.find('NotificationContainer').props().notification)
          .to.eql({ message: 'Form translations saved successfully', type: 'success' });
          done();
        }, 50);
      }, 50);
      wrapper.find('#locale-options').find('select')
        .simulate('change', { target: { value: 'es' } });
    }, 50);
  });

  it('should show error message when locale fetch failed', (done) => {
    mockHttp.get.withArgs('/bahmni_config/openmrs/apps/home/locale_languages.json')
      .returns(Promise.reject());
    const wrapper = mount(
      <Provider store={getStore()}>

        <FormTranslationsContainer
          {...defaultProps}
        />
      </Provider>
    );
    setTimeout(() => {
      sinon.assert.calledOnce(
        mockHttp.get.withArgs('/bahmni_config/openmrs/apps/home/locale_languages.json')
      );
      sinon.assert.notCalled(
        mockHttp.get.withArgs('/openmrs/ws/rest/v1/form/form_uuid?v=custom:(id,uuid,name,version)')
      );
      const formTranslationContainer = wrapper.find('FormTranslationsContainer');
      formTranslationContainer.update();
      expect(wrapper.find('NotificationContainer').props().notification)
        .to.eql({ message: 'Failed to fetch locales information', type: 'error' });
      done();
    }, 50);
  });

  it('should show error message when form information fetch failed', (done) => {
    mockHttp.get.withArgs('/openmrs/ws/rest/v1/form/form_uuid?v=custom:(id,uuid,name,version)')
      .returns(Promise.reject());
    const wrapper = mount(
      <Provider store={getStore()}>

        <FormTranslationsContainer
          {...defaultProps}
        />
      </Provider>
    );
    setTimeout(() => {
      sinon.assert.callOrder(
        mockHttp.get.withArgs('/bahmni_config/openmrs/apps/home/locale_languages.json'),
        mockHttp.get.withArgs('/openmrs/ws/rest/v1/form/form_uuid?v=custom:(id,uuid,name,version)')
      );

      sinon.assert.notCalled(
        mockHttp.get.withArgs('/openmrs/ws/rest/v1/bahmniie/form/translate?formName=' +
          'form_name&formVersion=2&locale=en&formUuid=form_uuid')
      );
      const formTranslationContainer = wrapper.find('FormTranslationsContainer');
      formTranslationContainer.update();
      expect(wrapper.find('NotificationContainer').props().notification)
        .to.eql({ message: 'Failed to fetch form information', type: 'error' });
      done();
    }, 50);
  });

  it('should show error message when form translations fetch failed', (done) => {
    mockHttp.get.withArgs('/openmrs/ws/rest/v1/bahmniie/form/translate?formName=' +
      'form_name&formVersion=2&locale=en&formUuid=form_uuid')
      .returns(Promise.reject());
    const wrapper = mount(
      <Provider store={getStore()}>

        <FormTranslationsContainer
          {...defaultProps}
        />
      </Provider>
    );
    setTimeout(() => {
      sinon.assert.callOrder(
        mockHttp.get.withArgs('/bahmni_config/openmrs/apps/home/locale_languages.json'),
        mockHttp.get.withArgs('/openmrs/ws/rest/v1/form/form_uuid?v=custom:(id,uuid,name,version)'),
        mockHttp.get.withArgs('/openmrs/ws/rest/v1/bahmniie/form/translate?formName=' +
          'form_name&formVersion=2&locale=en&formUuid=form_uuid')
      );
      const formTranslationContainer = wrapper.find('FormTranslationsContainer');
      formTranslationContainer.update();
      expect(wrapper.find('NotificationContainer').props().notification)
        .to.eql({ message: 'Failed to fetch translation for [English] locale', type: 'error' });
      done();
    }, 50);
  });
});
