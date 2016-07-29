import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { dateUtils } from 'common/utils/dateUtils';

export default class FormList extends Component {

  getRows() {
    return _.map(this.props.data, (rowItem) => (
      <tr key={rowItem.id}>
        <td>{rowItem.name}</td>
        <td>{rowItem.version}</td>
        <td>{dateUtils.getDateWithoutTime(rowItem.auditInfo.dateCreated)}</td>
        <td>{dateUtils.getDateWithoutTime(rowItem.auditInfo.dateChanged)}</td>
        <td>published</td>
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
          <th>Last Modified</th>
          <th>Status</th>
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
