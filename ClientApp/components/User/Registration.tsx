import * as React from 'react';
import { IUser } from 'ClientApp/helpers/interfaces';
import { RouteComponentProps } from 'react-router';

interface RegistrationState {
    user: IUser;
    passwordCheck: string;
}

export class Registration extends React.Component<RouteComponentProps<{}>, RegistrationState> {
    constructor() {
        super();

        this.state = {
            user: {} as IUser,
            passwordCheck: ""
        }

        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public render() {
        let user = this.state.user;

        return (
            <div>
                <h1>Register</h1>

                <form onSubmit={this.handleSubmit} >
                    <label>Username</label>
                    <input type="text" name="username" className="form-control input-md" placeholder="Username" value={user.username} onChange={e => this.handleFieldChange(e)} />

                    <label>Email</label>
                    <input type="text" name="email" className="form-control input-md" placeholder="Email" value={user.email} onChange={e => this.handleFieldChange(e)} />

                    <label>Password</label>
                    <input type="password" name="password" className="form-control input-md" placeholder="Password" value={user.password} onChange={e => this.handleFieldChange(e)} />

                    <label>Re-Enter Password</label>
                    <input type="password" name="passwordCheck" className="form-control input-md" placeholder="Re-Enter Password" value={this.state.passwordCheck} onChange={e => this.handleFieldChange(e)} />

                    <input type="submit" value="Register" className="btn" />
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

        fetch(`api/User/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state.user)
        })
            .then(() => this.props.history.push('/login'));
        //catch
    }
}