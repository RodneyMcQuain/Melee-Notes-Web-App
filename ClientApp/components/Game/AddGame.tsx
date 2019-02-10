import * as React from 'react';
import { GameForm } from '../Game/GameForm';
import { RouteComponentProps } from 'react-router';
import { ISet, IGame } from 'ClientApp/helpers/interfaces';
import { Preloader } from '../General/Preloader';
import { Token } from '../../helpers/token';
import { handleResponse } from '../../helpers/handleResponseErrors';
import { TITLE_PREFIX } from '../../helpers/constants';
import { GoToSetButton } from './GoToSetButton';

interface AddGameState {
    game: IGame;
    tournamentId: number;
    isLoading: boolean;
}

type AddGameProps = RouteComponentProps<{
    tournamentId: string;
    setId: string;
}>;

export class AddGame extends React.Component<AddGameProps, AddGameState> {
    constructor() {
        super();
        this.state = {
            game: {} as IGame,
            tournamentId: 0,
            isLoading: true
        }

        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public componentDidMount() {
        document.title = TITLE_PREFIX + "Add Game";
        let selectedSetId = parseInt(this.props.match.params.setId) || 0;
        let game = {} as IGame;

        this.setDefaultGameValues(selectedSetId);
    }

    private setDefaultGameValues(selectedSetId: number) {
        let game = JSON.parse(JSON.stringify(this.state.game));
        const selectedTournamentId = parseInt(this.props.match.params.tournamentId) || 0;

        game = {
            setId: selectedSetId,
            outcome: "Won",
            myCharacter: "Fox",
            OpponentCharacter: "Fox",
            Stage: "Battlefield"
        }

        this.setState({
            game: game,
            tournamentId: selectedTournamentId,
            isLoading: false
        });
    }

    public render() {
        let isLoading = this.state.isLoading;

        if (isLoading)
            return <Preloader />
        else {
            const { tournamentId, game } = this.state;

            return (
                <div>
                    <div className="-horizontal-table-form-parent-container">
                        <div className="-horizontal-table-form-child-container">
                            <h1>Add Game</h1>

                            <GameForm handleFieldChange={ this.handleFieldChange } game={ this.state.game } handleSubmit={ this.handleSubmit } submitButtonName="Add Game" />
                            <GoToSetButton tournamentId={ tournamentId } setId={ game.setId } history={ this.props.history } /> 
                        </div>
                    </div>
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
        const { game, tournamentId } = this.state;
        let userId = Token.getUserId();

        fetch(`api/Game/User/${userId}`, {
            method: 'POST',
            headers: Token.getAuthorizationHeaders(),
            body: JSON.stringify(game)
        })
            .then(response => handleResponse(this.props.history, response))
            .then(() => this.props.history.push(`/tournament/${tournamentId}/set/${game.setId}`))
            .catch (error => console.log(error));
    }
}