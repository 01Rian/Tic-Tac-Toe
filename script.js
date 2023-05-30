const gameBoard = (() => {
  const gameBoardElement = document.querySelector("#gameboard");
  const cells = [];

  const createBoard = () => {
    for (let i = 0; i < 9; i++) {
      const cell = createCell(i);
      cells.push(cell);
      gameBoardElement.appendChild(cell);
    }
  };

  const createCell = (index) => {
    const cellElement = document.createElement("div");
    cellElement.classList.add("cell");
    cellElement.id = index;
    cellElement.addEventListener("click", addSign);
    return cellElement;
  };

  const addSign = (e) => {
    const cell = e.target;
    if (cell.textContent === "") {
      // Get sign from gameModule
      gameModule.addSign(cell.id);
    }
  };

  const resetBoard = () => {
    cells.forEach((cell) => {
      cell.textContent = "";
      cell.removeEventListener("click", addSign);
      cell.addEventListener("click", addSign);
    });
  };

  return {
    createBoard,
    resetBoard,
    cells,
  };
})();

const displayController = (() => {
  const infoDisplay = document.querySelector(".winning-message");
  const infoTurnDisplay = document.querySelector(".turnDisplay");

  const showMessage = (message) => {
    infoDisplay.textContent = message;
    infoDisplay.classList.add("show");
  };

  const hideMessage = () => {
    infoDisplay.classList.remove("show");
    infoDisplay.innerHTML = "";
  };

  const updateTurnDisplay = (sign) => {
    infoTurnDisplay.textContent = `It is now ${sign === "X" ? "Cross" : "Circle"}'s turn`;
  };

  const createRestartButton = () => {
    const restartButton = document.createElement("button");
    restartButton.innerText = "Restart";
    restartButton.addEventListener("click", gameModule.resetGame);
    infoDisplay.appendChild(restartButton);
  };

  return {
    showMessage,
    hideMessage,
    updateTurnDisplay,
    createRestartButton,
  };
})();

const gameModule = (() => {
  let sign = "X";
  let movesCount = 0;
  let isGameOver = false;

  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const addSign = (cellId) => {
    const cell = gameBoard.cells[Number(cellId)];
    const signDisplay = document.createElement("div");

    signDisplay.classList.add(sign);
    signDisplay.textContent = sign;
    cell.appendChild(signDisplay);

    cell.removeEventListener("click", gameBoard.addSign);

    movesCount++;
    checkWin();

    sign = sign === "X" ? "O" : "X"; 
    displayController.updateTurnDisplay(sign);

    isDraw();
  };

  const isDraw = () => {
    if (movesCount === 9 && !isGameOver) {
      endGame("It's a Draw");
    }
  };

  const checkWin = () => {
    winningCombos.forEach((combo) => {
      const [a, b, c] = combo;
      const cells = gameBoard.cells;

      if (
        cells[a].textContent === sign &&
        cells[b].textContent === sign &&
        cells[c].textContent === sign
      ) {
        endGame(`${sign === "X" ? "Cross" : "Circle"} Wins`);
        isGameOver = true;
        return;
      }
    });
  };

  const endGame = (message) => {
    displayController.showMessage(message);
    displayController.createRestartButton();
  };

  const resetGame = () => {
    gameBoard.resetBoard();
    sign = "X";
    movesCount = 0;
    isGameOver = false;
    displayController.hideMessage();
    displayController.updateTurnDisplay(sign);
  };

  return {
    addSign,
    resetGame,
  };
})();

gameBoard.createBoard();
