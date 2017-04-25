import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {setChangedProperty} from "../actions/control";

class FormEventContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {events: {}};
  }

  componentWillUpdate(newProps) {
    const updatedEvents = newProps.formDetails && newProps.formDetails.events;
    if (updatedEvents && this.state.events !== updatedEvents) {
      this.setState({ events: updatedEvents });
      this.props.updateFormEvents(updatedEvents);
    }
  }

  updateProperty() {
    const properties = {'formEvent' : true};
    this.props.dispatch(setChangedProperty(properties));
  }

  render() {
    const name = 'Form Event';
    return (
      <div className="section-grid">
        <label>{name}</label>
        <button onClick={() => this.updateProperty()}>Editor</button>
      </div>
    );
  }
}

FormEventContainer.propTypes = {
  dispatch: PropTypes.func,
  formDetails: PropTypes.object,
  updateFormEvents: PropTypes.func,
};

const mapStateToProps = (state) => ({
  formDetails: state.formDetails,
});

export default connect(mapStateToProps)(FormEventContainer);



