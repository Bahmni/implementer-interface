import { shallow } from 'enzyme';
import React from 'react';
import { expect } from 'chai';
import App from '../../../src/form-builder/components/App';

describe('App', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<App />);
  });

  it('should render properly', () => {
    expect(wrapper.find('.greeting').text()).to.eql('Hello, world.');
  });
});
