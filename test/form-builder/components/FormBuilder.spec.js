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
      auditInfo: {
        changedBy: null,
        creator: {
          display: 'superman',
          links: [
            {
              rel: 'self',
              uri: 'http://192.168.33.10/openmrs/ws/rest/v1/user/c1c21e11-3f10-11e4-adec-0800271c1b75',
            },
          ],
          uuid: 'c1c21e11-3f10-11e4-adec-0800271c1b75',
        },
        dateChanged: null,
        dateCreated: '2017-04-10T06:31:06.000+0000',
      },
      id: 4,
      name: '123',
      published: false,
      uuid: 'bb3c33e6-dd00-4e65-b132-fd85c9f408d0',
      version: 1,
    },
    {
      auditInfo: {
        changedBy: {
          display: 'superman',
          links: [
            {
              rel: 'self',
              uri: 'http://192.168.33.10/openmrs/ws/rest/v1/user/c1c21e11-3f10-11e4-adec-0800271c1b75',
            },
          ],
          uuid: 'c1c21e11-3f10-11e4-adec-0800271c1b75',
        },
        creator: {
          display: 'superman',
          links: [
            {
              rel: 'self',
              uri: 'http://192.168.33.10/openmrs/ws/rest/v1/user/c1c21e11-3f10-11e4-adec-0800271c1b75',
            },
          ],
          uuid: 'c1c21e11-3f10-11e4-adec-0800271c1b75',
        },
        dateChanged: '2017-04-10T06:17:06.000+0000',
        dateCreated: '2017-04-10T06:15:56.000+0000',
      },
      id: 2,
      name: '12345678901234567890123456789012345678901234567890',
      published: true,
      uuid: '9de09979-a8fa-4747-a22b-c047bf639ef2',
      version: 1,
    },
    {
      auditInfo: {
        changedBy: {
          display: 'superman',
          links: [
            {
              rel: 'self',
              uri: 'http://192.168.33.10/openmrs/ws/rest/v1/user/c1c21e11-3f10-11e4-adec-0800271c1b75',
            },
          ],
          uuid: 'c1c21e11-3f10-11e4-adec-0800271c1b75',
        },
        creator: {
          display: 'superman',
          links: [
            {
              rel: 'self',
              uri: 'http://192.168.33.10/openmrs/ws/rest/v1/user/c1c21e11-3f10-11e4-adec-0800271c1b75',
            },
          ],
          uuid: 'c1c21e11-3f10-11e4-adec-0800271c1b75',
        },
        dateChanged: '2017-04-10T06:52:16.000+0000',
        dateCreated: '2017-04-10T06:51:44.000+0000',
      },
      id: 6,
      name: 'qqq11111qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq',
      published: true,
      uuid: 'e912dee3-b5c9-4eaf-b30f-f67a06f3d83b',
      version: 1,
    },
  ];

  const routes = [
    {
      childRoutes: [
        {
          childRoutes: [
            {
              name: 'Form Details',
              path: ':formUuid',
            },
          ],
          indexRoute: {
            name: 'Form Builder',
          },
          name: 'Form Builder',
          path: 'form-builder',
        },
      ],
      indexRoute: {
        name: 'Dashboard',
      },
      name: 'Dashboard',
      path: '/',
    },
    {
      childRoutes: [
        {
          name: 'Form Details',
          path: ':formUuid',
        },
      ],
      indexRoute: {
        name: 'Form Builder',
      },
      name: 'Form Builder',
      path: 'form-builder',
    },
    {
      name: 'Form Builder',
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
    const instance = shallow(<FormBuilder data={data} saveForm={saveFormSpy} />).instance();
    instance.updateExportStatus(true, 2);

    expect(instance.state.exportDisabled).to.eql(false);
    expect(data[2].checked).to.eql(true);
  });

  it('should download forms when click export button', (done) => {
    const updatedWrapper = shallow(<FormBuilder data={data} saveForm={saveFormSpy} />);
    const instance = updatedWrapper.instance();
    const downloadDone = sinon.spy(instance, 'downloadDone');
    instance.updateExportStatus(true, 2);
    updatedWrapper.find('button').at(1).simulate('click');
    setTimeout(() => {
      sinon.assert.calledOnce(downloadDone);
      done();
    }, 500);
  });

  it('should show exporting message when export forms success', () => {
    const instance = shallow(<FormBuilder data={data} saveForm={saveFormSpy} />).instance();
    const showMessageBox = sinon.spy(instance, 'showMessageBox');
    instance.updateExportStatus(true, 2);
    const downloadResults = { file1: { success: true } };

    instance.downloadDone(downloadResults);

    sinon.assert.calledOnce(showMessageBox);
    expect(instance.state.message.type).to.eql('success');
  });

  it('should show exporting message when export forms success', () => {
    const instance = shallow(<FormBuilder data={data} saveForm={saveFormSpy} />).instance();
    instance.updateExportStatus(true, 2);
    const downloadResults = { file1: { success: false } };

    instance.downloadDone(downloadResults);

    expect(instance.state.message.type).to.eql('error');
  });

  it('should update message to null on click of close button', () => {
    const updatedWrapper = mount(
        <FormBuilder data={data} routes={routes} saveForm={saveFormSpy} />);
    const instance = updatedWrapper.instance();
    const results = [{ file1: { name: 'file1' } }];

    instance.showMessageBox('Test', 'error', results);
    updatedWrapper.find('.btn--close').simulate('click');

    expect(instance.state.message).to.eql({});
  });
});
