import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { httpInterceptor } from 'common/utils/httpInterceptor';
import { formBuilderConstants } from 'form-builder/constants';
import { saveTranslations } from 'common/apis/formTranslationApi';

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
});
