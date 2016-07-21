import React from 'react';
import { Link } from 'react-router';

export default class Dashboard extends React.Component {
  render() {
    return (
      <div>
        <div className="form-builder-link">
          <Link to="form-builder">Form Builder</Link>
        </div>
      </div>
    );
  }
}
