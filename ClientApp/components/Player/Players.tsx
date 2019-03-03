import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { IPlayer } from 'ClientApp/helpers/interfaces';
import { Preloader } from '../General/Preloader';
import { Token } from '../../helpers/token';
import { handleResponse } from '../../helpers/handleResponseErrors';
import { TITLE_PREFIX } from '../../helpers/constants';

interface PlayersState {
    players: IPlayer[];
    isLoading: boolean;
}

export class Players extends React.Component<RouteComponentProps<{}>, PlayersState> {
    constructor(props: RouteComponentProps<{}>) {
        super(props);
        this.state = {
            players: [] as IPlayer[],
            isLoading: true
        }
    }

    public componentDidMount() {
        document.title = TITLE_PREFIX + "Players";
        let userId = Token.getUserId();
        
        fetch(`api/Player/User/${userId}`, { headers: Token.getAuthorizationHeaders() })
            .then(response => handleResponse(this.props.history, response))
            .then(response => response.json() as Promise<IPlayer[]>)
            .then(players => { this.setState({ players: players, isLoading: false }); })
            .catch(error => console.log(error));
    }

    public render() {
        let isLoading = this.state.isLoading;
        let players = this.state.players;

        if (isLoading)
            return <Preloader />
        else
            return (
                <div>
                    <h1>Players</h1>

                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Tag</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.map(player =>
                                <tr key={ player.id } onClick={ () => this.onClick_trPlayer(player.id) } >
                                    <td>{ player.tag }</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <button className="btn" onClick={ () => this.onClick_btAddPlayer() } >Add Player</button>
                </div>     
            );
    }

    private onClick_trPlayer(playerId: number) {
        this.props.history.push(`/player/${playerId}`);
    }

    private onClick_btAddPlayer() {
        this.props.history.push(`/addPlayer`);
    }
}