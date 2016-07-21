import React from 'react';

import { shallow } from 'enzyme';
import { expect } from 'chai';
import FormBuilder from 'form-builder/components/FormBuilder';

describe('FormBuilder', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<FormBuilder />);
  });

  it('should render form builder page', () => {
    expect(wrapper.find('.heading').text()).to.eql('This is the form builder page');
  });
});
