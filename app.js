// GameBoard function creates and manages the Tic-Tac-Toe board
function GameBoard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  // Initialize the board with empty cells
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i][j] = cell(); //Each cell is an object with method
    }
  }

  // Returns the current board
  const getBoard = () => board;

  // Drops a token into the cell if it is empty
  const dropToken = (row, col, token) => {
    if (board[row][col].getValue() === ' ') {
      board[row][col].addToken(token);
      return { row: row, col: col };
    }
  };

  // const printBoard = () => {
  //   console.log(board.map(row => row.map(cell => cell.getValue())));
  // };

  return {
    getBoard,
    dropToken,
    //printBoard
  };
}

// Cell function represents a single cell 
function cell() {
  let value = ' ';

  // Add tokens to the cell
  const addToken = (token) => {
    value = token;
  };

  // Return the current value of cell
  const getValue = () => value;

  return {
    addToken,
    getValue
  };
}

// GameController function manages the game logic and flow
function GameController(playerOne = 'Player X', playerTwo = 'Player O') {
  const players = [
    { playerName: playerOne, token: 'X' },
    { playerName: playerTwo, token: 'O' }
  ];

  // Initialize th board
  const board = GameBoard();

  // Start with player X
  let activePlayer = players[0];

  // Function to switch the player
  const switchPlayer = () => {
    activePlayer = (activePlayer == players[0]) ? players[1] : players[0];
    return `${activePlayer.playerName}'s turn`;
  }

  // Return the current active player
  const getActivePlayer = () => {
    return activePlayer;
  }

  // Flag to track the game state 
  let gameOver = false;

  // Check if last move resulted in a win
  const checkWin = (row, col) => {
    const directions = [
      { dr: 0, dc: 1 }, //horizontal
      { dr: 1, dc: 0 }, //vertical
      { dr: 1, dc: 1 }, //diagonal right
      { dr: 1, dc: -1 } //diagonal left
    ];

    // Checkk all directions for 3 in a row
    for (const { dr, dc } of directions) {
      let count = 1;
      let r = row + dr;
      let c = col + dc;

      // Check in positive direction 
      while (r >= 0 && r < 3 && c >= 0 && c < 3 && board.getBoard()[r][c].getValue() === activePlayer.token) {
        count++;
        r += dr;
        c += dc;
      }

      r = row - dr;
      c = col - dc;

      // Check in negative direction
      while (r >= 0 && r < 3 && c >= 0 && c < 3 && board.getBoard()[r][c].getValue() === activePlayer.token) {
        count++;
        r -= dr;
        c -= dc;
      }

      // If three in a row are found
      if (count >= 3) return true;
    }
    return false;
  };

  // Check if the board is full (draw)
  const isBoardFull = () => {
    return board.getBoard().every(row => row.every(cell => cell.getValue() !== ' '));
  }

  // const printRound = () => {
  //   board.printBoard();
  //   if (!gameOver) console.log(`${activePlayer.playerName}'s turn.`);
  // }

  // Main function to play a round 
  const playRound = (row, col) => {
    if (gameOver) return "Game Over"; //  Stop if game is over

    const lastMove = board.dropToken(row, col, activePlayer.token);
    if (!lastMove) {
      return "Cell already occupied. Try again!";
    }

     // Extract the last move's row and column
    const { row: r, col: c } = lastMove;

    // Check for win
    if (checkWin(r, c)) {
      // board.printBoard();
      // console.log(`${activePlayer.playerName} wins!`);
      gameOver = true;
      return `${activePlayer.playerName} wins!`;
    }

    // Check for draw
    if (isBoardFull()) {
      // board.printBoard();
      // console.log("It's a draw!");
      gameOver = true;
      return "It's a draw!";
    }

    // Switch player
    const statusMessage = switchPlayer();
    //printRound();
    return statusMessage;
  };

  // Restart the game 
  const restartGame = () => {
    activePlayer = players[0];
    gameOver = false;
    for(let i =0; i<3; i++){
      for(let j = 0; j<3; j++){
        board.getBoard()[i][j].addToken(' ');
      }
    }
  };

  //printRound();

  return {
    getActivePlayer,
    playRound,
    restartGame
  };
}

// ScreenController function manages the UI interactions
function ScreenController() {
  // Get DOM elements
  const statusDiv = document.querySelector(".status");
  const cells = document.querySelectorAll(".cell");
  const scoreX = document.querySelector(".score-x");
  const scoreO = document.querySelector(".score-o");
  const scoreDraw = document.querySelector(".draw");
  const restartBtn = document.querySelector(".restart-button");
  const resetScoreBtn = document.querySelector(".reset-score");

  const game = GameController();  // Create a new game instance

  // Score tracking
  let scores = {
    X: 0,
    O: 0,
    D: 0
  };

  // Updates the status on the screen
  const updateStatus = (message) => {
    statusDiv.textContent = message;
  };

  // Update the score board on the screen
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

  // ADD event listener to all cells
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

  // Restart game
  const restartGame = () => {
    cells.forEach(c => c.textContent = "");
    updateStatus("Player X's turn");
    game.restartGame();
  };

  // Reset scores 
  const resetScores = () => {
    scores = { X: 0, O: 0, D: 0 };
    scoreX.textContent = 0;
    scoreO.textContent = 0;
    scoreDraw.textContent = 0;
    restartGame();
  };

  // Add button event listeners
  restartBtn.addEventListener("click", restartGame);
  resetScoreBtn.addEventListener("click", resetScores);
}

// Start the game
ScreenController();