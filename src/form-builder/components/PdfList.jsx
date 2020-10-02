import React, { Component } from 'react';

export default class FormList extends Component {
  constructor(props) {
    super(props);

    this.downloadFile = this.downloadFile.bind(this);
  }
  downloadFile(){
    window.open(this.props.downloadLink);
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
                <button onClick={this.downloadFile} disabled={this.props.status!='Completed'} >Download</button>
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    );
  }
}
