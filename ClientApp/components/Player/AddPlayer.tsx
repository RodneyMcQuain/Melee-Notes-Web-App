import * as React from 'react';
import { PlayerForm } from '../Player/PlayerForm';
import { RouteComponentProps } from 'react-router';
import { IPlayer } from 'ClientApp/helpers/interfaces';
import { getAuthorizationHeaders, getCurrentUserId } from '../../helpers/token';
import { handleResponse } from '../../helpers/handleResponseErrors';

interface AddPlayerState { player: IPlayer; }

export class AddPlayer extends React.Component<RouteComponentProps<{}>, AddPlayerState> {
    constructor() {
        super();
        this.state = { player: {} as IPlayer }

        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public render() {
        return (
            <div>
                <h1>Add Player</h1>
                <PlayerForm handleFieldChange={ this.handleFieldChange } player={ this.state.player } handleSubmit={ this.handleSubmit } submitButtonName="Add Player" />
            </div>
        );
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
        let userId = getCurrentUserId();

        fetch(`api/Player/User/${userId}`, {
            method: 'POST',
            headers: getAuthorizationHeaders(),
            body: JSON.stringify(player)
        })
            .then(response => handleResponse(this.props.history, response))
            .then(() => this.props.history.push('/players'))
            .catch(error => console.log(error));
    }
}