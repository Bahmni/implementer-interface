import React, { Component } from 'react';
import { Router, Route, Link, browserHistory } from 'react-router';

class Header extends Component{
  render(){
      return(
          <div>
              <div className="header-wrap">
                  <header className="header">
                      <nav className="nav">
                          <ul>
                              <li><Link to="formBuilder">FORM BUILDER</Link></li>
                              <li><Link to="FormList">My Forms</Link></li>
                              <li><Link to="form-builder">Templates</Link></li>
                          </ul>
                      </nav>
                  </header>
              </div>
              
          </div>
      );
  }
}

export default Header;