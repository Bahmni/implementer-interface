import React from 'react';

import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import FormBuilder from 'form-builder/components/FormBuilder.jsx';
import sinon from 'sinon';

chai.use(chaiEnzyme());

describe('FormBuilder', () => {
  let wrapper;
  const saveFormSpy = sinon.spy();

  const data = [
    {
      id: 1,
      name: 'Vitals',
      version: 1.1,
      auditInfo: {
        dateCreated: '2010-10-10T15:21:17.000+0530',
      },
      uuid: 'someUuid-1',
      published: false,
      checked: undefined,
    },
    {
      id: 2,
      name: 'BP',
      version: 1.2,
      auditInfo: {
        dateCreated: '2010-08-09T15:21:17.000+0530',
      },
      published: true,
      uuid: 'someUuid-2',
      checked: undefined,
    },
    {
      id: 3,
      name: 'Pulse',
      version: 1.1,
      auditInfo: {
        dateCreated: '2010-08-09T15:21:17.000+0530',
      },
      published: true,
      uuid: 'someUuid-3',
      checked: undefined,
    },
  ];

  beforeEach(() => {
    wrapper = shallow(<FormBuilder data={[1, 2, 3]} saveForm={saveFormSpy} />);
  });

  it('should render FormList', () => {
    expect(wrapper).to.have.exactly(1).descendants('FormList');
  });

  it('should render export button', () => {
    expect(wrapper).to.have.exactly(2).descendants('button');
    expect(wrapper.find('button').at(1).text()).to.eql('Export');
  });

  it('should render create form modal', () => {
    expect(wrapper).to.have.exactly(1).descendants('CreateFormModal');
  });

  it('should set state of showModal as true when create a form option is clicked', () => {
    const instance = wrapper.instance();
    expect(instance.state.showModal).to.eql(false);

    wrapper.find('button').first().simulate('click');
    expect(instance.state.showModal).to.eql(true);
  });

  it('should set state of showModal as true when openFormModal is called', () => {
    const instance = wrapper.instance();
    expect(instance.state.showModal).to.eql(false);
    instance.openFormModal();
    expect(instance.state.showModal).to.eql(true);
  });

  it('should set state of showModal as false when form builder is initialized', () => {
    const instance = wrapper.instance();
    expect(instance.state.showModal).to.eql(false);
  });

  it('should set state of showModal as false when closeFormModal is called', () => {
    const instance = wrapper.instance();
    instance.openFormModal();
    expect(instance.state.showModal).to.eql(true);
    instance.closeFormModal();
    expect(instance.state.showModal).to.eql(false);
  });

  it('should save form when createForm is called', () => {
    const instance = wrapper.instance();
    const formName = 'someFormName';
    const expectedFormJson = {
      name: formName,
      version: '1',
      published: false,
    };
    instance.createForm(formName);
    sinon.assert.calledOnce(saveFormSpy);
    sinon.assert.calledWith(saveFormSpy, expectedFormJson);
  });

  it('should enable export-button when check a form', () => {
    const wrapper = shallow(<FormBuilder data={data} saveForm={saveFormSpy} />);
    const instance = wrapper.instance();
    instance.updateExportStatus(true, 2);

    expect(instance.state.exportDisabled).to.eql(false);
    expect(data[2].checked).to.eql(true);
  });

  it('should download forms when click export button', (done) => {
    const wrapper = shallow(<FormBuilder data={data} saveForm={saveFormSpy} />);
    const instance = wrapper.instance();
    const downloadDone = sinon.spy(instance, 'downloadDone');
    instance.updateExportStatus(true, 2);
    wrapper.find('button').at(1).simulate('click');
    setTimeout(() => {
      sinon.assert.calledOnce(downloadDone);
      done();
    }, 500);
  });

  it('should show exporting message when export forms success', () => {
    const wrapper = shallow(<FormBuilder data={data} saveForm={saveFormSpy} />);
    const instance = wrapper.instance();
    const showMessageBox = sinon.spy(instance, 'showMessageBox');
    instance.updateExportStatus(true, 2);
    const downloadResults = {'file1': {success: true}};

    instance.downloadDone(downloadResults);

    sinon.assert.calledOnce(showMessageBox);
    expect(instance.state.message.type).to.eql('success');
  });

  it('should show exporting message when export forms success', () => {
    const wrapper = shallow(<FormBuilder data={data} saveForm={saveFormSpy} />);
    const instance = wrapper.instance();
    instance.updateExportStatus(true, 2);
    const downloadResults = {'file1': {success: false}};

    instance.downloadDone(downloadResults);

    expect(instance.state.message.type).to.eql('error');
  });

  it('should call closeModal function on click of close button', () => {
    const wrapper = mount(<FormBuilder data={data} saveForm={saveFormSpy} />);
    const instance = wrapper.instance();
    const closeFormModalSpy = sinon.spy(instance, 'closeFormModal');
    const results = [{'file1': {name: 'file1'}}];

    instance.showMessageBox('Test', 'error', results);
    wrapper.find('.btn').simulate('click');

    sinon.assert.calledOnce(closeFormModalSpy);
  });
});
