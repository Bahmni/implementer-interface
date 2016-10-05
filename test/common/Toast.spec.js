import { mount, shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import NotificationContainer from 'common/Notification';

chai.use(chaiEnzyme());

describe('Notification Container Component', () => {
  let closeMessageSpy;
  let wrapper;
  let notifications;

  beforeEach(() => {
    closeMessageSpy = sinon.spy();
    notifications = [
      { message: 'message-1', type: 'type-1' },
      { message: 'message-2', type: 'type-2' },
    ];
  });

  it('should render notifications', () => {
    wrapper = mount(
      <NotificationContainer
        closeMessage={closeMessageSpy}
        notifications={notifications}
      />
    );
    expect(wrapper).to.have.exactly(2).descendants('Notification');
    expect(wrapper.find('.notification--type-1').find('.message').text()).to.eql('message-1');
    expect(wrapper.find('.notification--type-2').find('.message').text()).to.eql('message-2');
  });

  it('should not render notifications when empty', () => {
    wrapper = shallow(<NotificationContainer closeMessage={closeMessageSpy} notifications={[]} />);
    expect(wrapper).to.be.blank();
  });

  it('should callback the close Message', () => {
    wrapper = mount(
      <NotificationContainer
        closeMessage={closeMessageSpy}
        notifications={notifications}
      />
    );

    wrapper.find('.btn--close').at(0).simulate('click');
    sinon.assert.calledOnce(closeMessageSpy.withArgs(0));

    wrapper.find('.btn--close').at(1).simulate('click');
    sinon.assert.calledOnce(closeMessageSpy.withArgs(1));
  });
});
