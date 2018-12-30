import * as React from 'react';

interface StageDropdownProps {
    handleFieldChange: Function;
    stage: string;
}

export class StageDropdown extends React.Component<StageDropdownProps, {}> {
    public render() {
        let stages = ["Battlefield", "Dreamland", "Yoshis Story", "Fountain of Dreams", "Final Destination", "Pokemon Stadium"];
        let stageOptions = stages.map(stage => <option key={stage} value={stage}>{stage}</option>);

        return (
            <select name="stage" className="form-control" onChange={ e => this.props.handleFieldChange(e) } value={ this.props.stage }>
                { stageOptions }
            </select>
        );
    }
}