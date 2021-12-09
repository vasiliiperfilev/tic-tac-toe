const Player = (name, symbol) => {
    let positionsList = [];
    return {name, symbol, positionsList};
};

const player1 = Player("player1", "X");
const player2 = Player("player2", "O");

const gameBoard = ((gameBoardContainer) => {

    const createNewBoard = () => {
        gameBoardContainer.innerHTML = "";
        for (let i = 0; i < 9; i++){
            let cell = document.createElement("div");
            cell['boardIndex'] = i;
            cell.classList.add("gridCell");
            gameBoardContainer.appendChild(cell);
        }
    }

    const resetGame = () => {
        createNewBoard();
        player1.positionsList = [];
        player2.positionsList = [];
    }

    return {
        gameBoardContainer,
        resetGame,
        player1,
        player2,
    }
})(document.querySelector(".gameBoard"));

const displayController = ((gameBoard) => {
    let activePlayer = gameBoard.player1;

    const switchActivePlayer = () => {
        activePlayer = (activePlayer === gameBoard.player1) ? gameBoard.player2 : gameBoard.player1;
    }

    const checkIfWin = (player, lastPosition) => {
        let rowMatch = 0;
        let columnMatch = 0;
        let diagonalMatch = 0;

        player.positionsList.forEach(position => {
            if (Math.floor(position / 3) === Math.floor(lastPosition / 3)) rowMatch++;
            if (position % 3 === lastPosition % 3) columnMatch++;
            if ((position % 2 === lastPosition % 2) && !(Math.floor(position / 3) === Math.floor(lastPosition / 3))) diagonalMatch++;
        })
        console.log({rowMatch, columnMatch, diagonalMatch})
        if (rowMatch === 3 || columnMatch === 3 || diagonalMatch === 3){
            console.log(`${player.name} won`);
            return true;
        }
        else if (gameBoard.player1.positionsList.length === 5)
        {
            console.log(`draw`);
            return true;
        }
        {
            return false;
        }
    }

    const drawSymbol = (e) => {
        if (e.target.textContent === ""){
            e.target.textContent = activePlayer.symbol;
            activePlayer.positionsList.push(e.target.boardIndex);
            if (checkIfWin(activePlayer, e.target.boardIndex)){
                setTimeout(gameBoard.resetGame, 5000)
            }
            else 
            {
                switchActivePlayer();
            }
        }
    }

    gameBoard.gameBoardContainer.addEventListener("click", drawSymbol);

    return {
        drawSymbol,
    }
})(gameBoard);

gameBoard.resetGame();