import * as React from 'react';

interface TypeDropdownProps {
    handleFieldChange: Function;
    type: string;
}

export class TypeDropdown extends React.Component<TypeDropdownProps, {}> {
    public render() {
        return (
            <select name="type" className="form-control" onChange={ e => this.props.handleFieldChange(e) } value={ this.props.type }>
                <option value="Tournament">Tournament</option>
                <option value="Money Match">Money Match</option>
                <option value="Friendly">Friendly</option>
            </select>
        );
    }
}