import React from 'react';

import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import Form from 'form-builder/components/Form';

chai.use(chaiEnzyme());

describe('Form', () => {
  let wrapper;
  let formData = {
    name: 'someFormName',
    version: '1.0',
  };

  beforeEach(() => {
    wrapper = shallow(<Form formData={formData} />);
  });

  it('should render form details', () => {
    expect(wrapper.find('.name').text()).to.be.eql('someFormName');
    expect(wrapper.find('.version').text()).to.be.eql('1.0');
  });
});
