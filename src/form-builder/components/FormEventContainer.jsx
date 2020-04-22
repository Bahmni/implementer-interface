import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setChangedProperty } from '../actions/control';

export class FormEventContainer extends Component {

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
      <div className="form-event-container">
        <label>{name}</label>
        <button onClick={() => this.updateProperty()}>
          <i aria-hidden="true" className="fa fa-code" />
        </button>
      </div>
    );
  }
}

FormEventContainer.propTypes = {
  dispatch: PropTypes.func,
  eventProperty: PropTypes.string,
  formDetails: PropTypes.object,
  label: PropTypes.string,
  onEventLoad: PropTypes.func,
  updateFormEvents: PropTypes.func,
};

const mapStateToProps = (state) => ({
  formDetails: state.formDetails,
});

export default connect(mapStateToProps)(FormEventContainer);

