import * as React from "react";
import { History } from 'history';

interface IGoToTournamentButtonProps {
    tournamentId: number;
    history: History;
}

export const GoToTournamentButton = (props: IGoToTournamentButtonProps) => {
    const { tournamentId, history } = props;
    const onClick_btGoToTournament = (tournamentId: number) => {
        history.push(`/tournament/${tournamentId}`);
    }

    return <button className="btn" onClick={() => onClick_btGoToTournament(tournamentId)} >Go Back to Tournament</button>
}
