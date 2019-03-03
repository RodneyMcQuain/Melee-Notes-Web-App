import * as React from 'react';
import { ITournament } from 'ClientApp/helpers/interfaces';
import { Token } from '../../helpers/token';
import { RouteComponentProps } from 'react-router';
import { handleResponse } from '../../helpers/handleResponseErrors';

interface TournamentDropdownProps {
    handleFieldChange: Function;
    tournamentId: number;
}

interface TournamentDropdownState {
    tournaments: ITournament[];
}

interface OptionalRouteComponentProps {
    history?: RouteComponentProps<{}>;
}

export class TournamentDropdown extends React.Component<TournamentDropdownProps & OptionalRouteComponentProps, TournamentDropdownState> {
    constructor(props: TournamentDropdownProps & OptionalRouteComponentProps) {
        super(props);

        this.state = { tournaments: [] }
    }

    public componentDidMount() {
        let userId = Token.getUserId();

        fetch(`api/Tournament/User/${userId}`, { headers: Token.getAuthorizationHeaders() })
            .then(response => handleResponse(this.props.history, response))
            .then(response => response.json() as Promise<ITournament[]>)
            .then(tournaments => this.setState({ tournaments: tournaments }))
            .catch (error => console.log(error));
    }

    public render() {
        let tournaments = this.state.tournaments;
        let handleFieldChange = this.props.handleFieldChange.bind(this);

        let tournamentOptions = tournaments.map(tournament => <option key={ tournament.id } value={ tournament.id } >{ tournament.name }</option>);

        return (
            <select name="tournamentId" className="form-control" onChange={ handleFieldChange } value={ this.props.tournamentId } >
                { tournamentOptions }
            </select>
        );
    }
}