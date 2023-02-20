import { useState } from "react";
import "./App.css";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [movingSquare, setMovingSquare] = useState(false);

  const [squares, setSquares] = useState(Array(9).fill(null));
  const [adjacentSquares, setAdjacentSquares] = useState(new Set());

  // Incremental variable to track when "x" and "o" symbols have reached 3
  const [centerCount, setCenterCount] = useState(0);
  const [xCount, setxCount] = useState(0);
  const [oCount, setoCount] = useState(0);
  const [initial, setInitial] = useState(0);

  function centerSquare() {
    if (squares[4] == null) {
      console.log("empty");
      setCenterCount(0);
      return;
    }
    if (squares[4] != null && squares[4] == "O" && !xIsNext) {
      console.log("o count INCREASED");
      setCenterCount(centerCount + 1);
    }
    if (squares[4] == "X" && xIsNext) {
      console.log("x count INCREASED");
      setCenterCount(centerCount + 1);
    }
  }

  function handle2ndClick(i) {
    const nextSquares = squares.slice();
    // Checks if there is alr a block there and if it is winnable

    if (calculateWinner(squares, centerCount) || squares[i]) {
      return;
    }

    if (adjacentSquares.includes(i)) {
      if (xIsNext) {
        nextSquares[i] = "X";
        nextSquares[initial] = null;
      } else {
        nextSquares[i] = "O";
        nextSquares[initial] = null;
      }
      centerSquare();
      setSquares(nextSquares);
      setXIsNext(!xIsNext);
      setMovingSquare(false);
    } else {
      console.log("Invalid Movement");
    }
    return;
  }

  function handleClick(i) {
    const nextSquares = squares.slice();

    if (movingSquare) {
      handle2ndClick(i);
      return;
    }

    // If the previous turn was to select a square to move AND there are adjacent squares, then we allow to player to move

    if (squares[i] == "X" && xIsNext == true) {
      setInitial(i);
      checkAdjacent(i);
      setMovingSquare(true);
      return;

      // how do we get it to call the click again
    }

    if (squares[i] == "O" && xIsNext == false) {
      setInitial(i);
      checkAdjacent(i);
      setMovingSquare(true);

      return;
    }

    if (squares[i] == null) {
      if (xIsNext && xCount >= 3) {
        console.log("Must move existing X");
        return;
      }

      if (xIsNext == false && oCount >= 3) {
        console.log("Must move existing O");
        return;
      }
      if (xIsNext) {
        nextSquares[i] = "X";
        console.log("xCount: " + xCount);

        setxCount(xCount + 1);
      } else {
        nextSquares[i] = "O";
        console.log("oCount: " + oCount);
        setoCount(oCount + 1);
      }
      setSquares(nextSquares);
      setXIsNext(!xIsNext);
    } else {
      console.log("invalid move");
      return;
    }
    centerSquare();
  }

  function checkAdjacent(i) {
    let adjacentSquares = [];
    switch (i) {
      case 0:
        adjacentSquares = [1, 3, 4];
        break;
      case 1:
        adjacentSquares = [0, 2, 3, 4, 5];
        break;
      case 2:
        adjacentSquares = [1, 4, 5];
        break;
      case 3:
        adjacentSquares = [0, 1, 4, 6, 7];
        break;
      case 4:
        adjacentSquares = [0, 1, 2, 3, 5, 6, 7, 8, 9];
        break;
      case 5:
        adjacentSquares = [1, 2, 4, 7, 8];
        break;
      case 6:
        adjacentSquares = [3, 4, 7];
        break;
      case 7:
        adjacentSquares = [3, 4, 5, 6, 8];
        break;
      case 8:
        adjacentSquares = [4, 5, 7];
        break;
      default:
        setAdjacentSquares(adjacentSquares);
        return;
    }
    setAdjacentSquares(adjacentSquares);
    return;
  }
  let winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (centerCount > 0) {
    console.log("square4: " + squares[4]);
    if (squares[4] == "X") {
      winner = "O";
      console.log("WTF");
    }
    if (squares[4] == "O") {
      winner = "X";
      console.log("omg");
    }
  }
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="board">
        <div className="status">{status}</div>
        <div className="board-row">
          <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
          <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
          <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
        </div>
        <div className="board-row">
          <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
          <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
          <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
        </div>
        <div className="board-row">
          <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
          <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
          <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
        </div>
      </div>
    </>
  );
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
  // console.log("final_count: " + centerCount);
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}
