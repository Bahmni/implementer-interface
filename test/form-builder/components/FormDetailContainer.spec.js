import React from 'react';
import { mount, shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { FormDetailContainer } from 'form-builder/components/FormDetailContainer.jsx';
import { ComponentStore } from 'bahmni-form-controls';
import sinon from 'sinon';
import { httpInterceptor } from 'common/utils/httpInterceptor';
import { formBuilderConstants } from 'form-builder/constants';
import { UrlHelper } from 'form-builder/helpers/UrlHelper';
import { getStore } from 'test/utils/storeHelper';
import { clearTranslations, formLoad } from 'form-builder/actions/control';
import { Provider } from 'react-redux';
import * as FormBuilderBreadcrumbs from 'form-builder/components/FormBuilderBreadcrumbs.jsx';
import * as ControlPropertiesContainer from
    'form-builder/components/ControlPropertiesContainer.jsx';
import * as FormEventContainer from 'form-builder/components/FormEventContainer.jsx';
import * as Canvas from 'form-builder/components/Canvas.jsx';
import * as FormEventEditor from 'form-builder/components/FormEventEditor.jsx';
import FormHelper from 'form-builder/helpers/formHelper';

const routes = [
  {
    exact: true,
    path: '/',
    title: 'Dashboard',
  },
  {
    exact: true,
    path: '/form-builder',
    title: 'Form Builder',
  },
  {
    exact: true,
    path: '/form-builder/:formUuid',
    title: 'Form Details',
    siblingPath: '/form-builder/:formUuid/translate',
  },
  {
    exact: true,
    path: '/form-builder/:formUuid/translate',
    title: 'Form Translate',
    siblingPath: '/form-builder/:formUuid',
  },
];

chai.use(chaiEnzyme());

describe('FormDetailContainer', () => {
  let getDesignerComponentStub;
  let getAllDesignerComponentsStub;
  let breadcrumbsStub;
  let controlPropertiesContainer;
  let formEventContainer;
  let canvas;
  let formEventEditorStub;
  const formData = {
    id: 1,
    name: 'someFormName',
    version: '1',
    uuid: 'someUuid',
    resources: [],
    published: false,
  };

  const publishedFormData = Object.assign({}, formData, { published: true });

  const formJson = { uuid: 'FID', controls: [] };

  const defaultProps = {
    params: { formUuid: 'FID' },
    routes,
    defaultLocale: 'en',
    dispatch: () => {},
    store: getStore(),
    match: {
      path: '/form-builder/:formUuid',
      params: {
        formUuid: 'FID',
      },
    },
  };
  const context = { router: {}, store: getStore() };

  const control = () => (<div></div>);

  before(() => {
    getDesignerComponentStub = sinon.stub(ComponentStore, 'getDesignerComponent');
    getDesignerComponentStub.returns({
      metadata: {
        attributes: [{ name: 'properties', dataType: 'complex', attributes: [] }],
      },
      control,
    });
    breadcrumbsStub = sinon.stub(FormBuilderBreadcrumbs, 'default').returns(<div>A stub</div>);
    controlPropertiesContainer = sinon.stub(ControlPropertiesContainer, 'default')
      .returns(<div>A stub</div>);
    formEventContainer = sinon.stub(FormEventContainer, 'default')
      .returns(<div>A stub</div>);
    canvas = sinon.stub(Canvas, 'default')
      .returns(<div>A stub</div>);
    getAllDesignerComponentsStub = sinon.stub(
      ComponentStore,
      'getAllDesignerComponents').callsFake(() => {});
    formEventEditorStub = sinon.stub(FormEventEditor, 'default').returns(<div>A stub</div>);
  });

  after(() => {
    getDesignerComponentStub.restore();
    getAllDesignerComponentsStub.restore();
    breadcrumbsStub.restore();
    controlPropertiesContainer.restore();
    formEventContainer.restore();
    canvas.restore();
    formEventEditorStub.restore();
  });

  afterEach(() => {
    if (httpInterceptor && httpInterceptor.get.restore) {
      httpInterceptor.get.restore();
    }
    if (httpInterceptor && httpInterceptor.post.restore) {
      httpInterceptor.post.restore();
    }
  });

  it('should render appropriate controls with appropriate props', () => {
    sinon.stub(httpInterceptor, 'get').callsFake(() => Promise.resolve(formData));
    const wrapper = mount(
      <Provider store={getStore()}>
        <FormDetailContainer
          {...defaultProps}
        /></Provider>, { context }
    );
    const formDetail = wrapper.find('FormDetail');
    expect(formDetail.prop('formData')).to.equal(undefined);
    expect(formDetail).to.have.prop('setError');

    const notification = wrapper.find('NotificationContainer');
    expect(notification).to.have.prop('notification');

    const formBuilderBreadcrumbs = wrapper.find('.breadcrumb-wrap').find('default');
    expect(formBuilderBreadcrumbs).to.have.prop('routes');
    httpInterceptor.get.restore();
  });

  it('should not show publish button & save button before get formData', () => {
    const wrapper = mount(
      <Provider store={getStore()}>
      <FormDetailContainer
        {...defaultProps}
      /></Provider>, { context }
    );
    wrapper.find('FormDetailContainer').setState({ httpReceived: false });
    const saveButton = wrapper.find('.save-button');
    const publishButton = wrapper.find('.publish-button');
    expect(saveButton).to.have.length(0);
    expect(publishButton).to.have.length(0);
  });

  it('should show preview button before get formData', () => {
    const wrapper = mount(
      <Provider store={getStore()}>
        <FormDetailContainer
          {...defaultProps}
        /></Provider>, { context }
    );
    wrapper.find('FormDetailContainer').setState({ httpReceived: false });
    const previewButton = wrapper.find('.preview-button');
    expect(previewButton).to.have.length(1);
  });

  it('should call the appropriate endpoint to post formData', (done) => {
    sinon.stub(httpInterceptor, 'post').callsFake(() => Promise.resolve(formData));
    const wrapper = shallow(
      <FormDetailContainer
        {...defaultProps}
      />, { context }
    );
    wrapper.setState({ formData });
    setTimeout(() => {
      wrapper.instance().cloneFormResource();
      sinon.assert.calledWith(
        httpInterceptor.post,
        formBuilderConstants.formUrl,
        sinon.match.any
      );

      httpInterceptor.post.restore();
      done();
    }, 500);
  });

  it('should call the appropriate endpoint to fetch the formData', (done) => {
    const params =
      'v=custom:(id,uuid,build,name,version,published,auditInfo,' +
      'resources:(value,dataType,uuid))';
    const formResourceURL = `${formBuilderConstants.formUrl}/${'FID'}?${params}`;
    sinon.stub(httpInterceptor, 'get').callsFake(() => Promise.resolve(formData));
    const wrapper = mount(
      <Provider store={getStore()}>
      <FormDetailContainer
        {...defaultProps}
      /></Provider>, { context }
    );
    setTimeout(() => {
      wrapper.find('FormDetailContainer').update();
      const formDetail = wrapper.find('FormDetail');
      expect(formDetail.prop('formData')).to.eql(formData);
      httpInterceptor.get.restore();
      done();
    }, 500);

    sinon.assert.calledWith(httpInterceptor.get, formResourceURL);
  });

  it('should call the cloneFormResource when name changed and click save button', () => {
    const wrapper = shallow(
      <FormDetailContainer
        {...defaultProps}
      />, { context }
    );
    const instance = wrapper.instance();
    const spy = sinon.spy(instance, 'cloneFormResource');
    wrapper.setState({ formData, originalFormName: 'TestForRename', httpReceived: true });
    const saveButton = wrapper.find('.save-button');
    saveButton.simulate('click');
    sinon.assert.calledOnce(spy);
  });

  it('should throw exception given form with empty blocks', () => {
    const wrapper = shallow(
            <FormDetailContainer
              {...defaultProps}
            />, {
              context: {
                router: {
                  push() {
                  },
                },
              },
            }
        );
    wrapper.setState({ formData, httpReceived: true });
    const formJsonData = {
      name: 'SectionForm',
      controls: [{
        type: 'section',
        controls: [],
      }],
    };
    sinon.stub(wrapper.instance(), 'getFormJson').callsFake(() => formJsonData);

    wrapper.instance().onSave();

    const notificationContainer = wrapper.find('NotificationContainer');
    expect(notificationContainer.prop('notification').message).to.equal(undefined);
  });

  it('should return true when formJson have section with no inner controls', () => {
    const wrapper = shallow(
            <FormDetailContainer
              {...defaultProps}
            />, { context }
        );
    const formJsonData = {
      name: 'SectionForm',
      controls: [{
        type: 'section',
        controls: [],
      },
      {
        type: 'table',
        controls: [{ name: 'one' }, { name: 'two' }, { name: 'three' }],
      }],
    };
    const instance = wrapper.instance();

    expect(instance.hasEmptyBlocks(formJsonData)).to.equal(true);
  });

  it('should return true when formJson have tables with no inner controls', () => {
    const wrapper = shallow(
            <FormDetailContainer
              {...defaultProps}
            />, { context }
        );
    const formJsonData = {
      name: 'SectionForm',
      controls: [{
        type: 'section',
        controls: [{ name: 'obsControl' }],
      },
      {
        type: 'table',
        controls: [],
      }],
    };
    const instance = wrapper.instance();

    expect(instance.hasEmptyBlocks(formJsonData)).to.equal(true);
  });

  it('should return false when formJson has no empty section or table', () => {
    const wrapper = shallow(
            <FormDetailContainer
              {...defaultProps}
            />, { context }
        );
    const formJsonData = {
      name: 'SectionForm',
      controls: [
        {
          type: 'section',
          controls: [{
            name: 'label1',
          }],
        },
        {
          type: 'table',
          controls: [{ name: 'first' }, { name: 'second' }, { name: 'third' }],
        },
      ],
    };

    expect(wrapper.instance().hasEmptyBlocks(formJsonData)).to.equal(false);
  });

  it('should return true when formJson have table and section with no inner controls', () => {
    const wrapper = shallow(
            <FormDetailContainer
              {...defaultProps}
            />, { context }
        );
    const formJsonData = {
      name: 'SectionForm',
      controls: [{
        type: 'section',
        controls: [],
      },
      {
        type: 'table',
        controls: [],
      }],
    };
    const instance = wrapper.instance();

    expect(instance.hasEmptyBlocks(formJsonData)).to.equal(true);
  });

  it('should return true when formJson have nested empty sections', () => {
    const wrapper = shallow(
            <FormDetailContainer
              {...defaultProps}
            />, { context }
        );
    const formJsonData = {
      name: 'SectionForm',
      controls: [{
        type: 'section',
        controls: [{ type: 'section', controls: [{ type: 'section', controls: [] }] }],
      }],
    };
    const instance = wrapper.instance();

    expect(instance.hasEmptyBlocks(formJsonData)).to.equal(true);
  });

  it('should return newName when given new formName', () => {
    const wrapper = shallow(
      <FormDetailContainer
        {...defaultProps}
      />, { context }
    );
    wrapper.setState({
      formList: [{ display: 'A' }, { display: 'B' }],
      originalFormName: 'TestUpdateNameMethod',
    });

    const updatedName = wrapper.instance().updateFormName('newName');

    expect(updatedName).to.equal('newName');
  });

  it('should return original name when given formName with ^', () => {
    const wrapper = shallow(
      <FormDetailContainer
        {...defaultProps}
      />, { context }
    );
    const originalFormName = 'TestUpdateNameMethod';
    wrapper.setState({
      formList: [{ display: 'A' }, { display: 'B' }],
      originalFormName,
    });

    const updatedName = wrapper.instance().updateFormName('NewName^');

    expect(updatedName).to.equal(originalFormName);
  });

  it('should return original name when given formName with /', () => {
    const wrapper = shallow(
      <FormDetailContainer
        {...defaultProps}
      />, { context }
    );
    const originalFormName = 'TestUpdateNameMethod';
    wrapper.setState({
      formList: [{ display: 'A' }, { display: 'B' }],
      originalFormName,
    });

    const updatedName = wrapper.instance().updateFormName('NewName/');

    expect(updatedName).to.equal(originalFormName);
  });

  it('should return original name when given formName with empty', () => {
    const wrapper = shallow(
      <FormDetailContainer
        {...defaultProps}
      />, { context }
    );
    const originalFormName = 'TestUpdateNameMethod';
    wrapper.setState({
      formList: [{ display: 'A' }, { display: 'B' }],
      originalFormName,
    });

    const updatedName = wrapper.instance().updateFormName('');

    expect(updatedName).to.equal(originalFormName);
  });

  it('should return true when try to update after original name length has equal 50', () => {
    const wrapper = shallow(
          <FormDetailContainer
            {...defaultProps}
          />, { context }
      );
    const updatedFormName = '12345678901234567890123456789012345678901234567890';

    const isError = wrapper.instance().validateNameLength(updatedFormName);

    expect(isError).to.equal(true);
  });

  it('should return false when try to update after original name length less than 50', () => {
    const wrapper = shallow(
          <FormDetailContainer
            {...defaultProps}
          />, { context }
      );
    const updatedFormName = '1234567890';

    const isError = wrapper.instance().validateNameLength(updatedFormName);

    expect(isError).to.equal(false);
  });

  it('should update original name when clone form success', (done) => {
    sinon.stub(httpInterceptor, 'post')
      .callsFake(() => Promise.resolve(formData));

    const wrapper = shallow(
      <FormDetailContainer
        {...defaultProps}
      />, { context }
    );
    wrapper.setState({ formData, originalFormName: 'original name' });

    wrapper.instance().cloneFormResource();

    setTimeout(() => {
      expect(wrapper.state().originalFormName).to.equal(formData.name);
      httpInterceptor.post.restore();
      done();
    }, 500);
  });

  it('should call formLoad redux action when handleUpdateFormControlEvents is called', () => {
    const dispatch = sinon.spy();
    const wrapper = shallow(
      <FormDetailContainer
        {...defaultProps}
        dispatch={dispatch}
      />, { context, store: {}, disableLifecycleMethods: true }
    );

    const instance = wrapper.instance();
    const jsonForm = {
      name: 'Test',
      controls: [
        {
          type: 'obsGroupControl',
          label: {
            translationKey: 'SYSTOLIC_DATA_19',
            type: 'label',
            value: 'Systolic Data',
            id: '19',
          },

          id: '19',
          concept: {
            name: 'Systolic Data',
            uuid: 'c36ddb6d-3f10-11e4-adec-0800271c1b75',
            datatype: 'N/A',
            setMembers: [
              {
                name: 'Systolic',
              },
            ],
          },
          controls: [
            {
              type: 'obsControl',
              id: '20',
              concept: {
                name: 'Systolic',
              },
              events: {
                onValueChange: 'function(){\nconsole.log("test")}',
              },
            },
          ],
        },
      ],
      events: {},
    };

    instance.handleUpdateFormControlEvents(jsonForm);
    const obsControlEvents = FormHelper.getObsControlEvents(jsonForm);
    const formLoadAction = formLoad(obsControlEvents);
    expect(dispatch.lastCall.args[0].type).to.eq(formLoadAction.type);
    expect(dispatch.lastCall.args[0].controls).to.eql(formLoadAction.controls);
  });

  describe('when NOT published', () => {
    beforeEach(() => {
      sinon.stub(httpInterceptor, 'get').callsFake(() => Promise.resolve(formData));
    });
    afterEach(() => {
      httpInterceptor.get.restore();
    });

    it('should show save button', () => {
      const wrapper = mount(
        <Provider store={getStore()} >
        <FormDetailContainer
          {...defaultProps}
        /></Provider>, { context }
      );
      wrapper.find('FormDetailContainer').setState({ httpReceived: true });

      const saveButton = wrapper.find('.save-button');
      expect(saveButton.text()).to.equal('Save');
      expect(saveButton).to.have.prop('onClick');
    });

//    it('should save form when save button is clicked', (done) => {
//      sinon.stub(httpInterceptor, 'post').callsFake(() => Promise.resolve(formData));
//      const wrapper = shallow(
//        <FormDetailContainer
//          {...defaultProps}
//        />, { context }
//      );
//      wrapper.setState({ httpReceived: true });
//      sinon.stub(wrapper.instance(), 'getFormJson').callsFake(() => formJson);
//      const saveButton = wrapper.find('.save-button');
//
//      setTimeout(() => {
//        saveButton.simulate('click');
//        sinon.assert.calledWith(
//          httpInterceptor.post,
//          formBuilderConstants.bahmniFormResourceUrl,
//          sinon.match.any
//        );
//        httpInterceptor.post.restore();
//        done();
//      }, 500);
//    });

//    it('should show the appropriate notification form is saved', (done) => {
//      const fakePromise = {
//        cb: () => {},
//        then(cb) { this.cb = cb; return this; },
//        catch(e) { return this; },
//      };
//
//      sinon.stub(httpInterceptor, 'post').callsFake(() => fakePromise);
//
//      const wrapper = shallow(
//        <FormDetailContainer
//          {...defaultProps}
//        />, { context: { router: { history: { push() {} } } } }
//      );
//      wrapper.setState({ formData, httpReceived: true });
//      sinon.stub(wrapper.instance(), 'getFormJson').callsFake(() => formJson);
//      wrapper.instance().onSave();
//
//      const dummyResponse = {
//        form: { id: 1, uuid: 'saveUuid', name: 'F1', published: false, version: '' },
//        name: 'F1',
//        dataType: 'datatype',
//        value: '{}',
//        uuid: 'formUuid',
//      };
//      fakePromise.cb(dummyResponse);
//      const formDetail = wrapper.find('FormDetail');
//      const notificationContainer = wrapper.find('NotificationContainer');
//
//      setTimeout(() => {
//        sinon.assert.calledWith(
//          httpInterceptor.post,
//          formBuilderConstants.bahmniFormResourceUrl,
//          sinon.match.any
//        );
//        expect(formDetail.prop('formData').resources).to.have.length(1);
//        expect(formDetail.prop('formData').resources[0]).to.eql({
//          name: 'F1',
//          dataType: 'datatype',
//          value: '{}',
//          uuid: 'formUuid',
//        });
//
//        expect(notificationContainer.prop('notification')).to.eql({
//          message: 'Form Saved Successfully',
//          type: 'success',
//        });
//
//        httpInterceptor.post.restore();
//        done();
//      }, 500);
//    });

    it('should show publish button', () => {
      const wrapper = mount(
        <Provider store={getStore()}>
        <FormDetailContainer
          {...defaultProps}
        /></Provider>, { context }
      );
      wrapper.find('FormDetailContainer').setState({ httpReceived: true });

      const publishButton = wrapper.find('.publish-button');
      expect(publishButton.text()).to.equal('Publish');
      expect(publishButton).to.have.prop('onClick');
    });

    it('should publish form when the publish button is clicked', (done) => {
      const resources = [{
        dataType: formBuilderConstants.formResourceDataType,
        value: '{"controls": [{}]}',
      }];
      formData.version = '2';
      const updatedForm = Object.assign({}, formData, { resources });
      httpInterceptor.get.restore();
      sinon.stub(httpInterceptor, 'get').callsFake(() => Promise.resolve([{ uuid: 'uuid', formId: 1, privilegeName: 'test', editable: true, viewable: false, formVersion: '2', form_privilege_id: 1, id: 1 }]));
      const postStub = sinon.stub(httpInterceptor, 'post');
      postStub.onCall(0).returns(Promise.resolve({ form: formData }))
          .onCall(1).returns(Promise
          .resolve('[{"display" :"some name to display", "locale": "en"}]'))
          .onCall(2).returns(Promise.resolve({}))
          .onCall(3).returns(Promise.resolve(updatedForm));
      const wrapper = shallow(
        <FormDetailContainer
          {...defaultProps}
        />, { context: { router: { history: { push() {} } } } }
      );
      wrapper.setState({ httpReceived: true });
      sinon.stub(wrapper.instance(), 'getFormJson').callsFake(() => formJson);
      let publishButton = undefined;
      updatedForm.version = '2';
      wrapper.setState({ formData: updatedForm },
        () => {
          publishButton = wrapper.find('.publish-button');
        });
      wrapper.setState({ referenceVersion: '1', referenceFormUuid: 'ref-uuid' });
      publishButton.simulate('click');
      setTimeout(() => {
        sinon.assert.callCount(httpInterceptor.post, 5);
        const formNameTranslations = {
          form: { name: wrapper.state().originalFormName, uuid: 'FID' },
          value: '',
        };
        const formNameTranslateSaveUrl = new UrlHelper()
          .bahmniSaveFormNameTranslateUrl('ref-uuid');
        sinon.assert.calledWith(httpInterceptor.get,
            '/openmrs/ws/rest/v1/bahmniie/form/getFormPrivileges?formId=1&formVersion=2');
        sinon.assert.calledWith(postStub.withArgs('/openmrs/ws/rest/v1/bahmniie/form/saveFormPrivileges', [{ formId: 1, privilegeName: 'test', editable: true, viewable: false, formVersion: '2' }]));
        sinon.assert.calledOnce(postStub.withArgs(formNameTranslateSaveUrl, formNameTranslations));
        sinon.assert.callOrder(
          postStub.withArgs(formBuilderConstants.saveTranslationsUrl,
            [{ formName: 'someFormName', locale: 'en', version: '2', referenceVersion: '1',
              referenceFormUuid: 'ref-uuid', formUuid: 'someUuid' }]),
          postStub.withArgs(new UrlHelper().bahmniFormPublishUrl(formData.uuid))
        );
        postStub.restore();
        done();
      }, 500);
    });

    it('should not call save form name translation endpoint if the form is of 1st version' +
      ' and publish form when the publish button is clicked', (done) => {
      const resources = [{
        dataType: formBuilderConstants.formResourceDataType,
        value: '{"controls": [{}]}',
      }];
      formData.version = '1';
      const updatedForm = Object.assign({}, formData, { resources });
      httpInterceptor.get.restore();
      sinon.stub(httpInterceptor, 'get').callsFake(() => Promise.resolve([{ uuid: 'uuid', formId: 1, privilegeName: 'test', editable: true, viewable: false, formVersion: '1', form_privilege_id: 1, id: 1 }]));
      const postStub = sinon.stub(httpInterceptor, 'post');
      postStub.onFirstCall().returns(Promise.resolve({ form: formData }))
          .onSecondCall().returns(Promise
          .resolve('[{"display" :"some name to display", "locale": "en"}]'))
          .onThirdCall(1).returns(Promise.resolve({}));
      const wrapper = shallow(
        <FormDetailContainer
          {...defaultProps}
        />, { context: { router: { history: { push() {} } } } }
      );
      wrapper.setState({ httpReceived: true });
      sinon.stub(wrapper.instance(), 'getFormJson').callsFake(() => formJson);
      let publishButton = undefined;
      wrapper.setState({ formData: updatedForm },
        () => {
          publishButton = wrapper.find('.publish-button');
        });
      wrapper.setState({ referenceVersion: '1', referenceFormUuid: 'ref-uuid' });
      publishButton.simulate('click');
      setTimeout(() => {
        sinon.assert.callCount(httpInterceptor.post, 4);
        const formNameTranslations = {
          form: { name: wrapper.state().originalFormName, uuid: 'FID' },
          value: '',
        };
        const formNameTranslateSaveUrl = new UrlHelper()
          .bahmniSaveFormNameTranslateUrl('ref-uuid');
        sinon.assert.notCalled(postStub.withArgs(formNameTranslateSaveUrl, formNameTranslations));
        postStub.restore();
        done();
      }, 500);
    });

    it('should NOT show edit button', (done) => {
      const wrapper = mount(
        <Provider store={getStore()}>
        <FormDetailContainer
          {...defaultProps}
        /></Provider>, { context }
      );
      wrapper.find('FormDetailContainer').setState({ httpReceived: true });
      const editButton = wrapper.find('.edit-button');

      setTimeout(() => {
        expect(editButton.getElements().length).to.equal(0);
        done();
      }, 500);
    });
  });

  describe('when component unmounted', () => {
    beforeEach(() => {
      sinon.stub(httpInterceptor, 'get').callsFake(() => Promise.resolve(publishedFormData));
    });

    afterEach(() => {
      httpInterceptor.get.restore();
    });

    it('should call clearTimeout after component unmounted', () => {
      const wrapper = shallow(
        <FormDetailContainer
          {...defaultProps}
        />, { context }
      );
      const spy = sinon.spy(window, 'clearTimeout');
      wrapper.unmount();
      sinon.assert.calledOnce(spy);
      window.clearTimeout.restore();
    });
  });

  describe('when published', () => {
    beforeEach(() => {
      sinon.stub(httpInterceptor, 'get').callsFake(() => Promise.resolve(publishedFormData));
    });

    afterEach(() => {
      httpInterceptor.get.restore();
    });

    it('should show edit button', (done) => {
      const wrapper = shallow(
        <FormDetailContainer
          {...defaultProps}
        />, { context, store: {} }
      );
      wrapper.setState({ formData: publishedFormData });
      const editButton = wrapper.find('.edit-button');

      setTimeout(() => {
        expect(editButton.text()).to.equal('Edit');
        done();
      }, 500);
    });

    it('should show modal equal true when click edit button', () => {
      const dispatch = sinon.spy();
      const wrapper = shallow(
        <FormDetailContainer
          {...defaultProps}
          dispatch={dispatch}
        />, { context, store: {} }
      );
      wrapper.setState({ formData: publishedFormData });

      wrapper.find('.edit-button').simulate('click');

      expect(wrapper.state().showModal).to.equal(true);

      const instance = wrapper.instance();
      instance.editForm();
      sinon.assert.calledTwice(dispatch.withArgs(clearTranslations()));
    });

    it('should set showPreview equal true when click preview button', () => {
      const dispatch = sinon.spy();

      const wrapper = shallow(
        <FormDetailContainer
          {...defaultProps}
          dispatch={dispatch}
        />, { context, store: {} }
      );
      const json = {
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
                  '.getValue();\n var y = form.get("SA, Penicillin");\n  if (parseInt(x) > 5) {\n' +
                  '    y.setHidden(true);\n  } else\n y.setHidden(false);\n}',
            },
          },
        ],
        version: '43',
      };
      const formJsonSpy = sinon.stub(wrapper.instance(), 'getFormJson').callsFake(() => json);
      const generateFormSpy = sinon.spy(wrapper.instance(), 'generateFormPreviewJson');

      wrapper.setState({ formData: publishedFormData });
      wrapper.find('.preview-button').simulate('click');

      expect(wrapper.state().showPreview).to.equal(true);
      sinon.assert.calledOnce(generateFormSpy);
      sinon.assert.calledOnce(formJsonSpy);
    });

    it('should show edit modal', (done) => {
      const wrapper = shallow(
        <FormDetailContainer
          {...defaultProps}
        />, { context, store: {} }
      );

      wrapper.setState({ formData: publishedFormData });
      const editModal = wrapper.find('EditModal');

      setTimeout(() => {
        expect(editModal.prop('showModal')).to.equal(false);
        done();
      }, 1000);
    });

    it('should show preview modal', (done) => {
      const wrapper = shallow(
        <FormDetailContainer
          {...defaultProps}
        />, { context, store: {} }
      );
      wrapper.setState({ formData: publishedFormData });

      const popup = wrapper.find('Popup');

      setTimeout(() => {
        expect(popup.prop('open')).to.equal(false);
        done();
      }, 1000);
    });

    it('should NOT show publish button', (done) => {
      const wrapper = shallow(
        <FormDetailContainer
          {...defaultProps}
        />, { context }
      );
      wrapper.setState({ formData: publishedFormData });
      const publishButton = wrapper.find('.publish-button');
      setTimeout(() => {
        expect(publishButton.getElements().length).to.equal(0);
        done();
      }, 500);
    });

    it('when edited should set the form in edit mode', (done) => {
      const wrapper = shallow(
        <FormDetailContainer
          {...defaultProps}
        />, { context }
      );

      wrapper.setState({ formData: publishedFormData });
      const editModal = wrapper.find('EditModal');
      editModal.prop('editForm')();
      const formDetail = wrapper.find('FormDetail');

      setTimeout(() => {
        expect(formDetail.prop('formData').editable).to.eql(true);
        done();
      }, 500);
    });

    it('should throw exception given form with empty blocks', () => {
      const wrapper = shallow(
        <FormDetailContainer
          {...defaultProps}
        />, {
          context: {
            router: {
              push() {
              },
            },
          },
        }
      );
      wrapper.setState({ formData, httpReceived: true });
      const formJsonData = {
        name: 'SectionForm',
        controls: [{
          type: 'section',
          controls: [],
        }],
      };
      sinon.stub(wrapper.instance(), 'getFormJson').callsFake(() => formJsonData);

      wrapper.instance().onPublish();

      const notificationContainer = wrapper.find('NotificationContainer');
      expect(notificationContainer.prop('notification').message).to.equal(undefined);
    });

    it('should show preview button after publish', () => {
      const wrapper = mount(
          <Provider store={getStore()}>
            <FormDetailContainer
              {...defaultProps}
            /></Provider>, { context }
      );
      wrapper.find('FormDetailContainer').setState({ httpReceived: false });
      const previewButton = wrapper.find('.preview-button');
      expect(previewButton).to.have.length(1);
    });

    it('should copy the translation to new version after editing', (done) => {
      const wrapper = mount(
        <Provider store={getStore()}>
          <FormDetailContainer
            {...defaultProps}
          /></Provider>, { context }
      );
      wrapper.find('FormDetailContainer').setState({ formData: publishedFormData,
        httpReceived: true, originalFormName: publishedFormData.name });
      wrapper.update();
      const editButton = wrapper.find('.edit-button');
      editButton.simulate('click');
      wrapper.find('EditModal').find('.btn--highlight').simulate('click');
      expect(wrapper.find('FormDetailContainer').state().referenceVersion)
        .to.eq(publishedFormData.version);
      expect(wrapper.find('FormDetailContainer').state().referenceFormUuid)
        .to.eq(publishedFormData.uuid);
      sinon.stub(wrapper.find('FormDetailContainer').instance(), 'getFormJson').returns({});
      sinon.stub(wrapper.find('FormDetailContainer').instance(), 'hasEmptyBlocks').returns(false);
      httpInterceptor.get.restore();
      const getStub = sinon.stub(httpInterceptor, 'get');
      getStub.onFirstCall().returns(Promise.resolve([{ uuid: 'uuid', formId: 1, privilegeName: 'test', editable: true, viewable: false, formVersion: '1', form_privilege_id: 1, id: 1 }]));
      const postStub = sinon.stub(httpInterceptor, 'post');
      postStub.callsFake(() => Promise.resolve(Object.assign({},
        formData, { version: '2', uuid: 'next-uuid' })));
      const saveButton = wrapper.find('.save-button');
      saveButton.simulate('click');
      setTimeout(() => {
        expect(postStub.getCall(0).args[0]).to.eq(formBuilderConstants.bahmniFormResourceUrl);
        /* expect(JSON.parse(postStub.getCall(0).args[1].value).referenceVersion)
          .to.eq(publishedFormData.version);
        expect(JSON.parse(postStub.getCall(0).args[1].value).referenceFormUuid)
          .to.eq(publishedFormData.uuid); */
        httpInterceptor.post.restore();
        done();
      }, 500);
    });
  });
});
