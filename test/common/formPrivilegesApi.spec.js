import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { httpInterceptor } from 'common/utils/httpInterceptor';
import { formBuilderConstants } from 'form-builder/constants';
import {
  saveFormPrivileges, getFormPrivileges,
  getFormPrivilegesFromUuid,
} from 'common/apis/formPrivilegesApi';
import { UrlHelper } from 'form-builder/helpers/UrlHelper';

chai.use(chaiEnzyme());

describe('formPrivilegesApi', () => {
  describe('save privileges', () => {
    beforeEach(() => {
      sinon.stub(httpInterceptor, 'post').callsFake(() => Promise.resolve());
    });
    afterEach(() => {
      httpInterceptor.post.restore();
    });
    it('should call save privileges endpoint and return a promise', () => {
      const privileges = [{ formId: 1, privilegeName: 'sample', editable: false, viewable: false }];
      const saveFormPrivilegesPromise = saveFormPrivileges(privileges);
      expect(saveFormPrivilegesPromise).not.to.eq(null);
      saveFormPrivilegesPromise.then(() => {
        sinon.assert.calledWith(
          httpInterceptor.post,
          formBuilderConstants.saveFormPrivilegesUrl,
          privileges
        );
      });
    });
    it('should call save privileges endpoint and return a promise', () => {
      const privileges = [];
      const saveFormPrivilegesPromise = saveFormPrivileges(privileges);
      expect(saveFormPrivilegesPromise).not.to.eq(null);
      saveFormPrivilegesPromise.then(() => {
        sinon.assert.calledWith(
              httpInterceptor.post,
              formBuilderConstants.saveFormPrivilegesUrl,
              privileges
            );
      });
    });
  });
  describe('fetch privileges for form given uuid ', () => {
    const privileges = [{ formId: 1, privilegeName: 'sample', editable: false, viewable: false }];
    beforeEach(() => {
      sinon.stub(httpInterceptor, 'get').callsFake(() => Promise.resolve(privileges));
    });
    afterEach(() => {
      httpInterceptor.get.restore();
    });
//         it('should call getFormPrivilegesFromUuid endpoint and return formPrivileges', () => {
//
//           const formUuid = 'formUuid';
//           const privilegePromise = getFormPrivilegesFromUuid(formUuid);
//           expect(privilegePromise).not.to.eq(null);
//           privilegePromise.then(() => {
//             sinon.assert.calledWith(
//               httpInterceptor.get,
//               new UrlHelper().getFormPrivilegesFromUuid(formUuid)
//             );
//           });
//
//         });
    it('should call getFormPrivileges endpoint and return formPrivileges', () => {
      const formName = 'formName';
      const formVersion = 'formVersion';
      const privilegePromise = getFormPrivileges(formName, formVersion);
      expect(privilegePromise).not.to.eq(null);
      privilegePromise.then(() => {
        sinon.assert.calledWith(
            httpInterceptor.get,
              new UrlHelper().getFormPrivilegesUrl(formName, formVersion)
            );
      });
    });
  });
});

