import React from 'react';
import Portal from 'react-portal';
import shallowCompare from 'react-addons-shallow-compare';
// import {browserHistory} from 'react-router';
import styles from './userbar.css';

// components
import Modal from '../modal';
import Changelog from '../changelog';
import Notifications from '../notifications';

// store and actions
// import store$, {getChannels, setChannel, resetNewChannel} from '../../store';

// util
import {logout} from '../../util';

export default class Userbar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: localStorage.getItem('user'),
            showChangelog: false,
            showNotifications: false,
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    render() {
        return (
            <div className={`is-flex ${styles.userbar}`}>
                <div className={`is-flex ${styles.buttons}`}>
                    <a className="button is-black is-small" onClick={() => logout()}>
                        Logout
                    </a>
                    <span className="is-spacer" />
                    <a
                        className="button is-black is-small"
                        onClick={() => this.setState({showNotifications: true})}
                    >
                        Notifications
                    </a>
                </div>
                <div className="is-flex">
                    <a
                        className={`button is-small is-link ${styles.textLink}`}
                        onClick={() => this.setState({showChangelog: true})}
                    >
                        Changelog
                    </a>
                </div>

                {/* Modal for team edit */}
                {this.state.showChangelog && (
                    <Portal closeOnEsc onClose={() => this.setState({showChangelog: false})} isOpened>
                        <Modal closeAction={() => this.setState({showChangelog: false})}>
                            <Changelog />
                        </Modal>
                    </Portal>
                )}

                {/* Modal for notifications */}
                {this.state.showNotifications && (
                    <Portal closeOnEsc onClose={() => this.setState({showNotifications: false})} isOpened>
                        <Modal closeAction={() => this.setState({showNotifications: false})}>
                            <Notifications />
                        </Modal>
                    </Portal>
                )}
            </div>
        );
    }
}
