import * as React from 'react';

interface OutcomeDropdownProps {
    handleFieldChange: Function;
    outcome: string;
}

export class OutcomeDropdown extends React.Component<OutcomeDropdownProps, {}> {
    public render() {
        return (
            <select name="outcome" className="form-control" onChange={ e => this.props.handleFieldChange(e) } value={ this.props.outcome }>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
            </select>
        );
    }
}