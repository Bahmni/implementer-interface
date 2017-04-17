import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { dateUtils } from 'common/utils/dateUtils';
import { Link } from 'react-router';

export default class FormList extends Component {

  constructor(props) {
    super(props);
    this.state = { selectAll: false };
  }

  getRows() {
    const data = _.map(this.props.data, (rowItem, index) => (
      <tr key={rowItem.id}>
        <td><input type="checkbox" disabled={!rowItem.published}
          checked={rowItem.checked}
          onClick={(e) => this.isChecked(e.target.checked, index)}
        /></td>
        <td><i className=" fa fa-file-text-o" />{rowItem.name}</td>
        <td>{rowItem.version}</td>
        <td>{dateUtils.getDateWithoutTime(rowItem.auditInfo.dateCreated)}</td>
        <td>{this._getFormStatus(rowItem)}</td>
        <td className="edit-icon">{this._editOrReuseIcon(rowItem)}</td>
      </tr>
    ));
    return data;
  }

  isChecked(checked, index) {
    if (this.props.isChecked) {
      this.props.isChecked(checked, index);
    }
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

  onSelectAll() {
    const isSelectAll = !this.state.selectAll;
    this.props.data.forEach((item, index) => {
      if (item.published) {
        this.isChecked(isSelectAll, index);
      }
    });
    this.setState({ selectAll: isSelectAll });
  }

  render() {
    return (this.props.data.length === 0 ? <p className="placeholder-text">No Forms to Display</p> :
      <table>
        <thead>
        <tr>
          <th><input type="checkbox" onClick={() => (this.onSelectAll())} /></th>
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
  isChecked: PropTypes.func,
};
