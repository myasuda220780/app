import { MouseEventHandler, useState } from "react";

function Square({
  value,
  highlight,
  onSquareClick,
}: {
  value: string | null;
  highlight: boolean;
  onSquareClick: MouseEventHandler;
}) {
  let className = "square";
  if (highlight) {
    className += " highlight";
  }
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({
  xIsNext,
  squares,
  onPlay,
}: {
  xIsNext: boolean;
  squares: Array<string | null>;
  onPlay: (squares: Array<string | null>) => void;
}) {
  function handleClick(i: number) {
    if (squares[i] || findWinningLine(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const winningLine = findWinningLine(squares);
  const winner = winningLine ? squares[winningLine[0]] : null;
  const status = winner
    ? "Winner: " + winner
    : squares.every((square) => !!square)
    ? "This game is a draw!"
    : "Next player: " + (xIsNext ? "X" : "O");

  const board = [
    squares.slice(0, 3),
    squares.slice(3, 6),
    squares.slice(6),
  ].map((row, rowIndex) => {
    const squares = row.map((square, columnIndex) => {
      const squareIndex = rowIndex * row.length + columnIndex;
      return (
        <Square
          key={squareIndex}
          value={square}
          highlight={!!winningLine?.includes(squareIndex)}
          onSquareClick={() => handleClick(squareIndex)}
        />
      );
    });
    return (
      <div key={rowIndex} className="board-row">
        {squares}
      </div>
    );
  });

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)] as Array<
    Array<string | null>
  >);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const [isReverse, setIsReverse] = useState(false);

  function handlePlay(nextSquares: Array<string | null>) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  function handleToggleSort() {
    setIsReverse(!isReverse);
  }

  function getDiscription(
    history: Array<Array<string | null>>,
    move: number,
    currentMove: number
  ): string {
    let description;
    const playerStr = move % 2 === 0 ? "X" : "O";
    const sign = getMoveSign(history, move);
    const signStr = sign ? `(${sign[0]}, ${sign[1]})` : "";
    if (move === currentMove) {
      description = `${playerStr} ${signStr} You are at move #${move}`;
    } else if (move > 0) {
      description = playerStr + " " + signStr + " Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return description;
  }

  const moves = history.map((_, move) => {
    const description = getDiscription(history, move, currentMove);
    return (
      <li key={move}>
        <button disabled={move === currentMove} onClick={() => jumpTo(move)}>
          {description}
        </button>
      </li>
    );
  });

  if (isReverse) {
    moves.reverse();
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={currentMove % 2 === 0}
          squares={currentSquares}
          onPlay={handlePlay}
        />
      </div>
      <div className="game-info">
        <button onClick={handleToggleSort}>ソートトグル</button>
        <ol reversed={isReverse}>{moves}</ol>
      </div>
    </div>
  );
}

function findWinningLine(squares: Array<string | null>): number[] | null {
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
  for (const line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return line;
    }
  }
  return null;
}

function getMoveSign(
  history: Array<Array<string | null>>,
  move: number
): [number, number] | null {
  if (history.length < 2 || move === 0) {
    return null;
  }
  for (let i = 0; i < history[move].length; i++) {
    if (history[move][i] !== history[move - 1][i]) {
      return [Math.floor((i + 1) / 3), (i + 1) % 3];
    }
  }
  return null;
}
