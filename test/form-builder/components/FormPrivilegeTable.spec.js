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
import FormPrivilegeTable from 'form-builder/components/FormPrivilegeTable.jsx';
import sinon from 'sinon';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { httpInterceptor } from 'common/utils/httpInterceptor';
import { formBuilderConstants } from 'form-builder/constants';
import { commonConstants } from 'common/constants';

chai.use(chaiEnzyme());

describe('FormPrivilegeTable', () => {
  let wrapper;
  const defaultProps = {
    formPrivileges: [{
      formId: 1,
      privilegeName: '',
      editable: false,
      viewable: false,
    }],
  };

  it('should add new row to formPrivileges when Add Row button is clicked', () => {
    wrapper = shallow(<FormPrivilegeTable {...defaultProps} />);
    const spy = sinon.spy(FormPrivilegeTable.prototype, 'handleAddRow');
    wrapper.setState({
      formPrivileges: [{
        formId: '1',
        privilegeName: 'abcd',
        editable: true,
        viewable: false,
      }, {
        formId: '2',
        privilegeName: 'efgh',
        editable: false,
        viewable: true,
      }],
    });
    wrapper.find('#add-btn').simulate('click');

    // sinon.assert.calledOnce(spy);
    // expect(wrapper.state('formPrivileges')).to.have.length(3);
  });
});


describe('FormPrivilegeTable', () => {
  it('should remove data from formPrivilege when delete icon is clicked', () => {
    let wrapper;
    const defaultProps = {
      formPrivileges: [{
        formId: 1,
        privilegeName: '',
        editable: false,
        viewable: false,
      }],
    };
    wrapper = shallow(<FormPrivilegeTable {...defaultProps} />);
    wrapper.setState({
      formPrivileges: [{
        formId: '1',
        privilegeName: 'abcd',
        editable: true,
        viewable: false,
      }, {
        formId: '2',
        privilegeName: 'efgh',
        editable: false,
        viewable: true,
      }],
    });
    const instance = wrapper.instance();

    instance.handleRemoveSpecificRow(1);

    // expect(wrapper.state('formPrivileges').length).to.eql(1);
    // expect(wrapper.state('formPrivileges')[0].privilegeName).to.eql('abcd');
  });
});
describe('FormPrivilegeTable', () => {
  it('should handle data from formPrivilege ', () => {
    let wrapper;
    const defaultProps = {
      formPrivileges: [{
        formId: 1,
        privilegeName: '',
        editable: false,
        viewable: false,
      }],
    };
    wrapper = shallow(<FormPrivilegeTable {...defaultProps} />);
    wrapper.setState({
      formPrivileges: [{
        formId: '1',
        privilegeName: 'abcd',
        editable: true,
        viewable: false,
      }, {
        formId: '2',
        privilegeName: 'efgh',
        editable: false,
        viewable: true,
      }],
    });
    const instance = wrapper.instance();
    const event = {
      display: 'ghij',
    };
    instance.handleTag(event, 0);
        // expect(wrapper.state('formPrivileges').length).to.eql(2);
        // expect(wrapper.state('formPrivileges')[0].privilegeName).to.eql("abcd");
  });
});

describe('FormPrivilegeTable pagination', () => {
  const firstUrl = `${formBuilderConstants.formPrivilegeUrl}?=`;
  const pageUrl = (startIndex) =>
    `${formBuilderConstants.formPrivilegeUrl}?limit=1&startIndex=${startIndex}`;
  const nextLink = (uri) => [{ rel: 'next', uri }];
  const privilege = (name) => ({ uuid: `uuid-${name}`, display: name });
  let wrapper;
  let getStub;

  beforeEach(() => {
    getStub = sinon.stub(httpInterceptor, 'get').returns(new Promise(() => {}));
    wrapper = shallow(<FormPrivilegeTable formPrivileges={[{ formId: 1 }]} />);
    getStub.reset();
    wrapper.setState({ loading: true, notification: {} });
  });

  afterEach(() => {
    getStub.restore();
  });

  it('should request next pages from the current origin and merge all pages', () => {
    getStub.withArgs(firstUrl).returns(Promise.resolve({
      results: [privilege('b'), privilege('a')],
      links: nextLink(`http://localhost${pageUrl(1)}`),
    }));
    getStub.withArgs(pageUrl(1)).returns(Promise.resolve({
      results: [privilege('c')],
      links: nextLink(`http://other.example${pageUrl(2)}`),
    }));
    getStub.withArgs(pageUrl(2)).returns(Promise.resolve({ results: [privilege('d')] }));

    return wrapper.instance().fetchPrivileges().then(() => {
      expect(getStub.args.map((args) => args[0])).to.eql([firstUrl, pageUrl(1), pageUrl(2)]);
      expect(wrapper.state('availablePrivileges')).to.eql(
        ['b', 'a', 'c', 'd'].map((name) => ({ value: name, uuid: `uuid-${name}`, label: name })));
      getStub.args.forEach((args) => expect(args[0].charAt(0)).to.eql('/'));
      expect(wrapper.state('loading')).to.eql(false);
      expect(wrapper.state('notification')).to.eql({});
    });
  });

  it('should show an error and stop loading when a later page fails', () => {
    getStub.withArgs(firstUrl).returns(Promise.resolve({
      results: [privilege('a')],
      links: nextLink(pageUrl(1)),
    }));
    getStub.withArgs(pageUrl(1)).returns(Promise.reject(new Error('Failed to fetch')));

    return wrapper.instance().fetchPrivileges().then(() => {
      expect(wrapper.state('loading')).to.eql(false);
      expect(wrapper.state('availablePrivileges')).to.eql([]);
      expect(wrapper.state('notification')).to.eql(
        { message: 'Failed to fetch', type: commonConstants.responseType.error });
    });
  });

  it('should show an error and stop loading when the first request fails', () => {
    getStub.withArgs(firstUrl).returns(Promise.reject(new Error('Server down')));

    return wrapper.instance().fetchPrivileges().then(() => {
      expect(wrapper.state('loading')).to.eql(false);
      expect(wrapper.state('notification').message).to.eql('Server down');
    });
  });

  [
    ['an error without a message', () => new Error('')],
    ['a null rejection', () => null],
    ['an undefined rejection', () => undefined],
  ].forEach(([description, makeError]) => {
    it(`should show a fallback message and stop loading for ${description}`, () => {
      getStub.withArgs(firstUrl).returns(Promise.reject(makeError()));

      return wrapper.instance().fetchPrivileges().then(() => {
        expect(wrapper.state('loading')).to.eql(false);
        expect(wrapper.state('notification')).to.eql(
          { message: 'Failed to load privileges', type: commonConstants.responseType.error });
      });
    });
  });

  it('should show an error and stop loading when the next link is invalid', () => {
    getStub.withArgs(firstUrl).returns(Promise.resolve({
      results: [privilege('a')],
      links: nextLink('http://localhost//evil.com/a'),
    }));

    return wrapper.instance().fetchPrivileges().then(() => {
      expect(getStub.callCount).to.eql(1);
      expect(wrapper.state('loading')).to.eql(false);
      expect(wrapper.state('availablePrivileges')).to.eql([]);
      expect(wrapper.state('notification').message).to.contain('Invalid pagination link');
    });
  });

  it('should show an error instead of looping when the next link repeats', () => {
    getStub.withArgs(firstUrl).returns(Promise.resolve({
      results: [privilege('a')],
      links: nextLink(pageUrl(1)),
    }));
    getStub.withArgs(pageUrl(1)).returns(Promise.resolve({
      results: [privilege('b')],
      links: nextLink(pageUrl(1)),
    }));

    return wrapper.instance().fetchPrivileges().then(() => {
      expect(getStub.callCount).to.eql(2);
      expect(wrapper.state('loading')).to.eql(false);
      expect(wrapper.state('notification').message).to.contain('repeated pagination link');
    });
  });

  it('should not request another page when there is no next link', () => {
    getStub.withArgs(firstUrl).returns(Promise.resolve({ results: [privilege('a')], links: [] }));

    return wrapper.instance().fetchPrivileges().then(() => {
      expect(getStub.callCount).to.eql(1);
      expect(wrapper.state('availablePrivileges').map((p) => p.label)).to.eql(['a']);
      expect(wrapper.state('loading')).to.eql(false);
    });
  });
});
