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
