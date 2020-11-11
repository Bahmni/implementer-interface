import React from 'react';
import { shallow } from 'enzyme';
import FormPrivilegeTable from 'form-builder/components/FormPrivilegeTable.jsx';
import sinon from 'sinon';
import { expect } from 'chai';

describe('FormPrivilegeTable', () => {
   let wrapper;

   it('should add new row to formPrivileges when Add Row button is clicked', () => {
      const spy = sinon.spy(FormPrivilegeTable.prototype, 'handleAddRow');
      wrapper = shallow(<FormPrivilegeTable />);

      wrapper.find('#add-btn').simulate('click');

      sinon.assert.calledOnce(spy);
      expect(wrapper.state('formPrivileges')).to.have.length(2);
   });
})
