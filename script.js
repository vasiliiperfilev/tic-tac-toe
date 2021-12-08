const Player = (name, symbol) => {
    return {name, symbol};
};

const player1 = Player("player1", "X");
const player2 = Player("player2", "O");

const displayController = ((player1, player2) => {
    let activePlayer = player1;

    const switchActivePlayer = () => {
        activePlayer = (activePlayer === player1) ? player2 : player1;
    }

    const checkForWinner = (gameBoard, player, lastTurn) => {

    }

    const drawSymbol = (e) => {
        if (e.target.textContent === ""){
            e.target.textContent = activePlayer.symbol;
            checkForWinner(this, activePlayer);
            switchActivePlayer();
        }
    }
    return {
        drawSymbol,
    }
})(player1, player2);

const gameBoard = ((gameBoardContainer, displayController) => {

    gameBoardContainer.addEventListener("click", displayController.drawSymbol);

    const createNewBoard = () => {
        for (let i = 0; i < 9; i++){
            let cell = document.createElement("div");
            cell.classList.add("gridCell");
            gameBoardContainer.appendChild(cell);
        }
    }

    return {
        createNewBoard,
    }
})(document.querySelector(".gameBoard"), displayController);

gameBoard.createNewBoard();