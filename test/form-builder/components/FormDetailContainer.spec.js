import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { FormDetailContainer } from 'form-builder/components/FormDetailContainer.jsx';
import { ComponentStore } from 'bahmni-form-controls';
import sinon from 'sinon';
import { httpInterceptor } from 'common/utils/httpInterceptor';
import { formBuilderConstants } from 'form-builder/constants';

chai.use(chaiEnzyme());

describe.skip('FormDetailContainer', () => {
  let getDesignerComponentStub;
  let getAllDesignerComponentsStub;
  const formData = {
    id: 1,
    name: 'someFormName',
    version: '1',
    uuid: 'someUuid',
    resources: [],
    published: false,
  };

  const params =
    'v=custom:(id,uuid,name,version,published,auditInfo,' +
    'resources:(valueReference,dataType,uuid))';
  const formResourceURL = `${formBuilderConstants.formUrl}/${'FID'}?${params}`;

  const defaultProps = {
    params: { formUuid: 'FID' },
    routes: [],
    dispatch: () => {},
  };
  const context = { router: {} };

  const control = () => (<div></div>);

  before(() => {
    getDesignerComponentStub = sinon.stub(ComponentStore, 'getDesignerComponent');
    getDesignerComponentStub.returns({
      metadata: {
        attributes: [{ name: 'properties', dataType: 'complex', attributes: [] }],
      },
      control,
    });
    getAllDesignerComponentsStub = sinon.stub(
      ComponentStore,
      'getAllDesignerComponents',
      () => ({})
    );
  });

  after(() => {
    getDesignerComponentStub.restore();
    getAllDesignerComponentsStub.restore();
  });

  it('should render appropriate controls with appropriate props', () => {
    const wrapper = mount(
      <FormDetailContainer
        {...defaultProps}
      />, { context }
    );

    const formDetail = wrapper.find('FormDetail');
    expect(formDetail).to.have.prop('editForm');
    expect(formDetail.prop('formData')).to.equal(undefined);
    expect(formDetail).to.have.prop('publishForm');
    expect(formDetail).to.have.prop('saveFormResource');
    expect(formDetail).to.have.prop('setError');

    const notification = wrapper.find('NotificationContainer');
    expect(notification).to.have.prop('notifications');
    expect(notification).to.have.prop('closeMessage');

    const formBuilderBreadcrumbs = wrapper.find('FormBuilderBreadcrumbs');
    expect(formBuilderBreadcrumbs).to.have.prop('routes');
  });

  it('should call the appropriate endpoint to fetch the formData', () => {
    sinon.stub(httpInterceptor, 'get', () => Promise.resolve(formData));
    mount(
      <FormDetailContainer
        {...defaultProps}
      />, { context }
    );

    sinon.assert.calledWith(httpInterceptor.get, formResourceURL);
    httpInterceptor.get.restore();
  });

  describe('when NOT published', () => {
    it('should show save button', () => {
      const wrapper = mount(
        <FormDetailContainer
          {...defaultProps}
        />, { context }
      );

      const saveButton = wrapper.find('.save-button');
      expect(saveButton.text()).to.equal('Save');
      expect(saveButton).to.have.prop('onClick');
    });

    it('should show publish button', () => {
      const wrapper = mount(
        <FormDetailContainer
          {...defaultProps}
        />, { context }
      );

      const publishButton = wrapper.find('.publish-button');
      expect(publishButton.text()).to.equal('Publish');
      expect(publishButton).to.have.prop('onClick');
    });

    it('should call the save form endpoint when save button is clicked', () => {
      sinon.stub(httpInterceptor, 'post', () => Promise.resolve(formData));
      const wrapper = mount(
        <FormDetailContainer
          {...defaultProps}
        />, { context }
      );
      sinon.stub(wrapper.instance(), 'getFormJson', () => ({ uuid: 'FID' }));
      wrapper.find('.save-button').simulate('click');
      httpInterceptor.post.restore();
    });
  });

  it('should show save button if the form is NOT published', () => {
    const wrapper = mount(
      <FormDetailContainer
        {...defaultProps}
      />, { context }
    );

    const saveButton = wrapper.find('.save-button');
    expect(saveButton.text()).to.equal('Save');
    expect(saveButton).to.have.prop('onClick');
  });

  it('should publish form on click of Publish button', () => {
    sinon.stub(httpInterceptor, 'post', () => Promise.resolve(formData));
    const wrapper = mount(
      <FormDetailContainer
        {...defaultProps}
      />, { context }
    );

    wrapper.find('.publish-button').simulate('click');
    httpInterceptor.post.restore();
  });
});
