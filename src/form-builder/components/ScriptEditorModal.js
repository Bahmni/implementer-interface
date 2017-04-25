
import React, { Component, PropTypes } from 'react';

export default class ScriptEditorModal extends Component {
  constructor(props) {
    super(props);
    this.state = { script: this.props.script };
  }

  render() {
    return (
      <div>
        <div className="dialog-wrapper"></div>
        <div className="dialog">
          <h2 className="header-title">Editor</h2>
          <textarea autoFocus className="editor-wrapper"
            onChange={(e) => {this.setState({ script: e.target.value });}}
            defaultValue={this.state.script}
          >
            </textarea>
          <div className="button-wrapper fr">
            <button className="button btn--highlight"
              type="submit"
              onClick={() => this.props.updateScript(this.state.script)}
            >
              Save
            </button>
            <button className="btn" type="reset"
              onClick={() => this.props.close()}
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
  script: PropTypes.string,
  updateScript: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

ScriptEditorModal.defaultProps = {
  script: '',
};
