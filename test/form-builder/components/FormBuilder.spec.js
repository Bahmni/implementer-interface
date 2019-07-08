import React from 'react';

import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import FormBuilder from 'form-builder/components/FormBuilder.jsx';
import sinon from 'sinon';
import JSZip from 'jszip';
import { httpInterceptor } from '../../../src/common/utils/httpInterceptor';
import jsonpath from 'jsonpath/jsonpath';

chai.use(chaiEnzyme());

describe('FormBuilder', () => {
  let wrapper;
  const saveFormSpy = sinon.spy();

  beforeEach(() => {
    wrapper = shallow(<FormBuilder data={[1, 2, 3]} saveForm={saveFormSpy} />);
  });

  it('should render FormList', () => {
    expect(wrapper).to.have.exactly(1).descendants('FormList');
  });

  it('should render create form modal', () => {
    expect(wrapper).to.have.exactly(1).descendants('CreateFormModal');
  });

  it('should set state of showModal as true when create a form option is clicked', () => {
    const instance = wrapper.instance();
    expect(instance.state.showModal).to.eql(false);
    wrapper.find('button.openFormModal').simulate('click');
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

  it('should render input file', () => {
    expect(wrapper).to.have.exactly(1).descendants('input');
    expect(wrapper.find('input').prop('type')).to.eql('file');
  });
});

describe('Import form', () => {
  let wrapper;
  const saveFormSpy = sinon.spy();
  const saveFormResourceSpy = sinon.spy();
  const file = [
    {
      lastModified: 1492756593000,
      name: '1_1.json',
      size: 1813,
      type: 'application/json',
      webkitRelativePath: '',
      lastModifiedDate: 'Fri Apr 21 2017 14:36:33 GMT+0800 (CST)',
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
  const data = [
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
        dateChanged: '2017-04-25T06:59:34.000+0000',
        dateCreated: '2017-04-25T06:59:34.000+0000',
      },
      id: 201,
      name: '1',
      published: true,
      uuid: '30f163d3-1a98-47ce-a9e8-0ec7cc9b2c3d',
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
        dateChanged: '2017-04-25T07:17:31.000+0000',
        dateCreated: '2017-04-25T07:17:30.000+0000',
      },
      id: 202,
      name: '1',
      published: true,
      uuid: '785dce21-4a19-4ab7-a8a1-4f2134f7b214',
      version: 2,
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
        dateChanged: '2017-04-25T06:27:30.000+0000',
        dateCreated: '2017-04-25T06:27:29.000+0000',
      },
      id: 200,
      name: 'test',
      published: true,
      uuid: '9d1d0ce9-69bb-413a-9a9c-b3d6d828b688',
      version: 1,
    },
  ];

  beforeEach(() => {
    wrapper = mount(<FormBuilder data={data} routes={routes} saveForm={saveFormSpy}
      saveFormResource={saveFormResourceSpy}
    />);
  });

  afterEach(() => {
    if (httpInterceptor.post.restore !== undefined) {
      httpInterceptor.post.restore();
    }

    if (httpInterceptor.get.restore !== undefined) {
      httpInterceptor.get.restore();
    }

    if (jsonpath.query.restore !== undefined) {
      jsonpath.query.restore();
    }
  });

  it('should call validate file when click import button', () => {
    const spy = sinon.spy(wrapper.instance(), 'validateFile');
    wrapper.find('.importBtn').find('input').simulate('change', { target: { files: file } });

    sinon.assert.calledOnce(spy);
  });

  it('should change the value to null when click import button', () => {
    const input = wrapper.find('.importBtn').find('input');
    input.simulate('click', {
      preventDefault: () => {
      },
    });

    expect(input.getDOMNode().value).to.eql('');
  });

  it('should get max version when import same name form', () => {
    const sameName = '1';
    const exitedMaxVersion = wrapper.instance().getFormVersion(sameName);

    expect(exitedMaxVersion).to.eql(2);
  });

  it('should get max version form uuid when import same name form', () => {
    const sameName = '1';
    const uuid = wrapper.instance().getFormUuid(sameName);

    expect(uuid).to.eql(data[1].uuid);
  });

  it('should throw error if concept not present', (done) => {
    sinon.stub(httpInterceptor, 'get')
      .callsFake(() => Promise.resolve({ results: [] }));
    sinon.stub(jsonpath, 'query')
      .onFirstCall().returns([{ name: 'Pulse', uuid: 'someUuid' }])
      .onSecondCall().returns([])
      .onThirdCall().returns([]);
    const newInstance = wrapper.instance();
    newInstance.fixuuid('formName').catch(() => {
      expect(newInstance.validationErrors[0]).to.eql('Concept name not found Pulse');
      done();
    });
  });

  it('should success callback', (done) => {
    const concept = [{
      name: { name: 'Pulse' },
      uuid: 'someUuid',
      setMembers: [{ name: { name: 'Abnormal' }, uuid: 'randomUuid' }],
      answers: [{ name: { name: 'Answer-1' }, uuid: 'randomUuid1' }],
    }];
    sinon.stub(httpInterceptor, 'get')
      .onFirstCall().returns(Promise.resolve({ results: concept }))
      .onSecondCall().returns(Promise.resolve({ results: concept[0].setMembers }))
      .onThirdCall().returns(Promise.resolve({ results: concept[0].answers }));
    sinon.stub(jsonpath, 'query')
      .onFirstCall().returns([{ name: 'Pulse', uuid: 'someUuid' }])
      .onSecondCall().returns([[{ name: 'Abnormal', uuid: 'randomUuid' }]])
      .onThirdCall().returns([[{ name: 'Answer-1', uuid: 'randomUuid1' }]]);
    const newInstance = wrapper.instance();
    newInstance.fixuuid('formName').then((validated) => {
      expect(validated).to.eql([true, true, true]);
      done();
    });
  });
});

describe('Export Forms', () => {
  let wrapper;
  const saveFormSpy = sinon.spy();
  let exportResponse;
  let mockHttp;
  beforeEach(() => {
    wrapper = shallow(<FormBuilder data={[1, 2, 3]} saveForm={saveFormSpy} />);
    mockHttp = sinon.stub(httpInterceptor);
  });

  afterEach(() => {
    if (mockHttp.get.restore !== undefined) {
      mockHttp.get.restore();
    }
    if (mockHttp.post.restore !== undefined) {
      mockHttp.post.restore();
    }
  });


  it('should call exportForms method in click of export button', () => {
    const spy = sinon.spy(wrapper.instance(), 'exportForms');
    wrapper.find('.exportBtn').simulate('click');
    sinon.assert.calledOnce(spy);
  });

  it('should return true when no form uuids are passed', () => {
    expect(wrapper.instance().validateExport([])).to.eql(true);
  });

  it('should return true when form uuids are passed are more than limit', () => {
    const spy = sinon.spy(wrapper.instance(), 'setMessage');
    expect(wrapper.instance().validateExport(['1', '2', '3', '1', '2', '3', '1', '2', '3',
      '1', '2', '3', '1', '2', '3', '1', '2', '3', '1', '2', '3', '1', '2',
      '3', '1', '2', '3']))
        .to.eql(true);
    sinon.assert.calledOnce(spy);
    expect(wrapper.find('NotificationContainer').prop('notification').type).to.eql('error');
  });

  it('should return false when form uuids are more than 0 and less than 20', () => {
    expect(wrapper.instance().validateExport(['1', '2', '3'])).to.eql(false);
  });

  it('should return false when form uuids are more than 0 and less than 20', () => {
    const spy = sinon.spy(wrapper.instance(), 'validateExport');
    wrapper.instance().exportForms();
    sinon.assert.calledOnce(spy);
  });

  it('should call validate export when exportForms is called', () => {
    const spy = sinon.spy(wrapper.instance(), 'validateExport');
    wrapper.instance().exportForms();
    sinon.assert.calledOnce(spy);
  });

  it('should have notification container with error type, ' +
      'when response have error forms list', (done) => {
    wrapper.instance().state.selectedForms = ['uuid1'];
    exportResponse = {
      errorFormList: ['Form1_1'],
    };
    mockHttp.get.withArgs('/openmrs/ws/rest/v1/bahmniie/form/export?uuid=uuid1')
        .returns(Promise.resolve(exportResponse));
    wrapper.instance().exportForms();
    setTimeout(() => {
      expect(wrapper.find('NotificationContainer').prop('notification').type).to.eql('error');
      done();
    }, 50);
  });

  it('should have notification container with success type, ' +
      'when response have no error forms list', (done) => {
    const spyZipFile = sinon.spy(JSZip.prototype, 'file');
    wrapper.instance().state.selectedForms = ['uuid1'];
    exportResponse = {
      bahmniFormDataList: [{ formJson: { name: 'Form', version: '1' } },
          { formJson: { name: 'Form2', version: '1' } }],
      errorFormList: [],
    };
    mockHttp.get.withArgs('/openmrs/ws/rest/v1/bahmniie/form/export?uuid=uuid1')
        .returns(Promise.resolve(exportResponse));
    wrapper.instance().exportForms();
    setTimeout(() => {
      sinon.assert.calledTwice(spyZipFile);
      expect(wrapper.find('NotificationContainer').prop('notification').type).to.eql('success');
      done();
    }, 50);
  });
});
