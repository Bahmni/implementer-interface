
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
            defaultValue={this.state.script}
            onChange={(e) => {this.setState({ script: e.target.value });}}
          >
          </textarea>
          <div className="button-wrapper fr">
            <button className="button btn--highlight"
              onClick={() => this.props.updateScript(this.state.script)}
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
