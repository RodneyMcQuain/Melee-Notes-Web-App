import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';
import { FormatDropdown } from '../Dropdowns/FormatDropdown';
import { CharacterDropdown } from '../Dropdowns/CharacterDropdown';
import { StageDropdown } from '../Dropdowns/StageDropdown';
import { PlayerDropdown } from '../Dropdowns/PlayerDropdown';
import { TypeDropdown } from '../Dropdowns/TypeDropdown';
import { ISet, IGame } from '../../helpers/interfaces';

interface IStatistic {
    myCharacter: string;
    opponentCharacter: string;
    stage: string;
    playerId: number;
    format: string;
    type: string;
    startDate: string;
    endDate: string;
    [key: string]: any;
}

interface StatisticsState {
    statistic: IStatistic;
    dateDropdown: string;
    isLoading: boolean;
}

type OnChangeSelectInputEvent = React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>;

export class Statistics extends React.Component<RouteComponentProps<{}>, StatisticsState> {
    constructor() {
        super();

        this.state = {
            statistic: {} as IStatistic,
            isLoading: true,
            dateDropdown: "All Time",
        }

        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleDateDropdownChange = this.handleDateDropdownChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public componentDidMount() {
        let today = new Date().toISOString().slice(0, 10);

        let statistic = {
            myCharacter: "All Characters",
            opponentCharacter: "All Characters",
            playerId: 0, //this will indicate all players
            stage: "All Stages",
            format: "All Formats",
            type: "All Types",
            startDate: "2001-01-01",
            endDate: today
        }

        this.setState({ statistic: statistic })
    }

    public render() {
        let statistic = this.state.statistic;

        let date = this.state.dateDropdown === "Specify Date"
            ? <div>
                <label>Start Date</label>
                <input type="date" name="startDate" className="form-control" value={ statistic.startDate } onChange={ this.handleFieldChange } />

                <label>End Date</label>
                <input type="date" name="endDate" className="form-control" value={ statistic.endDate } onChange={ this.handleFieldChange } />
            </div>
            : <div></div>

        return (
            <div>
                <h1>Statistics</h1>

                <form onSubmit={this.handleSubmit} >
                    <label>My Character</label>
                    <CharacterDropdown handleFieldChange={(e: OnChangeSelectInputEvent) => this.handleFieldChange(e)} character={statistic.myCharacter} characterType="myCharacter" hasAll={true} />

                    <label>Opponent Character</label>
                    <CharacterDropdown handleFieldChange={(e: OnChangeSelectInputEvent) => this.handleFieldChange(e)} character={statistic.opponentCharacter} characterType="opponentCharacter" hasAll={true} />

                    <label>Player</label>
                    <PlayerDropdown handleFieldChange={(e: OnChangeSelectInputEvent) => this.handleFieldChange(e)} playerId={statistic.playerId} hasAll={true} />

                    <label>Format</label>
                    <FormatDropdown handleFieldChange={(e: OnChangeSelectInputEvent) => this.handleFieldChange(e)} format={statistic.format} hasAll={true} />

                    <label>Type</label>
                    <TypeDropdown handleFieldChange={(e: OnChangeSelectInputEvent) => this.handleFieldChange(e)} type={statistic.type} hasAll={true} />

                    <label>Date</label> 
                    <select name="dateType" className="form-control" value={ this.state.dateDropdown } onChange={ this.handleDateDropdownChange } >
                        <option value="All Time">All Time</option>
                        <option value="Specify Date">Specify Date</option>
                    </select>

                    { date }

                    <input type="submit" value="Get Statistics" className="btn" />
                </form>

                <img src={require('../../images/Battlefield.jpg')}></img>
                <img src={require('../../images/Dreamland.jpg')}></img>
                <img src={require('../../images/FinalDestination.jpg')}></img>
                <img src={require('../../images/FountainOfDreams.jpg')}></img>
                <img src={require('../../images/PokemonStadium.jpg')}></img>
                <img src={require('../../images/YoshisIsland.jpg')}></img>
            </div>
        );
    }

    private handleFieldChange(event: OnChangeSelectInputEvent) {
        let key: any = event.target.name;
        let statistic = this.state.statistic;
        statistic[key] = event.target.value;
        this.setState({ statistic: statistic });
    }

    private handleDateDropdownChange(event: React.ChangeEvent<HTMLSelectElement>) {
        this.setState({ dateDropdown: event.target.value });
    }

    public handleSubmit(event: React.FormEvent<EventTarget>) {
        event.preventDefault();
        let statistic = this.state.statistic;
        console.log(statistic);

        //fetch
        //catch
    }
}
