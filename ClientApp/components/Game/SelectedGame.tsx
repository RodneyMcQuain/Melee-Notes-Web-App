import * as React from 'react';
import { IGame } from 'ClientApp/helpers/interfaces';
import { GameForm } from '../Game/GameForm';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';
import { Preloader } from '../General/Preloader';
import { Token } from '../../helpers/token';
import { handleResponse } from '../../helpers/handleResponseErrors';

interface SelectedGameState {
    game: IGame,
    isLoading: boolean;
}

type SelectedGameProps = RouteComponentProps<{ tournamentId: string, gameId: string; }>;

export class SelectedGame extends React.Component<SelectedGameProps, SelectedGameState> {
    constructor() {
        super();

        this.state = {
            game: {} as IGame,
            isLoading: true,
        }

        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public componentDidMount() {
        let selectedGameId = parseInt(this.props.match.params.gameId) || 0;

        fetch(`api/Game/${selectedGameId}`, { headers: Token.getAuthorizationHeaders() })
            .then(response => handleResponse(this.props.history, response))
            .then(response => response.json() as Promise<IGame>)
            .then(game => this.setState({ game: game, isLoading: false }))
            .catch(error => console.log(error));
    }

    public render() {
        let isLoading = this.state.isLoading;
        let game = this.state.game;

        if (isLoading)
            return <Preloader />
        else {
            let tournamentId = parseInt(this.props.match.params.tournamentId) || 0;

            return (
                <div>
                    <h2>Game</h2>

                    <GameForm handleFieldChange={ this.handleFieldChange } game={ this.state.game } handleSubmit={ this.handleSubmit } submitButtonName="Update Game" tournamentId={ tournamentId } />
                    <button className="btn" onClick={ () => this.onClick_btRemoveGame(game, tournamentId) } >Remove Game</button>
                    <button className="btn" onClick={ () => this.onClick_btGoToSet(tournamentId, game.setId) } >Go Back to Set</button>
                </div>
            );
        }
    }

    private handleFieldChange(event: React.ChangeEvent<HTMLSelectElement>) {
        let key: any = event.target.name;
        let game = this.state.game;
        game[key] = event.target.value;
        this.setState({ game: game });
    }

    public handleSubmit(event: React.FormEvent<EventTarget>) {
        event.preventDefault();
        let game = this.state.game;

        fetch(`api/Game/${game.id}`, {
            method: 'PUT',
            headers: Token.getAuthorizationHeaders(),
            body: JSON.stringify(game)
        })
            .then(response => handleResponse(this.props.history, response))
            .catch(error => console.log(error));
    }

    private onClick_btRemoveGame(game: IGame, tournamentId: number) {
        fetch(`api/Game/${game.id}`, {
            method: 'DELETE',
            headers: Token.getAuthorizationHeaders(),
            body: JSON.stringify(game)
        })
            .then(response => handleResponse(this.props.history, response))
            .then(() => this.props.history.push(`/tournament/${tournamentId}/set/${game.setId}`))
            .catch(error => console.log(error));
    }

    private onClick_btGoToSet(tournamentId: number, setId: number) {
        this.props.history.push(`/tournament/${tournamentId}/set/${setId}`);
    }
}