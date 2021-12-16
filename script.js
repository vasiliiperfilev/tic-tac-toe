const Player = (name, symbol, isAI) => {
    let positionsList = [];
    return {
        name,
        symbol,
        positionsList,
        isAI
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

    const findCell = index => {
        let cell;
        Array.from(gameBoardContainer.children).forEach(child => {
            if (child.boardIndex == index) cell = child;
        })
        return cell
    }

    return {
        gameBoardContainer,
        createNewBoard,
        findCell
    }
})(document.querySelector(".gameBoard"));

const gameController = ((restartBtn) => {

    const player1 = Player("Player", "X", false);
    const player2 = Player("AI", "O", true);
    let activePlayer = player1;
    let isInputActive = true;

    const switchActivePlayer = () => {
        activePlayer = (activePlayer === player1) ? player2 : player1;
        displayController.changeInfoLabel(activePlayer, false);
        if (activePlayer.isAI) {
            isInputActive = false;
            setTimeout(aiMakeMove, 300);
            setTimeout(() => isInputActive = true, 500);
        }
    }

    const checkIfWin = (positionsList) => {
        let rowMatch = 0;
        let columnMatch = 0;
        let diagonalMatch = 0;

        for (let i = 0; i < positionsList.length; i++) {
            for (let j = i + 1; j < positionsList.length; j++) {
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
        }

        if (rowMatch === 3 || columnMatch === 3 || diagonalMatch >= 3) {
            return "win";
        } else if (positionsList.length === 5) {
            return "draw";
        } else {
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
            })
            return value;
        } else {
            let value = 100;
            currentState.freePositionsList.forEach(position => {
                let newState = createNewState(currentState, position, true)
                value = Math.min(value, scoreMove(newState, depth - 1, true));
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

        const move = Object.keys(moveScores).reduce((a, b) => moveScores[a] > moveScores[b] ? a : b);
        return move;
    }

    const playerMakeMove = e => {
        if (isInputActive && e.target.textContent === "") {
            let target = e.target;
            activePlayer.positionsList.push(e.target.boardIndex);
            displayController.drawSymbol(target, activePlayer.symbol);
            checkMoveResult();
        }
    }

    const aiMakeMove = () => {
        let move = chooseMove(currentState());
        activePlayer.positionsList.push(move);
        let target = gameBoard.findCell(move);
        displayController.drawSymbol(target, activePlayer.symbol);
        checkMoveResult();
    }

    const checkMoveResult = () => {
        result = checkIfWin(activePlayer.positionsList);
        if (result) {
            displayController.setActive(false);
            displayController.changeInfoLabel(activePlayer, result);
        } else {
            switchActivePlayer();
        }
    }

    const resetGame = () => {
        gameBoard.gameBoardContainer.innerHTML = "";
        gameBoard.createNewBoard();
        player1.positionsList = [];
        player2.positionsList = [];
        activePlayer = player1;
        displayController.setActive(true);
        displayController.changeInfoLabel(activePlayer, false);
    }

    restartBtn.addEventListener('click', resetGame);
    gameBoard.gameBoardContainer.addEventListener("click", playerMakeMove);

    return {
        resetGame,
    }
})(document.querySelector(".restartBtn"));

const displayController = ((infoLabel) => {

    let active = true;

    const drawSymbol = (target, symbol) => {
        if (active) {
            target.textContent = symbol;
        }
    }

    const changeInfoLabel = (activePlayer, result) => {
        if (result === false) infoLabel.textContent = `${activePlayer.name} turn`;
        if (result === "win") infoLabel.textContent = `${activePlayer.name} won!`;
        if (result === "draw") infoLabel.textContent = `Draw!`;
    }

    const setActive = (bool) => {
        active = bool;
    }

    return {
        setActive,
        drawSymbol,
        changeInfoLabel,
    }
})(document.querySelector(".infoLabel"));

gameController.resetGame();