import React from "react";
import './SelectPlayer.css';

export class SelectPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this)
    }

    onChange(e) {
        const player = e.target.value;
        this.props.onChoose(player)

    }

    render() {
        return (
            <div className="select-player">
                <p>Do you choose X or O ?</p>
                <div className="player">
                <ul className="listplayer">
                    <li id="x-player">
                    <label htmlFor="X" id="labelX">X</label>
                    <input type="radio" id="X" value="X" name="player" onClick={this.onChange}></input>
                    </li>
                    <li id="o-player">
                    <label htmlFor="O" id="labelO">O</label>
                    <input type='radio' id='O' value='O' name="player" onClick={this.onChange}></input>
                    </li>
                </ul>
                </div> 
            </div>
        )
    }
}