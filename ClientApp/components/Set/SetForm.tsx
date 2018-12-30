import * as React from 'react';
import { ISet } from 'ClientApp/helpers/interfaces';
import { TournamentDropdown } from '../Dropdowns/TournamentDropdown';
import { PlayerDropdown } from '../Dropdowns/PlayerDropdown';
import { OutcomeDropdown } from '../Dropdowns/OutcomeDropdown';
import { FormatDropdown } from '../Dropdowns/FormatDropdown';
import { TypeDropdown } from '../Dropdowns/TypeDropdown';

interface SetFormProps {
    handleFieldChange: Function;
    set: ISet;
    handleSubmit: Function;
    submitButtonName: string;
}

export class SetForm extends React.Component<SetFormProps, {}> {
    public render() {
        let set = this.props.set;
        let handleSubmit = this.props.handleSubmit.bind(this);

        return (
            <form onSubmit={ handleSubmit } >
                <label>Tournament</label>
                <TournamentDropdown handleFieldChange={ this.props.handleFieldChange } tournamentId={ this.props.set.tournamentId } />

                <label>Player</label>
                <PlayerDropdown handleFieldChange={ this.props.handleFieldChange } playerId={ this.props.set.playerId } />

                <label>Outcome</label>
                <OutcomeDropdown handleFieldChange={ this.props.handleFieldChange } outcome={ this.props.set.outcome } />

                <label>Format</label>
                <FormatDropdown handleFieldChange={ this.props.handleFieldChange } format={this.props.set.format} />

                <label>Type</label>
                <TypeDropdown handleFieldChange={ this.props.handleFieldChange } type={ this.props.set.type } />

                <label>Bracket Round</label>
                <input type="text" name="bracketRound" className="form-control input-md" placeholder="Winner's Finals, Loser's Semis, etc." value={ set.bracketRound } onChange={ e => this.props.handleFieldChange(e) } />

                <label>Notes</label>
                <textarea name="notes" className="form-control input-md" placeholder="Notes" value={set.notes} onChange={ e => this.props.handleFieldChange(e) } />

                <input type="submit" value={ this.props.submitButtonName } className="btn" />
            </form>
        );
    }
}