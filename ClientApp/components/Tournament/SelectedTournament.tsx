import * as React from 'react';
import { ITournament, ISet } from 'ClientApp/helpers/interfaces';
import { TournamentForm } from '../Tournament/TournamentForm';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';
import { Preloader } from '../General/Preloader';
import { formatDate } from '../../helpers/formatDate';
import { Token } from '../../helpers/token';
import { handleResponse } from '../../helpers/handleResponseErrors';
import { PopUp } from '../PopUps/PopUp';
import { POP_UP_MS, TITLE_PREFIX } from '../../helpers/constants';

interface SelectedTournamentState {
    tournament: ITournament;
    playerTags: string[];
    isLoading: boolean;
    isPopUpVisible: boolean;
}

type SelectedTournamentProps = RouteComponentProps<{ tournamentId: string }>;

export class SelectedTournament extends React.Component<SelectedTournamentProps, SelectedTournamentState> {
    constructor() {
        super();
        this.state = {
            tournament: {} as ITournament,
            playerTags: [],
            isLoading: true,
            isPopUpVisible: false
        }

        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public componentDidMount() {
        document.title = TITLE_PREFIX + "Tournament";
        let selectedTournamentId = parseInt(this.props.match.params.tournamentId) || 0;

        fetch(`api/Tournament/${selectedTournamentId}`, { headers: Token.getAuthorizationHeaders() })
            .then(response => handleResponse(this.props.history, response))
            .then(response => response.json() as Promise<ITournament>)
            .then(tournament => {
                tournament.date = formatDate(tournament.date);
                this.setState({ tournament: tournament, isLoading: false });

                tournament.sets.map(set => {
                    fetch(`api/Player/${set.playerId}`, { headers: Token.getAuthorizationHeaders() })
                        .then(response => handleResponse(this.props.history, response))
                        .then(response => response.json() as Promise<ITournament>)
                        .then(player => this.setState(prevState => ({ playerTags: [...prevState.playerTags, player.tag] })))
                        .catch (error => console.log(error));

                });
            })
            .catch(error => console.log(error));
    }

    public render() {
        const { isLoading, isPopUpVisible } = this.state;
        let popUp = <div></div>

        if (isPopUpVisible)
            popUp = <PopUp text="Tournament Updated" />    

        if (isLoading)
            return <Preloader />
        else {
            let tournament = this.state.tournament;
            let sets = tournament.sets;
            let increment = -1;

            return (
                <div>
                    { popUp }

                    <div className="-horizontal-table-form-parent-container" >
                        <div className="-horizontal-table-form-child-container" >
                            <h1>{ tournament.name }</h1>

                            <TournamentForm handleFieldChange={ this.handleFieldChange } tournament={ tournament } handleSubmit={ this.handleSubmit } submitButtonName={ "Update Tournament" } />
                            <button className="btn" onClick={ () => this.onClick_btRemoveTournament() } >Remove Tournament</button>
                        </div>

                        <div className="-horizontal-table-form-child-container top-margin-less-than-medium-size" >
                            <div className="-horizontal-container" >
                                <h1>Sets</h1>
                                <button className="btn" onClick={ () => this.onClick_btAddSet(tournament.id) } >Add Set</button>
                            </div>

                            <table className='table'>
                                <thead>
                                    <tr>
                                        <th>Tag</th>
                                        <th>Outcome</th>
                                        <th>Format</th>
                                        <th>Bracket Round</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sets.map(set => {
                                        increment++;

                                        return (
                                            <tr key={ set.id } onClick={ () => this.onClick_trSet(tournament.id, set.id) } >
                                                <td>{ this.state.playerTags[increment] }</td>
                                                <td>{ set.outcome }</td>
                                                <td>{ set.format }</td>
                                                <td>{ set.bracketRound }</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                </table>
                            </div>
                    </div>
                </div>
            );
        }
    }

    private onClick_trSet(tournamentId: number, setId: number) {
        this.props.history.push(`/tournament/${tournamentId}/set/${setId}`);
    }

    private handleFieldChange(event: React.ChangeEvent<HTMLSelectElement>) {
        let key: any = event.target.name;
        let tournament = this.state.tournament;
        tournament[key] = event.target.value;
        this.setState({ tournament: tournament });
    }

    public handleSubmit(event: React.FormEvent<EventTarget>) {
        event.preventDefault();
        let tournament = this.state.tournament;

        fetch(`api/Tournament/${tournament.id}`, {
            method: 'PUT',
            headers: Token.getAuthorizationHeaders(),
            body: JSON.stringify(tournament)
        })
            .then(response => handleResponse(this.props.history, response))
            .then(() => this.setState({ isPopUpVisible: true }))
            .then(() => setTimeout(() => this.setState({ isPopUpVisible: false }), POP_UP_MS))
            .catch(error => console.log(error));
    }

    private onClick_btAddSet(tournamentId: number) {
        this.props.history.push(`/addSet/${tournamentId}`);
    }

    private onClick_btRemoveTournament() {
        let tournament = this.state.tournament;

        fetch(`api/Tournament/${tournament.id}`, {
            method: 'DELETE',
            headers: Token.getAuthorizationHeaders(),
            body: JSON.stringify(tournament)
        })
            .then(response => handleResponse(this.props.history, response))
            .then(() => this.props.history.push('/'))
            .catch(error => console.log(error));
    }
}
