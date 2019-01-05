import * as React from 'react';
import { ITournament } from 'ClientApp/helpers/interfaces';
import { Preloader } from './General/Preloader';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';
import { formatDate } from '../helpers/formatDate';
import { Token } from '../helpers/token';
import { handleResponse } from '../helpers/handleResponseErrors';

interface HomeState {
    tournaments: ITournament[];
    isLoading: boolean;
}

export class Home extends React.Component<RouteComponentProps<{}>, HomeState> {
    constructor() {
        super();
        this.state = { tournaments: [], isLoading: true }

        this.onClick_trTournament = this.onClick_trTournament.bind(this);
    }

    public componentDidMount() {
        let userId = Token.getUserId();

        fetch(`api/Tournament/User/${userId}`, { headers: Token.getAuthorizationHeaders() })
            .then(response => handleResponse(this.props.history, response))
            .then(response => response.json() as Promise<ITournament[]>)
            .then(tournaments => {
                tournaments.map(tournament => {
                    tournament.date = formatDate(tournament.date);
                    return tournament;
                });

                this.setState({ tournaments: tournaments, isLoading: false });
            })
            .catch(error => console.log(error));
    }

    public render() {
        let tournaments = this.state.tournaments;
        let isLoading = this.state.isLoading;

        if (isLoading)
            return <Preloader />
        else 
            return (
                <div>
                    <h1>Melee Notes</h1>
                    <h2>Tournaments</h2>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Date</th>
                                <th>My Placing</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tournaments.map(tournament =>
                                <tr key={ tournament.id } onClick={() => this.onClick_trTournament(tournament.id)} >
                                    <td>{ tournament.name }</td>
                                    <td>{ tournament.date }</td>
                                    <td>{ tournament.myPlacing }</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            );
    }

    private onClick_trTournament(tournamentId: number) {
        this.props.history.push(`/tournament/${tournamentId}`);
    }
}
