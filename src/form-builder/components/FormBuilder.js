import React, { Component } from 'react';

export default class FormBuilder extends Component {

  getClassName() {
    return 'heading';
  }

  render() {
    return (
      <div>
        <h1 className={this.getClassName()}>This is the form builder page</h1>
      </div>
    );
  }
}
