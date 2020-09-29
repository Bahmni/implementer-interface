import sinon from 'sinon';
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { httpInterceptor } from 'common/utils/httpInterceptor';
import FormPrivilegesPreviewGrid from '../../../src/form-builder/components/FormPrivilegesPreviewGrid.jsx';
import { mount } from 'enzyme';
import { formBuilderConstants } from '../../../src/form-builder/constants';

chai.use(chaiEnzyme());

describe('Form Privileges Preview Grid', () => {
    const formData = { resources: {} };

    const defaultProps = {
        formUuid: 'form_uuid'
    };

    const privilegeResults = {
        results: [{ display: 1, uuid: 'form_uuid' }]
    };

    let mockHttp;

    beforeEach(() => {
        mockHttp = sinon.stub(httpInterceptor);
        mockHttp.get.withArgs('/openmrs/ws/rest/v1/form/form_uuid?v=custom:(id,uuid,name,version,published,auditInfo,resources:(value,dataType,uuid))')
            .returns(Promise.resolve(formData));
        mockHttp.get.withArgs('/openmrs/ws/rest/v1/privilege?=')
            .returns(Promise.resolve(privilegeResults));
    });

    afterEach(() => {
        mockHttp.get.restore();
        mockHttp.post.restore();
    });

    it('should fetch data from form', () => {
        let wrapper;
        wrapper = mount(<FormPrivilegesPreviewGrid {...defaultProps} />);

        const params =
            'v=custom:(id,uuid,name,version,published,auditInfo,' +
            'resources:(value,dataType,uuid))';
        const optionsUrl = `${formBuilderConstants.formUrl}/${defaultProps.formUuid}?${params}`;

        mockHttp.get.withArgs(optionsUrl).returns(Promise.resolve({}));
        wrapper.instance().fetchFormData();

        sinon.assert.called(mockHttp.get.withArgs(optionsUrl));
    });

    it('should fetch privileges', () => {
        let wrapper;

        wrapper = mount(<FormPrivilegesPreviewGrid  {...defaultProps} />);

        const queryParams = `?=`;
        const optionsUrl = `${formBuilderConstants.formPrivilegeUrl}${queryParams}`;

        mockHttp.get.withArgs(optionsUrl).returns(Promise.resolve({}));
        wrapper.instance().fetchPrivileges();

        sinon.assert.called(mockHttp.get.withArgs(optionsUrl));
    });
});