import React from 'react';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import FormPreviewModal from 'form-builder/components/FormPreviewModal.jsx';


chai.use(chaiEnzyme());

describe('FormPreviewModal', () => {
  let wrapper;
  let closeSpy;

  const formJson = {
    name: 'Groovy',
    id: 62,
    uuid: 'a70e3e5c-70cf-49a7-b73b-4dc6d70643a7',
    controls: [
      {
        type: 'obsControl',
        label: {
          translationKey: 'ANA,_HEIGHT_1',
          value: 'ANA, Height',
        },
        properties: {
          mandatory: false,
        },
        id: '1',
        concept: {
          name: 'ANA, Height',
          uuid: 'f17466a5-5d1a-11ea-9bb4-080027405b36',
          datatype: 'Numeric',
          properties: {
            allowDecimal: true,
          },
        },
        events: {
          onValueChange: 'function(form, interceptor) {\n  var x = form.get("ANA, Height")' +
              '.getValue();\n  var y = form.get("SA, Penicillin");\n  if (parseInt(x) > 5) {\n' +
              '    y.setHidden(true);\n  } else\n    y.setHidden(false);\n}',
        },
      },
    ],
    version: '43',
  };
  beforeEach(() => {
    closeSpy = sinon.spy();
    wrapper = mount(
      <FormPreviewModal
        close={closeSpy}
        formJson={formJson}
      />
    );
  });

  it('should render create form preview modal when form data exists', () => {
    const container = wrapper.find('.preview-container');
    expect(container).to.have.length(1);
    expect(container.children().length).to.be.equal(3);
  });

  it('should not render create form modal when form data doesnot exist', () => {
    wrapper = mount(
        <FormPreviewModal
          close={closeSpy}
          formJson={undefined}
        />
    );
    const modal = wrapper.find('.preview-container');
    const container = wrapper.find('Container');
    expect(container).to.be.length(0);
    expect(modal).to.be.length(0);
  });

  it('should call close modal function when close button is clicked', () => {
    const button = wrapper.find('.preview-close-btn');
    button.simulate('click');
    sinon.assert.calledOnce(closeSpy);
  });

  it('should call close modal function when close icon is clicked', () => {
    const button = wrapper.find('.fa-times');
    button.simulate('click');
    sinon.assert.calledOnce(closeSpy);
  });

  it('should render container if metadata is present', () => {
    const container = wrapper.find('Container');
    expect(container).to.have.length(1);
  });
});
