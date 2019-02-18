import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';

export class NavMenu extends React.Component<{}, {}> {
    public render() {
        return (
            <div className='main-nav'>
                <div className='navbar navbar-inverse'>
                    <div className='navbar-header'>
                        <button type='button' className='navbar-toggle' data-toggle='collapse' data-target='.navbar-collapse'>
                            <span className='sr-only'>Toggle navigation</span>
                            <span className='icon-bar'></span>
                            <span className='icon-bar'></span>
                            <span className='icon-bar'></span>
                        </button>
                        <Link className='navbar-brand' to={ '/' }>Melee Notes</Link>
                    </div>
                    <div className='clearfix'></div>
                    <div className='navbar-collapse collapse'>
                        <ul className='nav navbar-nav'>
                            <li>
                                <NavLink to={ '/' } exact activeClassName='active'>
                                    <span className='glyphicon glyphicon-home'></span> Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={'/tournaments'} activeClassName='active'>
                                    <span className='glyphicon glyphicon-th-list'></span> Tournaments
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={'/addTournament'} activeClassName='active'>
                                    <span className='glyphicon glyphicon-plus'></span> Add Tournament
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={'/players'} activeClassName='active'>
                                    <span className='glyphicon glyphicon-th-list'></span> Players
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={'/statistics'} activeClassName='active'>
                                    <span className='glyphicon glyphicon-stats'></span> Statistics
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={'/myAccount'} activeClassName='active'>
                                    <span className='glyphicon glyphicon-user'></span> My Account
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}
