import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const Form = ({ formData }) =>
  <div>
    <Link to="form-builder">My Forms</Link>
    <div className="name">{formData.name}</div>
    <div className="version">{formData.version}</div>
  </div>;

Form.propTypes = {
  formData: PropTypes.object,
};

export default Form;
