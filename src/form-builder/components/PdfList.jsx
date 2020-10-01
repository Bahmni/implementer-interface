import React, { Component } from 'react';
import fileDownload from 'react-file-download';
import { Link } from 'react-router-dom';

export default class FormList extends Component {
  constructor(props) {
    super(props);

    this.downloadFile = this.downloadFile.bind(this);
  }
  downloadFile() {
    fileDownload([this.props.downloadLink], `fileName.pdf`);

  }
  render() {
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Form Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>

            <tr >
              <td>{this.props.status}</td>
              <td>
                <button onClick={this.downloadFile}>Download</button>
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    );
  }
}