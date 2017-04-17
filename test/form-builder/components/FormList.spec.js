import React from 'react';

import { mount, shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import FormList from 'form-builder/components/FormList.jsx';

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

  function getData(row, column) {
    return getItem(row).at(column).text();
  }

  function getLinkAt(row) {
    return wrapper.find('Link').at(row);
  }

  function getHeader(row) {
    return wrapper.find('table').find('thead').find('tr').at(row).find('th');
  }

  function getItem(row) {
    return wrapper.find('table').find('tbody').find('tr').at(row).find('td');
  }

  it('should render form list in table', () => {
    wrapper = mount(<FormList data={data} />);

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

    expect(getLinkAt(0).props().to).to.deep.eql({ pathname: 'form-builder/someUuid-1' });
    expect(getLinkAt(1).props().to).to.deep.eql({ pathname: 'form-builder/someUuid-2' });
    expect(getLinkAt(2).props().to).to.deep.eql({ pathname: 'form-builder/someUuid-3' });
  });

  it('should not display table if there is no data', () => {
    wrapper = shallow(<FormList data={[]} />);

    expect(wrapper.find('p').text()).to.eql('No Forms to Display');
    expect(wrapper).to.not.have.descendants('table');
  });

  it('should enable checkbox when this form published', () => {
    wrapper = mount(<FormList data={data} />);

    const publishedItem = getItem(2).at(0);
    expect(publishedItem.find('input').props().type).to.eql('checkbox');
    expect(publishedItem.find('input').props().disabled).to.eql(false);
  });

  it('should disable checkbox when this form not published', () => {
    wrapper = mount(<FormList data={data} />);

    const draftItem = getItem(0).at(0);
    expect(draftItem.find('input').props().type).to.eql('checkbox');
    expect(draftItem.find('input').props().disabled).to.eql(true);
  });

  it('should select all published items when click select all', () => {
    wrapper = mount(<FormList data={data} isChecked={() => {}} />);

    expect(wrapper.state().selectAll).to.eql(false);
    getHeader(0).find('input').simulate('click');

    expect(wrapper.state().selectAll).to.eql(true);
  });
});
