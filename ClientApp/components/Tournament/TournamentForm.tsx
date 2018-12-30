import * as React from 'react';
import { ITournament } from 'ClientApp/helpers/interfaces';

interface TournamentFormProps {
    handleFieldChange: Function;
    tournament: ITournament;
    handleSubmit: Function;
    submitButtonName: string;
}

export class TournamentForm extends React.Component<TournamentFormProps, {}> {
    public render() {
        let tournament = this.props.tournament;
        let handleSubmit = this.props.handleSubmit.bind(this);

        return (
            <form onSubmit={ handleSubmit } >
                <label>Name</label>
                <input type="text" name="name" className="form-control input-md" placeholder="Tournament Name" value={ tournament.name } onChange={ e => this.props.handleFieldChange(e) } />

                <label>Date</label>
                <input type="date" name="date" className="form-control input-md" placeholder="Date of the Tournament" value={ tournament.date } onChange={ e => this.props.handleFieldChange(e) } />

                <label>Your Placing</label>
                <input type="text" name="myPlacing" className="form-control input-md" placeholder="Placement you Recieved" value={ tournament.myPlacing } onChange={ e => this.props.handleFieldChange(e) } />

                <label>City</label>
                <input type="text" name="city" className="form-control input-md" placeholder="City" value={ tournament.city } onChange={ e => this.props.handleFieldChange(e) } />

                <label>State</label>
                <input type="text" name="state" className="form-control input-md" placeholder="State" value={ tournament.state } onChange={ e => this.props.handleFieldChange(e) } />

                <label>Notes</label>
                <textarea name="notes" className="form-control input-md" placeholder="Notes" value={ tournament.notes } onChange={ e => this.props.handleFieldChange(e) } />

                <input type="submit" value={ this.props.submitButtonName } className="btn" />
            </form>
        );
    }
}