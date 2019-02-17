import * as React from 'react';
import { IUser, IToken } from 'ClientApp/helpers/interfaces';
import { RouteComponentProps } from 'react-router';
import * as jwtDecode from 'jwt-decode';
import { Token } from '../../helpers/token';
import { Preloader } from '../General/Preloader';
import { handleResponse } from '../../helpers/handleResponseErrors';
import { TITLE_PREFIX } from '../../helpers/constants';

interface LoginState {
    user: IUser;
    isLoading: boolean;
    isServerError: boolean;
    isNotFoundError: boolean;
    isUnauthorizedError: boolean;
}

export class Login extends React.Component<RouteComponentProps<{}>, LoginState> {
    constructor() {
        super();

        this.state = {
            user: {} as IUser,
            isLoading: false,
            isServerError: false,
            isNotFoundError: false,
            isUnauthorizedError: false
        }

        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public componentDidMount() {
        document.title = TITLE_PREFIX + "Login";
    }

    public render() {
        const { user, isLoading, isServerError, isNotFoundError, isUnauthorizedError } = this.state;

        let errorMessage = <p></p>;
        if (isServerError)
            errorMessage = <p className="invalid">Sorry, there was a server error</p>
        else if (isNotFoundError)
            errorMessage = <p className="invalid">That username or email does not exist</p>
        else if (isUnauthorizedError)
            errorMessage = <p className="invalid">Those credentials are invalid</p>

        if (isLoading)
            return <Preloader />
        else
            return (
                <div>
                    <h1 className="-center-container">Melee Notes</h1>

                    <div className="login-container -center-container -curved-border">
                        <h1>Login</h1>

                        <form onSubmit={ this.handleSubmit } >
                            <label>Username or Email</label>
                            <input type="text" name="username" className="form-control input-md" placeholder="Username or Email" value={ user.username } onChange={ e => this.handleFieldChange(e) } />

                            <label>Password</label>
                            <input type="password" name="password" className="form-control input-md" placeholder="Password" value={ user.password } onChange={ e => this.handleFieldChange(e) } />

                            { errorMessage }

                            <input type="submit" value="Login" className="btn" />
                        </form>

                        <button className="btn" onClick={ () => this.onClick_btRegistration() } >Go To Registration</button>
                    </div>
                </div>
            );
    }

    private onClick_btRegistration() {
        this.props.history.push('/registration');
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
                Token.setToken(token);
                this.setState({ isLoading: false })

                if (Token.isUserAuthenticated())
                    this.props.history.push('/');
            })
            .catch(error => {
                this.setState({ isLoading: false })

                console.log(error)
            });
    }

    private handleLoginResponse(response: Response) {
        let statusCode = response.status;

        if(statusCode >= 500) {
            this.setState({
                isUnauthorizedError: false,
                isNotFoundError: false,
                isServerError: true
            });
            throw new Error(statusCode.toString());
        } else if (statusCode == 404) {
            this.setState({
                isUnauthorizedError: false,
                isNotFoundError: true,
                isServerError: false
            });
            throw new Error("404");
        } else if (statusCode == 401) {
            this.setState({
                isUnauthorizedError: true,
                isNotFoundError: false,
                isServerError: false
            });
            throw new Error("401");
        } else {
            this.setState({
                isUnauthorizedError: false,
                isNotFoundError: false,
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