import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={() => {this.props.onClick()}}>
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  /*constructor(props) {
    super(props);
    this.state = {squares: Array(9).fill(null), NextPlayer: 'X'};
  }*/
  renderSquare(i) {
    return <Square value={this.props.squares[i]} onClick={() => this.props.OnClick(i)}/>;
  }
  render() {

    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {history: [{squares: Array(9).fill(null)}], NextPlayer: 'X', stepNumber: 0};   
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current=history[history.length-1];
    const squares=current.squares.slice();
    if (calculateWinner(squares) != null) {
      return;
    }
    squares[i]=this.state.NextPlayer;
    if (this.state.NextPlayer == 'X') {
      this.setState({history : history.concat([{squares:squares}]), NextPlayer : 'O', stepNumber : history.length});
    }
    else {
      this.setState({history : history.concat([{squares:squares}]), NextPlayer : 'X', stepNumber: history.length});
    }
  }

  jumpTo(step) {
    if ((step % 2) === 0) {
      this.setState({
        stepNumber: step,
        NextPlayer: 'X',
      });
    }
    else {
      this.setState({
        stepNumber: step,
        NextPlayer: 'O',
      });
    }
  }

  render() {
    
    var status;
    const history=this.state.history;
    const current=history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    
    const moves = history.map((step, move) => {
      const desc = 'Przejdź do ruchu #' + move;
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    })

    if (winner) {
      status= 'Winner: ' + winner;
    }
    else if(checkDraw(current.squares)) {
      status= 'The game is draw';
    }
    else {
      status = 'Next player: ' + this.state.NextPlayer
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} OnClick={(i) => this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
function checkDraw(squares) {
  for(var i=0; i< squares.length; i++) {
    if(!squares[i]) {
      return false;
    }
  }
  return true;
}
function calculateWinner(squares) {
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
  for (var i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}