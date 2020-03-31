import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { httpInterceptor } from 'common/utils/httpInterceptor';
import { formBuilderConstants } from 'form-builder/constants';
import {
  getFormNameTranslations, saveFormNameTranslations,
  saveTranslations,
  translationsFor,
} from 'common/apis/formTranslationApi';
import { UrlHelper } from 'form-builder/helpers/UrlHelper';

chai.use(chaiEnzyme());

describe('formTranslationApi', () => {
  describe('save translation', () => {
    beforeEach(() => {
      sinon.stub(httpInterceptor, 'post').callsFake(() => Promise.resolve());
    });
    afterEach(() => {
      httpInterceptor.post.restore();
    });
    it('should call save translations endpoint and return a promise', () => {
      const translations = [{ formName: 'formName', formUuid: 'formUuid', version: '2',
        locale: 'en',
        concepts: { HEIGHT_2: 'HEIGHT_NEW_UUID' }, labels: {} }];
      const saveTranslationPromise = saveTranslations(translations);
      expect(saveTranslationPromise).not.to.eq(null);
      saveTranslationPromise.then(() => {
        sinon.assert.calledWith(
          httpInterceptor.post,
          formBuilderConstants.saveTranslationsUrl,
          translations
        );
      });
    });
  });
  describe('fetch translation', () => {
    const translations = [{ formName: 'formName', formUuid: 'formUuid', version: '2',
      locale: 'en',
      concepts: { HEIGHT_2: 'HEIGHT_NEW_UUID' }, labels: {} }];
    beforeEach(() => {
      sinon.stub(httpInterceptor, 'get').callsFake(() => Promise.resolve(translations));
    });
    afterEach(() => {
      httpInterceptor.get.restore();
    });
    it('should call translate endpoint and return a translations', () => {
      const formName = 'formName';
      const formVersion = 'version';
      const locale = 'locale';
      const formUuid = 'formUuid';
      const translatePromise = translationsFor(formName, formVersion, locale, formUuid);

      expect(translatePromise).not.to.eq(null);
      translatePromise.then(() => {
        sinon.assert.calledWith(
          httpInterceptor.get,
          new UrlHelper().bahmniFormTranslateUrl(formName, formVersion, locale, formUuid)
        );
      });
    });
  });

  describe('save form name translation', () => {
    beforeEach(() => {
      sinon.stub(httpInterceptor, 'post').callsFake(() => Promise.resolve());
    });
    afterEach(() => {
      httpInterceptor.post.restore();
    });

    it('should call save form name translations endpoint and return a promise', () => {
      const translations = { form: { name: 'formName', uuid: 'formUuid' }, value: '' };
      const saveTranslationPromise = saveFormNameTranslations(translations);
      expect(saveTranslationPromise).not.to.eq(null);
      saveTranslationPromise.then(() => {
        sinon.assert.calledWith(
          httpInterceptor.post,
          formBuilderConstants.saveNameTranslationsUrl,
          translations
        );
      });
    });

    it('should call save form name translations endpoint with reference form uuid ', () => {
      const translations = { form: { name: 'formName', uuid: 'formUuid' }, value: '' };
      const saveTranslationPromise = saveFormNameTranslations(translations, 'ref-uuid');
      expect(saveTranslationPromise).not.to.eq(null);
      saveTranslationPromise.then(() => {
        sinon.assert.calledWith(
          httpInterceptor.post,
          `${formBuilderConstants.saveNameTranslationsUrl}?referenceFormUuid=ref-uuid`,
          translations
        );
      });
    });
  });

  describe('fetch form name translation', () => {
    const nameTranslations = "[{ display: 'formName_en', locale: 'en'}]";
    beforeEach(() => {
      sinon.stub(httpInterceptor, 'get').callsFake(() => Promise.resolve(nameTranslations));
    });
    afterEach(() => {
      httpInterceptor.get.restore();
    });
    it('should call form name translate endpoint and return a translations', () => {
      const formName = 'formName';
      const formUuid = 'formUuid';
      const translatePromise = getFormNameTranslations(formName, formUuid);

      expect(translatePromise).not.to.eq(null);
      translatePromise.then(() => {
        sinon.assert.calledWith(
          httpInterceptor.get,
          new UrlHelper().bahmniFormTranslateUrl(formName, formUuid)
        );
      });
    });
  });
});

