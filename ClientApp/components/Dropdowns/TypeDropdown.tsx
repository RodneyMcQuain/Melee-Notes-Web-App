import * as React from 'react';

interface TypeDropdownProps {
    handleFieldChange: Function;
    type: string;
    hasAll?: boolean;
}

export class TypeDropdown extends React.Component<TypeDropdownProps, {}> {
    public render() {
        let typeHasAll;
        if (this.props.hasAll)
            typeHasAll = <option value="All Types">All Types</option>

        return (
            <select name="type" className="form-control" onChange={ e => this.props.handleFieldChange(e) } value={ this.props.type } >
                { typeHasAll }
                <option value="Tournament">Tournament</option>
                <option value="Money Match">Money Match</option>
                <option value="Friendly">Friendly</option>
            </select>
        );
    }
}