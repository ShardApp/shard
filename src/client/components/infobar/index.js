import React from 'react';
import styles from './infobar.css';

import store$, {setInfobar} from '../../store';

export default class Infobar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: 'Infobar',
            content: 'Loading...',
        };
    }

    componentWillMount() {
        this.subs = [
            store$
            .map(s => s.get('infobar'))
            .filter(s => s !== undefined)
            .distinctUntilChanged(d => d, (a, b) => a.equals(b))
            .map(s => s.toJS())
            .subscribe(s => this.setState(s)),
        ];
    }
    componentWillUnmount() {
        this.subs.map(s => s.dispose());
    }

    hide() {
        setInfobar({});
    }

    render() {
        return (
            <div className={`card is-flex ${styles.infobar}`}>
                <header className={`card-header ${styles.header}`}>
                    <p className="card-header-title">
                        {this.state.title}
                    </p>
                    {/* <a className="card-header-icon" onClick={() => this.hide()}>
                        <i className="fa fa-times"></i>
                    </a> */}
                </header>
                <div className={`card-content ${styles.cardContent}`}>
                    <div className={`content ${styles.content}`}>
                        {this.state.content}
                    </div>
                </div>
            </div>
        );
    }
}
