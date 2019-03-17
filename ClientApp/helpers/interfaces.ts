export interface ITournament {
    id: number;
    name: string;
    date: string;
    myPlacing: number;
    city: string;
    state: string;
    notes: string;
    sets: ISet[];
    [key: string]: any;
}

export interface ISet {
    id: number;
    tournamentId: number;
    playerId: number;
    outcome: string;
    bracketRound: string;
    format: string;
    type: string;
    notes: string;
    games: IGame[];
    [key: string]: any;
}

export interface IGame {
    id: number;
    setId: number;
    outcome: string;
    myCharacter: string;
    opponentCharacter: string;
    stage: string;
    [key: string]: any;
}

export interface IPlayer {
    id: number;
    tag: string;
    notes: string;
    [key: string]: any;
}

export interface IUser {
    id: number;
    username: string;
    email: string;
    password: string;
    dateCreated: string;
    [key: string]: any;
}

export interface IToken {
    token: string;
    userId: string;
    username: string;
    email: string;
    dateCreated: string;
}

export interface IStatistic {
    myCharacter: string;
    opponentCharacter: string;
    playerId: number;
    format: string;
    type: string;
    startDate: string;
    endDate: string;
    [key: string]: any;
}