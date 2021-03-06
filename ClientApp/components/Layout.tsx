import * as React from 'react';
import { NavMenu } from './NavMenu';
import { Token } from '../helpers/token';

export interface LayoutProps {
    children?: React.ReactNode;
}

export class Layout extends React.Component<LayoutProps, {}> {
    public render() {
        let body;
        if (Token.isUserAuthenticated()) // Display NavMenu if user is authenticated.
            body = (
                <div>
                    <div className='col-sm-3'>
                        <NavMenu />
                    </div>
                    <div className='col-sm-9 -top-margin-container'>
                        { this.props.children }
                    </div>
                </div>
            );
        else // Display nothing if user is not authenticated.
            body = (
                <div className='col-sm-12 -top-margin-container'>
                    { this.props.children }
                </div>
            );

        return (
            <div className='container-fluid'>
                <div className='row'>
                    { body }
                </div>
            </div>
        );
    }
}
