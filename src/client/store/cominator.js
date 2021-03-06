import _ from 'lodash';
import {fromJS} from 'immutable';
import {browserHistory} from 'react-router';
import {meTeam} from '../util';

// sort by title
const orderBy = (attr) => (item1, item2) => {
    if (item1.get(attr) < item2.get(attr)) {
        return -1;
    }

    if (item1.get(attr) > item2.get(attr)) {
        return 1;
    }

    return 0;
};

// team update function
const updateTeam = (s, updates) => {
    const team = updates.get('team');
    let ns = s;
    // check if it's current team
    if (s.getIn(['currentTeam', 'id']) === team.get('id')) {
        ns = ns.set('currentTeam', s.get('currentTeam').merge(team));
        // update url
        const oldTeamName = _.camelCase(s.getIn(['currentTeam', 'name']));
        const newTeamName = _.camelCase(team.get('name'));
        const newPath = window.location.pathname.replace(`/channels/${oldTeamName}/`, `/channels/${newTeamName}/`);
        browserHistory.push(newPath);
    }
    // try to find in teams
    const teamsKey = ns.get('teams', fromJS([])).findKey(v => v.get('id') === team.get('id'));
    // if found - update
    if (teamsKey !== undefined) {
        ns = ns.setIn(['teams', teamsKey],
            ns.get('teams').find(v => v.get('id') === team.get('id')).merge(team)
        );
    } else { // if not - push new team
        ns = ns.set('teams',
            ns.get('teams', fromJS([]))
                .push(team)
                .sort(orderBy('name'))
                // put meTeam on top
                .sort((team1, team2) => {
                    if (team1.get('id') === meTeam.id) {
                        return -1;
                    }

                    if (team2.get('id') === meTeam.id) {
                        return 1;
                    }

                    return 0;
                })
        );
    }
    return ns;
};

// channel update function
const updateChannel = (s, updates) => {
    const channel = updates.get('channel')
        .delete('subchannels'); // leave subchannels out
    let ns = s;
    // check if channel not is for current team - just return
    if (channel.getIn(['team', 'id']) !== s.getIn(['currentTeam', 'id'])) {
        return ns;
    }
    // check if it's current channel
    if (s.getIn(['currentChannel', 'id']) === channel.get('id')) {
        ns = s.set('currentChannel', s.get('currentChannel').merge(channel));
        // update url
        const oldChName = _.camelCase(s.getIn(['currentChannel', 'name']));
        const newChName = _.camelCase(channel.get('name'));
        const newPath = window.location.pathname.replace(new RegExp(`/${oldChName}$`), `/${newChName}`);
        browserHistory.push(newPath);
    }
    // try to find in channels
    let chKey = ns.get('channels', fromJS([])).findKey(v => v.get('id') === channel.get('id'));
    // if found - update
    if (chKey !== undefined) {
        ns = ns.setIn(['channels', chKey], ns.getIn(['channels', chKey]).merge(channel));
    } else { // try to find in subchannels
        let sKey = undefined;
        chKey = ns.get('channels', fromJS([])).findKey(ch => {
            const subs = ch.get('subchannels');
            if (!subs) {
                return false;
            }
            const k = subs.findKey(v => v.get('id') === channel.get('id'));
            if (k !== undefined) {
                sKey = k;
            }
            return k !== undefined;
        });
        // if found in subchannel - update that
        if (chKey !== undefined && sKey !== undefined) {
            ns = ns.setIn(['channels', chKey, 'subchannels', sKey],
                ns.getIn(['channels', chKey, 'subchannels', sKey]).merge(channel)
            );
        } else { // if not - push new channel
            // if no parent - add to top level
            if (channel.get('parent') === 'none') {
                ns = ns.set('channels', ns.get('channels', fromJS([])).push(channel).sort(orderBy('name')));
            } else {
                chKey = ns.get('channels', fromJS([])).findKey(v => v.get('id') === channel.get('parent'));
                if (chKey !== undefined) {
                    ns = ns.setIn(['channels', chKey, 'subchannels'],
                        ns.getIn(['channels', chKey, 'subchannels'], []).push(channel).sort(orderBy('name'))
                    );
                }
            }
        }
    }
    return ns;
};

// create combinator that updates state with given .updates prop
export const combinator = (state, data) => {
    const updates = data.get('updates');
    if (updates) {
        // console.log('*****************************************************');
        // console.log('=================== got updates ===================');
        // console.log(JSON.stringify(updates.toJS(), null, 2));
        // console.log('=================== old state ===================');
        // console.log(JSON.stringify(state.get('channels').toJS(), null, 2));

        const mergedState = state.merge(data).delete('updates');
        const newState = updates
            .keySeq()
            .reduce((s, key) => {
                // update teams if needed
                if (key === 'team') {
                    return updateTeam(s, updates);
                }

                if (key === 'channel') {
                    return updateChannel(s, updates);
                }

                return s;
            }, mergedState);

        // console.log('=================== new state ===================');
        // console.log(JSON.stringify(newState.get('channels').toJS(), null, 2));

        return newState;
    }
    return state.merge(data);
};
