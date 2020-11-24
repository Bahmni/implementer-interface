import React from 'react';
import { shallow } from 'enzyme';
import FormPrivilegeTable from 'form-builder/components/FormPrivilegeTable.jsx';
import sinon from 'sinon';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';

chai.use(chaiEnzyme());

describe('FormPrivilegeTable', () => {
   let wrapper;

   it('should add new row to formPrivileges when Add Row button is clicked', () => {
      const spy = sinon.spy(FormPrivilegeTable.prototype, 'handleAddRow');
      wrapper = shallow(<FormPrivilegeTable />);

      wrapper.find('#add-btn').simulate('click');

      sinon.assert.calledOnce(spy);
      expect(wrapper.state('formPrivileges')).to.have.length(2);
   })
})


describe('FormPrivilegeTable', () => {
    it('should remove data from formPrivilege when delete icon is clicked', () => {
        const wrapper = shallow(<FormPrivilegeTable />);
        wrapper.setState({
            formPrivileges: [{
                formId: "1",
                privilegeName: "abcd",
                editable: true,
                viewable: false,
            }, {
                formId: "2",
                privilegeName: "efgh",
                editable: false,
                viewable: true,
            }]
        })
        const instance = wrapper.instance();

        instance.handleRemoveSpecificRow(1);

        expect(wrapper.state('formPrivileges').length).to.eql(1);
        expect(wrapper.state('formPrivileges')[0].privilegeName).to.eql("abcd");
    });
});
>>>>>>> Stashed changes
