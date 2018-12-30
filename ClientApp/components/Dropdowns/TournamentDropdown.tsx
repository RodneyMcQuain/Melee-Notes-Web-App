import * as React from 'react';
import { ITournament } from 'ClientApp/helpers/interfaces';

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
        fetch('api/Tournament/')
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