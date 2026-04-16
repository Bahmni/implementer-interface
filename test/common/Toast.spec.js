/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

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
