import * as React from 'react';
import { RouteComponentProps } from 'react-router';

export class Home extends React.Component<RouteComponentProps<{}>, {}> {
    constructor(props: RouteComponentProps<{}>) {
        super(props);
    }

    public render() {
        return (
            <div>
                <h1>Melee Notes</h1>
            </div>
        );
    }
}
