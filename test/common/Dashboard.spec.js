import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import React from 'react';

chai.use(chaiEnzyme());

import Dashboard from 'common/Dashboard';

describe('Dashboard', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Dashboard />);
  });

  it('should render dashboard', () => {
    expect(wrapper.find('.form-builder-link')).to.have.descendants('Link');
  });
});
