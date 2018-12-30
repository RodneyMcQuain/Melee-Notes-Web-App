import * as React from 'react';
import { ISet } from 'ClientApp/helpers/interfaces';
import { getAuthorizationHeaders } from '../../helpers/token';

interface SetDropdownProps {
    handleFieldChange: Function;
    setId: number;
    tournamentId: number;
}

interface SetDropdownState {
    sets: ISet[];
}

export class SetDropdown extends React.Component<SetDropdownProps, SetDropdownState> {
    constructor() {
        super();

        this.state = { sets: [] }
    }

    public componentDidMount() {
        fetch(`api/Tournament/${this.props.tournamentId}/Set`, { headers: getAuthorizationHeaders })
            .then(response => response.json() as Promise<ISet[]>)
            .then(sets => { this.setState({ sets: sets }); });
    }

    public render() {
        let sets = this.state.sets;
        let handleFieldChange = this.props.handleFieldChange.bind(this);

        let setOptions = sets.map(set => <option key={set.id} value={set.id} >{set.bracketRound}</option>);

        return (
            <select name="tournamentId" className="form-control" onChange={ handleFieldChange } value={ this.props.setId } >
                { setOptions }
            </select>
        );
    }
}