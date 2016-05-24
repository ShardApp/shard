import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import {Subject} from 'rx';
import styles from './chat.css';

// components
import Description from '../description';
import Message from '../message/';
import ChatInput from '../chatInput';
import Dropdown from '../dropdown';

// store and actions
import store$, {initChat, closeChat, getChat, getHistory, sendChat, setInfobar, markRead} from '../../store';

// utils
import {reduceShortMessages} from '../../util';

export default class Chat extends React.Component {
    constructor(props) {
        super(props);

        this.unreadSubj = new Subject();
        this.state = {
            currentChannel: {},
            requestedForChannel: undefined,
            messages: [],
            history: [],
        };
    }

    componentWillMount() {
        this.subs = [
            // get initial data
            store$
            .map(s => s.filter((v, key) => ['history', 'currentTeam', 'currentChannel'].includes(key)))
            .distinctUntilChanged()
            .map(s => s.toJS())
            .do(s => this.initSocket(s))
            // map history
            .map(({history = [], ...rest}) => ({
                ...rest,
                allMessages: history.filter(s => s !== undefined)
                    .reduce(reduceShortMessages, [])
                    .map(({replies, ...message}) => ({
                        ...message,
                        replies: replies.reduce(reduceShortMessages, []),
                    })),
            }))
            // say we need to mark new unread
            .do(() => this.unreadSubj.onNext())
            // store to state
            .subscribe(s => this.setState(s)),

            // listen for new messages
            store$
            .map(s => s.get('messages'))
            .filter(s => s !== undefined)
            .distinctUntilChanged()
            .map(s => s.toJS())
            .subscribe(m => {
                const {allMessages: oldMessages} = this.state;
                // say we need to mark new unread
                this.unreadSubj.onNext();
                // if new message is not a reply - just fit it into allMessages
                if (!m.replyTo) {
                    const allMessages = reduceShortMessages(oldMessages, m);
                    this.setState({allMessages});
                    return;
                }

                // if it's a reply, find parent and add it there
                const allMessages = oldMessages.map(msg => {
                    if (msg.id !== m.replyTo) {
                        return msg;
                    }

                    return {
                        ...msg,
                        replies: reduceShortMessages(msg.replies, m),
                    };
                });

                this.setState({allMessages});
            }),

            // mark unread as read
            this.unreadSubj
            .debounce(3000)
            .subscribe(() => this.markUnread()),
        ];
    }
    componentDidUpdate() {
        this.scrollToBottom();
    }
    componentWillUnmount() {
        this.subs.map(s => s.dispose());
    }

    initSocket(s) {
        if (s.currentTeam && s.currentChannel) {
            // if already opened for this chat - ignore action
            if (this.state.requestedForChannel === (s.currentTeam.id + s.currentChannel.id)) {
                return;
            }

            // if another socket exists - close it
            if (this.state.requestedForChannel) {
                closeChat(this.state.requestedForChannel);
            }

            // construct request
            const params = {
                team: s.currentTeam.id,
                channel: s.currentChannel.id,
            };
            // init connection
            initChat(params);
            // get history
            getHistory(params);
            // setup listener
            getChat(params);
            // set flag to not repeat that
            this.setState({requestedForChannel: s.currentTeam.id + s.currentChannel.id});
        }
    }

    scrollToBottom() {
        const n = ReactDOM.findDOMNode(this.chatContainer);
        n.scrollTop = n.scrollHeight;
    }

    sendMessage() {
        const message = this._text.value;
        const team = this.state.currentTeam.id;
        const channel = this.state.currentChannel.id;
        sendChat({team, channel, message});
    }

    showMenu() {
        this.setState({showMenu: true});
    }
    handleMenuItem(item) {
        setInfobar(item);
    }
    closeMenu() {
        this.setState({showMenu: false});
    }

    markUnread() {
        const messages = _.flatten(this.state.allMessages.concat(this.state.allMessages.map(m => m.moreMessages)))
            .filter(msg => msg !== undefined)
            .filter(msg => msg.isNew)
            .map(msg => msg.id);
        const rep = _.flatten(this.state.allMessages.map(msg => msg.replies))
            .filter(msg => msg !== undefined);
        const replies = _.flatten(rep.concat(rep.map(m => m.moreMessages)))
            .filter(msg => msg !== undefined)
            .filter(msg => msg.isNew)
            .map(msg => msg.id);

        // only send requests if there are any new messages
        if (!messages.length && !replies.length) {
            return;
        }

        const team = this.state.currentTeam.id;
        const channel = this.state.currentChannel.id;
        markRead({team, channel, messages, replies});
    }

    render() {
        const menuItems = [{
            title: 'Description',
            content: <Description text={this.state.currentChannel.description || ''} />,
        }];

        return (
            <div className={`column is-flex ${styles.mainarea}`}>
                <nav className={`navbar is-flex ${styles.navbar}`}>
                    <div className="navbar-item">
                        <p className={`title channel-name is-flex ${styles.title}`}>
                            {this.state.currentChannel.name || 'No channel selected'}
                        </p>
                    </div>

                    <div className={styles.navSpacer} />

                    <div className={`navbar-item is-flex ${styles.navMenu}`}>
                        <a className="card-header-icon" onClick={() => this.showMenu()}>
                            <i className="fa fa-angle-down" />
                        </a>
                    </div>

                    {this.state.showMenu && (
                        <Dropdown
                            style={{top: 50, right: 5}}
                            title="Channel"
                            items={menuItems}
                            onItem={it => this.handleMenuItem(it)}
                            onHide={() => this.closeMenu()}
                        />
                    )}
                </nav>

                <div ref={c => { this.chatContainer = c; }} className={styles.section}>
                    {this.state.allMessages && this.state.allMessages.length === 0 && 'No messages yet!'}
                    {this.state.allMessages && this.state.allMessages.map(m => (
                        <Message key={m.id} {...m} />
                    ))}
                </div>
                <div className={styles.footer}>
                    <ChatInput {...this.state} />
                </div>
            </div>
        );
    }
}
