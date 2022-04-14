import React from "react";
import { SelectPlayer } from "../SelectPlayer/SelectPlayer";
import './Start.css'

export class StartScreen extends React.Component {
    render() {
        return (
            <div className="start" id='start'>
            <SelectPlayer onChoose={this.props.onChoose}/>
        </div>
        )
        
    }
}