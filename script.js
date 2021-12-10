const Player = (name, symbol) => {
    let positionsList = [];
    return {name, symbol, positionsList};
};

const gameBoard = ((gameBoardContainer) => {

    const createNewBoard = () => {
        for (let i = 0; i < 9; i++){
            let cell = document.createElement("div");
            cell['boardIndex'] = i;
            cell.classList.add("gridCell");
            gameBoardContainer.appendChild(cell);
        }
    }

    // const resetGame = () => {
    //     gameBoardContainer.innerHTML = "";
    //     createNewBoard();
    //     player1.positionsList = [];
    //     player2.positionsList = [];
    // }

    return {
        gameBoardContainer,
        createNewBoard,
    }
})(document.querySelector(".gameBoard"));

const gameController = (() => {

    const player1 = Player("player1", "X");
    const player2 = Player("player2", "O");
    let activePlayer = player1;

    const switchActivePlayer = () => {
        activePlayer = (activePlayer === player1) ? player2 : player1;
    }

    const getActivePlayer = () => {
        return activePlayer
    }

    const checkIfWin = (player, lastPosition) => {
        let rowMatch = 0;
        let columnMatch = 0;
        let diagonalMatch = 0;

        player.positionsList.forEach(position => {
            if (Math.floor(position / 3) === Math.floor(lastPosition / 3)) {
                rowMatch++;
            }
            else if (position % 3 === lastPosition % 3) {
                columnMatch++;
            }
            else if ((position % 2 === 0) && (lastPosition % 2 === 0)){
                diagonalMatch++; 
            }
        })
        console.log({rowMatch, columnMatch, diagonalMatch});
        if (rowMatch === 2 || columnMatch === 2 || diagonalMatch === 2){
            console.log(`${player.name} won`);
            return true;
        }
        else if (player.positionsList.length === 4)
        {
            console.log(`draw`);
            return true;
        }
        {
            return false;
        }
    }

    const resetGame = () => {
        gameBoard.gameBoardContainer.innerHTML = "";
        gameBoard.createNewBoard();
        player1.positionsList = [];
        player2.positionsList = [];
        activePlayer = player1;
    }

    return {
        player1, 
        player2,
        getActivePlayer,
        checkIfWin,
        resetGame,
        switchActivePlayer
    }
})();

// const player1 = Player("player1", "X");
// const player2 = Player("player2", "O");

const displayController = (() => {

    const drawSymbol = (e) => {
        activePlayer = gameController.getActivePlayer()
        if (e.target.textContent === ""){
            e.target.textContent = activePlayer.symbol;
            if (gameController.checkIfWin(activePlayer, e.target.boardIndex)){
                setTimeout(gameController.resetGame, 5000);
            }
            else 
            {
                activePlayer.positionsList.push(e.target.boardIndex);
                gameController.switchActivePlayer();
            }
        }
    }

    gameBoard.gameBoardContainer.addEventListener("click", drawSymbol);

    return {
        drawSymbol,
    }
})();

gameController.resetGame();