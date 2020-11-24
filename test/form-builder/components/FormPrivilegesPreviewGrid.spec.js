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
        const optionsUrl = `${formBuilderConstants.getFormPrivilegesFromUuidUrl}/${defaultProps.formUuid}`;

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

    it('order form by version', () => {
        let wrapper;

        wrapper = mount(<FormPrivilegesPreviewGrid {...defaultProps} />);

        const itemList = [{
            value: 1,
            uuid: 'form_uuid1',
            label: 1
        },
        {
            value: 2,
            uuid: 'form_uuid2',
            label: 2
        }
        ];

        const privilege = [{ display: 1, uuid: 'form_uuid1' }, { display: 2, uuid: 'form_uuid2' }];

        expect(wrapper.instance().orderFormByVersion(privilege)).to.be.eql(itemList);
    });
});