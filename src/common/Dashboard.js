import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () =>
  <div>
    <div className="form-builder-link">
      <Link to="form-builder">
          <i className="fa fa-user-secret"></i>
          Form Builder
      </Link>
    </div>
  </div>;

export default Dashboard;
