import React from 'react';
import styles from './joinchannel.css';
import {markdown} from '../../util';
import store$, {joinChannel} from '../../store';

export default class JoinChannel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            publicChannels: [],
            filterText: '',
            error: undefined,
        };
    }

    componentWillMount() {
        this.subs = [
            store$
            .map(s => s.filter((_, key) => ['publicChannels', 'joinedChannel'].includes(key)))
            .distinctUntilChanged(d => d, (a, b) => a.equals(b))
            .map(s => s.toJS())
            .do(s => s.joinedChannel && this.close(s.joinedChannel))
            .subscribe(s => this.setState(s)),

            // status sub
            store$
            .map(s => s.get('channelStatus'))
            .distinctUntilChanged()
            .subscribe(status => this.setState({status})),
        ];
    }
    componentWillUnmount() {
        this.subs.map(s => s.dispose());
    }

    handleSearch(e) {
        this.setState({filterText: e.target.value.toLowerCase()});
    }

    join(ch) {
        joinChannel(ch);
    }

    close(ch) {
        store$.clear({joinedChannel: undefined});
        this.props.close(ch);
    }

    renderChannel(ch) {
        return (
            <div className={`card is-fullwidth ${styles.channel}`} key={ch.id} onClick={() => this.join(ch)}>
                <header className="card-header">
                    <div className={`card-header-title ${styles.channelHeader}`}>
                        <span className="icon is-small">
                            <i className="fa fa-hashtag" />
                        </span>
                        <p className="is-flex">{ch.name}</p>
                    </div>
                </header>
                {ch.description && ch.description.length > 0 && (
                    <div
                        className={`card-content ${styles.description}`}
                        dangerouslySetInnerHTML={{__html: markdown(ch.description)}}
                    />
                )}
            </div>
        );
    }

    render() {
        const {error, status, publicChannels, filterText} = this.state;

        return (
            <div className="card is-fullwidth">
                <header className="card-header">
                    <p className="card-header-title">
                        Join a channel
                    </p>
                </header>
                <div className="card-content">
                    <p className="control">
                        <input
                            className={`input is-medium ${error && 'is-danger'}`}
                            type="text"
                            placeholder="Search channels"
                            onChange={e => this.handleSearch(e)}
                        />
                    </p>
                    <div className="content">
                        {(status === 'loadingPublic' || publicChannels.length === 0) && (
                            <div className="card is-fullwidth">
                                <div className="card-header">
                                    <div className="card-header-title">
                                        {status === 'loadingPublic' ?
                                            'Loading...' :
                                            'No unjoined channels found!'}
                                    </div>
                                </div>
                            </div>
                        )}
                        {status !== 'loadingPublic' &&
                            publicChannels
                            .filter(ch => ch.name.toLowerCase().includes(filterText))
                            .map(ch => this.renderChannel(ch))}
                    </div>
                </div>
            </div>
        );
    }
}
