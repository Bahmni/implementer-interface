import React, { PropTypes } from 'react';

const App = ({ children }) => <div id="container">{children}</div>;

App.propTypes = {
  children: PropTypes.object.isRequired,
};

export default App;
