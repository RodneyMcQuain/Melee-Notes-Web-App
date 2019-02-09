import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';
import { FormatDropdown } from '../Dropdowns/FormatDropdown';
import { CharacterDropdown } from '../Dropdowns/CharacterDropdown';
import { StageDropdown } from '../Dropdowns/StageDropdown';
import { PlayerDropdown } from '../Dropdowns/PlayerDropdown';
import { TypeDropdown } from '../Dropdowns/TypeDropdown';
import { ISet, IGame } from '../../helpers/interfaces';
import { handleResponse } from '../../helpers/handleResponseErrors';
import { Token } from '../../helpers/token';
import { ContentPreloader } from '../General/ContentPreloader';
import { Promise } from 'es6-promise';
import { TITLE_PREFIX } from '../../helpers/constants';

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

interface StatisticsState {
    statistic: IStatistic;
    dateDropdown: string;
    setsWon: number;
    setsLost: number;
    gamesWon: number[];
    gamesLost: number[];
    isStatisticLoading: boolean;
    isAfterFirstSubmit: boolean;
    isLoading: boolean;
}

type OnChangeSelectInputEvent = React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>;

export class Statistics extends React.Component<RouteComponentProps<{}>, StatisticsState> {
    constructor() {
        super();

        this.state = {
            statistic: {} as IStatistic,
            isLoading: true,
            isStatisticLoading: false,
            isAfterFirstSubmit: false,
            dateDropdown: "All Time",
            setsWon: -1,
            setsLost: -1,
            gamesWon: [],
            gamesLost: []
        }

        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleDateDropdownChange = this.handleDateDropdownChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public componentDidMount() {
        document.title = TITLE_PREFIX + "Statistics";
        let today = new Date().toISOString().slice(0, 10);

        let statistic = {
            myCharacter: "All Characters",
            opponentCharacter: "All Characters",
            playerId: 0, //this will indicate all players
            format: "All Formats",
            type: "All Types",
            startDate: "2001-01-01", //year the game was released in
            endDate: today,
        }

        this.setState({ statistic: statistic })
    }

    public render() {
        const { statistic, setsWon, setsLost, gamesWon, gamesLost, isStatisticLoading, isAfterFirstSubmit } = this.state;

        const date = this.state.dateDropdown === "Specify Date"
            ? <div>
                <div className="statistic-form-margin form-group col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <label htmlFor="startDate" >Start Date</label>
                    <input type="date" name="startDate" className="form-control" value={statistic.startDate} onChange={this.handleFieldChange} />
                </div>

                <div className="statistic-form-margin form-group col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <label htmlFor="endDate" >End Date</label>
                    <input type="date" name="endDate" className="form-control" value={statistic.endDate} onChange={this.handleFieldChange} />
                </div>
            </div>
            : <div></div>
        
        const statisticContent = isStatisticLoading
            ? <ContentPreloader />
            : <div>
                <div className="col-xs-12" >Set Count: { setsWon }-{ setsLost } (excludes character in query)</div>

                { this.renderStages(gamesWon, gamesLost) }
            </div>

        const afterFirstSubmit = isAfterFirstSubmit
            ? <div className="row statistic-negative-margin" >
                { statisticContent }
            </div>
           : <div></div>

        return (
            <div>
                <h1>Statistics</h1>

                <form className="form-horizontal" onSubmit={this.handleSubmit} >
                    <div className="statistic-form-margin form-group col-lg-4 col-md-4 col-sm-6 col-xs-12" >
                        <label htmlFor="myCharacter" >My Character</label>
                        <CharacterDropdown handleFieldChange={(e: OnChangeSelectInputEvent) => this.handleFieldChange(e)} character={statistic.myCharacter} characterType="myCharacter" hasAll={true} />
                    </div>

                    <div className="statistic-form-margin form-group col-lg-4 col-md-4 col-sm-6 col-xs-12" >
                        <label htmlFor="oppponentCharacter" >Opponent Character</label>
                        <CharacterDropdown handleFieldChange={(e: OnChangeSelectInputEvent) => this.handleFieldChange(e)} character={statistic.opponentCharacter} characterType="opponentCharacter" hasAll={true} />
                    </div>

                    <div className="statistic-form-margin form-group col-lg-4 col-md-4 col-sm-6 col-xs-12" >
                        <label htmlFor="player" >Player</label>
                        <PlayerDropdown handleFieldChange={(e: OnChangeSelectInputEvent) => this.handleFieldChange(e)} playerId={statistic.playerId} hasAll={true} />
                    </div>

                    <div className="statistic-form-margin form-group col-lg-4 col-md-4 col-sm-6 col-xs-12" >
                        <label htmlFor="format" >Format</label>
                        <FormatDropdown handleFieldChange={(e: OnChangeSelectInputEvent) => this.handleFieldChange(e)} format={statistic.format} hasAll={true} />
                    </div>

                    <div className="statistic-form-margin form-group col-lg-4 col-md-4 col-sm-6 col-xs-12">
                        <label htmlFor="type" >Type</label>
                        <TypeDropdown handleFieldChange={(e: OnChangeSelectInputEvent) => this.handleFieldChange(e)} type={statistic.type} hasAll={true} />
                    </div>

                    <div className="statistic-form-margin form-group col-lg-4 col-md-4 col-sm-6 col-xs-12">
                        <label htmlFor="dateType" >Date</label> 
                        <select name="dateType" className="form-control" value={this.state.dateDropdown} onChange={this.handleDateDropdownChange} >
                            <option value="All Time">All Time</option>
                            <option value="Specify Date">Specify Date</option>
                        </select>
                    </div>

                    { date }

                    <div className="col-xs-12 statistic-submit-button" >
                        <input type="submit" value="Get Statistics" className="btn" />
                    </div>
                </form>

                { afterFirstSubmit }
            </div>
        );
    }

    private renderStages(gamesWon: number[], gamesLost: number[]) {
        const BATTLEFIELD_ID = 0;
        const DREAMLAND_ID = 1;
        const YOSHIS_STORY_ID = 2;
        const FOUNTAIN_OF_DREAMS_ID = 3;
        const FINAL_DESTINATION_ID = 4;
        const POKEMON_STADIUM_ID = 5;

        return (
            <div>
                <div className="img-padding-margin col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <img className="stage" src={require('../../images/Battlefield.jpg')}></img>
                    <div className="-center-container">{ gamesWon[BATTLEFIELD_ID] } - { gamesLost[BATTLEFIELD_ID] }</div>
                    <div className="-center-container">{ this.calculateWinRate(gamesWon[BATTLEFIELD_ID], gamesLost[BATTLEFIELD_ID]) }%</div>
                </div>

                <div className="img-padding-margin col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <img className="stage" src={require('../../images/Dreamland.jpg')}></img>
                    <div className="-center-container">{ gamesWon[DREAMLAND_ID] } - { gamesLost[DREAMLAND_ID] }</div>
                    <div className="-center-container">{ this.calculateWinRate(gamesWon[DREAMLAND_ID], gamesLost[DREAMLAND_ID]) }%</div>
                </div>

                <div className="img-padding-margin col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <img className="stage" src={require('../../images/FinalDestination.jpg')}></img>
                    <div className="-center-container">{ gamesWon[FINAL_DESTINATION_ID] } - { gamesLost[FINAL_DESTINATION_ID] }</div>
                    <div className="-center-container">{ this.calculateWinRate(gamesWon[FINAL_DESTINATION_ID], gamesLost[FINAL_DESTINATION_ID]) }%</div>
                </div>

                <div className="img-padding-margin col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <img className="stage" src={require('../../images/FountainOfDreams.jpg')}></img>
                    <div className="-center-container">{ gamesWon[FOUNTAIN_OF_DREAMS_ID] } - { gamesLost[FOUNTAIN_OF_DREAMS_ID] }</div>
                    <div className="-center-container">{ this.calculateWinRate(gamesWon[FOUNTAIN_OF_DREAMS_ID], gamesLost[FOUNTAIN_OF_DREAMS_ID]) }%</div>
                </div>

                <div className="img-padding-margin col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <img className="stage" src={require('../../images/PokemonStadium.jpg')}></img>
                    <div className="-center-container">{ gamesWon[POKEMON_STADIUM_ID] } - { gamesLost[POKEMON_STADIUM_ID] }</div>
                    <div className="-center-container">{ this.calculateWinRate(gamesWon[POKEMON_STADIUM_ID], gamesLost[POKEMON_STADIUM_ID]) }%</div>
                </div>

                <div className="img-padding-margin col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <img className="stage" src={require('../../images/YoshisIsland.jpg')}></img>
                    <div className="-center-container">{ gamesWon[YOSHIS_STORY_ID] } - { gamesLost[YOSHIS_STORY_ID] }</div>
                    <div className="-center-container">{ this.calculateWinRate(gamesWon[YOSHIS_STORY_ID], gamesLost[YOSHIS_STORY_ID]) }%</div>
                </div>
            </div>
        );
    }

    private calculateWinRate(wonCount: number, lostCount: number) {
        let totalGames = wonCount + lostCount;

        if (totalGames <= 0)
            return 0;

        let winRate = (wonCount / totalGames) * 100;

        return winRate.toFixed(2);
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
        let statistic = this.modifyStatisticBeforeSubmit(this.state.statistic);
        let userId = Token.getUserId();
        this.setState({
            isAfterFirstSubmit: true,
            isStatisticLoading: true
        });

        let setsWon = 0;
        let setsLost = 0;
        let gamesWon = [] as number[];
        let gamesLost = [] as number[];
        this.getSetsWon(userId, statistic)
            .then(setsWonResult => setsWon = setsWonResult)
            .then(() => this.getSetsLost(userId, statistic))
            .then(setsLostResult => setsLost = setsLostResult)
            .then(() => this.getGamesByOutcome(userId, statistic, "Won"))
            .then(gamesWonResult => gamesWon = gamesWonResult)
            .then(() => this.getGamesByOutcome(userId, statistic, "Lost"))
            .then(gamesLostResult => gamesLost = gamesLostResult)
            .then(() => this.setState({
                setsWon: setsWon,
                setsLost: setsLost,
                gamesWon: gamesWon,
                gamesLost: gamesLost,
                isStatisticLoading: false
            }))
            .catch(error => console.log(error));
    }

    private getGamesByOutcome(userId: string, statistic: IStatistic, outcome: string) {
        let stages = ["Battlefield", "Dreamland", "Yoshis Story", "Fountain of Dreams", "Final Destination", "Pokemon Stadium"];
        statistic.outcome = outcome;

        let requests = stages.map(stage => {
            statistic.stage = stage;

            return fetch(`api/Statistic/GetGameOutcomeByStage/User/${userId}`, {
                method: 'POST',
                headers: Token.getAuthorizationHeaders(),
                body: JSON.stringify(statistic)
            });
        });

        return Promise.all(requests)
            .then(responses => Promise.all(responses.map(response => handleResponse(this.props.history, response))))
            .then(responses => Promise.all(responses.map(response => response.json() as Promise<number>)));
    }

    private getSetsWon(userId: string, statistic: IStatistic) {
        return fetch(`api/Statistic/GetSetsWon/User/${userId}`, {
            method: 'POST',
            headers: Token.getAuthorizationHeaders(),
            body: JSON.stringify(statistic)
        })
            .then(response => handleResponse(this.props.history, response))
            .then(response => response.json() as Promise<number>)
    }

    private getSetsLost(userId: string, statistic: IStatistic) {
        return fetch(`api/Statistic/GetSetsLost/User/${userId}`, {
            method: 'POST',
            headers: Token.getAuthorizationHeaders(),
            body: JSON.stringify(statistic)
        })
            .then(response => handleResponse(this.props.history, response))
            .then(response => response.json() as Promise<number>)
    }

    private modifyStatisticBeforeSubmit(statistic: IStatistic) {
        if (statistic.myCharacter === "All Characters")
            statistic.myCharacter = "";

        if (statistic.opponentCharacter === "All Characters")
            statistic.opponentCharacter = "";

        if (statistic.format === "All Formats")
            statistic.format = "";

        if (statistic.type === "All Types")
            statistic.type = "";

        return statistic;
    }
}
