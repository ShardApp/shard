import React from 'react';
import Textarea from 'react-textarea-autosize';
import {markdown} from '../../util';
import styles from './description.css';

// store and actions
import store$, {updateChannel} from '../../store';

export default class Description extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            edit: false,
            currentChannel: {},
        };
    }

    componentWillMount() {
        this.subs = [
            // get initial data
            store$
            .map(s => s.filter((v, key) => ['currentChannel', 'updatedChannel', 'channelStatus'].includes(key)))
            .distinctUntilChanged(d => d, (a, b) => a.equals(b))
            .map(s => s.toJS())
            .map(s => {
                if (s.updatedChannel) {
                    this.closeEdit();

                    return {
                        channelStatus: s.channelStatus,
                        currentChannel: s.updatedChannel,
                    };
                }

                return s;
            })
            // store to state
            .subscribe(s => this.setState(s)),
        ];
    }
    componentWillUnmount() {
        this.subs.map(s => s.dispose());
    }

    enableEdit() {
        this.setState({edit: true});
    }
    closeEdit() {
        this.setState({edit: false});
    }
    saveEdit() {
        const description = this._text.value;
        const channel = {
            ...this.state.currentChannel,
            description,
        };
        updateChannel(channel);
    }

    renderEdit() {
        const {currentChannel, channelStatus} = this.state;

        return (
            <div className={styles.editArea}>
                <Textarea
                    className={`textarea ${styles.inputArea}`}
                    defaultValue={currentChannel.description}
                    placeholder="Write a description..."
                    ref={(t) => { this._text = t; }}
                />
                <div className={styles.editButtons}>
                    <button
                        className="button"
                        disabled={channelStatus === 'updating'}
                        onClick={() => this.closeEdit()}
                    >
                        Cancel
                    </button>
                    <div className="is-spacer" />
                    <button
                        className={`button is-success ${channelStatus === 'updating' ? 'is-loading' : ''}`}
                        disabled={channelStatus === 'updating'}
                        onClick={() => this.saveEdit()}
                    >
                        Save
                    </button>
                </div>
            </div>
        );
    }

    render() {
        const {currentChannel, edit} = this.state;

        return (
            <div className={`column content ${styles.content}`} onDoubleClick={() => this.enableEdit()}>
                {!currentChannel.description && 'Loading...'}

                <div
                    ref={md => { this._md = md; }}
                    className={styles.description}
                    dangerouslySetInnerHTML={{__html:
                        !edit && currentChannel && currentChannel.description ?
                            markdown(currentChannel.description) : '',
                    }}
                />

                {edit && this.renderEdit()}
            </div>
        );
    }
}
