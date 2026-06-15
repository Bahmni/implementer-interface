import React from 'react';
import { bahmniHomePath } from '../../common/constants';

const Header = () => {
  const homeUrl = (typeof localStorage !== 'undefined' && localStorage.getItem('homeUrl'))
    || bahmniHomePath;
  return (
    <div>
      <div className="header-wrap">
        <header className="header">
          <nav className="nav">
            <ul>
              <li>
                <a className="back-btn" href={homeUrl}>
                  <i className="fa fa-home"></i>
                </a>
              </li>
            </ul>
          </nav>
        </header>
      </div>
    </div>
  );
};

export default Header;
