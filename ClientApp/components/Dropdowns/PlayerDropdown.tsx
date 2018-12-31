import * as React from 'react';
import { IPlayer } from 'ClientApp/helpers/interfaces';
import { getAuthorizationHeaders, getCurrentUserId } from '../../helpers/token';
import { RouteComponentProps } from 'react-router';
import { handleResponse } from '../../helpers/handleResponseErrors';

interface PlayerDropdownProps {
    handleFieldChange: Function;
    playerId: number;
}

interface PlayerDropdownState {
    players: IPlayer[];
}

interface OptionalRouteComponentProps {
    history?: RouteComponentProps<{}>;
}

export class PlayerDropdown extends React.Component<PlayerDropdownProps & OptionalRouteComponentProps, PlayerDropdownState> {
    constructor() {
        super();

        this.state = { players: [] as IPlayer[] }
    }

    public componentDidMount() {
        let userId = getCurrentUserId();

        fetch(`api/Player/User/${userId}`, { headers: getAuthorizationHeaders() })
            .then(response => handleResponse(this.props.history, response))
            .then(response => response.json() as Promise<IPlayer[]>)
            .then(players => { this.setState({ players: players }); })
            .catch(error => console.log(error));
    }

    public render() {
        let players = this.state.players;
        let handleFieldChange = this.props.handleFieldChange.bind(this);

        let playerOptions = players.map(player => <option key={ player.id } value={ player.id } >{ player.tag }</option>);

        return (
            <select name="playerId" className="form-control" onChange={ handleFieldChange } value={ this.props.playerId } >
                { playerOptions }
            </select>
        );
    }
}