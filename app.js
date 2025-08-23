console.log("TIC-TAC-TOE");

function GameBoard(){
  const rows = 3;
  const columns = 3;
  const board = [];

  for(let i =0; i< rows; i++){
    board[i] = [];
    for(let j = 0; j < columns; j++){
      board[i][j] = cell();
    }
  }

  const getBoard = () => board;

  const dropToken = (row,col,token) => {
    if (board[row][col].getValue() === ' ') {
      board[row][col].addToken(token);
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

function GameController(playerOne = 'playerX', playerTwo = 'playerO'){
  const players = [
    {playerName: playerOne, token: 'X'},
    {playerName: playerTwo, token: 'O'}
  ];

  const board = GameBoard();

  let activePlayer = players[0];

  const switchPlayer = () => {
    activePlayer = (activePlayer == players[0]) ? players[1] : players[0];
  }

  const getActivePlayer = () => {
    return activePlayer;
  }

  const printRound = () => {
    board.printBoard();
    console.log(`${activePlayer.playerName}'s turn.`);
  }

  const playRound = (row, col) => {
    board.dropToken(row, col, activePlayer.token);
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