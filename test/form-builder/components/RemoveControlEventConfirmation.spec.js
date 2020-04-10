import React from 'react';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import RemoveControlEventConfirmation from
      '../../../src/form-builder/components/RemoveControlEventConfirmation.jsx';

chai.use(chaiEnzyme());

describe('RemoveControlEventConfirmation', () => {
  let wrapper;
  let closeSpy;
  let removeAndCloseSpy;

  beforeEach(() => {
    closeSpy = sinon.spy();
    removeAndCloseSpy = sinon.spy();
  });

  it('should render editor modal', () => {
    wrapper = mount(
        <RemoveControlEventConfirmation
          close={closeSpy}
          removeAndClose={removeAndCloseSpy}
        />);
    expect(wrapper.find('.remove-control-event-container')).to.have.length(1);
    expect(wrapper.find('.remove-control-event-body')).to.have.length(1);
    expect(wrapper.find('.header-title')).to.have.length(1);
  });

  it('should call close once click cancel button', () => {
    wrapper = shallow(
        <RemoveControlEventConfirmation
          close={closeSpy}
          removeAndClose={removeAndCloseSpy}
        />);
    const noButton = wrapper.find('.btn--highlight').at(0);
    noButton.simulate('click');

    expect(noButton.text()).to.eql('No');
    sinon.assert.calledOnce(closeSpy);
  });

  it('should call update script once click save button', () => {
    wrapper = shallow(
        <RemoveControlEventConfirmation
          close={closeSpy}
          removeAndClose={removeAndCloseSpy}
        />);
    const yesButton = wrapper.find('.btn').at(0);
    yesButton.simulate('click');

    expect(yesButton.text()).to.eql('Yes');
    sinon.assert.calledOnce(removeAndCloseSpy);
  });
});
