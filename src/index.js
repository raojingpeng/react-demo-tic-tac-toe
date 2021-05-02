import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  // 想写一个组件只包含 reder 方法，并且不包括 state，那么使用函数组件就会更简单
  return (
    <button className="square" onClick={props.onClick} style={props.styles}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  render() {
    const rows = 3;
    const lines = 3;
    return (
      <div>
        {[...Array(rows)].map((item1, index1) => {
          return (
            <div className="board-row" key={index1}>
              {[...Array(lines)].map((item2, index2) => (
                <Square
                  key={index1 * 3 + index2}
                  value={this.props.squares[index1 * 3 + index2]}
                  onClick={() => this.props.onClick(index1 * 3 + index2)}
                  styles={this.props.styles(index1 * 3 + index2)}
                />
              ))}
            </div>
          );
        })}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null), coordinate: null }],
      isNextX: true,
      stepNumber: 0,
      descendingOrder: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const curHistory = history[history.length - 1];
    const squares = curHistory.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const coordinate = [
      i - (Math.ceil((i + 1) / 3) - 1) * 3 + 1,
      Math.ceil((i + 1) / 3),
    ];
    squares[i] = this.state.isNextX ? "X" : "O";
    this.setState({
      history: history.concat([{ squares: squares, coordinate: coordinate }]),
      isNextX: !this.state.isNextX,
      stepNumber: this.state.stepNumber + 1,
    });
  }

  handleWinnerStyle(winner, i) {
    const style = { background: "yellow" };
    if (winner && winner.indexOf(i) > -1) {
      return style;
    }
    return null;
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      isNextX: step % 2 === 0,
    });
  }

  reverseHistory() {
    this.setState({
      descendingOrder: !this.state.descendingOrder,
    });
  }

  render() {
    let status;
    const history = this.state.history;
    const curHistory = history[this.state.stepNumber];
    const winner = calculateWinner(curHistory.squares);

    if (winner) {
      status = "Winner: " + curHistory.squares[winner[0]];
    } else if (this.state.stepNumber === 9) {
        status = "A tie"
    } else {
      status = "Next player: " + (this.state.isNextX ? "X" : "O");
    }

    let moves = history.map((step, move) => {
      const desc = move
        ? "Go to move #" + move + " [" + step.coordinate + "]"
        : "Go to game start";
      return (
        <li key={move}>
          <button
            style={{
              fontWeight: this.state.stepNumber !== move ? "initial" : "bold",
            }}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    });

    if (this.state.descendingOrder) {
      moves.reverse();
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={curHistory.squares}
            onClick={(i) => this.handleClick(i)}
            styles={(i) => this.handleWinnerStyle(winner, i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <button onClick={() => this.reverseHistory()}>
              {this.state.descendingOrder
                ? "Ascending Order"
                : "Descending Order"}
            </button>
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
