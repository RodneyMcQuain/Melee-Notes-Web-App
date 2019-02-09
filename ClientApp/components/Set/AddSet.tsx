import * as React from 'react';
import { SetForm } from '../Set/SetForm';
import { RouteComponentProps } from 'react-router';
import { ITournament, ISet } from 'ClientApp/helpers/interfaces';
import { Preloader } from '../General/Preloader';
import { Token } from '../../helpers/token';
import { handleResponse } from '../../helpers/handleResponseErrors';
import { TITLE_PREFIX } from '../../helpers/constants';

interface AddSetState {
    set: ISet;
    isLoading: boolean;
}

type SelectedTournamentProps = RouteComponentProps<{ tournamentId: string }>;

export class AddSet extends React.Component<SelectedTournamentProps, AddSetState> {
    constructor() {
        super();
        this.state = {
            set: {} as ISet,
            isLoading: true
        }

        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public componentDidMount() {
        document.title = TITLE_PREFIX + "Add Set";
        let selectedTournamentId = parseInt(this.props.match.params.tournamentId) || 0;
        let selectedPlayerId = 0;
        let set = {} as ISet;
        let userId = Token.getUserId();

        if (selectedTournamentId === 0) {
            fetch(`api/Tournament/User/${userId}`, { headers: Token.getAuthorizationHeaders() })
                .then(response => handleResponse(this.props.history, response))
                .then(response => response.json() as Promise<ITournament[]>)
                .then(tournaments => {
                    if (tournaments[0])
                        return tournaments[0].id

                    return -1;
                })
                .then(initialTournamentId => {
                    let initialPlayerId = this.fetchInitialPlayerId(userId);
                    initialPlayerId.then(initialPlayerId => this.setDefaultSetValues(initialTournamentId, initialPlayerId));
                })
                .catch(error => console.log(error));
        } else {
            let initialPlayerId = this.fetchInitialPlayerId(userId);
            initialPlayerId.then(initialPlayerId => this.setDefaultSetValues(selectedTournamentId, initialPlayerId));
        }        
    }

    private fetchInitialPlayerId(userId: string): Promise<number> {
        return fetch(`api/Player/User/${userId}`, { headers: Token.getAuthorizationHeaders() })
            .then(response => handleResponse(this.props.history, response))
            .then(response => response.json() as Promise<ITournament[]>)
            .then(players => {
                if (players[0])
                    return players[0].id;

                return -1;
            })
    }

    private setDefaultSetValues(initialTournamentId: number, intialPlayerId: number) {
        let set = JSON.parse(JSON.stringify(this.state.set));

        set = {
            tournamentId: initialTournamentId,
            playerId: intialPlayerId,
            outcome: "Won",
            format: "Bo3",
            type: "Tournament"
        }

        this.setState({ set: set, isLoading: false });
    }

    public render() {
        let isLoading = this.state.isLoading;

        if (isLoading)
            return <Preloader />
        else
            return (
                <div>
                    <h1>Add Set</h1>

                    <SetForm handleFieldChange={ this.handleFieldChange } set={ this.state.set } handleSubmit={ this.handleSubmit } submitButtonName="Add Set" history={ this.props.history } />
                </div>
            );
    }

    private handleFieldChange(event: React.ChangeEvent<HTMLSelectElement>) {
        let key: any = event.target.name;
        let set = this.state.set;
        set[key] = event.target.value;
        this.setState({ set: set });
    }

    public handleSubmit(event: React.FormEvent<EventTarget>) {
        event.preventDefault();
        let set = this.state.set;
        let userId = Token.getUserId();

        fetch(`api/Set/User/${userId}`, {
            method: 'POST',
            headers: Token.getAuthorizationHeaders(),
            body: JSON.stringify(set)
        })
            .then(response => handleResponse(this.props.history, response))
            .then(() => { this.props.history.push(`/tournament/${set.tournamentId}`) })
            .catch (error => console.log(error));
    }
}