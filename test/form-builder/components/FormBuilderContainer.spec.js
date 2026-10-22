/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { FormBuilderContainer } from 'form-builder/components/FormBuilderContainer.jsx';
import { httpInterceptor } from 'common/utils/httpInterceptor';
import { formBuilderConstants } from 'form-builder/constants';
import { commonConstants } from 'common/constants';

describe('FormBuilderContainer pagination', () => {
  const formsUrl =
    `${formBuilderConstants.formUrl}?v=custom:(id,uuid,name,version,published,auditInfo)`;
  const pageUrl = (startIndex) =>
    `${formBuilderConstants.formUrl}?v=custom%3A%28id%29&limit=2&startIndex=${startIndex}`;
  const absolutePageUrl = (startIndex) => `http://localhost${pageUrl(startIndex)}`;
  const form = (name) => ({ uuid: name, name, version: '1' });
  let getStub;
  let wrapper;

  const mountContainer = () => {
    wrapper = shallow(<FormBuilderContainer dispatch={() => {}} />,
      { disableLifecycleMethods: true, context: { router: {} } });
    return wrapper.instance();
  };

  beforeEach(() => {
    getStub = sinon.stub(httpInterceptor, 'get');
  });

  afterEach(() => {
    getStub.restore();
  });

  it('should request next pages from the current origin and merge all pages', () => {
    getStub.withArgs(formsUrl).returns(Promise.resolve({
      results: [form('b'), form('a')],
      links: [{ rel: 'next', uri: absolutePageUrl(2) }],
    }));
    getStub.withArgs(pageUrl(2)).returns(Promise.resolve({
      results: [form('d'), form('c')],
      links: [
        { rel: 'prev', uri: 'http://localhost/openmrs/ws/rest/v1/form?limit=2&' },
        { rel: 'next', uri: absolutePageUrl(4) },
      ],
    }));
    getStub.withArgs(pageUrl(4)).returns(Promise.resolve({ results: [form('e')], links: [] }));

    return mountContainer().getFormData().then(() => {
      expect(getStub.args.map((args) => args[0])).to.eql([formsUrl, pageUrl(2), pageUrl(4)]);
      expect(wrapper.state('data').map((f) => f.name)).to.eql(['a', 'b', 'c', 'd', 'e']);
      expect(wrapper.state('loading')).to.eql(false);
    });
  });

  it('should show an error and no partial list when a later page fails', () => {
    getStub.withArgs(formsUrl).returns(Promise.resolve({
      results: [form('a')],
      links: [{ rel: 'next', uri: absolutePageUrl(2) }],
    }));
    getStub.withArgs(pageUrl(2)).returns(Promise.reject(new Error('Failed to fetch')));

    return mountContainer().getFormData().then(() => {
      expect(wrapper.state('data')).to.eql([]);
      expect(wrapper.state('loading')).to.eql(false);
      expect(wrapper.state('notification')).to.eql(
        { message: 'Failed to fetch', type: commonConstants.responseType.error });
    });
  });

  it('should show an error instead of looping when the next link repeats', () => {
    getStub.withArgs(formsUrl).returns(Promise.resolve({
      results: [form('a')],
      links: [{ rel: 'next', uri: absolutePageUrl(2) }],
    }));
    getStub.withArgs(pageUrl(2)).returns(Promise.resolve({
      results: [form('b')],
      links: [{ rel: 'next', uri: absolutePageUrl(2) }],
    }));

    return mountContainer().getFormData().then(() => {
      expect(getStub.callCount).to.eql(2);
      expect(wrapper.state('data')).to.eql([]);
      expect(wrapper.state('loading')).to.eql(false);
      expect(wrapper.state('notification').type).to.eql(commonConstants.responseType.error);
      expect(wrapper.state('notification').message).to.contain('repeated pagination link');
    });
  });

  it('should show an error when the next link is invalid', () => {
    getStub.withArgs(formsUrl).returns(Promise.resolve({
      results: [form('a')],
      links: [{ rel: 'next', uri: 'http://' }],
    }));

    return mountContainer().getFormData().then(() => {
      expect(getStub.callCount).to.eql(1);
      expect(wrapper.state('data')).to.eql([]);
      expect(wrapper.state('loading')).to.eql(false);
      expect(wrapper.state('notification').message).to.contain('Invalid pagination link');
    });
  });

  it('should stop without requesting another page when the data limit is reached', () => {
    const results = Array.from({ length: formBuilderConstants.dataLimit }, (_, i) => form(`f${i}`));
    getStub.withArgs(formsUrl).returns(Promise.resolve({
      results,
      links: [{ rel: 'next', uri: absolutePageUrl(2) }],
    }));

    return mountContainer().getFormData().then(() => {
      expect(getStub.callCount).to.eql(1);
      expect(wrapper.state('data').length).to.eql(formBuilderConstants.dataLimit);
    });
  });

  it('should show the error message from the response when the first request fails', () => {
    const body = { error: { globalErrors: [{ message: 'boom' }] } };
    const response = { json: () => Promise.resolve(body) };
    const error = new Error('Server Error');
    error.response = response;
    getStub.withArgs(formsUrl).returns(Promise.reject(error));

    return mountContainer().getFormData()
      .then(() => new Promise((resolve) => setTimeout(resolve, 0)))
      .then(() => {
        expect(wrapper.state('loading')).to.eql(false);
        expect(wrapper.state('notification').message).to.eql('boom');
      });
  });

  describe('other actions', () => {
    let dispatch;

    const mountWithContext = (context) => {
      dispatch = sinon.spy();
      wrapper = shallow(<FormBuilderContainer dispatch={dispatch} />,
        { disableLifecycleMethods: true, context: { router: context } });
      return wrapper.instance();
    };

    let setItem;

    beforeEach(() => {
      setItem = sinon.spy();
      window.localStorage = { setItem };
    });

    afterEach(() => {
      delete window.localStorage;
    });

    it('should set the default locale and stop loading', () => {
      getStub.withArgs(formBuilderConstants.defaultLocaleUrl, 'text')
        .returns(Promise.resolve('fr'));
      const container = mountWithContext({});

      container.getDefaultLocale();

      return new Promise((resolve) => setTimeout(resolve, 0)).then(() => {
        expect(dispatch.calledOnce).to.eql(true);
        expect(setItem.calledWith('openmrsDefaultLocale', 'fr')).to.eql(true);
        expect(wrapper.state('loading')).to.eql(false);
      });
    });

    it('should show an error when the default locale cannot be fetched', () => {
      getStub.withArgs(formBuilderConstants.defaultLocaleUrl, 'text')
        .returns(Promise.reject(new Error('locale failed')));
      const container = mountWithContext({});
      container.getDefaultLocale();

      return new Promise((resolve) => setTimeout(resolve, 0)).then(() => {
        expect(wrapper.state('loading')).to.eql(false);
        expect(wrapper.state('notification').message).to.eql('locale failed');
      });
    });

    it('should show validation errors as error notification', () => {
      mountWithContext({}).onValidationError('invalid file');
      expect(wrapper.state('notification')).to.eql(
        { message: 'invalid file', type: commonConstants.responseType.error });
    });

    it('should reject an invalid form name without posting', () => {
      const postStub = sinon.stub(httpInterceptor, 'post');
      mountWithContext({}).saveForm({ name: ' bad name' });
      expect(postStub.called).to.eql(false);
      expect(wrapper.state('notification').type).to.eql(commonConstants.responseType.error);
      postStub.restore();
    });

    it('should navigate to the new form after it is saved', () => {
      const push = sinon.spy();
      const postStub = sinon.stub(httpInterceptor, 'post')
        .returns(Promise.resolve({ uuid: 'newUuid' }));
      mountWithContext({ history: { push } }).saveForm({ name: 'goodName' });

      return new Promise((resolve) => setTimeout(resolve, 0)).then(() => {
        expect(push.calledWith('/form-builder/newUuid')).to.eql(true);
        postStub.restore();
      });
    });

    it('should show an error when saving the form fails', () => {
      const postStub = sinon.stub(httpInterceptor, 'post')
        .returns(Promise.reject(new Error('save failed')));
      mountWithContext({}).saveForm({ name: 'goodName' });

      return new Promise((resolve) => setTimeout(resolve, 0)).then(() => {
        expect(wrapper.state('notification').message).to.eql('save failed');
        postStub.restore();
      });
    });

    it('should render the form builder with the loaded data', () => {
      mountWithContext({});
      wrapper.setState({ data: [form('a')], loading: false });
      expect(wrapper.find('Connect').length + wrapper.find('FormBuilder').length)
        .to.be.greaterThan(0);
    });
  });
});
