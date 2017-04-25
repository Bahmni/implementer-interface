import React from 'react';

import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import FormBuilder from 'form-builder/components/FormBuilder.jsx';
import sinon from 'sinon';
import {httpInterceptor} from "../../../src/common/utils/httpInterceptor";

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
    wrapper.find('button').simulate('click');
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

  const formData = {
    id: 1,
    name: 'someFormName',
    version: '1',
    uuid: 'someUuid',
    resources: [],
    published: false,
  };

  const formJson = {
    "auditInfo": {
      "changedBy": {
        "display": "superman",
        "links": [
          {
            "rel": "self",
            "uri": "http://192.168.33.10/openmrs/ws/rest/v1/user/c1c21e11-3f10-11e4-adec-0800271c1b75"
          }
        ],
        "uuid": "c1c21e11-3f10-11e4-adec-0800271c1b75"
      },
      "creator": {
        "display": "superman",
        "links": [
          {
            "rel": "self",
            "uri": "http://192.168.33.10/openmrs/ws/rest/v1/user/c1c21e11-3f10-11e4-adec-0800271c1b75"
          }
        ],
        "uuid": "c1c21e11-3f10-11e4-adec-0800271c1b75"
      },
      "dateChanged": "2017-04-25T02:12:13.000+0000",
      "dateCreated": "2017-04-25T02:12:13.000+0000"
    },
    "id": 193,
    "name": "1",
    "published": true,
    "resources": [
      {
        "dataType": "org.bahmni.customdatatype.datatype.FileSystemStorageDatatype",
        "uuid": "d2eae4e8-aa36-4617-9d96-1b623555715f",
        "value": "{\"name\":\"1\",\"id\":52,\"uuid\":\"b916b78f-bc34-40b3-ab4d-b7df6c73b2a5\",\"controls\":[{\"type\":\"obsControl\",\"label\":{\"type\":\"label\",\"value\":\"WEIGHT\"},\"properties\":{\"mandatory\":false,\"notes\":false,\"addMore\":false,\"hideLabel\":false,\"location\":{\"column\":0,\"row\":0}},\"id\":\"1\",\"concept\":{\"name\":\"WEIGHT\",\"uuid\":\"5089AAAAAAAAAAAAAAAAAAAAAAAAAAAA\",\"description\":[],\"datatype\":\"Numeric\",\"answers\":[],\"properties\":{\"allowDecimal\":false}},\"units\":null,\"hiNormal\":null,\"lowNormal\":null,\"hiAbsolute\":null,\"lowAbsolute\":null},{\"type\":\"obsControl\",\"label\":{\"type\":\"label\",\"value\":\"HEIGHT\"},\"properties\":{\"mandatory\":false,\"notes\":false,\"addMore\":false,\"hideLabel\":false,\"location\":{\"column\":0,\"row\":1}},\"id\":\"2\",\"concept\":{\"name\":\"HEIGHT\",\"uuid\":\"5090AAAAAAAAAAAAAAAAAAAAAAAAAAAA\",\"description\":[],\"datatype\":\"Numeric\",\"answers\":[],\"properties\":{\"allowDecimal\":false}},\"units\":null,\"hiNormal\":null,\"lowNormal\":null,\"hiAbsolute\":null,\"lowAbsolute\":null}]}"
      }
    ],
    "uuid": "b916b78f-bc34-40b3-ab4d-b7df6c73b2a5",
    "version": "1"
  };

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

  it('should call saveFormResource when import form', (done) => {
    const json = JSON.stringify(formJson);

    sinon.stub(httpInterceptor, 'post').callsFake(() => Promise.resolve(formData));
    let loadStub = sinon.stub(FileReader.prototype, 'readAsText', function() {
      this.result = json;
      this.onload();
    });

    const wrapper = shallow(<FormBuilder data={data} routes={routes} saveForm={saveFormSpy}
                                 saveFormResource={saveFormResourceSpy}/>);

    wrapper.instance().validateFile(file);

    setTimeout(() => {
      sinon.assert.calledOnce(saveFormResourceSpy);

      httpInterceptor.post.restore();
      loadStub.restore();
      done();
    }, 500);
  });
});
