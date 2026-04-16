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
import Spinner from 'common/Spinner';

chai.use(chaiEnzyme());

describe('Spinner Component', () => {
  it('should render spinner', () => {
    const wrapper = mount(
      <Spinner show />
    );
    expect(wrapper).to.have.descendants('div');
  });

  it('should not render spinner', () => {
    const wrapper = mount(
      <Spinner show={false} />
    );
    expect(wrapper).to.be.blank();
  });
});
