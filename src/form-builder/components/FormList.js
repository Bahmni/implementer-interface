import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { dateUtils } from 'common/utils/dateUtils';
import { Link } from 'react-router';

export default class FormList extends Component {

  getRows() {
    return _.map(this.props.data, (rowItem) => (
      <tr key={rowItem.id}>
        <td>{rowItem.name}</td>
        <td>{rowItem.version}</td>
        <td>{dateUtils.getDateWithoutTime(rowItem.auditInfo.dateCreated)}</td>
        <td>published</td>
        <td><Link to={{ pathname: `form-builder/${rowItem.uuid}` }}>Edit</Link></td>
      </tr>
    ));
  }

  render() {
    return (this.props.data.length === 0 ? <div>No Forms to Display</div> :
      <table>
        <thead>
        <tr>
          <th>Name</th>
          <th>Version</th>
          <th>Created On</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
        </thead>
        <tbody>{this.getRows()}</tbody>
      </table>
    );
  }
}

FormList.propTypes = {
  data: PropTypes.array.isRequired,
};
