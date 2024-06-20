import React from 'react';
import { Link } from 'react-router-dom';
import FormBuilderHeader from 'form-builder/components/FormBuilderHeader.jsx';

const Dashboard = () =>
  <div>
    <FormBuilderHeader />
    <div className="form-builder-link">
      <Link to="form-builder">
          <i className="fa fa-user-secret"></i>
          Form Builder
      </Link>
      <Link to="form-printer">
          <i className="fa fa-user-secret"></i>
          Print Form
      </Link>
    </div>
  </div>;

export default Dashboard;
