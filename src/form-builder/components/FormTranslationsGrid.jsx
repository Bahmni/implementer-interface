import React, { Component } from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import { FreeTextAutoComplete } from 'bahmni-form-controls';
import { updateTranslations } from 'form-builder/actions/control';
import { connect } from 'react-redux';


class FormTranslationsGrid extends Component {

  constructor(props) {
    super(props);
    this.state = { notification: {} };
    this.onChange = this.onChange.bind(this);
  }

  onChange(value, type, translationKey, locale) {
    const { dispatch } = this.props;
    dispatch(updateTranslations(Object.assign({}, value, { type, translationKey, locale })));
  }

  getRows(type) {
    const { data } = this.props.translationData;
    if (!data) {
      return [];
    }
    const defaultTranslation = data[0];
    return map(defaultTranslation[type], (value, key) => this._createRow(data, key, type));
  }

  _createRow(translations, key, type) {
    return (
      <tr key={key}>
        <td>{key}</td>
        {
          map(translations, (translation) =>
            <td key={`${key}_${translation.locale}`}>{this._displayFreeTextAutoComplete(
              translation[type][key], type, key, translation.locale)}</td>
          )
        }
      </tr>
    );
  }

  _displayFreeTextAutoComplete(options, type, key, locale) {
    const updateOptions = map(options, (option) => ({ label: option, value: option }));
    return (<FreeTextAutoComplete locale={locale} onChange={this.onChange} options={updateOptions}
      translationKey={key} type={type} value={updateOptions[0].value}
    />);
  }

  _getHeaders(headers) {
    return map(headers, (header) => <th key={header}>{header}</th>);
  }


  render() {
    return (
        <div className="translations-table-container">
          <table className="translations-table">
            <thead>
            <tr>
              {this._getHeaders(this.props.translationData.headers)}
            </tr>
            </thead>
            <tbody>{this.getRows('formNames')}</tbody>
            <tbody>{this.getRows('concepts')}</tbody>
            <tbody>{this.getRows('labels')}</tbody>
          </table>
        </div>
    );
  }
}

FormTranslationsGrid.propTypes = {
  dispatch: PropTypes.func,
  translationData: PropTypes.object.isRequired,
};

export default connect()(FormTranslationsGrid);
