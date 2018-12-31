import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Login } from './components/User/Login';
import { Registration } from './components/User/Registration';
import { AddTournament } from './components/Tournament/AddTournament';
import { AddSet } from './components/Set/AddSet';
import { AddGame } from './components/Game/AddGame';
import { SelectedTournament } from './components/Tournament/SelectedTournament';
import { SelectedSet } from './components/Set/SelectedSet';
import { SelectedGame } from './components/Game/SelectedGame';
import { SelectedPlayer } from './components/Player/SelectedPlayer';
import { Players } from './components/Player/Players';
import { AddPlayer } from './components/Player/AddPlayer';
import { Statistics } from './components/Statistic/Statistics';
import { MyAccount } from './components/User/MyAccount';
import { RoutingError } from './components/Errors/RoutingError';
import { NotFoundError } from './components/Errors/NotFoundError';
import { ServerError } from './components/Errors/ServerError';
import { isAuthenticated } from './helpers/token';

const PrivateRoute = ({ component: Component, ...rest }: any) => (
    <Route {...rest} render={(props) => (
        isAuthenticated === true
            ? <Component {...props} />
            : <Redirect to='/login' />
     )}/>
);

export const routes = <Layout>
    <Switch>
        <PrivateRoute exact path='/' component={ Home } />
        <Route path='/login' component={ Login } />
        <Route path='/registration' component={ Registration } />
        <PrivateRoute path='/addTournament' component={ AddTournament } />
        <PrivateRoute path='/addSet/:tournamentId' component={ AddSet } />
        <PrivateRoute path='/addSet' component={ AddSet } />
        <PrivateRoute path='/addGame/tournament/:tournamentId/set/:setId' component={ AddGame } />
        <PrivateRoute path='/addGame' component={ AddGame } />
        <PrivateRoute path='/addPlayer' component={ AddPlayer } />
        <PrivateRoute path='/tournament/:tournamentId/set/:setId/game/:gameId' component={ SelectedGame } />
        <PrivateRoute path='/tournament/:tournamentId/set/:setId' component={ SelectedSet } />
        <PrivateRoute path='/tournament/:tournamentId' component={ SelectedTournament } />
        <PrivateRoute path='/player/:playerId' component={ SelectedPlayer } />
        <PrivateRoute path='/players' component={ Players } />
        <PrivateRoute path='/statistics' component={ Statistics } />
        <Route path='/myAccount' component={ MyAccount } />
        <Route path='/NotFoundError' component={ NotFoundError } />
        <Route path='/ServerError' component={ ServerError } />
        <Route component={ RoutingError } />
    </Switch>
</Layout>;