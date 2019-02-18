import * as React from 'react';
import { Token } from '../../helpers/token';
import { RouteComponentProps } from 'react-router';
import { IUser } from '../../helpers/interfaces';
import { handleResponse } from '../../helpers/handleResponseErrors';
import { formatDate } from '../../helpers/formatDate';
import { TITLE_PREFIX } from '../../helpers/constants';
import { Preloader } from '../General/Preloader';

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
        document.title = TITLE_PREFIX + "My Account";
        const userId = Token.getUserId();

        fetch(`api/User/${userId}`, { headers: Token.getAuthorizationHeaders() })
            .then(response => handleResponse(this.props.history, response))
            .then(response => response.json() as Promise<IUser>)
            .then(user => this.setState({
                user: user,
                isLoading: false
            }))
            .catch(error => console.log(error));
    }

    public render() {
        const { isLoading, user } = this.state;


        if (isLoading)
           return  <Preloader />
        else 
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
        Token.logout();
        this.props.history.push(`/login`);
    }
}