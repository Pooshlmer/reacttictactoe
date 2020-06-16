import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  let winner = '';
  if (props.winSquare) {
    winner = ' winsquare';
  }
  return (
    <button className={"square" + winner} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Reverse(props) {
  return (
    <button onClick={props.onClick}>
      Reverse move list
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i, winner) {
    return ( 
    <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        winSquare={winner}
        key={i}
    />
    );
  }

  render() {
    let outerdiv = [];
    let counter = 0;
    for (let i = 0; i < this.props.gameSize; i++) {
      let innerdiv = [];
      for (let j = 0; j < this.props.gameSize; j++) {
        let highlight;
        if (this.props.winLine) {
          if (this.props.winLine.includes(counter)){
            highlight = true;
          }
        }
        let temp = this.renderSquare(counter++, highlight);
        innerdiv.push(temp)
      }
      outerdiv.push(<div key={i} className="board-row">{innerdiv}</div>)
    }
    return (
      <div>
      {outerdiv}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(props.gameSize * 2).fill(null),
        changed: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      reversed: false,
      winLine: null,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const winner = calculateWinner(squares);
    if (winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        changed: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    })
  }

  reverseList() {
    this.setState({
      reversed: !this.state.reversed,
    });
  }

  jumpTo(step) {

    this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.slice(0, history.length).map((step, move) => {
      const desc = move ?
        'Go to move #' + move + " (" + step.changed + ")":
        'Go to game start';
      return (
        <li key={move}>
          <button className={move === this.state.stepNumber ? 'current-move' : null} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    if (this.state.reversed) {
      moves.reverse();
    }


    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (!winner && moves.length === 10) {
      status = 'Draw';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
    <div className="game">
      <div className="game-board">
        <Board 
          squares={current.squares}
          onClick={(i) => this.handleClick(i)}
          gameSize={this.props.gameSize}
          winLine={winner}
        />
      </div>
      <div className="game-info">
      <div>{status}</div>
      <div>
        <Reverse 
          onClick={() => this.reverseList()}
        />
      </div>
      <ol>{moves}</ol>
      </div>
    </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game 
    gameSize={3}
  />,
  document.getElementById('root')
);

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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;    
}