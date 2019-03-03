import * as React from 'react';
import { ISet } from 'ClientApp/helpers/interfaces';
import { Token } from '../../helpers/token';
import { RouteComponentProps } from 'react-router';
import { handleResponse } from '../../helpers/handleResponseErrors';

interface SetDropdownProps {
    handleFieldChange: Function;
    setId: number;
    tournamentId: number;
}

interface SetDropdownState {
    sets: ISet[];
}

interface OptionalRouteComponentProps {
    history?: RouteComponentProps<{}>;
}

export class SetDropdown extends React.Component<SetDropdownProps & OptionalRouteComponentProps, SetDropdownState> {
    constructor(props: SetDropdownProps & OptionalRouteComponentProps) {
        super(props);

        this.state = { sets: [] }
    }

    public componentDidMount() {
        fetch(`api/Tournament/${this.props.tournamentId}/Set`, { headers: Token.getAuthorizationHeaders() })
            .then(response => handleResponse(this.props.history, response))
            .then(response => response.json() as Promise<ISet[]>)
            .then(sets => this.setState({ sets: sets }))
            .catch(error => console.log(error));
    }

    public render() {
        let sets = this.state.sets;
        let handleFieldChange = this.props.handleFieldChange.bind(this);

        let setOptions
        if (sets.length === 0)
            setOptions = <option key="No Sets" value="No Sets" >No Sets Added</option>;
        else
            setOptions = sets.map(set => <option key={ set.id } value={ set.id } >{ set.bracketRound }</option>);

        return (
            <select name="tournamentId" className="form-control" onChange={ handleFieldChange } value={ this.props.setId } >
                { setOptions }
            </select>
        );
    }
}