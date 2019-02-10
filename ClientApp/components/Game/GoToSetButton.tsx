import * as React from "react";
import { History } from 'history';

interface IGoToSetButtonProps {
    tournamentId: number;
    setId: number;
    history: History;

}

export const GoToSetButton = (props: IGoToSetButtonProps) => {
    const { tournamentId, setId, history } = props;
    const onClick_btGoToSet = (tournamentId: number, setId: number) => {
        history.push(`/tournament/${tournamentId}/set/${setId}`);    
    }

    return <button className="btn" onClick={() => onClick_btGoToSet(tournamentId, setId)} >Go Back to Set</button>
}
