import React from 'react';
import { Link } from 'react-router';

const Header = () =>
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
          </div>;

export default Header;
