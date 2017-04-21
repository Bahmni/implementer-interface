import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { dateUtils } from 'common/utils/dateUtils';
import { Link } from 'react-router';
import { httpInterceptor } from '../../common/utils/httpInterceptor';
import { formBuilderConstants } from '../constants';
import fileDownload from 'react-file-download';
import NotificationContainer from 'common/Notification';
import { commonConstants } from '../../common/constants';

export default class FormList extends Component {

  constructor(props) {
    super(props);
    this.state = { notification: {} };
  }

  getRows() {
    const data = _.map(this.props.data, (rowItem, index) => (
      <tr key={rowItem.id}>
        <td><i className=" fa fa-file-text-o" />{rowItem.name}</td>
        <td>{rowItem.version}</td>
        <td>{dateUtils.getDateWithoutTime(rowItem.auditInfo.dateCreated)}</td>
        <td>{this._getFormStatus(rowItem)}</td>
        <td>
          <b className="edit-icon">{this._editOrReuseIcon(rowItem)} </b>
          <a hidden={!rowItem.published}
            onClick={() => this.downloadFile(index)}
          >Export</a>
        </td>
      </tr>
    ));
    return data;
  }

  setMessage(messageText, type) {
    const notification = { message: messageText, type };
    this.setState({ notification });

    setTimeout(() => {
      this.setState({ notification: {} });
    }, commonConstants.toastTimeout);
  }

  downloadFile(index) {
    const form = this.props.data[index];
    const params =
      'v=custom:(id,uuid,name,version,published,auditInfo,' +
      'resources:(value,dataType,uuid))';

    const fileName = `${form.name}_${form.version}`;
    httpInterceptor
      .get(`${formBuilderConstants.formUrl}/${form.uuid}?${params}`)
      .then((data) => {
        const value = JSON.parse(data.resources[0].value);
        fileDownload(JSON.stringify(value), `${fileName}.json`);
        this.setMessage('Export Successfully', commonConstants.responseType.success);
      })
      .catch(() => {
        this.setMessage('Export Failed', commonConstants.responseType.error);
      });
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
        <div>
          <NotificationContainer notification={this.state.notification} />
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
        </div>
    );
  }
}

FormList.propTypes = {
  data: PropTypes.array.isRequired,
};
