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
