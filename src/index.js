import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// 盤の1辺のマス数
const row_col_max = 3
//// 勝利ルール（縦横斜めに並べる数）
//const win_num = 3

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  // コンストラクタ
  constructor(props) {
    super(props);
    this.state = {
      squares: JSON.parse(JSON.stringify((new Array(row_col_max)).fill((new Array(row_col_max)).fill(null)))),
      isNext: true,
      winner: null,
    };
  }

  // クリックイベント
  handleClick(col, row) {
    const squares = this.state.squares.slice();

    // 勝負が決まっている、もしくは、既に選択済みの場合、無効とする
    if (this.state.winner || squares[col][row]) {
      return;
    }

    // データ更新
    squares[col][row] = this.state.isNext ? '○' : '●';
    this.setState({
      squares: squares,
      isNext: !this.state.isNext,
      winner: calculateWinner(squares, col, row),
    });
  }

  // 表示更新メソッド
  renderSquare(col, row) {
    return (
      <Square
        value = {this.state.squares[col][row]}
        onClick={() => this.handleClick(col, row)}
      />
    );
  }

  // 表示更新
  render() {
    let status;
    if (this.state.winner) {
      status = 'Winner: ' + this.state.winner;
    } else {
      status = 'Next player: ' + (this.state.isNext ? '○' : '●');
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0, 0)}
          {this.renderSquare(0, 1)}
          {this.renderSquare(0, 2)}
        </div>
        <div className="board-row">
          {this.renderSquare(1, 0)}
          {this.renderSquare(1, 1)}
          {this.renderSquare(1, 2)}
        </div>
        <div className="board-row">
          {this.renderSquare(2, 0)}
          {this.renderSquare(2, 1)}
          {this.renderSquare(2, 2)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
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

// 選択されたマスを指標とし、勝利が決まったかを判定
function calculateWinner(squares, col, row) {
  const lines = [
    // 横について
    [[0,0], [0,1], [0,2]],
    [[1,0], [1,1], [1,2]],
    [[2,0], [2,1], [2,2]],
    // 縦について
    [[0,0], [1,0], [2,0]],
    [[0,1], [1,1], [2,1]],
    [[0,2], [1,2], [2,2]],
    // 斜めについて
    [[0,0], [1,1], [2,2]],
    [[0,2], [1,1], [0,2]],
  ];

  // 判定処理
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a[0]][a[1]] &&
        squares[a[0]][a[1]] === squares[b[0]][b[1]] &&
        squares[a[0]][a[1]] === squares[c[0]][c[1]]) {
      return squares[col][row];
    }
  }
  return null;
}
