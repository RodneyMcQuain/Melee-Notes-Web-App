import * as React from 'react';
import { ITournament, ISet } from 'ClientApp/helpers/interfaces';
import { TournamentForm } from '../Tournament/TournamentForm';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';
import { Preloader } from '../General/Preloader';
import { formatDate } from '../../helpers/formatDate';
import { getAuthorizationHeaders } from '../../helpers/token';

interface SelectedTournamentState {
    tournament: ITournament;
    playerTags: string[];
    isLoading: boolean;
}

type SelectedTournamentProps = RouteComponentProps<{ tournamentId: string }>;

export class SelectedTournament extends React.Component<SelectedTournamentProps, SelectedTournamentState> {
    constructor() {
        super();
        this.state = {
            tournament: {} as ITournament,
            playerTags: [],
            isLoading: true
        }

        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public componentDidMount() {
        let selectedTournamentId = parseInt(this.props.match.params.tournamentId) || 0;

        fetch(`api/Tournament/${selectedTournamentId}`, { headers: getAuthorizationHeaders() })
            .then(response => response.json() as Promise<ITournament>)
            .then(tournament => {
                tournament.date = formatDate(tournament.date);
                this.setState({ tournament: tournament, isLoading: false });

                tournament.sets.map(set => {
                    fetch(`api/Player/${set.playerId}`, { headers: getAuthorizationHeaders() })
                        .then(response => response.json() as Promise<ITournament>)
                        .then(player => this.setState(prevState => ({ playerTags: [...prevState.playerTags, player.tag] })));
                });
            });
    }

    public render() {
        let isLoading = this.state.isLoading;

        if (isLoading)
            return <Preloader />
        else {
            let tournament = this.state.tournament;
            let sets = tournament.sets;
            let increment = -1;

            return <div>
                <h1>{ tournament.name }</h1>

                <TournamentForm handleFieldChange={ this.handleFieldChange } tournament={ tournament } handleSubmit={ this.handleSubmit } submitButtonName={ "Update Tournament" } />
                <button className="btn" onClick={ () => this.onClick_btRemoveTournament() } >Remove Tournament</button>
                <button className="btn" onClick={ () => this.onClick_btAddSet(tournament.id) } >Add Set</button>

                <h2>Sets</h2>
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
            headers: getAuthorizationHeaders(),
            body: JSON.stringify(tournament)
        });    
    }

    private onClick_btAddSet(tournamentId: number) {
        this.props.history.push(`/addSet/${tournamentId}`);
    }

    private onClick_btRemoveTournament() {
        let tournament = this.state.tournament;

        fetch(`api/Tournament/${tournament.id}`, {
            method: 'DELETE',
            headers: getAuthorizationHeaders(),
            body: JSON.stringify(tournament)
        })
            .then(() => this.props.history.push('/'));
    }
}
