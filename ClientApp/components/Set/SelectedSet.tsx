import * as React from 'react';
import { ISet, IGame } from 'ClientApp/helpers/interfaces';
import { SetForm } from '../Set/SetForm';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';
import { Preloader } from '../General/Preloader';
import { Token } from '../../helpers/token';
import { handleResponse } from '../../helpers/handleResponseErrors';

interface SelectedSetState {
    set: ISet;
    isLoading: boolean;
}

type SelectedSetProps = RouteComponentProps<{
    tournamentId: string;
    setId: string;
}>;

export class SelectedSet extends React.Component<SelectedSetProps, SelectedSetState> {
    constructor() {
        super();

        this.state = {
            set: {} as ISet,
            isLoading: true,
        }

        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public componentDidMount() {
        let selectedSetId = parseInt(this.props.match.params.setId) || 0;

        fetch(`api/Set/${selectedSetId}`, { headers: Token.getAuthorizationHeaders() })
            .then(response => handleResponse(this.props.history, response))
            .then(response => response.json() as Promise<ISet>)
            .then(set => this.setState({ set: set, isLoading: false }))
            .catch(error => console.log(error));
    }

    public render() {
        let isLoading = this.state.isLoading;

        if (isLoading)
            return <Preloader />
        else {
            let set = this.state.set;
            let games = set.games;
            let tournamentId = parseInt(this.props.match.params.tournamentId) || 0;
            let incrementer = 0;
            

            return (
                <div className="-horizontal-table-form-parent-container" >
                    <div className="-horizontal-table-form-child-container" >
                        <h1>Set</h1>

                        <SetForm handleFieldChange={ this.handleFieldChange } set={ this.state.set } handleSubmit={ this.handleSubmit } submitButtonName="Update Set" />
                        <button className="btn" onClick={ () => this.onClick_btRemoveSet() } >Remove Set</button>
                    </div>

                    <div className="-horizontal-table-form-child-container top-margin-less-than-medium-size" >
                        <div className="-horizontal-container" >
                            <h1>Games</h1>
                            <button className="btn" onClick={ () => this.onClick_btAddGame(tournamentId, set.id) } >Add Game</button>
                        </div>

                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>Game Number</th>
                                    <th>Outcome</th>
                                    <th>My Character</th>
                                    <th>Opponent Character</th>
                                    <th>Stage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {games.map(game => {
                                    incrementer++;
                                    return (
                                        <tr key={game.id} onClick={ () => this.onClick_trGame(tournamentId, set.id, game.id) } >
                                            <td>{ incrementer }</td>
                                            <td>{ game.outcome }</td>
                                            <td>{ game.myCharacter }</td>
                                            <td>{ game.opponentCharacter }</td>
                                            <td>{ game.stage }</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }
    }

    private onClick_trGame(tournamentId: number, setId: number, gameId: number) {
        this.props.history.push(`/tournament/${tournamentId}/set/${setId}/game/${gameId}`);
    }

    private handleFieldChange(event: React.ChangeEvent<HTMLSelectElement>) {
        let key: any = event.target.name;
        let set = this.state.set;
        set[key] = event.target.value;
        this.setState({ set: set });
    }

    public handleSubmit(event: React.FormEvent<EventTarget>) {
        event.preventDefault();
        let set = this.state.set;

        fetch(`api/Set/${set.id}`, {
            method: 'PUT',
            headers: Token.getAuthorizationHeaders(),
            body: JSON.stringify(set)
        })
            .then(response => handleResponse(this.props.history, response))
            .catch(error => console.log(error));
    }

    private onClick_btRemoveSet() {
        let set = this.state.set;

        fetch(`api/Set/${set.id}`, {
            method: 'DELETE',
            headers: Token.getAuthorizationHeaders(),
            body: JSON.stringify(set)
        })
            .then(response => handleResponse(this.props.history, response))
            .then(() => this.props.history.push(`/tournament/${set.tournamentId}`))
            .catch (error => console.log(error));
    }

    private onClick_btAddGame(tournamentId: number, setId: number) {
        this.props.history.push(`/addGame/tournament/${tournamentId}/set/${setId}`);
    }
}