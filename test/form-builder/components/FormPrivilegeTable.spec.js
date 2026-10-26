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
  let wrapper;
  let getStub;

  beforeEach(() => {
    getStub = sinon.stub(httpInterceptor, 'get').returns(new Promise(() => {}));
    wrapper = shallow(<FormPrivilegeTable formPrivileges={[{ formId: 1 }]} />);
    getStub.resetHistory();
  });

  afterEach(() => {
    getStub.restore();
  });

  it('should request the next page from the current origin and merge all pages', () => {
    const next = {
      results: [{ name: 'b' }],
      links: [],
    };
    getStub.returns(Promise.resolve(next));
    const first = {
      results: [{ name: 'a' }],
      links: [{ rel: 'next', uri: 'http://localhost//openmrs/ws/rest/v1/privilege?limit=1' }],
    };
    expect(() => wrapper.instance().collectAllPrivileges(first, [])).to.throw('Invalid pagination');
    first.links[0].uri = 'http://other.example/openmrs/ws/rest/v1/privilege?limit=1&startIndex=1';
    const all = [];
    wrapper.instance().collectAllPrivileges(first, all);
    sinon.assert.calledWith(getStub, '/openmrs/ws/rest/v1/privilege?limit=1&startIndex=1');
    return Promise.resolve().then(() => Promise.resolve()).then(() => {
      expect(all.map((p) => p.name)).to.eql(['a', 'b']);
    });
  });

  it('should not request another page when there is no next link', () => {
    wrapper.instance().collectAllPrivileges({ results: [{ name: 'a' }], links: [] }, []);
    sinon.assert.notCalled(getStub);
  });
});
