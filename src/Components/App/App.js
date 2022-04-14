import React from 'react';
import './App.css';
import { Game } from '../Game/Game'
import { Header } from '../Header/Header';
import { StartScreen } from '../Start/Start';
import { EndScreen } from '../End/End';


export default class App extends React.Component {

    render() {
        
        return (
            <div>
                <Header />
                <div id="wrap">
                <Game></Game>
                </div>
            </div>
        )
    }
}

