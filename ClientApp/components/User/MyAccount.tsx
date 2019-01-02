import * as React from 'react';
import { logout, getCurrentUserId, getAuthorizationHeaders } from '../../helpers/token';
import { RouteComponentProps } from 'react-router';
import { IUser } from '../../helpers/interfaces';
import { handleResponse } from '../../helpers/handleResponseErrors';
import { formatDate } from '../../helpers/formatDate';

interface MyAccountState {
    user: IUser;
    isLoading: boolean;
}

export class MyAccount extends React.Component<RouteComponentProps<{}>, MyAccountState> {
    constructor() {
        super();
        this.state = {
            user: {} as IUser,
            isLoading: true
        }
    }

    public componentDidMount() {
        const userId = getCurrentUserId();

        fetch(`api/User/${userId}`, { headers: getAuthorizationHeaders() })
            .then(response => handleResponse(this.props.history, response))
            .then(response => response.json() as Promise<IUser>)
            .then(user => this.setState({
                user: user,
                isLoading: false
            }))
            .catch(error => console.log(error));
    }

    public render() {
        const user = this.state.user;

        return (
            <div>
                <h1>My Account</h1>
                <p>Username: { user.username }</p>
                <p>Email: { user.email }</p>
                <p>Date Created: { formatDate(user.dateCreated) }</p>
                <button className="btn" onClick={ () => this.onClick_btLogout() } >Logout</button>
            </div>
        );
    }

    private onClick_btLogout() {
        logout();
        this.props.history.push(`/login`);
    }
}