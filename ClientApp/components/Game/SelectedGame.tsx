import * as React from 'react';
import { IGame } from 'ClientApp/helpers/interfaces';
import { GameForm } from '../Game/GameForm';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';
import { Preloader } from '../General/Preloader';

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

        fetch(`api/Game/${selectedGameId}`)
            .then(response => response.json() as Promise<IGame>)
            .then(game => this.setState({ game: game, isLoading: false }));
    }

    public render() {
        let isLoading = this.state.isLoading;

        if (isLoading)
            return <Preloader />
        else {
            let tournamentId = parseInt(this.props.match.params.tournamentId) || 0;

            return (
                <div>
                    <h2>Game</h2>
                    <GameForm handleFieldChange={ this.handleFieldChange } game={ this.state.game } handleSubmit={ this.handleSubmit } submitButtonName="Update Game" tournamentId={ tournamentId } />
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(game)
        })
        //catch
    }
}