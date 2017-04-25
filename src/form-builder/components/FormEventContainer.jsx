import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {setChangedProperty} from "../actions/control";

class FormEventContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {events: {}};
  }

  componentWillUpdate(newProps) {
    if (newProps.events && this.state.events !== newProps.events) {
      this.setState({ events: newProps.events });
      this.props.updateFormEvents(newProps.events);
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
  events: PropTypes.object,
  updateFormEvents: PropTypes.func,
};

const mapStateToProps = (state) => ({
  events: state.formDetails.events,
});

export default connect(mapStateToProps)(FormEventContainer);



