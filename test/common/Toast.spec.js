import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import React from 'react';
import NotificationContainer from 'common/Notification';

chai.use(chaiEnzyme());

describe('Notification Container Component', () => {
  it('should render notification', () => {
    const notification = { message: 'message-1', type: 'type-1' };
    const wrapper = mount(
      <NotificationContainer
        notification= { notification }
      />
    );
    expect(wrapper.find('.notification--type-1').find('.message').text()).to.eql('message-1');
  });
});
