import * as React from 'react';
import { IUser, IToken } from 'ClientApp/helpers/interfaces';
import { RouteComponentProps } from 'react-router';
import * as jwtDecode from 'jwt-decode';
import { setToken } from '../../helpers/token';

interface LoginState {
    user: IUser;
}

export class Login extends React.Component<RouteComponentProps<{}>, LoginState> {
    constructor() {
        super();

        this.state = {
            user: {} as IUser,
        }

        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public render() {
        let user = this.state.user;

        return (
            <div>
                <h1>Login</h1>

                <form onSubmit={this.handleSubmit} >
                    <label>Username</label>
                    <input type="text" name="username" className="form-control input-md" placeholder="Username" value={user.username} onChange={e => this.handleFieldChange(e)} />

                    <label>Password</label>
                    <input type="password" name="password" className="form-control input-md" placeholder="Password" value={user.password} onChange={e => this.handleFieldChange(e)} />

                    <input type="submit" value="Login" className="btn" />
                </form>
            </div>
        );
    }

    private handleFieldChange(event: React.ChangeEvent<HTMLInputElement>) {
        let key: any = event.target.name;
        let user = this.state.user;
        user[key] = event.target.value;
        this.setState({ user: user }); //cover password check
    }

    public handleSubmit(event: React.FormEvent<EventTarget>) {
        event.preventDefault();

        fetch(`api/User/Login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state.user)
        })
            .then(response => response.json() as Promise<IToken>)
            .then(token => setToken(token));
        //catch
    }
}