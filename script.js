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

    const checkIfWin = (positionsList) => {
        let rowMatch = 0;
        let columnMatch = 0;
        let diagonalMatch = 0;
        let lastPosition = positionsList[positionsList.length - 1]
        let positionsWithoutLast = positionsList.slice(0, -1)

        //positionsWithoutLast.forEach(position => {
        for (let i = 0; i < positionsList.length; i++){
            for (let j = i + 1; j < positionsList.length; j++){
                let position = positionsList[i];
                let lastPosition = positionsList[j];
                if (Math.floor(position / 3) === Math.floor(lastPosition / 3)) {
                    rowMatch++;
                } else if (position % 3 === lastPosition % 3) {
                    columnMatch++;
                } else if ((position % 2 === 0) && (lastPosition % 2 === 0)) {
                    diagonalMatch++;
                }
            }
            // if (Math.floor(position / 3) === Math.floor(lastPosition / 3)) {
            //     rowMatch++;
            // } else if (position % 3 === lastPosition % 3) {
            //     columnMatch++;
            // } else if ((position % 2 === 0) && (lastPosition % 2 === 0)) {
            //     diagonalMatch++;
            // }
        }//)
        //console.log({rowMatch, columnMatch, diagonalMatch});

        if (rowMatch === 3 || columnMatch === 3 || diagonalMatch >= 3) {
            //won
            return "win";
        } else if (positionsList.length === 5) {
            //draw
            return "draw";
        } {
            return false;
        }
    }

    const currentState = () => {
        const freePositionsList = [];
        Array.from(gameBoard.gameBoardContainer.children).forEach((child) => {
            if (child.textContent == "") {
                freePositionsList.push(child.boardIndex);
            }
        })
        return {
            p1Positions: [...player1.positionsList],
            p2Positions: [...player2.positionsList],
            freePositionsList
        }
    }

    const createNewState = (currentState, position, isP1) => {
        let positionIndex = currentState.freePositionsList.indexOf(position);
        let newState = JSON.parse(JSON.stringify(currentState));
        if (isP1) {
            newState.p1Positions.push(position);
            newState.freePositionsList.splice(positionIndex, 1);
        } else {
            newState.p2Positions.push(position);
            newState.freePositionsList.splice(positionIndex, 1);
        }
        return newState;
    }

    const scoreMove = (currentState, depth, isMaximazingPlayer) => {
        if (depth === 0 || checkIfWin(currentState.p1Positions) || checkIfWin(currentState.p2Positions)) {
            if (checkIfWin(currentState.p1Positions) === "win") return -100;
            if (checkIfWin(currentState.p1Positions) === "draw") return 0;
            if (checkIfWin(currentState.p2Positions) === "win") return 100 - depth;
        }
        if (isMaximazingPlayer) {
            let value = -100;
            currentState.freePositionsList.forEach(position => {
                let newState = createNewState(currentState, position, false)
                value = Math.max(value, scoreMove(newState, depth - 1, false));
                //console.log(newState.p1Positions, newState.p2Positions, value);
            })
            return value;
        } else {
            let value = 100;
            currentState.freePositionsList.forEach(position => {
                let newState = createNewState(currentState, position, true)
                value = Math.min(value, scoreMove(newState, depth - 1, true));
                //console.log(newState.p1Positions, newState.p2Positions, value);
            })
            return value;
        }
    }

    const chooseMove = (currentState) => {
        moveScores = {};

        currentState.freePositionsList.forEach(position => {
            let newState = createNewState(currentState, position, false);
            let value = scoreMove(newState, 8, false);
            moveScores[position] = value;
        })

        console.log(moveScores);
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
        switchActivePlayer,
        currentState,
        chooseMove,
    }
})(document.querySelector(".restartBtn"));

const displayController = ((infoLabel) => {

    let active = true;
    let result = false;

    const drawSymbol = (e) => {
        if (active) {
            activePlayer = gameController.getActivePlayer()
            if (e.target.textContent === "") {
                e.target.textContent = activePlayer.symbol;
                activePlayer.positionsList.push(e.target.boardIndex);
                result = gameController.checkIfWin(activePlayer.positionsList);
                if (result) {
                    active = false;
                } else {
                    gameController.switchActivePlayer();
                }
                changeInfoLabel(gameController.getActivePlayer());
                
                if (activePlayer.name == "Player 1"){
                    let currentState = gameController.currentState()
                    gameController.chooseMove(currentState);
                }
            }
        }
    }

    const changeInfoLabel = (activePlayer) => {
        if (result === false) infoLabel.textContent = `${activePlayer.name} turn`;
        if (result === "win") infoLabel.textContent = `${activePlayer.name} won!`;
        if (result === "draw") infoLabel.textContent = `Draw!`;
    }

    const setActive = (bool) => {
        active = bool;
        result = !bool;
    }

    gameBoard.gameBoardContainer.addEventListener("click", drawSymbol);

    return {
        setActive,
        drawSymbol,
        changeInfoLabel,
    }
})(document.querySelector(".infoLabel"));

gameController.resetGame();