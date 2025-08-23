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

function GameController(playerOne = 'playerX', playerTwo = 'playerO') {
  const players = [
    { playerName: playerOne, token: 'X' },
    { playerName: playerTwo, token: 'O' }
  ];

  const board = GameBoard();

  let activePlayer = players[0];

  const switchPlayer = () => {
    activePlayer = (activePlayer == players[0]) ? players[1] : players[0];
  }

  const getActivePlayer = () => {
    return activePlayer;
  }

  let gameOver = false;

  const checkWin = (row, col) => {
    const directions = [
      {dr:0,dc:1}, //horizontal
      {dr:1,dc:0}, //vertical
      {dr:1,dc:1}, //diagonal right
      {dr:1,dc:-1} //diagonal left
    ];

    for(const {dr,dc} of directions){
      let count = 1;
      let r = row + dr;
      let c = col + dc;

      while (r>=0 && r<3 && c>=0 && c<3 && board.getBoard()[r][c].getValue() === activePlayer.token){
        count++;
        r += dr;
        c += dc;
      }

      r = row - dr;
      c = col - dc;

    while (r>=0 && r<3 && c>=0 && c<3 && board.getBoard()[r][c].getValue() === activePlayer.token){
        count++;
        r -= dr;
        c -= dc;
      }

      if(count >= 3)  return true;
    }
    return false;
  };

  const isBoardFull = () => {
    return board.getBoard().every(row => row.every(cell => cell.getValue() !== ' '));
  }

  const printRound = () => {
    board.printBoard();
   if(!gameOver)  console.log(`${activePlayer.playerName}'s turn.`);
  }

  const playRound = (row, col) => {
    if(gameOver) return;

    const lastMove = board.dropToken(row, col, activePlayer.token);
    if(!lastMove){
      console.log("Cell already occupied. Try again!");
      return;
    }

    const{ row: r,col: c } = lastMove;
    if(checkWin(r,c)){
      board.printBoard();
      console.log(`${activePlayer.playerName} wins!`);
      gameOver = true;
      return;
    }

    if(isBoardFull()){
      board.printBoard();
      console.log("It's a draw!");
      gameOver = true;
      return;
    }

    switchPlayer();
    printRound();
  }

  printRound();

  return {
    getActivePlayer,
    playRound
  };
}

const game = GameController();