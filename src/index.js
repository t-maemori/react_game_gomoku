import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// 盤の1辺のマス数
const row_col_max = 19
// 勝利ルール（縦横斜めに並べる数）
const win_num = 5

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
  handleClick(row, col) {
    const squares = this.state.squares.slice();

    // 勝負が決まっている、もしくは、既に選択済みの場合、無効とする
    if (this.state.winner || squares[row][col]) {
      return;
    }

    // データ更新
    squares[row][col] = this.state.isNext ? '○' : '●';
    this.setState({
      squares: squares,
      isNext: !this.state.isNext,
      winner: calculateWinner(squares, row, col),
    });
  }

  // 表示更新メソッド（セル）
  renderSquareCell(row, col) {
    return (
      <Square
        key = {row * row_col_max + col}
        value = {this.state.squares[row][col]}
        onClick={() => this.handleClick(row, col)}
      />
    );
  }

  // 表示更新メソッド（盤上）
  renderSquare() {
    const rowSquares = [];
    // 行ループ
    for (let row = 0; row < row_col_max; row++) {
      rowSquares.push(
        <div key={row.toString()} className="board-row">
          {
            // 即時関数とする
            (() => {
              const rowSquares = [];
              // 列ループ
              for (let col = 0; col < row_col_max; col++) {
                rowSquares.push(this.renderSquareCell(row, col));
              }
              return rowSquares;
            })()
          }
        </div>
      );
    }
    return rowSquares;
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
        {this.renderSquare()}
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
function calculateWinner(squares, row, col) {
  // 判定するラインの計算用座標を格納
  const lines = [
    [[1, 0], [-1, 0]],  // 上-下（縦）
    [[0, 1], [0, -1]],  // 左-右（横）
    [[1, 1], [-1, -1]], // 左上-右下（斜め）
    [[1, -1], [-1, 1]], // 左下-右上（斜め）
  ];

  // 計算する種類分ループ
  for (let i = 0; i < lines.length; i++) {
    // カウンター（指標座標分を含めるため、1を初期値とする）
    let count = 1;

    for (let j = 0; j < lines[i].length; j++) {
      const calc = lines[i][j];

      let new_row = row;
      let new_col = col;
      while (true) {
        new_row += calc[0];
        new_col += calc[1];

        // 座標が盤上ではなくなった場合、次の処理へ
        if (new_row < 0 || new_row >= row_col_max ||
            new_col < 0 || new_col >= row_col_max) {
          break;
        }

        // 指標座標の値と同じであればカウント、異なる場合は次の処理へ
        if (squares[row][col] === squares[new_row][new_col]) {
          count++;
        } else {
          break;
        }
      }
    }
    // カウンターが勝利規定数以上である場合
    if (count >= win_num) {
      return squares[row][col];
    }
  }
  return null;
}
