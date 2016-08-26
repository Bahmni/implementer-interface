import React from 'react';

import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import Canvas from 'form-builder/components/canvas';
// import sinon from 'sinon';

chai.use(chaiEnzyme());

describe('Canvas', () => {

  it('should render a blank canvas with place holder text', () => {
    const canvas = shallow(<Canvas />);
    expect(canvas.find('.canvas-placeholder').text()).to.eql('Drag & Drop controls to create a form');
  });
});
