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
import { clearTranslations } from 'form-builder/actions/control';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import * as FormBuilderBreadcrumbs from 'form-builder/components/FormBuilderBreadcrumbs.jsx';
import * as ControlPropertiesContainer from
    'form-builder/components/ControlPropertiesContainer.jsx';
import * as FormEventContainer from 'form-builder/components/FormEventContainer.jsx';
import * as Canvas from 'form-builder/components/Canvas.jsx';
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

window.localStorage = {
  getItem: sinon.stub(),
};

chai.use(chaiEnzyme());

describe('FormDetailContainer', () => {
  let getDesignerComponentStub;
  let getAllDesignerComponentsStub;
  let breadcrumbsStub;
  let controlPropertiesContainer;
  let formEventContainer;
  let canvas;
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
  });

  after(() => {
    getDesignerComponentStub.restore();
    getAllDesignerComponentsStub.restore();
    breadcrumbsStub.restore();
    controlPropertiesContainer.restore();
    formEventContainer.restore();
    canvas.restore();
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

  it('should get defaultLocale from local storage if its not present in props', () => {
    localStorage.getItem.returns('en');
    sinon.stub(httpInterceptor, 'get').callsFake(() => Promise.resolve(formData));
    const wrapper = mount(
      <MemoryRouter>
      <FormDetailContainer
        {...defaultProps}
        defaultLocale={undefined}
      /></MemoryRouter>, { context }
    );

    const formDetail = wrapper.find('FormDetail');
    expect(formDetail.prop('formData')).to.equal(undefined);
    expect(formDetail).to.have.prop('setError');
    expect(formDetail).to.have.prop('defaultLocale').to.equal('en');
    sinon.assert.calledOnce(localStorage.getItem.withArgs('openmrsDefaultLocale'));
    httpInterceptor.get.restore();
  });

  // it('should call the appropriate endpoint to fetch the formData', (done) => {
  //   sinon.stub(httpInterceptor, 'get').callsFake(() => Promise.resolve(formData));
  //   const wrapper = mount(
  //     <Provider store={getStore()}>
  //     <FormDetailContainer
  //       {...defaultProps}
  //     /></Provider>, { context }
  //   );
  //   setTimeout(() => {
  //     wrapper.find('FormDetailContainer').update();
  //     const formDetail = wrapper.find('FormDetail');
  //     expect(formDetail.prop('formData')).to.eql(formData);
  //     httpInterceptor.get.restore();
  //     done();
  //   }, 500);
  //
  //   sinon.assert.calledWith(httpInterceptor.get, formResourceURL);
  // });

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

  // it('should call the appropriate endpoint to post formData', (done) => {
  //   sinon.stub(httpInterceptor, 'post').callsFake(() => Promise.resolve(formData));
  //   const wrapper = shallow(
  //     <Provider store={getStore()}>
  //     <FormDetailContainer
  //       {...defaultProps}
  //     /></Provider>, { context }
  //   );
  //   wrapper.find('FormDetailContainer').setState({ formData });
  //   setTimeout(() => {
  //     wrapper.instance().cloneFormResource();
  //     sinon.assert.calledWith(
  //       httpInterceptor.post,
  //       formBuilderConstants.formUrl,
  //       sinon.match.any
  //     );
  //
  //     httpInterceptor.post.restore();
  //     done();
  //   }, 500);
  // });

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
    expect(notificationContainer.prop('notification').message).to.equal('Section/Table is empty');
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

    it('should save form when save button is clicked', (done) => {
      sinon.stub(httpInterceptor, 'post').callsFake(() => Promise.resolve(formData));
      const wrapper = shallow(
        <FormDetailContainer
          {...defaultProps}
        />, { context }
      );
      wrapper.setState({ httpReceived: true });
      sinon.stub(wrapper.instance(), 'getFormJson').callsFake(() => formJson);
      const saveButton = wrapper.find('.save-button');

      setTimeout(() => {
        saveButton.simulate('click');
        sinon.assert.calledWith(
          httpInterceptor.post,
          formBuilderConstants.bahmniFormResourceUrl,
          sinon.match.any
        );

        httpInterceptor.post.restore();
        done();
      }, 500);
    });

    it('should show the appropriate notification form is saved', (done) => {
      const fakePromise = {
        cb: () => {},
        then(cb) { this.cb = cb; return this; },
        catch() { return this; },
      };

      sinon.stub(httpInterceptor, 'post').callsFake(() => fakePromise);

      const wrapper = shallow(
        <FormDetailContainer
          {...defaultProps}
        />, { context: { router: { history: { push() {} } } } }
      );
      wrapper.setState({ formData, httpReceived: true });
      sinon.stub(wrapper.instance(), 'getFormJson').callsFake(() => formJson);
      wrapper.instance().onSave();

      const dummyResponse = {
        form: { id: 1, uuid: 'saveUuid', name: 'F1', published: false, version: '' },
        name: 'F1',
        dataType: 'datatype',
        value: '{}',
        uuid: 'formUuid',
      };
      fakePromise.cb(dummyResponse);
      const formDetail = wrapper.find('FormDetail');
      const notificationContainer = wrapper.find('NotificationContainer');

      setTimeout(() => {
        sinon.assert.calledWith(
          httpInterceptor.post,
          formBuilderConstants.bahmniFormResourceUrl,
          sinon.match.any
        );
        expect(formDetail.prop('formData').resources).to.have.length(1);
        expect(formDetail.prop('formData').resources[0]).to.eql({
          name: 'F1',
          dataType: 'datatype',
          value: '{}',
          uuid: 'formUuid',
        });

        expect(notificationContainer.prop('notification')).to.eql({
          message: 'Form Saved Successfully',
          type: 'success',
        });

        httpInterceptor.post.restore();
        done();
      }, 500);
    });

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
      const updatedForm = Object.assign({}, formData, { resources });
      const postStub = sinon.stub(httpInterceptor, 'post');
      postStub.onFirstCall().returns(Promise.resolve({}))
        .onSecondCall(1).returns(Promise.resolve(updatedForm));
      const wrapper = shallow(
        <FormDetailContainer
          {...defaultProps}
        />, { context }
      );
      wrapper.setState({ httpReceived: true });
      sinon.stub(wrapper.instance(), 'getFormJson').callsFake(() => formJson);
      let publishButton = undefined;
      wrapper.setState({ formData: updatedForm },
        () => {
          publishButton = wrapper.find('.publish-button');
        });
      wrapper.setState({ referenceVersion: '1' });
      publishButton.simulate('click');
      setTimeout(() => {
        sinon.assert.calledTwice(httpInterceptor.post);
        sinon.assert.callOrder(
          postStub.withArgs(formBuilderConstants.saveTranslationsUrl,
            [{ formName: 'someFormName', locale: 'en', version: '1', referenceVersion: '1' }]),
          postStub.withArgs(new UrlHelper().bahmniFormPublishUrl(formData.uuid))
        );
        postStub.restore();
        done();
      }, 500);
    });

    it('should pick defaultLocale from local storage when its not present in' +
        ' props during form publish', (done) => {
      window.localStorage = {
        getItem: sinon.stub(),
      };
      localStorage.getItem.returns('fr');

      const resources = [{
        dataType: formBuilderConstants.formResourceDataType,
        value: '{"controls": [{}]}',
      }];
      const updatedForm = Object.assign({}, formData, { resources });
      const postStub = sinon.stub(httpInterceptor, 'post');
      postStub.onFirstCall().returns(Promise.resolve({}))
        .onSecondCall(1).returns(Promise.resolve(updatedForm));
      const wrapper = shallow(
        <FormDetailContainer
          {...defaultProps}
          defaultLocale={undefined}
        />, { context }
      );
      wrapper.setState({ httpReceived: true });
      sinon.stub(wrapper.instance(), 'getFormJson').callsFake(() => formJson);
      let publishButton = undefined;
      wrapper.setState({ formData: updatedForm },
        () => {
          publishButton = wrapper.find('.publish-button');
        });
      wrapper.setState({ referenceVersion: '1' });
      publishButton.simulate('click');
      setTimeout(() => {
        sinon.assert.calledTwice(httpInterceptor.post);
        sinon.assert.callOrder(
          postStub.withArgs(formBuilderConstants.saveTranslationsUrl,
            [{ formName: 'someFormName', locale: 'fr', version: '1', referenceVersion: '1' }]),
          postStub.withArgs(new UrlHelper().bahmniFormPublishUrl(formData.uuid))
        );
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
      expect(notificationContainer.prop('notification').message).to.equal('Section/Table is empty');
    });
  });
});
