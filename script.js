const Player = (name, symbol) => {
    let positionsList = [];
    return {
        name,
        symbol,
        positionsList
    };
};

const gameBoard = ((gameBoardContainer) => {

    const createNewBoard = () => {
        for (let i = 0; i < 9; i++) {
            let cell = document.createElement("div");
            cell['boardIndex'] = i;
            cell.classList.add("gridCell");
            gameBoardContainer.appendChild(cell);
        }
    }

    return {
        gameBoardContainer,
        createNewBoard,
    }
})(document.querySelector(".gameBoard"));

const gameController = ((restartBtn) => {

    const player1 = Player("Player 1", "X");
    const player2 = Player("Player 2", "O");
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
            } else if (position % 3 === lastPosition % 3) {
                columnMatch++;
            } else if ((position % 2 === 0) && (lastPosition % 2 === 0)) {
                diagonalMatch++;
            }
        })

        if (rowMatch === 2 || columnMatch === 2 || diagonalMatch === 2) {
            console.log(`${player.name} won`);
            return true;
        } else if (player.positionsList.length === 4) {
            console.log(`draw`);
            return true;
        } {
            return false;
        }
    }

    const resetGame = () => {
        gameBoard.gameBoardContainer.innerHTML = "";
        gameBoard.createNewBoard();
        player1.positionsList = [];
        player2.positionsList = [];
        activePlayer = player1;
        displayController.setActive(true);
        displayController.changeInfoLabel(activePlayer);
    }

    restartBtn.addEventListener('click', resetGame);

    return {
        getActivePlayer,
        checkIfWin,
        resetGame,
        switchActivePlayer
    }
})(document.querySelector(".restartBtn"));

const displayController = ((infoLabel) => {

    let active = true;

    const drawSymbol = (e) => {
        if (active) {
            activePlayer = gameController.getActivePlayer()
            if (e.target.textContent === "") {
                e.target.textContent = activePlayer.symbol;
                if (gameController.checkIfWin(activePlayer, e.target.boardIndex)) {
                    active = false;
                } else {
                    activePlayer.positionsList.push(e.target.boardIndex);
                    gameController.switchActivePlayer();
                }
                changeInfoLabel(gameController.getActivePlayer());
            }
        }
    }

    const changeInfoLabel = (activePlayer) => {
        if (active === true) infoLabel.textContent = `${activePlayer.name} turn`;
        if (active === false) infoLabel.textContent = `${activePlayer.name} won!`;
    }

    const setActive = (bool) => {
        active = bool;
    }

    gameBoard.gameBoardContainer.addEventListener("click", drawSymbol);

    return {
        setActive,
        drawSymbol,
        changeInfoLabel,
    }
})(document.querySelector(".infoLabel"));

gameController.resetGame();