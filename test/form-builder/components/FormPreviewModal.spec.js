import React from 'react';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import FormPreviewModal from 'form-builder/components/FormPreviewModal.jsx';


chai.use(chaiEnzyme());

describe('EditModal', () => {
  let wrapper;
  let closeSpy;

  const formData = { name: 'TestPreview', uuid: 'b313c324-7efc-4c46-abb5-89f405e436c6',
    version: '1', published: false, id: null, resources: [{ name: 'TestPreview',
      dataType: 'org.bahmni.customdatatype.datatype.FileSystemStorageDatatype',
      value: '{"name":"TestPreview","id":56,"uuid":"b313c324-7efc-4c46-abb5-89f405e436c6",' +
              '"defaultLocale":"en","controls":[{"type":"obsControl",' +
              '"label":{"translationKey":"ANA,_SYSTOLIC_BLOOD_PRESSURE_1","id":"1",' +
          '"units":"(mmHg)","type":"label","value":"ANA, Systolic blood pressure"},' +
          '"properties":{"mandatory":false,"notes":false,"addMore":false,"hideLabel":false,' +
          '"controlEvent":false,"location":{"column":0,"row":0},"abnormal":false},"id":"1",' +
          '"concept":{"name":"ANA, Systolic blood pressure","uuid":"uuid","datatype":"Numeric",' +
              '"conceptClass":"Misc","conceptHandler":null,"answers":[],' +
          '"properties":{"allowDecimal":true}},' +
              '"units":"mmHg","hiNormal":null,"lowNormal":null,"hiAbsolute":null,' +
              '"lowAbsolute":null}],"events":{},"translationsUrl":"url"}',
      uuid: '7c87487b-e0e8-493a-a55f-b54e5184fded' }] };
  beforeEach(() => {
    closeSpy = sinon.spy();
    wrapper = mount(
      <FormPreviewModal
        close={closeSpy}
        formData={formData}
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
          formData={undefined}
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
