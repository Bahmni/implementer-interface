import React, { Component, PropTypes } from 'react';
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

  onChange(value, type, translationKey) {
    const { dispatch, translationData } = this.props;
    dispatch(updateTranslations(Object.assign({}, value, { type },
      { translationKey }, { locale: translationData.locale })));
  }

  getRows(type) {
    const { translationData } = this.props;

    return map(translationData[type], (rowItem, key) => (
      <tr key={key}>
        <td>{key}</td>
        <td>{this._displayFreeTextAutoComplete(rowItem, type, key)}</td>
      </tr>
    ));
  }

  _displayFreeTextAutoComplete(options, type, key) {
    const updateOptions = map(options, (option) => ({ label: option, value: option }));
    return (<FreeTextAutoComplete onChange={this.onChange} options={updateOptions}
      translationKey={key} type={type} value={updateOptions[0].value}
    />);
  }

  render() {
    return (
        <div>
          <table>
            <thead>
            <tr>
              <th>Translations Key</th>
              <th>Default Value</th>
            </tr>
            </thead>
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
