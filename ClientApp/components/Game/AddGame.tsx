import * as React from 'react';
import { GameForm } from '../Game/GameForm';
import { RouteComponentProps } from 'react-router';
import { ISet, IGame } from 'ClientApp/helpers/interfaces';
import { Preloader } from '../General/Preloader';
import { Token } from '../../helpers/token';
import { handleResponse } from '../../helpers/handleResponseErrors';
import { TITLE_PREFIX } from '../../helpers/constants';

interface AddGameState {
    game: IGame;
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
            isLoading: true
        }

        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public componentDidMount() {
        document.title = TITLE_PREFIX + "Add Game";
        let selectedSetId = parseInt(this.props.match.params.setId) || 0;
        let game = {} as IGame;

        if (selectedSetId === 0) {
            let userId = Token.getUserId();

            fetch(`api/Set/User/${userId}`, { headers: Token.getAuthorizationHeaders() })
                .then(response => handleResponse(this.props.history, response))
                .then(response => response.json() as Promise<ISet[]>)
                .then(sets => {
                    selectedSetId = sets[0].id;
                    this.setDefaultGameValues(selectedSetId);
                })
                .catch(error => console.log(error));
        } else {
            this.setDefaultGameValues(selectedSetId);
        }
    }

    private setDefaultGameValues(selectedSetId: number) {
        let game = JSON.parse(JSON.stringify(this.state.game));

        game = {
            setId: selectedSetId,
            outcome: "Won",
            myCharacter: "Fox",
            OpponentCharacter: "Fox",
            Stage: "Battlefield"
        }

        this.setState({ game: game, isLoading: false });
    }

    public render() {
        let isLoading = this.state.isLoading;
        let tournamentId = parseInt(this.props.match.params.tournamentId) || 0;

        if (isLoading)
            return <Preloader />
        else
            return (
                <div>
                    <div className="-horizontal-table-form-parent-container">
                        <div className="-horizontal-table-form-child-container">
                            <h1>Add Game</h1>

                            <GameForm handleFieldChange={ this.handleFieldChange } game={ this.state.game } handleSubmit={ this.handleSubmit } submitButtonName="Add Game" tournamentId={ tournamentId } />
                        </div>
                    </div>
                </div>
            )
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
        let userId = Token.getUserId();

        fetch(`api/Game/User/${userId}`, {
            method: 'POST',
            headers: Token.getAuthorizationHeaders(),
            body: JSON.stringify(game)
        })
            .then(response => handleResponse(this.props.history, response))
            .then(() => { this.props.history.push(`/set/${game.setId}`) })
            .catch (error => console.log(error));
    }
}