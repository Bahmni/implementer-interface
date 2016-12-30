import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { dateUtils } from 'common/utils/dateUtils';
import { Link } from 'react-router';

export default class FormList extends Component {

  getRows() {
    const data = _.map(this.props.data, (rowItem) => (
      <tr key={rowItem.id}>
        <td><i className=" fa fa-file-text-o"></i> {rowItem.name}</td>
        <td>{rowItem.version}</td>
        <td>{dateUtils.getDateWithoutTime(rowItem.auditInfo.dateCreated)}</td>
        <td>{this._getFormStatus(rowItem)}</td>
        <td>{this._editOrReuseIcon(rowItem)}</td>
      </tr>
    ));
    return data;
  }

  _editOrReuseIcon(rowItem) {
    if (rowItem.published) {
      return (
        <Link to={{ pathname: `form-builder/${rowItem.uuid}` }}>
         <i>VIEW</i>
        </Link>
      );
    }
    return (
      <Link to={{ pathname: `form-builder/${rowItem.uuid}` }}>
        <i className="fa fa-pencil"></i>
      </Link>
    );
  }


  _getFormStatus(rowItem) {
    if (rowItem.published) {
      return 'Published';
    }
    return 'Draft';
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
