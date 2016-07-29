import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import Error from 'common/Error';

chai.use(chaiEnzyme());

describe('Error Component', () => {
  let closeErrorMessageSpy;
  let error;
  let wrapper;

  beforeEach(() => {
    closeErrorMessageSpy = sinon.spy();
    error = { message: 'Error Message' };
    wrapper = shallow(<Error closeErrorMessage={closeErrorMessageSpy} error={error} />);
  });

  it('should show error message', () => {
    expect(wrapper.find('.message').text()).to.eql('Error Message');
  });

  it('should show not show error message when error is undefined', () => {
    wrapper = shallow(<Error closeErrorMessage={closeErrorMessageSpy} error={undefined} />);
    expect(wrapper).to.not.have.descendants('.error-container');
  });

  it('should close error message on click of close button', () => {
    wrapper.find('button').simulate('click');
    sinon.assert.calledOnce(closeErrorMessageSpy);
  });
});
