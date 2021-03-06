﻿import * as React from 'react';
import { CharacterDropdown } from '../Dropdowns/CharacterDropdown';
import { PlayerDropdown } from '../Dropdowns/PlayerDropdown';
import { FormatDropdown } from '../Dropdowns/FormatDropdown';
import { TypeDropdown } from '../Dropdowns/TypeDropdown';
import { StartEndDate } from './StartEndDate';
import { IStatistic } from '../../helpers/interfaces';

interface StatisticDropdownsProps {
    statistic: IStatistic;
    dateDropdown: string;
    handleFieldChange: Function;
    handleDateDropdownChange: Function;
}

export const StatisticDropdowns = (props: StatisticDropdownsProps) => {
    const { statistic, dateDropdown, handleFieldChange, handleDateDropdownChange } = props;

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
                <select name="dateType" className="form-control" value={dateDropdown} onChange={e => handleDateDropdownChange(e)} >
                    <option value="All Time">All Time</option>
                    <option value="Specify Date">Specify Date</option>
                </select>
            </div>

            { date }
        </>
    );
}