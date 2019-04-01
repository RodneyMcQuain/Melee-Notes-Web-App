import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';
import { handleResponse } from '../../helpers/handleResponseErrors';
import { Token } from '../../helpers/token';
import { ContentPreloader } from '../General/ContentPreloader';
import { Promise } from 'es6-promise';
import { TITLE_PREFIX } from '../../helpers/constants';
import { Stages } from './Stages';
import { StatisticDropdowns } from './StatisticDropdowns';
import { IStatistic } from '../../helpers/interfaces';
import { SetRatio } from './SetRatio';

interface StatisticsState {
    statistic: IStatistic;
    setsWon: number;
    setsLost: number;
    gamesWon: number[];
    gamesLost: number[];
    dateDropdown: string;
    isStatisticLoading: boolean;
    isAfterFirstSubmit: boolean;
    isLoading: boolean;
}

type OnChangeSelectInputEvent = React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>;

export class Statistics extends React.Component<RouteComponentProps<{}>, StatisticsState> {
    END_DATE: string;
    START_DATE: string;

    constructor(props: RouteComponentProps<{}>) {
        super(props);

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

        this.START_DATE = "2001-01-01"; //year the game was released in
        this.END_DATE = new Date().toISOString().slice(0, 10); //today's date
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleDateDropdownChange = this.handleDateDropdownChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public componentDidMount() {
        document.title = TITLE_PREFIX + "Statistics";

        let statistic = {
            myCharacter: "All Characters",
            opponentCharacter: "All Characters",
            playerId: 0, //this will indicate all players
            format: "All Formats",
            type: "All Types",
            startDate: this.START_DATE,
            endDate: this.END_DATE
        }

        this.setState({ statistic: statistic })
    }

    public render() {
        const { statistic, setsWon, setsLost, gamesWon, gamesLost, dateDropdown, isStatisticLoading, isAfterFirstSubmit } = this.state;
        
        const statisticContent = isStatisticLoading
            ? <ContentPreloader />
            : <>
                <SetRatio setsWon={ setsWon } setsLost={ setsLost } />
                <Stages gamesWon={ gamesWon } gamesLost={ gamesLost } />
            </>

        const afterFirstSubmit = isAfterFirstSubmit
            ? <div className="row statistic-negative-margin" >
                { statisticContent }
            </div>
           : <div></div>

        return (
            <div>
                <h1>Statistics</h1>

                <form className="form-horizontal" onSubmit={this.handleSubmit} >
                    <StatisticDropdowns 
                        statistic={ statistic } 
                        dateDropdown={ dateDropdown }
                        handleFieldChange={ this.handleFieldChange } 
                        handleDateDropdownChange={ this.handleDateDropdownChange }
                    />

                    <div className="col-xs-12 statistic-submit-button" >
                        <input type="submit" value="Get Statistics" className="btn" />
                    </div>
                </form>

                { afterFirstSubmit }
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
        const { statistic, dateDropdown } = this.state;
        let statisticModified = this.modifyStatisticBeforeSubmit(statistic, dateDropdown);
        let userId = Token.getUserId();
        this.setState({
            isAfterFirstSubmit: true,
            isStatisticLoading: true
        });

        let setsWon = 0;
        let setsLost = 0;
        let gamesWon = [] as number[];
        let gamesLost = [] as number[];
        this.getSetsWon(userId, statisticModified)
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

    private modifyStatisticBeforeSubmit(statistic: IStatistic, dateDropdown: string) {
        if (statistic.myCharacter === "All Characters")
            statistic.myCharacter = "";

        if (statistic.opponentCharacter === "All Characters")
            statistic.opponentCharacter = "";

        if (statistic.format === "All Formats")
            statistic.format = "";

        if (statistic.type === "All Types")
            statistic.type = "";

        if (dateDropdown === "All Time") {
            statistic.startDate = this.START_DATE;
            statistic.endDate = this.END_DATE;
        }

        return statistic;
    }
}
