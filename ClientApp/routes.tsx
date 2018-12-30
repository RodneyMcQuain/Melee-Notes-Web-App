import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
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
import { RoutingError } from './components/Errors/RoutingError';
import { NotFoundError } from './components/Errors/NotFoundError';
import { ServerError } from './components/Errors/ServerError';

export const routes = <Layout>
    <Switch>
        <Route exact path='/' component={ Home } />
        <Route path='/login' component={ Login } />
        <Route path='/registration' component={ Registration } />
        <Route path='/addTournament' component={ AddTournament } />
        <Route path='/addSet/:tournamentId' component={ AddSet } />
        <Route path='/addSet' component={ AddSet } />
        <Route path='/addGame/tournament/:tournamentId/set/:setId' component={ AddGame } />
        <Route path='/addGame' component={ AddGame } />
        <Route path='/addPlayer' component={ AddPlayer } />
        <Route path='/tournament/:tournamentId/set/:setId/game/:gameId' component={ SelectedGame } />
        <Route path='/tournament/:tournamentId/set/:setId' component={ SelectedSet } />
        <Route path='/tournament/:tournamentId' component={ SelectedTournament } />
        <Route path='/player/:playerId' component={ SelectedPlayer } />
        <Route path='/players' component={ Players } />
        <Route path='/statistics' component={ Statistics } />
        <Route path='/NotFoundError' component={NotFoundError} />
        <Route path='/ServerError' component={ ServerError } />
        <Route component={ RoutingError } />
    </Switch>
</Layout>;