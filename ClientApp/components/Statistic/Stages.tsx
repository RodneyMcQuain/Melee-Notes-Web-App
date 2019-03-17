import * as React from 'react';

interface StagesProps {
    gamesWon: number[];
    gamesLost: number[];
}

export const Stages = (props: StagesProps) => {
    const BATTLEFIELD_ID = 0;
    const DREAMLAND_ID = 1;
    const YOSHIS_STORY_ID = 2;
    const FOUNTAIN_OF_DREAMS_ID = 3;
    const FINAL_DESTINATION_ID = 4;
    const POKEMON_STADIUM_ID = 5;
    const WIN_LOSS = "Win-Loss: ";
    const WIN_PERCENTAGE = "Win Percentage: ";
    const { gamesWon, gamesLost } = props;


    return (
        <div>
            <div className="img-padding-margin col-lg-4 col-md-4 col-sm-6 col-xs-12">
                <img className="stage" src={require('../../images/Battlefield.jpg')}></img>
                <div className="-center-container">
                    <div>{ WIN_LOSS }{ gamesWon[BATTLEFIELD_ID] } - { gamesLost[BATTLEFIELD_ID] }</div>
                    <div>{ WIN_PERCENTAGE }{ calculateWinRate(gamesWon[BATTLEFIELD_ID], gamesLost[BATTLEFIELD_ID]) }%</div>
                </div>
            </div>

            <div className="img-padding-margin col-lg-4 col-md-4 col-sm-6 col-xs-12">
                <img className="stage" src={require('../../images/Dreamland.jpg')}></img>
                <div className="-center-container">
                    <div>{ WIN_LOSS }{ gamesWon[DREAMLAND_ID] } - { gamesLost[DREAMLAND_ID] }</div>
                    <div>{ WIN_PERCENTAGE }{ calculateWinRate(gamesWon[DREAMLAND_ID], gamesLost[DREAMLAND_ID]) }%</div>
                </div>
            </div>

            <div className="img-padding-margin col-lg-4 col-md-4 col-sm-6 col-xs-12">
                <img className="stage" src={require('../../images/FinalDestination.jpg')}></img>
                <div className="-center-container">
                    <div>{ WIN_LOSS }{ gamesWon[FINAL_DESTINATION_ID] } - { gamesLost[FINAL_DESTINATION_ID] }</div>
                    <div>{ WIN_PERCENTAGE }{ calculateWinRate(gamesWon[FINAL_DESTINATION_ID], gamesLost[FINAL_DESTINATION_ID]) }%</div>
                </div>
            </div>

            <div className="img-padding-margin col-lg-4 col-md-4 col-sm-6 col-xs-12">
                <img className="stage" src={require('../../images/FountainOfDreams.jpg')}></img>
                <div className="-center-container">
                    <div>{ WIN_LOSS }{ gamesWon[FOUNTAIN_OF_DREAMS_ID] } - { gamesLost[FOUNTAIN_OF_DREAMS_ID] }</div>
                    <div>{ WIN_PERCENTAGE }{ calculateWinRate(gamesWon[FOUNTAIN_OF_DREAMS_ID], gamesLost[FOUNTAIN_OF_DREAMS_ID]) }%</div>
                </div>
            </div>

            <div className="img-padding-margin col-lg-4 col-md-4 col-sm-6 col-xs-12">
                <img className="stage" src={require('../../images/PokemonStadium.jpg')}></img>
                <div className="-center-container">
                    <div>{ WIN_LOSS }{ gamesWon[POKEMON_STADIUM_ID] } - { gamesLost[POKEMON_STADIUM_ID] }</div>
                    <div>{ WIN_PERCENTAGE }{ calculateWinRate(gamesWon[POKEMON_STADIUM_ID], gamesLost[POKEMON_STADIUM_ID]) }%</div>
                </div>
            </div>

            <div className="img-padding-margin col-lg-4 col-md-4 col-sm-6 col-xs-12">
                <img className="stage" src={require('../../images/YoshisIsland.jpg')}></img>
                <div className="-center-container">
                    <div>{ WIN_LOSS }{ gamesWon[YOSHIS_STORY_ID] } - { gamesLost[YOSHIS_STORY_ID] }</div>
                    <div>{ WIN_PERCENTAGE }{ calculateWinRate(gamesWon[YOSHIS_STORY_ID], gamesLost[YOSHIS_STORY_ID]) }%</div>
                </div>
            </div>
        </div>
    
    );
}

export const calculateWinRate = (wonCount: number, lostCount: number): string => {
    let totalGames = wonCount + lostCount;

    if (totalGames <= 0)
        return "0.00";

    let winRate = (wonCount / totalGames) * 100;

    return winRate.toFixed(2);
}