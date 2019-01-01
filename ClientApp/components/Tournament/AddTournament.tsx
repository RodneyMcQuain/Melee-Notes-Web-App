import * as React from 'react';
import { TournamentForm } from '../Tournament/TournamentForm';
import { RouteComponentProps } from 'react-router';
import { ITournament } from 'ClientApp/helpers/interfaces';
import { getCurrentUserId, getToken, getAuthorizationHeaders } from '../../helpers/token';
import { handleResponse } from '../../helpers/handleResponseErrors';
import { getTodaysFormattedDate } from '../../helpers/formatDate';

interface AddTournamentState { tournament: ITournament; }

export class AddTournament extends React.Component<RouteComponentProps<{}>, AddTournamentState> {
    constructor() {
        super();
        this.state = { tournament: { date: getTodaysFormattedDate() } as ITournament }

        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public render() {
        return (
            <div>
                <h1>Add Tournament</h1>

                <TournamentForm handleFieldChange={ this.handleFieldChange } tournament={ this.state.tournament } handleSubmit={ this.handleSubmit } submitButtonName="Add Tournament" />
            </div>
        );
    }

    private handleFieldChange(event: React.ChangeEvent<HTMLSelectElement>) {
        let key: any = event.target.name;
        let tournament = this.state.tournament;
        tournament[key] = event.target.value;
        this.setState({ tournament: tournament });
    }

    public handleSubmit(event: React.FormEvent<EventTarget>) {
        event.preventDefault();

        let userId = getCurrentUserId();

        fetch(`api/Tournament/User/${userId}`, {
            method: 'POST',
            headers: getAuthorizationHeaders(),
            body: JSON.stringify(this.state.tournament)
        })
            .then(response => handleResponse(this.props.history, response))
            .then(() => this.props.history.push('/'))
            .catch(error => console.log(error));
    }
}