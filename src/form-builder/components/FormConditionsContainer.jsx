import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setChangedProperty } from '../actions/control';

export class FormConditionsContainer extends Component {

  constructor(props) {
    super(props);
    this.state = { events: {} };
  }

  componentWillUpdate(newProps) {
    const updatedEvents = newProps.formDetails && newProps.formDetails.events;
    if (updatedEvents && this.state.events !== updatedEvents) {
      this.setState({ events: updatedEvents });
      this.props.updateFormEvents(updatedEvents);
    }
  }

  updateProperty() {
    const properties = { [this.props.eventProperty]: true, formTitle: this.props.formTitle };
    this.props.dispatch(setChangedProperty(properties));
  }

  render() {
    return (
      <div className="form-controls-container">
        <label>{this.props.label}</label>
        <button onClick={() => this.updateProperty()}>
          <i aria-hidden="true" className="fa fa-code" />
        </button>
      </div>
    );
  }
}

FormConditionsContainer.propTypes = {
  dispatch: PropTypes.func,
  eventProperty: PropTypes.string,
  formDetails: PropTypes.object,
  formTitle: PropTypes.string,
  label: PropTypes.string,
  updateFormEvents: PropTypes.func,
};

const mapStateToProps = (state) => ({
  formDetails: state.formDetails,
});

export default connect(mapStateToProps)(FormConditionsContainer);
