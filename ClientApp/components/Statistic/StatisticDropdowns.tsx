import * as React from 'react';
import { CharacterDropdown } from '../Dropdowns/CharacterDropdown';
import { PlayerDropdown } from '../Dropdowns/PlayerDropdown';
import { FormatDropdown } from '../Dropdowns/FormatDropdown';
import { TypeDropdown } from '../Dropdowns/TypeDropdown';
import { StartEndDate } from './StartEndDate';

interface IStatistic {
    myCharacter: string;
    opponentCharacter: string;
    playerId: number;
    format: string;
    type: string;
    startDate: string;
    endDate: string;
    [key: string]: any;
}

interface StatisticDropdownsProps {
    statistic: IStatistic;
    handleFieldChange: Function;
}

interface StatisticDropdownsState {
    dateDropdown: string;
}

export class StatisticDropdowns extends React.Component<StatisticDropdownsProps, StatisticDropdownsState> {
    constructor(props: StatisticDropdownsProps) {
        super(props);

        this.state = {
            dateDropdown: "All Time"
        };
    }

    public render() {
        const dateDropdown = this.state.dateDropdown;
        const { statistic, handleFieldChange } = this.props;

        const date = dateDropdown === "Specify Date"
            ? <StartEndDate
                startDate={statistic.startDate}
                endDate={statistic.endDate}
                handleFieldChange={handleFieldChange}
            />
            : <div></div>

        return (
            <>
                <div className="statistic-form-margin form-group col-lg-4 col-md-4 col-sm-6 col-xs-12" >
                    <label htmlFor="myCharacter" >My Character</label>
                    <CharacterDropdown handleFieldChange={handleFieldChange} character={statistic.myCharacter} characterType="myCharacter" hasAll={true} />
                </div>

                <div className="statistic-form-margin form-group col-lg-4 col-md-4 col-sm-6 col-xs-12" >
                    <label htmlFor="oppponentCharacter" >Opponent Character</label>
                    <CharacterDropdown handleFieldChange={handleFieldChange} character={statistic.opponentCharacter} characterType="opponentCharacter" hasAll={true} />
                </div>

                <div className="statistic-form-margin form-group col-lg-4 col-md-4 col-sm-6 col-xs-12" >
                    <label htmlFor="player" >Player</label>
                    <PlayerDropdown handleFieldChange={handleFieldChange} playerId={statistic.playerId} hasAll={true} />
                </div>

                <div className="statistic-form-margin form-group col-lg-4 col-md-4 col-sm-6 col-xs-12" >
                    <label htmlFor="format" >Format</label>
                    <FormatDropdown handleFieldChange={handleFieldChange} format={statistic.format} hasAll={true} />
                </div>

                <div className="statistic-form-margin form-group col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <label htmlFor="type" >Type</label>
                    <TypeDropdown handleFieldChange={handleFieldChange} type={statistic.type} hasAll={true} />
                </div>

                <div className="statistic-form-margin form-group col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <label htmlFor="dateType" >Date</label>
                    <select name="dateType" className="form-control" value={dateDropdown} onChange={e => this.handleDateDropdownChange(e)} >
                        <option value="All Time">All Time</option>
                        <option value="Specify Date">Specify Date</option>
                    </select>
                </div>

                { date }
            </>
        );
    }

    private handleDateDropdownChange(event: React.ChangeEvent<HTMLSelectElement>) {
        this.setState({ dateDropdown: event.target.value });
    }
}