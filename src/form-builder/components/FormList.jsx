import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { dateUtils } from 'common/utils/dateUtils';
import { Link } from 'react-router';

export default class FormList extends Component {

  getRows() {
    const data = _.map(this.props.data, (rowItem) => (
      <tr key={rowItem.id}>
        <td><input type="checkbox"></input></td>
        <td><i className=" fa fa-file-text-o" />{rowItem.name}</td>
        <td>{rowItem.version}</td>
        <td>{dateUtils.getDateWithoutTime(rowItem.auditInfo.dateCreated)}</td>
        <td>{this._getFormStatus(rowItem)}</td>
        <td className="edit-icon">{this._editOrReuseIcon(rowItem)}</td>
      </tr>
    ));
    return data;
  }

  _editOrReuseIcon(rowItem) {
    if (rowItem.published) {
      return (
        <Link to={{ pathname: `form-builder/${rowItem.uuid}` }}>
            <i className="fa fa-eye"></i>
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
    return (this.props.data.length === 0 ? <p className="placeholder-text">No Forms to Display</p> :
      <table>
        <thead>
        <tr>
          <th><input type="checkbox" disabled="true"></input></th>
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
