import * as React from 'react';
import { ITournament } from 'ClientApp/helpers/interfaces';
import { getAuthorizationHeaders, getCurrentUserId } from '../../helpers/token';

interface TournamentDropdownProps {
    handleFieldChange: Function;
    tournamentId: number;
}

interface TournamentDropdownState {
    tournaments: ITournament[];
}

export class TournamentDropdown extends React.Component<TournamentDropdownProps, TournamentDropdownState> {
    constructor() {
        super();

        this.state = { tournaments: [] }
    }

    public componentDidMount() {
        let userId = getCurrentUserId();

        fetch(`api/Tournament/User/${userId}`, { headers: getAuthorizationHeaders() })
            .then(response => response.json() as Promise<ITournament[]>)
            .then(tournaments => {
                this.setState({ tournaments: tournaments });
            });
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