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
      status: 'published',
      uuid: 'someUuid-2',
    },
    {
      id: 3,
      name: 'Pulse',
      version: 1.1,
      auditInfo: {
        dateCreated: '2010-08-09T15:21:17.000+0530',
      },
      status: 'published',
      uuid: 'someUuid-3',
    },
  ];

  function getData(row, column) {
    return wrapper.find('table').find('tbody').find('tr').at(row).find('td').at(column).text();
  }

  function getLinkAt(row) {
    return wrapper.find('Link').at(row);
  }

  it('should render form list in table', () => {
    wrapper = mount(<FormList data={data} />);

    expect(wrapper.find('table').find('tbody')).to.have.exactly(3).descendants('tr');

    expect(getData(0, 0)).to.eql('Vitals');
    expect(getData(0, 1)).to.eql('1.1');
    expect(getData(0, 2)).to.eql('10 Oct 10');
    expect(getData(0, 3)).to.eql('published');
    expect(wrapper.find('table').find('.edit-icon')).to.have.exactly(3).descendants('i');


    expect(getData(1, 0)).to.eql('BP');
    expect(getData(2, 0)).to.eql('Pulse');

    expect(getData(1, 2)).to.eql('09 Aug 10');

    expect(getLinkAt(0).props().to).to.deep.eql({ pathname: 'form-builder/someUuid-1' });
    expect(getLinkAt(1).props().to).to.deep.eql({ pathname: 'form-builder/someUuid-2' });
    expect(getLinkAt(2).props().to).to.deep.eql({ pathname: 'form-builder/someUuid-3' });
  });

  it('should not display table if there is no data', () => {
    wrapper = shallow(<FormList data={[]} />);

    expect(wrapper.find('div').text()).to.eql('No Forms to Display');
    expect(wrapper).to.not.have.descendants('table');
  });
});
