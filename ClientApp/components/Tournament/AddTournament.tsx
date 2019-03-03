import * as React from 'react';
import { TournamentForm } from '../Tournament/TournamentForm';
import { RouteComponentProps } from 'react-router';
import { ITournament } from 'ClientApp/helpers/interfaces';
import { Token } from '../../helpers/token';
import { handleResponse } from '../../helpers/handleResponseErrors';
import { getTodaysFormattedDate } from '../../helpers/formatDate';
import { TITLE_PREFIX } from '../../helpers/constants';

interface AddTournamentState { tournament: ITournament; }

export class AddTournament extends React.Component<RouteComponentProps<{}>, AddTournamentState> {
    constructor(props: RouteComponentProps<{}>) {
        super(props);
        this.state = { tournament: { date: getTodaysFormattedDate() } as ITournament }

        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public componentDidMount() {
        document.title = TITLE_PREFIX + "Add Tournament";
    }

    public render() {
        return (
            <div>
                <div className="-horizontal-table-form-parent-container">
                    <div className="-horizontal-table-form-child-container">
                        <h1>Add Tournament</h1>

                        <TournamentForm handleFieldChange={ this.handleFieldChange } tournament={ this.state.tournament } handleSubmit={ this.handleSubmit } submitButtonName="Add Tournament" />
                    </div>
                </div>
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
        let userId = Token.getUserId();

        fetch(`api/Tournament/User/${userId}`, {
            method: 'POST',
            headers: Token.getAuthorizationHeaders(),
            body: JSON.stringify(this.state.tournament)
        })
            .then(response => handleResponse(this.props.history, response))
            .then(() => this.props.history.push('/'))
            .catch(error => console.log(error));
    }
}