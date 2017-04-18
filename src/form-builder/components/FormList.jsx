import React, {Component, PropTypes} from 'react';
import _ from 'lodash';
import {dateUtils} from 'common/utils/dateUtils';
import {Link} from 'react-router';
import {httpInterceptor} from "../../common/utils/httpInterceptor";
import {formBuilderConstants} from "../constants";
import fileDownload from 'react-file-download';

export default class FormList extends Component {

  downloadFile(index) {
    const form = this.props.data[index];
    const params =
      'v=custom:(id,uuid,name,version,published,auditInfo,' +
      'resources:(value,dataType,uuid))';

    const fileName = `${form.name}_${form.version}`;
    httpInterceptor
      .get(`${formBuilderConstants.formUrl}/${form.uuid}?${params}`)
      .then((data) => {
        fileDownload(JSON.stringify(data), `${fileName}.json`);

      })
      .catch(() => {

      })
  }

  getRows() {
    const data = _.map(this.props.data, (rowItem, index) => (
      <tr key={rowItem.id}>
        <td><i className=" fa fa-file-text-o"/>{rowItem.name}</td>
        <td>{rowItem.version}</td>
        <td>{dateUtils.getDateWithoutTime(rowItem.auditInfo.dateCreated)}</td>
        <td>{this._getFormStatus(rowItem)}</td>
        <td className="edit-icon">{this._editOrReuseIcon(rowItem)}</td>
        <td><a hidden={!rowItem.published}
               onClick={(e) => this.downloadFile(index)}>Export</a></td>
      </tr>
    ));
    return data;
  }

  _editOrReuseIcon(rowItem) {
    if (rowItem.published) {
      return (
        <Link to={{pathname: `form-builder/${rowItem.uuid}`}}>
          <i className="fa fa-eye"></i>
        </Link>
      );
    }
    return (
      <Link to={{pathname: `form-builder/${rowItem.uuid}`}}>
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
            <th>Name</th>
            <th>Version</th>
            <th>Created On</th>
            <th>Status</th>
            <th>Action</th>
            <th>...</th>
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
