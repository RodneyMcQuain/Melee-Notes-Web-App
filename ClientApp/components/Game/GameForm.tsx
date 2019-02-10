import * as React from 'react';
import { IGame } from 'ClientApp/helpers/interfaces';
import { TournamentDropdown } from '../Dropdowns/TournamentDropdown';
import { SetDropdown } from '../Dropdowns/SetDropdown';
import { OutcomeDropdown } from '../Dropdowns/OutcomeDropdown';
import { CharacterDropdown } from '../Dropdowns/CharacterDropdown';
import { StageDropdown } from '../Dropdowns/StageDropdown';

interface GameProps {
    handleFieldChange: Function;
    game: IGame;
    handleSubmit: Function;
    submitButtonName: string;
}

export class GameForm extends React.Component<GameProps, {}> {
    public render() {
        let game = this.props.game;
        let handleSubmit = this.props.handleSubmit.bind(this);

        return (
            <form onSubmit={ handleSubmit } >
                <label>Outcome</label>
                <OutcomeDropdown handleFieldChange={ this.props.handleFieldChange } outcome={ game.outcome } />

                <label>My Character</label>
                <CharacterDropdown handleFieldChange={ this.props.handleFieldChange } character={ game.myCharacter } characterType="myCharacter" />

                <label>Opponent Character</label>
                <CharacterDropdown handleFieldChange={ this.props.handleFieldChange } character={ game.opponentCharacter } characterType="opponentCharacter" />

                <label>Stage</label>
                <StageDropdown handleFieldChange={ this.props.handleFieldChange } stage={ game.stage } />

                <input type="submit" value={ this.props.submitButtonName } className="btn" />
            </form>
        );
    }
}