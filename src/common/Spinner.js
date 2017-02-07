import React, { PropTypes } from 'react';

const Spinner = (props) => {
  if (props.show) {
    return (<div className="overlay"></div>);
  }
  return (<div></div>);
};

Spinner.propTypes = {
  show: PropTypes.bool.isRequired,
};

export default Spinner;
