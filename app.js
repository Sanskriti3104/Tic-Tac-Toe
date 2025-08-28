console.log("TIC-TAC-TOE");

function GameBoard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i][j] = cell();
    }
  }

  const getBoard = () => board;

  const dropToken = (row, col, token) => {
    if (board[row][col].getValue() === ' ') {
      board[row][col].addToken(token);
      return { row: row, col: col };
    }
  };

  const printBoard = () => {
    console.log(board.map(row => row.map(cell => cell.getValue())));
  };

  return {
    getBoard,
    dropToken,
    printBoard
  };
}

function cell() {
  let value = ' ';

  const addToken = (token) => {
    value = token;
  };

  const getValue = () => value;

  return {
    addToken,
    getValue
  };
}

function GameController(playerOne = 'Player X', playerTwo = 'Player O') {
  const players = [
    { playerName: playerOne, token: 'X' },
    { playerName: playerTwo, token: 'O' }
  ];

  const board = GameBoard();

  let activePlayer = players[0];

  const switchPlayer = () => {
    activePlayer = (activePlayer == players[0]) ? players[1] : players[0];
    return `${activePlayer.playerName}'s turn`;
  }

  const getActivePlayer = () => {
    return activePlayer;
  }

  let gameOver = false;

  const checkWin = (row, col) => {
    const directions = [
      { dr: 0, dc: 1 }, //horizontal
      { dr: 1, dc: 0 }, //vertical
      { dr: 1, dc: 1 }, //diagonal right
      { dr: 1, dc: -1 } //diagonal left
    ];

    for (const { dr, dc } of directions) {
      let count = 1;
      let r = row + dr;
      let c = col + dc;

      while (r >= 0 && r < 3 && c >= 0 && c < 3 && board.getBoard()[r][c].getValue() === activePlayer.token) {
        count++;
        r += dr;
        c += dc;
      }

      r = row - dr;
      c = col - dc;

      while (r >= 0 && r < 3 && c >= 0 && c < 3 && board.getBoard()[r][c].getValue() === activePlayer.token) {
        count++;
        r -= dr;
        c -= dc;
      }

      if (count >= 3) return true;
    }
    return false;
  };

  const isBoardFull = () => {
    return board.getBoard().every(row => row.every(cell => cell.getValue() !== ' '));
  }

  const printRound = () => {
    board.printBoard();
    if (!gameOver) console.log(`${activePlayer.playerName}'s turn.`);
  }

  const playRound = (row, col) => {
    if (gameOver) return "Game Over";

    const lastMove = board.dropToken(row, col, activePlayer.token);
    if (!lastMove) {
      console.log("Cell already occupied. Try again!");
      return "Cell already occupied. Try again!";
    }

    const { row: r, col: c } = lastMove;
    if (checkWin(r, c)) {
      board.printBoard();
      console.log(`${activePlayer.playerName} wins!`);
      gameOver = true;
      return `${activePlayer.playerName} wins!`;
    }

    if (isBoardFull()) {
      board.printBoard();
      console.log("It's a draw!");
      gameOver = true;
      return "It's a draw!";
    }

    const statusMessage = switchPlayer();
    printRound();
    return statusMessage;
  };

  const restartGame = () => {
    activePlayer = players[0];
    gameOver = false;
    for(let i =0; i<3; i++){
      for(let j = 0; j<3; j++){
        board.getBoard()[i][j].addToken(' ');
      }
    }
  };

  printRound();

  return {
    getActivePlayer,
    playRound,
    restartGame
  };
}

function screenController() {
  const statusDiv = document.querySelector(".status");
  const cells = document.querySelectorAll(".cell");
  const scoreX = document.querySelector(".score-x");
  const scoreO = document.querySelector(".score-o");
  const scoreDraw = document.querySelector(".draw");
  const restartBtn = document.querySelector(".restart-button");
  const resetScoreBtn = document.querySelector(".reset-score");

  const game = GameController();

  let scores = {
    X: 0,
    O: 0,
    D: 0
  };

  const updateStatus = (message) => {
    statusDiv.textContent = message;
  };

  const updateScoreBoard = (message) => {
    if (message.includes("Player X wins")) {
      scores.X++;
      scoreX.textContent = scores.X;
    } else if (message.includes("Player O wins")) {
      scores.O++;
      scoreO.textContent = scores.O;
    } else if (message.includes("It's a draw!")) {
      scores.D++;
      scoreDraw.textContent = scores.D;
    }
  };

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;

    cell.addEventListener("click", () => {
      const token = game.getActivePlayer().token;
      if (cell.textContent === "") {
        cell.textContent = token;
      }
      const message = game.playRound(row, col);
      updateStatus(message);
      updateScoreBoard(message);
    });
  });

  const restartGame = () => {
    cells.forEach(c => c.textContent = "");
    updateStatus("Player X's turn");
    game.restartGame();
  };

  const resetScores = () => {
    scores = { X: 0, O: 0, D: 0 };
    scoreX.textContent = 0;
    scoreO.textContent = 0;
    scoreDraw.textContent = 0;
    restartGame();
  };

  restartBtn.addEventListener("click", restartGame);
  resetScoreBtn.addEventListener("click", resetScores);
}

screenController();