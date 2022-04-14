import React from "react";
import './End.css'

let isWinner; 

export class EndScreen extends React.Component {
    constructor(props) {
        super(props);
        this.isWinner = this.isWinner.bind(this)
        this.handleEnd = this.handleEnd.bind(this)
    }

    isWinner() {
        if (this.props.winner === this.props.player) {
            isWinner = 'win'
            return <p>You won!</p>
        }
        else if (this.props.winner === 'Tie!') {
            isWinner = 'tie'
            return <p>Tie!</p>
        }
        else {
            isWinner = 'loss'
            return <p>You lost!</p>
        }
    }

    handleEnd() {
        this.props.onEnd(isWinner)
    }

    render() {
        return (
            <div className="end">
            {this.isWinner()}
            <br></br>
            <button onClick={this.handleEnd}>Go again</button>
        </div>
        )
        
    }
}