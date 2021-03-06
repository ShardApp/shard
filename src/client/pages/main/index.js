import _ from 'lodash';
import React from 'react';
import Dock from 'react-dock';
import styles from './main.css';

// components
import Teambar from '../../components/teambar';
import Sidebar from '../../components/sidebar';
import ChatHeader from '../../components/chatHeader';
import Chat from '../../components/chat';
import ChatInput from '../../components/chatInput';
import Infobar from '../../components/infobar';
import CommandPalette from '../../components/commandpalette';
import HotkeyHelp from '../../components/hotkeyhelp';
import MarkdownHelp from '../../components/markdownhelp';

// store and actions
import store$, {setTeam, getUpdates} from '../../store';

// utils
import {meTeam} from '../../util';

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        const {channel, team} = props.params || {};

        const storedWidth = localStorage.getItem('shard.infobar.dock.width');
        const dockWidth = storedWidth ? parseFloat(storedWidth) : 0.3;

        this.state = {
            channel,
            team,
            dockWidth,
            teams: [],
            channels: [],
        };
    }

    componentWillMount() {
        this.subs = [
            store$
            .map(s => s.filter((v, key) => [
                'teams',
                'channels',
                'currentTeam',
                'currentChannel',
                'infobar',
                'infobarType',
                'infobarShow',
            ].includes(key)))
            .distinctUntilChanged()
            .map(s => s.toJS())
            .subscribe(s => this.setState(s)),
        ];

        getUpdates();
    }

    componentDidMount() {
        setTimeout(() => this.updateTeamChannel(), 50);
    }

    componentWillReceiveProps({params}) {
        const {channel, team} = params || {};
        // only update if needed
        if (channel !== this.state.channel || team !== this.state.team) {
            this.setState({channel, team});
        }
    }

    componentDidUpdate() {
        setTimeout(() => this.updateTeamChannel(), 50);
    }

    componentWillUnmount() {
        this.subs.map(s => s.dispose());
    }

    updateTeamChannel() {
        // set team if needed
        const currentTeam = this.state.teams.concat([meTeam])
            .find(t => _.camelCase(t.name) === this.state.team);
        if (currentTeam && (!this.state.currentTeam || currentTeam.id !== this.state.currentTeam.id)) {
            setTeam(currentTeam);
        }
    }

    handleDockResize(size) {
        // persist value for user
        localStorage.setItem('shard.infobar.dock.width', size);
    }

    render() {
        const {channel, infobarType, infobarShow} = this.state;

        return (
            <div className={styles.app}>
                {/* COL1: Teambar with teams */}
                <Teambar />
                {/* COL2: Sidebar with channels, team menu, user info */}
                <Sidebar joinChannel={channel} />
                {/* COL3: Chat header, chat messages, inline infobar and chat input */}
                <div className={`column is-flex ${styles.mainarea}`}>
                    <ChatHeader />
                    <div className={`column is-flex ${styles.section}`}>
                        <Chat />
                        {infobarType === 'sidebar' && <Infobar />}
                    </div>
                    <ChatInput />
                </div>
                {/* OVERLAY: infobar using overlay */}
                {infobarType === 'dock' && (
                    <Dock
                        defaultSize={this.state.dockWidth}
                        position="right"
                        isVisible={infobarShow}
                        onSizeChange={e => this.handleDockResize(e)}
                    >
                        <Infobar />
                    </Dock>
                )}
                {/* OVERLAY: comman palette */}
                <CommandPalette />
                {/* OVERLAY: hotkey help screen */}
                <HotkeyHelp />
                {/* OVERLAY: markdown help screen */}
                <MarkdownHelp />
            </div>
        );
    }
}
