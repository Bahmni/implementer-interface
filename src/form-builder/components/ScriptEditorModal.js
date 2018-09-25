import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NotificationContainer from 'common/Notification';
import { commonConstants } from 'common/constants';


export default class ScriptEditorModal extends Component {
  constructor(props) {
    super(props);
    this.validateScript = this.validateScript.bind(this);
    this.state = { script: this.props.script, notification: {} };
  }

  validateScript() {
    try {
      const script = this.state.script.trim();
      /* eslint-disable no-eval*/
      if (script.trim().length > 0) eval(`(${script})`);
      this.props.updateScript(script);
    } catch (ex) {
      const errorNotification = {
        message: 'Please Enter valid javascript function',
        type: commonConstants.responseType.error,
      };
      this.setState({ notification: errorNotification });

      setTimeout(() => {
        this.setState({ notification: {} });
      }, commonConstants.toastTimeout);
    }
  }


  render() {
    return (
      <div>
        <NotificationContainer
          notification={this.state.notification}
        />
        <div className="dialog-wrapper"></div>
        <div className="dialog area-height--dialog">
          <h2 className="header-title">Editor</h2>
          <textarea autoFocus className="editor-wrapper area-height--textarea"
            defaultValue={this.state.script}
            onChange={(e) => {this.setState({ script: e.target.value });}}
          >
          </textarea>
          <div className="button-wrapper fr">
            <button className="button btn--highlight"
              onClick={() => this.validateScript(this.state.script)}
              type="submit"
            >
              Save
            </button>
            <button className="btn"
              onClick={() => this.props.close()}
              type="reset"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
}

ScriptEditorModal.propTypes = {
  close: PropTypes.func.isRequired,
  script: PropTypes.string,
  updateScript: PropTypes.func.isRequired,
};

ScriptEditorModal.defaultProps = {
  script: '',
};
