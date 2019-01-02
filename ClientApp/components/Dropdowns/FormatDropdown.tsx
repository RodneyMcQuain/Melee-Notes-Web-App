import * as React from 'react';

interface FormatDropdownProps {
    handleFieldChange: Function;
    format: string;
    hasAll?: boolean;
}

export class FormatDropdown extends React.Component<FormatDropdownProps, {}> {
    public render() {
        let formatHasAll;
        if (this.props.hasAll)
            formatHasAll = <option value="All Formats">All Formats</option>

        return (
            <select name="format" className="form-control" onChange={ e => this.props.handleFieldChange(e) } value={ this.props.format }>
                { formatHasAll }
                <option value="Bo3">Best of 3</option>
                <option value="Bo5">Best of 5</option>
            </select>
        );
    }
}