import * as React from 'react';
import { IPlayer } from 'ClientApp/helpers/interfaces';

interface PlayerProps {
    player: IPlayer;
    handleFieldChange: Function;
    handleSubmit: Function;
    submitButtonName: string;
}

export class PlayerForm extends React.Component<PlayerProps, {}> {
    public render() {
        let player = this.props.player;
        let handleSubmit = this.props.handleSubmit.bind(this);

        return (
            <form onSubmit={ handleSubmit } >
                <label>Tag</label>
                <input type="text" name="tag" className="form-control input-md" placeholder="Moniker the player goes by" value={ player.tag } onChange={ e => this.props.handleFieldChange(e) } />

                <label>Notes</label>
                <textarea name="notes" className="form-control input-md" placeholder="Notes" value={ player.notes } onChange={ e => this.props.handleFieldChange(e) } />

                <input type="submit" value={ this.props.submitButtonName } className="btn" />
            </form>
        );
    }
}