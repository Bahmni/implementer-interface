import React from 'react';
import PropTypes from 'prop-types';
const App = ({ children }) => <div id="container">{children}</div>;

App.propTypes = {
  children: PropTypes.object.isRequired,
};

export default App;
