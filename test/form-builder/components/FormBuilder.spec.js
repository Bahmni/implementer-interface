import React from 'react';

import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import FormBuilder from 'form-builder/components/FormBuilder';

chai.use(chaiEnzyme());

describe('FormBuilder', () => {
  let wrapper;

  it('should render FormList', () => {
    wrapper = shallow(<FormBuilder data={[1, 2, 3]} />);
    expect(wrapper).to.have.exactly(1).descendants('FormList');
  });

  it('should render Error component when there is an error', () => {
    wrapper = shallow(<FormBuilder data={[]} error={{ status: 404 }} />);
    expect(wrapper).to.have.exactly(1).descendants('div');
  });
});
