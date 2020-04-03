import React from 'react';

import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import FormBuilder from 'form-builder/components/FormBuilder.jsx';
import sinon from 'sinon';
import JSZip from 'jszip';
import { httpInterceptor } from '../../../src/common/utils/httpInterceptor';
import { saveAs } from 'file-saver';
import jsonpath from 'jsonpath/jsonpath';
import * as FormBuilderBreadcrumbs from 'form-builder/components/FormBuilderBreadcrumbs.jsx';
import { MemoryRouter } from 'react-router-dom';
import { formEventUpdate, saveEventUpdate } from 'form-builder/actions/control';


chai.use(chaiEnzyme());

describe('FormBuilder', () => {
  let wrapper;
  const saveFormSpy = sinon.spy();
  let dispatchSpy;

  beforeEach(() => {
    dispatchSpy = sinon.spy();
    wrapper = shallow(<FormBuilder data={[1, 2, 3]} dispatch={dispatchSpy}
      saveForm={saveFormSpy}
    />);
  });

  it('should render FormList', () => {
    expect(wrapper).to.have.exactly(1).descendants('FormList');
  });

  it('should render create form modal', () => {
    expect(wrapper).to.have.exactly(1).descendants('CreateFormModal');
  });

  it('should clear clear FormEvent and Save Event', () => {
    sinon.assert.calledTwice(dispatchSpy);
    sinon.assert.callOrder(dispatchSpy.withArgs(saveEventUpdate('')),
      dispatchSpy.withArgs(formEventUpdate(''))
    );
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
  let breadcrumbsStub;
  const saveFormSpy = sinon.spy();
  const saveFormResourceSpy = sinon.spy();
  const dispatchSpy = sinon.spy();
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
    breadcrumbsStub = sinon.stub(FormBuilderBreadcrumbs, 'default').returns(<div>A stub</div>);
    wrapper = mount(<MemoryRouter><FormBuilder data={data} dispatch={dispatchSpy}
      routes={routes} saveForm={saveFormSpy} saveFormResource={saveFormResourceSpy}
    /></MemoryRouter>);
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
    breadcrumbsStub.restore();
  });

  it('should call validate file when click import button', () => {
    const spy = sinon.spy(wrapper.find('FormBuilder').instance(), 'import');
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
    const exitedMaxVersion = wrapper.find('FormBuilder').instance().getFormVersion(sameName);

    expect(exitedMaxVersion).to.eql(2);
  });

  it('should get max version form uuid when import same name form', () => {
    const sameName = '1';
    const uuid = wrapper.find('FormBuilder').instance().getFormUuid(sameName);

    expect(uuid).to.eql(data[1].uuid);
  });

  it('should throw error if concept not present', (done) => {
    sinon.stub(httpInterceptor, 'get')
      .callsFake(() => Promise.resolve({ results: [] }));
    sinon.stub(jsonpath, 'query')
      .onFirstCall().returns([{ name: 'Pulse', uuid: 'someUuid' }])
      .onSecondCall().returns([])
      .onThirdCall().returns([]);
    const newInstance = wrapper.find('FormBuilder').instance();
    const fileName = 'fileName.json';
    const validationPromise = newInstance.fixuuid('formName', fileName);

    validationPromise.then(() => {
      expect(newInstance.formConceptValidationResults[fileName])
        .to.eql(['Concept name not found Pulse']);
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
    const newInstance = wrapper.find('FormBuilder').instance();
    newInstance.fixuuid('formName').then((validated) => {
      expect(validated).to.eql([true, true, true]);
      done();
    });
  });

  it('should importValidForms valid forms ', (done) => {
    const formBuilderInstance = wrapper.find('FormBuilder').instance();
    const formJson = data[0];
    const resource = {
      name: data[0].name,
      id: data[0].id,
      uuid: data[0].uuid,
      defaultLocale: 'en',
      controls: [
        {
          type: 'obsControl',
          label: {
            translationKey: 'HEIGHT_1',
            id: '1',
            units: '',
            type: 'label',
            value: 'HEIGHT',
          },
          properties: {
            location: {
              column: 0,
              row: 0,
            },
            abnormal: false,
          },
          id: '1',
          concept: {
            name: 'HEIGHT',
            uuid: '5090AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
            datatype: 'Numeric',
            conceptClass: 'Misc',
            answers: [],
            properties: {
              allowDecimal: false,
            },
          },
        },
      ],
      events: {},
      translationsUrl: '/openmrs/ws/rest/v1/bahmniie/form/translations',
    };
    formJson.value = resource;
    formJson.formName = data[0].name;
    formJson.translations = [
      {
        locale: 'en',
        labels: {},
        concepts: {
          HEIGHT_1: 'HEIGHT',
        },
        formName: data[0].name,
        formUuid: null,
        version: data[0].version,
        referenceVersion: null,
        referenceFormUuid: null,
      },
    ];
    formJson.nameTranslations = '{"display":"1_EN_Name", "locale": "en"}';
    sinon.stub(httpInterceptor, 'post').callsFake(() => {
      const response = data[0];
      return Promise.resolve(Object.assign({}, response, { uuid: 'new_uuid' }));
    });
    formBuilderInstance.importValidForms([formJson]);
    setTimeout(() => {
      const firstArgumentOfSaveFormResource = saveFormResourceSpy.getCall(0).args[0];
      const secondArgumentOfSaveFormResource = saveFormResourceSpy.getCall(0).args[1];
      const thirdArgumentOfSaveFormResource = saveFormResourceSpy.getCall(0).args[2];
      sinon.assert.calledOnce(saveFormResourceSpy);
      expect(firstArgumentOfSaveFormResource.form.name).to.eq(data[0].name);
      expect(firstArgumentOfSaveFormResource.form.uuid).to.eq('new_uuid');
      expect(firstArgumentOfSaveFormResource.value).to.eq(JSON.stringify(formJson.value));
      expect(firstArgumentOfSaveFormResource.uuid).to.eq('');
      expect(secondArgumentOfSaveFormResource[0].referenceFormUuid).to.eq(null);
      expect(secondArgumentOfSaveFormResource[0].referenceVersion).to.eq(null);
      expect(secondArgumentOfSaveFormResource[0].version).to.eq(data[0].version);
      expect(secondArgumentOfSaveFormResource[0].formName).to.eq(data[0].name);
      expect(secondArgumentOfSaveFormResource[0].formUuid).to.eq('new_uuid');
      expect(thirdArgumentOfSaveFormResource.form.name).to.eq(data[0].name);
      expect(thirdArgumentOfSaveFormResource.form.uuid).to.eq('new_uuid');
      expect(thirdArgumentOfSaveFormResource.value).to.eq('{"display":"1_EN_Name", "locale": "en"}');
      done();
    }, 500);
  });
});

describe('Export Forms', () => {
  let wrapper;
  const saveFormSpy = sinon.spy();
  let exportResponse;
  let mockHttp;
  const dispatchSpy = sinon.spy();

  beforeEach(() => {
    wrapper = shallow(<FormBuilder data={[1, 2, 3]} dispatch={dispatchSpy}
      saveForm={saveFormSpy}
    />);
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

describe('Import Multiple Forms', () => {
  let wrapper;
  const saveFormSpy = sinon.spy();
  let onValidationErrorSpy = sinon.spy();
  let newInstance;
  const dispatchSpy = sinon.spy();

  beforeEach(() => {
    onValidationErrorSpy = sinon.spy();
    wrapper = shallow(<FormBuilder data={[1, 2, 3]} dispatch={dispatchSpy}
      onValidationError={onValidationErrorSpy} saveForm={saveFormSpy}
    />);
    newInstance = wrapper.instance();
    newInstance.resetValues();
  });

  afterEach(() => {
    if (JSZip.prototype.loadAsync.restore !== undefined) {
      JSZip.prototype.loadAsync.restore();
    }

    if (JSZip.prototype.file.restore !== undefined) {
      JSZip.prototype.file.restore();
    }

    if (httpInterceptor.get.restore !== undefined) {
      httpInterceptor.get.restore();
    }

    if (jsonpath.query.restore !== undefined) {
      jsonpath.query.restore();
    }
  });

  it('set loading to true when show loader is called', () => {
    newInstance.showLoader();

    expect(newInstance.state.loading).to.eql(true);
  });

  it('set loading to false when hide loader is called', () => {
    newInstance.hideLoader();

    expect(newInstance.state.loading).to.eql(false);
  });

  it('should add error messages to importErrors when updateImportErrors is called', () => {
    newInstance.updateImportErrors('file1', 'file1 error');
    newInstance.updateImportErrors('file2', 'file2 error');

    expect(newInstance.importErrors.length).to.eql(2);
  });

  it('should throw error when type of file is not json or zip', () => {
    const file = [];
    file.push({ type: 'application/text' });
    newInstance.import(file);

    sinon.assert.calledOnce(onValidationErrorSpy);
  });

  it('should call importJsonFile when type of file is json', () => {
    newInstance.importJsonFile = sinon.spy();
    const file = [];
    file.push({ type: 'application/json' });
    newInstance.import(file);

    sinon.assert.calledOnce(newInstance.importJsonFile);
  });

  it('should call validateAndLoadZipFile when type of file is zip', () => {
    newInstance.validateAndLoadZipFile = sinon.spy();
    const file = [];
    file.push({ type: 'application/x-zip-compressed' });
    newInstance.import(file);

    sinon.assert.calledOnce(newInstance.validateAndLoadZipFile);
  });


  it('should throw error when zip size is more than 5MB', () => {
    const jsonZip = {};
    jsonZip.size = 500 * 1024 * 1024 + 500;
    newInstance.validateAndLoadZipFile(jsonZip);

    sinon.assert.calledOnce(onValidationErrorSpy);
  });

  it('should call loadAsync and validateFilesInZip when zip is valid', (done) => {
    newInstance.validateFilesInZip = sinon.spy();
    sinon.stub(JSZip.prototype, 'loadAsync').callsFake(() => Promise.resolve({ test: 'value' }));
    const jsonZip = {};
    jsonZip.size = 2 * 1024;
    jsonZip.type = 'application/zip';
    jsonZip.name = 'test.zip';
    newInstance.validateAndLoadZipFile(jsonZip);

    setTimeout(() => {
      sinon.assert.calledOnce(newInstance.validateFilesInZip);
      done();
    }, 50);
  });

  it('should return valid json files', () => {
    const fileNames = ['sample.json', 'sample1.txt', 'sample2.pdf', 'sample3.json'];
    const validJsonFileNames = newInstance.getValidJsonFileNames(fileNames);
    expect(validJsonFileNames).to.eql(['sample.json', 'sample3.json']);
    expect(newInstance.importErrors.length).to.eql(2);
  });

  it('should call updateImportErrors for invalid json content', (done) => {
    const fileNames = ['sample.json', 'sample3.json'];
    const jsonZip = {
      files: [{}],
      file() {
        return this;
      },
      async() {
        return Promise.resolve('text goes here');
      },
    };
    sinon.stub(JSZip.prototype, 'file').returns({
      async: sinon.stub().callsFake(() => Promise.resolve('text goes here')),
    });
    sinon.stub(newInstance, 'getValidJsonFileNames').onFirstCall().returns(fileNames);
    newInstance.validateFilesInZip(jsonZip);

    setTimeout(() => {
      expect(newInstance.importErrors.length).to.eql(2);
      done();
    });
  });

  it('should call processForms for valid json content', (done) => {
    const fileNames = ['sample.json', 'sample3.json'];
    const jsonZip = {
      files: [{}],
      file() {
        return this;
      },
      async() {
        return Promise.resolve({});
      },
    };
    sinon.stub(JSZip.prototype, 'file').returns({
      async: sinon.stub().callsFake(() => Promise.resolve({})),
    });
    newInstance.processForms = sinon.stub();
    sinon.stub(newInstance, 'getValidJsonFileNames').onFirstCall().returns(fileNames);
    newInstance.validateFilesInZip(jsonZip);

    setTimeout(() => {
      sinon.assert.calledOnce(newInstance.processForms);
      done();
    });
  });

  it('should update errors for invalid json', () => {
    const formJsons = [{}, {}];
    newInstance.processForms(formJsons);

    expect(newInstance.importErrors.length).to.eql(2);
  });

  it('should update errors for invalid json', (done) => {
    const formJsons = [{}, {}];
    newInstance.downloadErrorsFile = sinon.spy();
    newInstance.processForms(formJsons);

    expect(newInstance.importErrors.length).to.eql(2);
    setTimeout(() => {
      sinon.assert.calledOnce(newInstance.downloadErrorsFile);
      done();
    });
  });

  it('should insert valid form json into formsValidationPromises', (done) => {
    const formJsons = [{}, {}];
    sinon.stub(newInstance, 'validateFormJsonAndConcepts')
      .onFirstCall().returns(Promise.resolve('data'))
      .onSecondCall().returns(Promise.resolve('data2'));
    newInstance.downloadErrorsFile = sinon.spy();
    newInstance.importValidForms = sinon.spy();
    const importSpy = sinon.spy(newInstance, 'processFormValidationPromises');
    newInstance.processForms(formJsons);

    setTimeout(() => {
      sinon.assert.calledOnce(newInstance.processFormValidationPromises);
      expect(importSpy.getCalls()[0].args[0].length).to.eql(2);
      done();
    });
  });

  it('should insert form json into formsValidationPromises when importJsonFile ' +
    'called with valid form', (done) => {
    const file = [{ name: 'sample.json' }];
    const blob = new Blob([JSON.stringify(file)], { type: 'application/json' });
    sinon.stub(newInstance, 'validateFormJsonAndConcepts')
      .onFirstCall().returns(Promise.resolve('data'));
    newInstance.downloadErrorsFile = sinon.spy();
    newInstance.importValidForms = sinon.spy();
    const importSpy = sinon.spy(newInstance, 'processFormValidationPromises');
    newInstance.importJsonFile([blob]);

    setTimeout(() => {
      sinon.assert.calledOnce(newInstance.processFormValidationPromises);
      expect(importSpy.getCalls()[0].args[0].length).to.eql(1);
      done();
    });
  });

  it('should call only downloadErrorFile when there are errors and no valid formJsons', (done) => {
    const formValidationPromises = [Promise.resolve(), Promise.resolve()];
    newInstance.importErrors = [{}];
    newInstance.formJSONs = [];
    newInstance.downloadErrorsFile = sinon.spy();
    newInstance.importValidForms = sinon.spy();
    newInstance.processFormValidationPromises(formValidationPromises);

    setTimeout(() => {
      sinon.assert.calledOnce(newInstance.downloadErrorsFile);
      sinon.assert.notCalled(newInstance.importValidForms);
      done();
    });
  });

  it('should call importValidForms when there are errors', (done) => {
    const formValidationPromises = [Promise.resolve(), Promise.resolve()];
    newInstance.formJSONs = [{}];
    newInstance.importErrors = [];
    newInstance.downloadErrorsFile = sinon.spy();
    newInstance.importValidForms = sinon.spy();
    newInstance.processFormValidationPromises(formValidationPromises);

    setTimeout(() => {
      sinon.assert.calledOnce(newInstance.importValidForms);
      sinon.assert.notCalled(newInstance.downloadErrorsFile);
      done();
    });
  });

  it('should call saveAs and hideLoader method', () => {
    sinon.stub(saveAs, 'saveAs').callsFake(() => {});
    newInstance.hideLoader = sinon.spy();
    newInstance.downloadErrorsFile([]);

    sinon.assert.calledOnce(saveAs);
    sinon.assert.calledOnce(newInstance.hideLoader);
  });

  it('should call importFormJson for given formJsons', (done) => {
    const formJsons = [{}, {}];
    newInstance.saveFormJson = sinon.spy();
    newInstance.hideLoader = sinon.spy();
    newInstance.importValidForms(formJsons);

    sinon.assert.calledTwice(newInstance.saveFormJson);
    setTimeout(() => {
      sinon.assert.calledOnce(newInstance.hideLoader);
      done();
    });
  });

  it('should add form validation results to existing file results', (done) => {
    const value = {};
    const fileName = 'sampleFile.json';
    newInstance.formConceptValidationResults[fileName] = ['Error in concept'];
    sinon.stub(httpInterceptor, 'get')
      .callsFake(() => Promise.resolve({ results: [] }));
    sinon.stub(jsonpath, 'query')
      .onFirstCall().returns([{ name: 'Pulse', uuid: 'someUuid' }])
      .onSecondCall().returns([])
      .onThirdCall().returns([]);
    const validationPromise = newInstance.fixuuid(value, fileName);

    setTimeout(() => {
      validationPromise.then(() => {
        expect(newInstance.formConceptValidationResults[fileName].length).to.eql(2);
      });
      done();
    });
  });

  it('should add to importErrors when formName is invalid', () => {
    const formName = 'sample-form-1';
    const fileName = 'fileName';
    const formData = {
      formJson: {
        name: formName,
        resources: [
          { value: '{"a":2}' },
        ],
      },
    };
    newInstance.validateFormJsonAndConcepts(fileName, formData);

    expect(newInstance.importErrors.length).to.eql(1);
  });

  it('should update import errors', (done) => {
    const formName = 'sampleForm';
    const fileName = 'fileName.json';
    const formData = {
      formJson: {
        name: formName,
        resources: [
          { value: '{"a":2}' },
        ],
      },
    };
    sinon.stub(newInstance, 'fixuuid').onFirstCall().returns(Promise.resolve(''));
    newInstance.formConceptValidationResults[fileName] = ['ERR1', 'ERR2'];
    newInstance.validateFormJsonAndConcepts(fileName, formData);

    setTimeout(() => {
      expect(newInstance.importErrors.length).to.eql(1);
      expect(newInstance.importErrors[0].error).to.eql('Concept validation error: \nERR1\nERR2\n');
      expect(newInstance.importErrors[0].name).to.eql(fileName);
      done();
    });
  });

  it('should insert to formJson for a valid form', (done) => {
    const formName = 'sampleForm';
    const fileName = 'fileName.json';
    const formData = {
      formJson: {
        name: formName,
        resources: [
          {value: '{"a":2}'}, {value: '{"display":"sampleForm_EN", "locale": "en"}'},
        ],
      },
      translations: [],
    };
    sinon.stub(newInstance, 'fixuuid').onFirstCall().returns(Promise.resolve(''));
    newInstance.validateFormJsonAndConcepts(fileName, formData);

    setTimeout(() => {
      expect(newInstance.formJSONs.length).to.eql(2);
      expect(newInstance.formJSONs[0].formName).to.eql(formName);
      expect(newInstance.formJSONs[0].translations).to.eql([]);
      expect(newInstance.formJSONs[0].nameTranslations).to.eql('{"display":"sampleForm_EN", "locale": "en"}');
      done();
    });
  });

  it('should show empty file error and hide loader', () => {
    const jsonZip = {
      files: [],
    };
    newInstance.validateFilesInZip(jsonZip);

    expect(onValidationErrorSpy.getCalls()[0].args[0])
      .to.eql('Error Importing.. No files found in ZIP');
  });
});
