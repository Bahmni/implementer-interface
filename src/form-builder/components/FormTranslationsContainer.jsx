import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { httpInterceptor } from 'common/utils/httpInterceptor';
import NotificationContainer from 'common/Notification';
import Spinner from 'common/Spinner';
import FormBuilderHeader from 'form-builder/components/FormBuilderHeader.jsx';
import FormBuilderBreadcrumbs from 'form-builder/components/FormBuilderBreadcrumbs.jsx';
import { formBuilderConstants } from 'form-builder/constants';
import FormTranslationsGrid from 'form-builder/components/FormTranslationsGrid.jsx';
import { connect } from 'react-redux';
import {
  clearTranslations, removeLocaleTranslation, updateTranslations,
}
  from 'form-builder/actions/control';
import forEach from 'lodash/forEach';
import map from 'lodash/map';
import omit from 'lodash/omit';
import { commonConstants } from 'common/constants';
import {
  getFormNameTranslations,
  saveFormNameTranslations,
  saveTranslations,
  translationsFor,
} from 'common/apis/formTranslationApi';
import { each } from 'lodash';


class FormTranslationsContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      translationData: {},
      notification: {},
      httpReceived: false, loading: true,
      originalFormName: undefined,
      allowedLocales: [],
    };
    this.name = undefined;
    this.version = undefined;
    this.selectedLocale = undefined;
    this.formNameTranslations = undefined;
    this._updateStore = this._updateStore.bind(this);
    this._saveTranslations = this._saveTranslations.bind(this);
    this._createTranslationReqObject = this._createTranslationReqObject.bind(this);
    this._createNameTranslationReqObject = this._createNameTranslationReqObject.bind(this);
    this._getFormNameTranslationsPromise = this._getFormNameTranslationsPromise.bind(this);
    this._generateFormNameTranslationPayload = this._generateFormNameTranslationPayload.bind(this);
    this._getTranslations = this._getTranslations.bind(this);
    this._generateTranslation = this._generateTranslation.bind(this);
    props.dispatch(clearTranslations());
  }

  componentDidMount() {
    const params = 'v=custom:(id,uuid,name,version)';
    this._getAllowedLocales().then((localeInfo) => {
      const { locales } = localeInfo;
      const allowedLocales = {};
      forEach(locales, (locale) => {
        allowedLocales[locale.code] = locale.nativeName;
      });
      this.setState({ allowedLocales });
      httpInterceptor
        .get(`${formBuilderConstants.formUrl}/${this.props.match.params.formUuid}?${params}`)
        .then((data) => {
          const { name, version } = data;
          this.name = name;
          this.version = version;
          const locale = localStorage.getItem('openmrsDefaultLocale');
          this._getTranslations(name, version, locale, this.props.match.params.formUuid);
        }).catch(() => {
          this.setMessage('Failed to fetch form information', commonConstants.responseType.error);
        });
    }).catch(() => {
      this.setMessage('Failed to fetch locales information', commonConstants.responseType.error);
    });
  }

  setMessage(message, type) {
    const errorNotification = { message, type };
    this.setState({ notification: errorNotification, loading: false });
    setTimeout(() => {
      this.setState({ notification: {} });
    }, commonConstants.toastTimeout);
  }


  _getTranslations(name, version, locale, uuid) {
    this.setState({ loading: true });
    const getFormNameTranslationsPromise = this._getFormNameTranslationsPromise(name, uuid);
    const getFormTranslationsPromise = translationsFor(name, version, locale, uuid);

    Promise.all([getFormTranslationsPromise, getFormNameTranslationsPromise])
      .then(translationsResponse => {
        const formNameTranslationResponse = translationsResponse[1];
        const formTranslationResponse = translationsResponse[0];
        if (formNameTranslationResponse) {
          this.formNameTranslations = formNameTranslationResponse;
          const nameTranslationJSON = JSON.parse(formNameTranslationResponse.toString());
          const nameTranslation = nameTranslationJSON.find(nameTranslationObj =>
            locale === nameTranslationObj.locale);
          formTranslationResponse.formNames = {
            FORM_NAME: [nameTranslation && nameTranslation.display || name],
          };
        } else {
          formTranslationResponse.formNames = { FORM_NAME: [name] };
        }
        this._createInitialValue(formTranslationResponse, locale);
        const { allowedLocales } = this.state;
        const data = this._getTranslationsInfo(locale, formTranslationResponse, allowedLocales);
        this.setState({ translationData: data, loading: false });
      }).catch(() => {
        const { allowedLocales } = this.state;
        this.setMessage('Failed to fetch translation for [' +
        `${allowedLocales[locale] || locale}] locale`, commonConstants.responseType.error);
      });
  }

  _getFormNameTranslationsPromise(name, uuid) {
    return this.formNameTranslations
      ? Promise.resolve(this.formNameTranslations)
      : getFormNameTranslations(name, uuid);
  }

  _getTranslationsInfo(locale, selectedTranslations, allowedLocales) {
    const defaultLocale = localStorage.getItem('openmrsDefaultLocale');
    const headers = this._getHeaders(allowedLocales, locale, defaultLocale);
    const { translationData } = this.state;
    const data = this._getTranslationsData(translationData.data,
      locale, defaultLocale, selectedTranslations);
    return Object.assign({}, { headers, data });
  }

  _getTranslationsData(translationData, locale, defaultLocale, selectedTranslations) {
    let defaultTranslation = translationData && translationData.length ?
      translationData[0] : null;
    defaultTranslation = (defaultTranslation && defaultLocale !== locale) ?
      defaultTranslation : null;

    return defaultTranslation ? [defaultTranslation, selectedTranslations] : [selectedTranslations];
  }

  _getHeaders(allowedLocales, locale, defaultLocale) {
    const headers = ['Translation Key'];
    headers.push(`Default Locale (${allowedLocales[defaultLocale]})`);

    if (defaultLocale !== locale) {
      headers.push(allowedLocales[locale]);
    }
    return headers;
  }

  _createInitialValue(translations, locale) {
    this._updateStore(translations, 'concepts', locale);
    this._updateStore(translations, 'labels', locale);
    this._updateStore(translations, 'formNames', locale);
  }


  _updateStore(translations, type, locale) {
    forEach(translations[type], (values, key) => {
      this.props.dispatch(updateTranslations(Object.assign({}, {
        value: values[0], type,
        translationKey: key, locale,
      })));
    });
  }

  _getAllowedLocales() {
    return httpInterceptor
      .get(formBuilderConstants.allowedLocalesUrl);
  }

  _showSaveButton() {
    return (
      <button
        className="fr save-button btn--highlight" id="save-translations-button"
        onClick={this._saveTranslations}
      >Save</button>
    );
  }

  _saveTranslations() {
    this.setState({ loading: true });
    const { translations } = this.props;
    saveFormNameTranslations(this._createNameTranslationReqObject(translations)).then(() => {
      this.formNameTranslations = undefined;
      this.setState({ loading: true });
      this._getFormNameTranslationsPromise(this.name, this.props.match.params.formUuid)
        .then(resp => {
          this.formNameTranslations = resp;
          const nameTranslationJSON = JSON.parse(resp.toString());
          if (nameTranslationJSON) {
            const updatedTranslationsData = map(this.state.translationData.data, translationObj => {
              const translation = Object.assign({}, translationObj);
              const nameTranslation = nameTranslationJSON.find(nameTranslationObj =>
                translation.locale === nameTranslationObj.locale
              );
              if (nameTranslation) {
                translation.formNames.FORM_NAME[0] = nameTranslation.display;
              }
              return translation;
            });
            this.setState({
              translationsData: {
                headers: this.state.translationData.headers,
                data: updatedTranslationsData,
              },
            });
          }
        }).catch(() => {
        }).finally(() => {
          this.setState({ loading: false });
        });
    });

    saveTranslations(this._createTranslationReqObject(translations)).then(() => {
      const message = 'Form translations saved successfully';
      this.setMessage(message, commonConstants.responseType.success);
      this.setState({ loading: false });
    }).catch(() => {
      this.setErrorMessage('Failed to save translations');
      this.setState({ loading: false });
    });
  }

  _createNameTranslationReqObject(translations) {
    const formNameTranslations = this._generateFormNameTranslationPayload(translations);
    return {
      form: { name: this.name, uuid: this.props.match.params.formUuid },
      value: JSON.stringify(formNameTranslations),
    };
  }

  _generateFormNameTranslationPayload(translations) {
    const formNameTranslationsObj = {};
    each(translations, (localeTranslation, locale) => {
      formNameTranslationsObj[locale] = localeTranslation.formNames.FORM_NAME;
    });
    if (this.formNameTranslations) {
      const existingTranslations = JSON.parse(this.formNameTranslations);
      each(existingTranslations, translation => {
        if (!formNameTranslationsObj[translation.locale]) {
          formNameTranslationsObj[translation.locale] = translation.display;
        }
      });
    }

    const formNameTranslationsList = [];
    each(formNameTranslationsObj, (display, locale) => {
      formNameTranslationsList.push({ display, locale });
    });
    return formNameTranslationsList;
  }

  _createTranslationReqObject(translations) {
    const { name, version } = this;
    const translationObj = [];
    each(translations, (localeTranslation, locale) => {
      const localeTranslationCopy = Object.assign(Object.assign({}, localeTranslation), {
        formName: name,
        formUuid: this.props.match.params.formUuid,
        version, locale,
      });
      delete localeTranslationCopy.formNames;
      translationObj.push(localeTranslationCopy);
    });
    return translationObj;
  }

  _generateTranslation(element) {
    this.props.dispatch(removeLocaleTranslation(this.selectedLocale));
    this.selectedLocale = element.target.value;
    this._getTranslations(this.name, this.version, this.selectedLocale,
      this.props.match.params.formUuid);
  }

  _createLocaleOptions(allowedLocales) {
    const defaultLocale = localStorage.getItem('openmrsDefaultLocale');
    const locales = omit(allowedLocales, defaultLocale);
    return (
      <div className="locale-selector">
        <label>Locale</label>
        <select
          onChange={this._generateTranslation}
        >
          <option key={defaultLocale} value={defaultLocale}>{allowedLocales[defaultLocale]}</option>
          {
            map(locales, (nativeName, code) =>
              <option key={code} value={code}>{nativeName}</option>
            )
          }
        </select>
      </div>);
  }

  render() {
    const { translationData } = this.state;
    return (<div>
      <Spinner show={this.state.loading} />
      <NotificationContainer
        notification={this.state.notification}
      />
      <FormBuilderHeader />
      <div className="breadcrumb-wrap">
        <div className="breadcrumb-inner">
          <div className="fl">
            <FormBuilderBreadcrumbs match={this.props.match} routes={this.props.routes} />
          </div>
          <div className="fr">
            {this._showSaveButton()}
          </div>
          <div id="locale-options">
            {this._createLocaleOptions(this.state.allowedLocales)}</div>
        </div>
      </div>
      <div className="container-content-wrap">
        <div className="info-view-mode-wrap">
          <div className="info-view-mode">
            <i className="fa fa-info-circle fl"></i>
            <span className="info-message">
             Please save the changes before selecting a locale.
            </span>
          </div>
        </div>
        <FormTranslationsGrid translationData={translationData} />
      </div>
    </div>);
  }
}

FormTranslationsContainer.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    isExact: PropTypes.bool.isRequired,
    params: PropTypes.object,
  }),
  routes: PropTypes.array,
  translations: PropTypes.object,
};

const mapStateToProps = (state) => ({
  translations: state.translations,
});

export default connect(mapStateToProps)(FormTranslationsContainer);
