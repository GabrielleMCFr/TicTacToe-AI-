import React from 'react';
import './Game.css';
import { Board } from '../Board/Board';
import { StartScreen } from '../Start/Start';
import { EndScreen } from '../End/End';


export class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null)
        }],
        xIsNext: true,
        stepNumber: 0,
        isStarted: false,
        player: 'X',
        aiPlayer: 'O',
        isAiTurn: false,
        aiIsMax: false,
        victories: 0,
        ties: 0,
        losses: 0
      }
      this.toggleViews = this.toggleViews.bind(this)
      this.endGame = this.endGame.bind(this)
      this.choosePlayer = this.choosePlayer.bind(this)
      this.resultAction = this.resultAction.bind(this)
      this.minimax = this.minimax.bind(this)
      this.minAlphaBeta = this.minAlphaBeta.bind(this)
      this.maxAlphaBeta = this.maxAlphaBeta.bind(this)
      this.undo = this.undo.bind(this)
      this.makeAiMove = this.makeAiMove.bind(this)
    }

    choosePlayer(player) {
      let ai;
      let aiTurn;
      let aiMax;
        if (player === 'X') {
          ai = 'O';
          aiTurn = false;
          aiMax = false;
        }
        else {
          ai = 'X';
          aiTurn = true;
          aiMax = true;
        }
        this.setState({
          player: player,
          aiPlayer: ai,
          isAiTurn: aiTurn,
          aiIsMax: aiMax,
          isStarted: true
        })
      
    }

    endGame(isWinner) {

        if (isWinner === 'tie') {
          this.setState({
            history: [{
              squares: Array(9).fill(null)
            }],
            xIsNext: true,
            stepNumber: 0,
            isStarted: false,
            player: 'X',
            aiPlayer: 'O',
            isAiTurn: false,
            aiIsMax: false,
            ties: this.state.ties+1
          })
        }

        else if ( isWinner === 'loss'){
          this.setState({
            history: [{
              squares: Array(9).fill(null)
            }],
            xIsNext: true,
            stepNumber: 0,
            isStarted: false,
            player: 'X',
            aiPlayer: 'O',
            isAiTurn: false,
            aiIsMax: false,
            losses: this.state.losses+1
          })
        }

        else {
          this.setState({
            history: [{
              squares: Array(9).fill(null)
            }],
            xIsNext: true,
            stepNumber: 0,
            isStarted: false,
            player: 'X',
            aiPlayer: 'O',
            isAiTurn: false,
            aiIsMax: false,
            victories: this.state.victories+1
          })
        }
    }

    handleClick(i, isAiTurn = false) {
      const history = this.state.history.slice(0, this.state.stepNumber+1);
      const current = history[history.length-1]
      const squares = current.squares.slice();
      // ignore click if game already won or ended or case occupied already
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      // else, handle click
      squares[i] = isAiTurn ? this.state.aiPlayer : this.state.player;
      this.setState({
        history: history.concat([{squares : squares}]),
        xIsNext: !this.state.xIsNext,
        stepNumber: history.length,
        isAiTurn: !this.state.isAiTurn},
        );

    }

    undo() {
      if (this.state.stepNumber >= 2) {
        // go back two steps and erase history
      this.setState({
        stepNumber: this.state.stepNumber-2,
      })
      }
      
    }
    /*
    jumpTo(step) {
      this.setState({
        stepNumber: step,
        // Nous définirons aussi xIsNext à true si le numéro de tour que nous utilisons dans stepNumber est pair 
        xIsNext: (step%2) === 0
      })
    } 
    */

    minimax(squares) {
      if (terminal(squares)) {
        return null
      }
      const isMax = this.state.aiIsMax
      let bestMove = null
      let listOfActions = returnActions(squares);
      let movesArray = []
      let currentAction;

      if (isMax) {
        for (let i = 0; i<listOfActions.length; i++) {
          currentAction = {utility: this.minAlphaBeta(this.resultAction(squares, listOfActions[i]), -Infinity, Infinity), action: listOfActions[i]}
          movesArray.push(currentAction)
        }
        
        movesArray.sort((a, b) => {
          return a.utility - b.utility
        })

        bestMove = movesArray[movesArray.length-1]
        return bestMove
        
      }
      else {
        for (let i = 0; i<listOfActions.length; i++) {
          currentAction = {utility: this.maxAlphaBeta(this.resultAction(squares, listOfActions[i]), -Infinity, Infinity), action: listOfActions[i]}
          movesArray.push(currentAction)
        }


        movesArray.sort((a, b) => {
          return b.utility - a.utility
        })
        bestMove = movesArray[movesArray.length-1]
        return bestMove
      }
    }

    minAlphaBeta(squares, alpha, beta) {
      let value = Infinity;
      if (terminal(squares)) {
        let util = utility(squares)
        return util
      }
      let listOfActions = returnActions(squares);
      for (let i = 0; i<listOfActions.length; i++) {
        value = Math.min(value, this.maxAlphaBeta(this.resultAction(squares, listOfActions[i]), alpha, beta)) 
        beta = Math.min(beta, value)
        if (beta <= alpha) {
          return value
        }
      }
      return value
    }

    maxAlphaBeta(squares, alpha, beta) {
      let value = -Infinity;
      let util;
      if (terminal(squares)) {
        util = utility(squares)
        return util
      }
      let listOfActions = returnActions(squares);
      for (let i = 0; i<listOfActions.length; i++) {
        value = Math.max(value, this.minAlphaBeta(this.resultAction(squares, listOfActions[i]), alpha, beta)) 
        alpha = Math.max(alpha, value)
        if (beta <= alpha) {
          return value
        }
      }
      return value
    }

    resultAction(squares, action) {
      let currentPlayer = player(squares)
      let deepCopyBoard = JSON.parse(JSON.stringify(squares));

      if (deepCopyBoard[action] === null) {
        deepCopyBoard[action] = currentPlayer
        return deepCopyBoard
      }
      return deepCopyBoard
    }


    toggleViews() {
      const history = this.state.history;
        // joue en considérant le coup actuel (si on revient dans le passé)
      const current = history[this.state.stepNumber]
      const winner = calculateWinner(current.squares);

      if (!this.state.isStarted) {
          return (<StartScreen onChoose={this.choosePlayer}/>)
      }

      else if(this.state.isStarted && winner) {
        return (<EndScreen onEnd={this.endGame} winner={winner} player={this.state.player}/>)
      }

      else if (this.state.isStarted) {

        // historique permettant de revenir à des tours precedents:
        /*const moves = history.map((step, move) => {
          const desc = move ?
            'Go to move #' + move :
            'Go to game start';
          return (
            <div>
            
            <li key={move}>
              <button onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>
            </div>
          );
        });
        */

        if (winner) {
          this.isOver() 
        }
        else {
          let move;
            if (this.state.isAiTurn) {
              move = this.minimax(current.squares);
            }
            

            return (
              <div className='wrap'>
              <div className="game">
              <div id="info">
                <span> {this.state.victories} {this.state.victories <= 1 ? 'win' : 'wins'}  </span>
                <span>{this.state.ties} {this.state.ties <= 1 ? 'draw' : 'draws'}  </span>
                <span>{this.state.losses} {this.state.losses <= 1 ? 'loss' : 'losses'}</span>   
                </div>
                <div className="game-board">
                <Board
                  squares={current.squares}
                  onClick={(i) => this.handleClick(i)}
                />
                <button id="undo-button" onClick={this.undo} title="undo">↺</button>
                </div>
                
              </div>
              {this.state.isAiTurn && this.makeAiMove(move.action)}
              </div>
            );
        }
      }

      else {
          return (
              <div>
                  <EndScreen/>
              </div>
          )
      }
  }

  makeAiMove(action) {
    this.handleClick(action,true)
  }

    render() {
      return (this.toggleViews())
      
  }
}

  function terminal(squares) {
    let winner = calculateWinner(squares);
    if (winner === null) {
      return false
    }
    else {
      return true
    }
  }
  

  function calculateWinner(squares) {
    // check for lines, columns and diagonals
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    let countTie = 0;

    // if any of those above is full of O's or X's, return the winner 
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
      else if (squares[a] == null || squares[b] == null || squares[c == null]) {
        countTie += 1;
      }

    }

    // if no winner, check for tie
    if (countTie === 0) {
      return 'Tie!'
    }

    // else, return null
    return null;
  }


  function utility(squares) {
    let potentialWinner = calculateWinner(squares)

    if (potentialWinner === "X") {
      return 1
    }
    else if (potentialWinner === 'O') {
      return (-1)
    }
    else {
      return 0
    }
  }

  function returnActions(squares) {
    let actions = []
    for (let i=0; i<9; i++) {
      if (squares[i] === null) {
        actions.push(i)
      }
    }
    return actions
  }

  function player(squares) {
    let countX = 0
    let countO = 0
    const emptyBoard = Array(9).fill(null)

    if (squares === emptyBoard) {
      return 'X'
    } 
    else {
      for (let i=0; i<9; i++) {
        if (squares[i] === 'X') {
          countX += 1
        }
        else if (squares[i] === 'O') {
          countO += 1
        }
      }
      if (countX > countO) {
        return 'O'
      }
      else {
        return 'X'
      }
    }
  }

// DUMB AI FOR TESTING
  function randomMove(squares) {
    if (calculateWinner(squares)) {
      return null
    }
    else {
      let moves = []
      let actions = returnActions(squares)

      for (let i = 0; i < actions.length; i++) {
        moves.push(actions[i])
      }

      let random = Math.floor(Math.random()*moves.length)
      return moves[random]
    }
  }