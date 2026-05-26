/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AutoComplete } from 'bahmni-form-controls';
import { formBuilderConstants as constants } from 'form-builder/constants';
import { connect } from 'react-redux';
import { selectSource, setChangedProperty } from 'form-builder/actions/control';
import { httpInterceptor } from 'common/utils/httpInterceptor';
import { commonConstants } from 'common/constants';
import { UrlHelper } from 'form-builder/helpers/UrlHelper';
import filter from 'lodash/filter';
import { useState } from 'react';

export class FormPrivilegesContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formPrivileges: {},
    };
  }

  componentWillUpdate(newProps) {
  }
  updateProperty() {
    let properties = { [this.props.eventProperty]: true };
    if (this.props.onEventLoad) {
      try {
        this.props.onEventLoad();
      } catch (e) {
        properties = { [this.props.eventProperty]: false };
      }
    }
    this.props.dispatch(setChangedProperty(properties));
  }
  render() {
    const name = this.props.label;
    return (
      <div className="form-privileges-container">
        <label>{'Manage Privileges'}</label>
        <button onClick={() => this.updateProperty()}>
          <i aria-hidden="true" className="fa fa-code" />
        </button>
      </div>
    );
  }
}

FormPrivilegesContainer.propTypes = {
  formPrivileges: PropTypes.Array,
  dispatch: PropTypes.func,
  onEventLoad: PropTypes.func,
  eventProperty: PropTypes.string,
  formPrivilege: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    isEditable: PropTypes.bool,
    isViewable: PropTypes.bool,
  }),
};

const mapStateToProps = (state) => ({
  formPrivileges: state.formPrivileges,
});
export default connect(mapStateToProps)(FormPrivilegesContainer);
