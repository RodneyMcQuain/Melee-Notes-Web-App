import * as React from 'react';
import { logout } from '../../helpers/token';
import { RouteComponentProps } from 'react-router';

export class MyAccount extends React.Component<RouteComponentProps<{}>, {}> {
    public render() {
        return (
            <div>
                <h1>My Account</h1>
                <button className="btn" onClick={ () => this.onClick_btLogout() } >Logout</button>
            </div>
        );
    }

    private onClick_btLogout() {
        logout();
        this.props.history.push(`/login`);
    }
}