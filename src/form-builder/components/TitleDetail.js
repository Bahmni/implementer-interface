import React, {Component, PropTypes} from 'react';
import {commonConstants} from 'common/constants';
import NotificationContainer from 'common/Notification';
import classNames from 'classnames';


export default class TitleDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {isEditable: false, red: false, notification: {}};
        this.input = props.value;
    }

    onKeyUp(e) {
        if (e.keyCode === 13) {
            this.updateValue();
        }
    }

    updateValue() {
        this.props.updateValue(this.input);
        this.setState({isEditable: false});
    }

    validateName(value) {
        if (value.length >= 50) {
            this.setState({red: true})
            this.setErrorMessage('Form name shall not exceed 50 characters');
        } else {
            this.setState({red: false})
        }
    }

    setErrorMessage(errorMessage) {
        const errorNotification = {message: errorMessage, type: commonConstants.responseType.error};
        this.setState({notification: errorNotification});
        setTimeout(() => {
            this.setState({notification: {}});
        }, commonConstants.toastTimeout);
    }

    setFormName(formName) {
        this.input = formName;
        this.validateName(formName);
    }

    render() {
        if (this.state.isEditable) {
            return (
                <div>
                    <NotificationContainer
                        notification={this.state.notification}
                    />
                    <input
                        className={ classNames({'is-red': this.state.red})}
                        defaultValue={this.props.value}
                        onBlur={() => this.updateValue()}
                        onChange={(e) => this.setFormName(e.target.value)}
                        onKeyUp={(e) => this.onKeyUp(e)}
                        type="text"
                        maxLength="50"
                        onKeyDown={(e) => this.validateName(e.target.value)}
                    />
                </div>
            );
        }
        return (
            <label onDoubleClick={() => (this.setState({isEditable: true}))}>
                {this.props.value}
            </label>
        );
    }
}

TitleDetail.propTypes = {
    updateValue: PropTypes.func,
    value: PropTypes.string.isRequired,
};

