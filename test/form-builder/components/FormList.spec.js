import React from 'react';
import { mount, shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import FormList from 'form-builder/components/FormList.jsx';
import sinon from 'sinon';
import { httpInterceptor } from 'common/utils/httpInterceptor';
import { formBuilderConstants } from '../../../src/form-builder/constants';
import { MemoryRouter } from 'react-router-dom';

chai.use(chaiEnzyme());

describe('FormList', () => {
  let wrapper;
  const data = [
    {
      id: 1,
      name: 'Vitals',
      version: 1.1,
      auditInfo: {
        dateCreated: '2010-10-10T15:21:17.000+0530',
      },
      uuid: 'someUuid-1',
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
    },
  ];

  function getItem(row, column) {
    return wrapper.find('table').find('tbody').find('tr').at(row).find('td').at(column);
  }

  function getData(row, column) {
    return getItem(row, column).text();
  }

  function getLinkAt(row) {
    return wrapper.find('Link').at(row);
  }

  it('should render form list in table', () => {
    wrapper = mount(<MemoryRouter><FormList data={data}
      handleSelectedForm={undefined}
    /></MemoryRouter>);

    expect(wrapper.find('table').find('tbody')).to.have.exactly(3).descendants('tr');

    expect(getData(0, 1)).to.have.string('Vitals');
    expect(getData(0, 2)).to.eql('1.1');
    expect(getData(0, 3)).to.eql('10 Oct 10');
    expect(getData(0, 4)).to.eql('Draft');

    expect(getData(1, 1)).to.eql('BP');
    expect(getData(1, 2)).to.eql('1.2');
    expect(getData(1, 3)).to.eql('09 Aug 10');
    expect(getData(1, 4)).to.eql('Published');

    expect(getData(2, 1)).to.eql('Pulse');
    expect(getData(2, 2)).to.eql('1.1');
    expect(getData(2, 3)).to.eql('09 Aug 10');
    expect(getData(2, 4)).to.eql('Published');

    expect(wrapper.find('table').find('.fa-pencil')).to.have.exactly(1).descendants('i');
    expect(wrapper.find('table').find('.fa-file-text-o')).to.have.exactly(3).descendants('i');

    expect(getItem(0, 5).find('.translate-icon').prop('hidden')).to.eql(true);
    expect(getItem(1, 5).find('.translate-icon').prop('hidden')).to.eql(false);
    expect(getItem(2, 5).find('.translate-icon').prop('hidden')).to.eql(false);
    expect(getLinkAt(0).props().to).to.deep.eql({ pathname: 'form-builder/someUuid-1' });
    expect(getLinkAt(1).props().to).to.deep.eql({ pathname: 'form-builder/someUuid-1/translate' });
    expect(getLinkAt(2).props().to).to.deep.eql({ pathname: 'form-builder/someUuid-2' });
    expect(getLinkAt(3).props().to).to.deep.eql({ pathname: 'form-builder/someUuid-2/translate' });
    expect(getLinkAt(4).props().to).to.deep.eql({ pathname: 'form-builder/someUuid-3' });
    expect(getLinkAt(5).props().to).to.deep.eql({ pathname: 'form-builder/someUuid-3/translate' });
  });

  it('should not display table if there is no data', () => {
    wrapper = shallow(<FormList data={[]} handleSelectedForm={undefined} />);

    expect(wrapper.find('p').text()).to.eql('No Forms to Display');
    expect(wrapper).to.not.have.descendants('table');
  });

  it('should render Export when form published', () => {
    wrapper = shallow(<FormList data={data} handleSelectedForm={undefined} />);

    expect(getItem(0, 5).find('a').prop('hidden')).to.eql(true);
    expect(getItem(1, 5).find('a').prop('hidden')).to.eql(false);
    expect(getItem(1, 5).find('a').find('i').prop('className')).to.eql('fa fa-download');
  });

  it('should call downloadFile when export be clicked', (done) => {
    const getStub = sinon.stub(httpInterceptor, 'get');
    getStub.onFirstCall().returns(Promise.resolve({ name: 'Vitals', version: '1' }))
      .onSecondCall(1).returns(Promise.resolve([]));

    wrapper = shallow(<FormList data={data} />);
    const exportElement = getItem(0, 5).find('a');
    exportElement.simulate('click');
    const params =
      'v=custom:(id,uuid,name,version,published,auditInfo,' +
      'resources:(value,dataType,uuid))';
    const formUrl = `${formBuilderConstants.formUrl}/someUuid-1?${params}`;
    const translationParams = 'formName=Vitals&formVersion=1.1';
    const translationUrl = `${formBuilderConstants.translationsUrl}?${translationParams}`;
    setTimeout(() => {
      sinon.assert.calledTwice(httpInterceptor.get);
      sinon.assert.callOrder(
        getStub.withArgs(formUrl),
        getStub.withArgs(translationUrl)
      );
      getStub.restore();
      done();
    }, 500);
  });

  it('should render notification container', () => {
    wrapper = shallow(<FormList data={data} handleSelectedForm={undefined} />);

    expect(wrapper.find('NotificationContainer')).to.have.length(1);
  });

  it('should call setMessage when download done', (done) => {
    wrapper = shallow(<FormList data={data} handleSelectedForm={undefined} />);
    const spy = sinon.spy(wrapper.instance(), 'setMessage');

    const exportElement = getItem(1, 5).find('a');
    exportElement.simulate('click');

    setTimeout(() => {
      sinon.assert.calledOnce(spy);
      done();
    }, 500);
  });

  it('should show translate button only for latest Published forms', () => {
    const form = {
      id: 4,
      name: 'Pulse',
      version: 1.2,
      auditInfo: {
        dateCreated: '2017-08-10T15:21:17.000+0530',
      },
      published: true,
      uuid: 'someUuid-4',
    };
    const forms = data.concat([form]);

    wrapper = shallow(<FormList data={forms} handleSelectedForm={undefined} />);

    expect(getItem(0, 5).find('.translate-icon').prop('hidden')).to.eql(true);
    expect(getItem(1, 5).find('.translate-icon').prop('hidden')).to.eql(false);
    expect(getItem(2, 5).find('.translate-icon').prop('hidden')).to.eql(true);
    expect(getItem(3, 5).find('.translate-icon').prop('hidden')).to.eql(false);
  });

  it('should display check boxes in table', () => {
    wrapper = mount(<MemoryRouter><FormList data={data}
      handleSelectedForm={undefined}
    /></MemoryRouter>);
    expect(wrapper.find('table').find('tbody')).to.have.exactly(3).descendants('tr');
    expect(getItem(0, 0).find('br').not.null);
    expect(getItem(1, 0).find('input').prop('type')).to.eql('checkbox');
    expect(getItem(2, 0).find('input').prop('type')).to.eql('checkbox');
  });
});

