/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React from 'react';

const Header = () =>
  <div>
    <div className="header-wrap">
      <header className="header">
        <nav className="nav">
          <ul>
            <li>
              <a className="back-btn" href="/bahmni/home">
                <i className="fa fa-home"></i>
              </a>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  </div>;

export default Header;
