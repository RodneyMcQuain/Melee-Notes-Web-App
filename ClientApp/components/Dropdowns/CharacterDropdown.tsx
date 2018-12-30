import * as React from 'react';

interface CharacterDropdownProps {
    handleFieldChange: Function;
    character: string;
    characterType: string;
    hasAll?: boolean;
}

export class CharacterDropdown extends React.Component<CharacterDropdownProps, {}> {
    public render() {
        let characters = ["Fox", "Falco", "Marth", "Sheik", "Jigglypuff", "Peach", "Ice Climbers", "Cptn. Falcon", "Pikachu",
            "Samus", "Dr. Mario", "Yoshi", "Luigi", "Gannon", "Mario", "Young Link", "Donkey Kong", "Link",
            "Mr. Game & Watch", "Roy", "Mewtwo", "Zelda", "Ness", "Pichu", "Bowser", "Kirby"];

        if (this.props.hasAll)
            characters.unshift("All Characters")

        let characterOptions = characters.map(character => <option value={character}>{character}</option>);

        return (
            <select name={ this.props.characterType } className="form-control" onChange={e => this.props.handleFieldChange(e)} value={ this.props.character }>
                { characterOptions }
            </select>
        );
    }
}