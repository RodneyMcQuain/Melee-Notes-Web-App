import * as React from 'react';
import { IUser, IToken } from 'ClientApp/helpers/interfaces';
import { RouteComponentProps } from 'react-router';
import * as jwtDecode from 'jwt-decode';
import { setToken, isAuthenticated } from '../../helpers/token';
import { Preloader } from '../General/Preloader';
import { handleResponse } from '../../helpers/handleResponseErrors';

interface LoginState {
    user: IUser;
    isLoading: boolean;
    isServerError: boolean;
    isForbiddenError: boolean;
}

export class Login extends React.Component<RouteComponentProps<{}>, LoginState> {
    constructor() {
        super();

        this.state = {
            user: {} as IUser,
            isLoading: false,
            isServerError: false,
            isForbiddenError: false
        }

        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public render() {
        const { user, isLoading, isForbiddenError, isServerError } = this.state;

        let errorMessage = <div></div>;
        if (isServerError)
            errorMessage = <div>Sorry, there was a server error</div>
        else if (isForbiddenError)
            errorMessage = <div>Sorry, those credentials do not match</div>

        if (isLoading)
            return <Preloader />
        else
            return (
                <div>
                    <h1>Login</h1>

                    <form onSubmit={ this.handleSubmit } >
                        <label>Username</label>
                        <input type="text" name="username" className="form-control input-md" placeholder="Username" value={ user.username } onChange={ e => this.handleFieldChange(e) } />

                        <label>Password</label>
                        <input type="password" name="password" className="form-control input-md" placeholder="Password" value={ user.password } onChange={ e => this.handleFieldChange(e) } />

                        <input type="submit" value="Login" className="btn" />
                    </form>

                    { errorMessage }
                </div>
            );
    }

    private handleFieldChange(event: React.ChangeEvent<HTMLInputElement>) {
        let key: any = event.target.name;
        let user = this.state.user;
        user[key] = event.target.value;
        this.setState({ user: user });
    }

    public handleSubmit(event: React.FormEvent<EventTarget>) {
        event.preventDefault();
        let user = this.state.user;
        this.setState({ isLoading: true })

        this.attemptLogin(user);

        this.clearPassword(user);
    }

    private attemptLogin(user: IUser) {
        fetch(`api/User/Login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        })
            .then(response => this.handleLoginResponse(response))
            .then(response => response.json() as Promise<IToken>)
            .then(token => {
                setToken(token);
                this.setState({ isLoading: false })

                if (isAuthenticated)
                    this.props.history.push('/');
            })
            .catch(error => {
                this.setState({ isLoading: false })

                console.log(error)
            });
    }

    private handleLoginResponse(response: Response) {
        let statusCode = response.status;

        if (statusCode === 403) {
            this.setState({ isForbiddenError: true });
            throw new Error("403");
        } else if (statusCode >= 500) {
            this.setState({ isServerError: true });
            throw new Error(statusCode.toString());
        } else {
            this.setState({
                isForbiddenError: false,
                isServerError: false
            });

            return response;
        }
    }

    private clearPassword(user: IUser) {
        user.password = "";
        this.setState({ user: user });
    }
}