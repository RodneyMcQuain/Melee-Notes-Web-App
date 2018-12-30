import * as React from 'react';

interface FormatDropdownProps {
    handleFieldChange: Function;
    format: string;
}

export class FormatDropdown extends React.Component<FormatDropdownProps, {}> {
    public render() {
        return (
            <select name="format" className="form-control" onChange={ e => this.props.handleFieldChange(e) } value={ this.props.format }>
                <option value="Bo3">Best of 3</option>
                <option value="Bo5">Best of 5</option>
            </select>
        );
    }
}