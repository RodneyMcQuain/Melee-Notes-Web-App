import * as React from 'react';
import { IPlayer } from 'ClientApp/helpers/interfaces';
import { PlayerForm } from '../Player/PlayerForm';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';
import { Preloader } from '../General/Preloader';
import { Token } from '../../helpers/token';
import { handleResponse } from '../../helpers/handleResponseErrors';
import { POP_UP_MS } from '../../helpers/constants';
import { PopUp } from '../PopUps/PopUp';
import { TITLE_PREFIX } from '../../helpers/constants';

interface SelectedPlayerState {
    player: IPlayer;
    isLoading: boolean;
    isPopUpVisible: boolean;
}

type SelectedPlayerProps = RouteComponentProps<{ playerId: string }>;

export class SelectedPlayer extends React.Component<SelectedPlayerProps, SelectedPlayerState> {
    constructor(props: SelectedPlayerProps) {
        super(props);
        this.state = {
            player: {} as IPlayer,
            isLoading: true,
            isPopUpVisible: false
        }

        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public componentDidMount() {
        document.title = TITLE_PREFIX + "Player";
        let selectedPlayerId = parseInt(this.props.match.params.playerId) || 0;

        fetch(`api/Player/${selectedPlayerId}`, { headers: Token.getAuthorizationHeaders() })
            .then(response => handleResponse(this.props.history, response))
            .then(response => response.json() as Promise<IPlayer>)
            .then(player => { this.setState({ player: player, isLoading: false }); })
            .catch(error => console.log(error));
    }

    public render() {
        const { isLoading, isPopUpVisible } = this.state;
        let popUp = <div></div>

        if (isPopUpVisible)
            popUp = <PopUp text="Player Updated" />  

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
            headers: Token.getAuthorizationHeaders(),
            body: JSON.stringify(player)
        })
            .then(response => handleResponse(this.props.history, response))
            .then(() => this.setState({ isPopUpVisible: true }))
            .then(() => setTimeout(() => this.setState({ isPopUpVisible: false }), POP_UP_MS))
            .catch(error => console.log(error));
    }

    private onClick_btRemoveTournament() {
        let player = this.state.player;

        fetch(`api/Player/${player.id}`, {
            method: 'DELETE',
            headers: Token.getAuthorizationHeaders(),
            body: JSON.stringify(player)
        })
            .then(response => handleResponse(this.props.history, response))
            .then(() => this.props.history.push('/players'))
            .catch(error => console.log(error));
    }
}