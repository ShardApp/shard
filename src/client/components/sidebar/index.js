import React from 'react';
import Portal from 'react-portal';
import store$, {getChannels, setChannel} from '../../store';
import styles from './sidebar.css';

import Modal from '../modal';
import NewChannel from '../newchannel';

const Sidebar = React.createClass({
    getInitialState() {
        return {
            currentTeam: {},
            channels: [],
            showCreateChannel: false,
        };
    },

    componentWillMount() {
        this.subs = [
            store$
            .map(s => s.filter((_, key) => ['currentTeam', 'currentChannel', 'channels'].includes(key)))
            .map(s => s.toJS())
            .subscribe(s => this.setState(s)),
        ];

        getChannels();
    },
    componentWillUnmount() {
        this.subs.map(s => s.dispose());
    },

    closeCreateChannel(refetch = false) {
        this.setState({showCreateChannel: false});
        if (refetch) {
            getChannels();
        }
    },

    isCurrent(channel) {
        return this.state.currentChannel && this.state.currentChannel._id === channel._id;
    },

    render() {
        return (
            <aside className={styles.sidebar}>
                <div className={styles.header}>
                    <header>
                        {this.state.currentTeam.name || 'No team selected'}
                    </header>
                </div>

                {this.state.currentTeam.name && (
                    <div className={`menu dark-menu ${styles.channels}`}>
                        <p className="menu-label">
                            <a
                                className={styles.channelsHeader}
                                onClick={() => this.setState({showCreateChannel: true})}
                            >
                                Channels
                                <span className={styles.separator} />
                                <span className="icon is-small">
                                    <i className="fa fa-plus" />
                                </span>
                            </a>
                        </p>
                        <ul className="menu-list">
                            {this.state.channels.length === 0 && (
                                <li>
                                    No channels found! Add one?
                                </li>
                            )}
                            {this.state.channels.map(channel => (
                                <li>
                                    <a
                                        className={`channel-name ${this.isCurrent(channel) && 'is-active'}`}
                                        onClick={() => setChannel(channel)}
                                    >
                                        {channel.name}
                                    </a>
                                    <ul>
                                        {channel.subchannels && channel.subchannels.map(ch => (
                                            <li>
                                                <a className="channel-name">{ch.name}</a>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Modal for team creation */}
                <Portal closeOnEsc isOpened={this.state.showCreateChannel}>
                    <Modal closeAction={this.closeCreateChannel}>
                        <NewChannel close={this.closeCreateChannel} />
                    </Modal>
                </Portal>
            </aside>
        );
    },
});

export default Sidebar;
