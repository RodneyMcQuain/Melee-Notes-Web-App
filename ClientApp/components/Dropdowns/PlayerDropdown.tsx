import * as React from 'react';
import { IPlayer } from 'ClientApp/helpers/interfaces';

interface PlayerDropdownProps {
    handleFieldChange: Function;
    playerId: number;
}

interface PlayerDropdownState {
    players: IPlayer[];
}

export class PlayerDropdown extends React.Component<PlayerDropdownProps, PlayerDropdownState> {
    constructor() {
        super();

        this.state = { players: [] as IPlayer[] }
    }

    public componentDidMount() {
        fetch('api/Player/')
            .then(response => response.json() as Promise<IPlayer[]>)
            .then(players => {
                this.setState({ players: players });
            });
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