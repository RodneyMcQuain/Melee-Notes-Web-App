import * as React from 'react';
import { IPlayer } from 'ClientApp/helpers/interfaces';
import { PlayerForm } from '../Player/PlayerForm';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';
import { Preloader } from '../General/Preloader';
import { getAuthorizationHeaders } from '../../helpers/token';
import { handleResponse } from '../../helpers/handleResponseErrors';

interface SelectedPlayerState {
    player: IPlayer;
    isLoading: boolean;
}

type SelectedTournamentProps = RouteComponentProps<{ playerId: string }>;

export class SelectedPlayer extends React.Component<SelectedTournamentProps, SelectedPlayerState> {
    constructor() {
        super();
        this.state = {
            player: {} as IPlayer,
            isLoading: true,
        }

        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public componentDidMount() {
        let selectedPlayerId = parseInt(this.props.match.params.playerId) || 0;

        fetch(`api/Player/${selectedPlayerId}`, { headers: getAuthorizationHeaders() })
            .then(response => handleResponse(this.props.history, response))
            .then(response => response.json() as Promise<IPlayer>)
            .then(player => { this.setState({ player: player, isLoading: false }); })
            .catch(error => console.log(error));
    }

    public render() {
        let isLoading = this.state.isLoading;

        if (isLoading)
            return <Preloader />
        else {
            let player = this.state.player;

            return <div>
                <h1>Player - { player.tag }</h1>

                <PlayerForm handleFieldChange={ this.handleFieldChange } player={ player } handleSubmit={ this.handleSubmit } submitButtonName="Update Player" />
                <button className="btn" onClick={ () => this.onClick_btRemoveTournament() } >Remove Player</button>
            </div>
        }
    }

    private handleFieldChange(event: React.ChangeEvent<HTMLSelectElement>) {
        let key: any = event.target.name;
        let player = this.state.player;
        player[key] = event.target.value;
        this.setState({ player: player });
    }

    public handleSubmit(event: React.FormEvent<EventTarget>) {
        event.preventDefault();
        let player = this.state.player;

        fetch(`api/Player/${player.id}`, {
            method: 'PUT',
            headers: getAuthorizationHeaders(),
            body: JSON.stringify(player)
        })
            .then(response => handleResponse(this.props.history, response))
            .catch(error => console.log(error));
    }

    private onClick_btRemoveTournament() {
        let player = this.state.player;

        fetch(`api/Player/${player.id}`, {
            method: 'DELETE',
            headers: getAuthorizationHeaders(),
            body: JSON.stringify(player)
        })
            .then(response => handleResponse(this.props.history, response))
            .then(() => this.props.history.push('/players'))
            .catch(error => console.log(error));
    }
}