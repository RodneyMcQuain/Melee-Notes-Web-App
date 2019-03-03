import * as React from 'react';
import { IPlayer } from 'ClientApp/helpers/interfaces';
import { Token } from '../../helpers/token';
import { RouteComponentProps } from 'react-router';
import { handleResponse } from '../../helpers/handleResponseErrors';

interface PlayerDropdownProps {
    handleFieldChange: Function;
    playerId: number;
    hasAll?: boolean;
}

interface PlayerDropdownState {
    players: IPlayer[];
}

interface OptionalRouteComponentProps {
    history?: RouteComponentProps<{}>;
}

export class PlayerDropdown extends React.Component<PlayerDropdownProps & OptionalRouteComponentProps, PlayerDropdownState> {
    constructor(props: PlayerDropdownProps & OptionalRouteComponentProps) {
        super(props);

        this.state = { players: [] as IPlayer[] }
    }

    public componentDidMount() {
        let userId = Token.getUserId();

        fetch(`api/Player/User/${userId}`, { headers: Token.getAuthorizationHeaders() })
            .then(response => handleResponse(this.props.history, response))
            .then(response => response.json() as Promise<IPlayer[]>)
            .then(players => { this.setState({ players: players }); })
            .catch(error => console.log(error));
    }

    public render() {
        let players = this.state.players;
        let handleFieldChange = this.props.handleFieldChange.bind(this);

        let playerHasAll;
        if (this.props.hasAll)
            playerHasAll = <option key="0" value="0">All Players</option>

        let playerOptions;
        if (players.length === 0)
            playerOptions = <option key="No Players" value="No Players" >No Players Added</option>;
        else
            playerOptions = players.map(player => <option key={ player.id } value={ player.id } >{ player.tag }</option>);

        return (
            <select name="playerId" className="form-control" onChange={ handleFieldChange } value={ this.props.playerId } >
                { playerHasAll }
                { playerOptions }
            </select>
        );
    }
}