function ship(length, hitList, sunk) {
    return {
        length: length,
        hitList: hitList,
        sunk: sunk,
        placement: [],
        hit(coordinate) {
            hitList.push(coordinate);
            return hitList;
        },
        isSunk() {
            if (hitList.length === length) {
                sunk = true;
                return true;
            } else {
                return false;
            }
        },
    };
}

const GameBoard = () => {
    let gameBoardArray = [
        [[], [], [], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], [], [], []],
    ];
    let shipList = [
        ship(5, [], false),
        ship(4, [], false),
        ship(3, [], false),
        ship(3, [], false),
        ship(2, [], false),
    ];
    let missedAttackList = [];
    return {
        gameBoardArray,
        placeShip(playerName, ship, coordinate) {
            for (let i = 0; i < ship.length; i++) {
                gameBoardArray[coordinate[0] - 1][coordinate[1] - 1 + i] = [
                    coordinate[0],
                    coordinate[1] + i,
                ];
                displayHandler.fillCell(playerName, coordinate, i, "gray");
                ship.placement.push([coordinate[0], coordinate[1] + i]);
            }
            return gameBoardArray[coordinate[0] - 1];
        },
        receiveAttack(coordinate) {
            const coordinateTest =
                gameBoardArray[coordinate[0] - 1][coordinate[1] - 1];
            if (coordinateTest.length !== 0) {
                if (
                    JSON.stringify(coordinateTest) ===
                    JSON.stringify(coordinate)
                ) {
                    let index;
                    for (let i = 0; i < shipList.length; i++) {
                        shipList[i].placement.forEach((coord) => {
                            if (
                                JSON.stringify(coord) ===
                                JSON.stringify(coordinate)
                            ) {
                                index = i;
                            }
                        });
                    }
                    shipList[index].hitList.push(coordinate);
                    if (shipList[index].isSunk()) {
                        shipList[index].sunk = true;
                    }
                    console.log(shipList);
                    return true;
                }
            } else {
                missedAttackList.push(coordinate);
                return false;
            }
        },
        checkAllShips() {
            let counter = 0;
            shipList.forEach((ship) => {
                if (ship.sunk) {
                    counter++;
                }
            });
            if (counter === shipList.length) {
                return true;
            } else {
                return false;
            }
        },
        missedAttackList,
        shipList,
    };
};

function player(name, playerGameBoard) {
    function generateAttack() {
        const coord1 = Math.floor(Math.random() * 10 + 1);
        const coord2 = Math.floor(Math.random() * 10 + 1);
        return [coord1, coord2];
    }
    return {
        name: name,
        playerGameBoard: playerGameBoard,
        generateAttack,
    };
}

const displayHandler = (() => {
    const defaultCellColor = "white";
    const hoverCellColor = "greenyellow";
    function inputPlayerName() {
        document.querySelector(".player1-name").value =
            document.getElementById("player1-name-input").value;
        document.getElementById("start-card").classList.toggle("hide");
        return document.getElementById("player1-name-input").value;
    }
    function toggleHoverCell(player, count) {
        console.log(count);
        displayMessage("Place your ships!");
        const ship = player.playerGameBoard.shipList[count];
        let cells = document.querySelectorAll(".brandon-gameboard-cell");
        for (let i = 0; i < cells.length; i++) {
            cells[i].addEventListener("mouseover", () => {
                for (let j = 0; j < ship.length; j++) {
                    if (i + (ship.length - j) <= Math.floor(i / 10) * 10 + 10) {
                        cells[i + j].classList.toggle("hover-cell");
                    } else {
                        return;
                    }
                }
            });
            cells[i].addEventListener("mouseout", () => {
                for (let j = 0; j < ship.length; j++) {
                    if (i + (ship.length - j) <= Math.floor(i / 10) * 10 + 10) {
                        cells[i + j].classList.toggle("hover-cell");
                    } else {
                        return;
                    }
                }
            });
            cells[i].addEventListener("click", () => {
                const shipList = player.playerGameBoard.shipList;
                const coordinate = [Math.floor(i / 10 + 1), (i % 10) + 1];
                if ((coordinate[1] + shipList[count].length - 1) / 10 > 1) {
                    return;
                }
                player.playerGameBoard.placeShip(
                    player.name,
                    shipList[count],
                    coordinate
                );
                if (count < 4) {
                    // Replace nodes to remove event listeners
                    cells.forEach((cell) => {
                        cell.replaceWith(cell.cloneNode());
                    });
                    toggleHoverCell(player, ++count);
                } else {
                    displayMessage("Game Start, attack the enemy!");
                    cells.forEach((cell) => {
                        cell.classList.add("inactive-cell");
                    });
                    generateAiShipPlacement(gameHandler.player2);
                    displayHandler.addAttackEventListener(gameHandler.player2);
                    gameHandler.gameLoop();
                }
            });
        }
    }
    function generateGameBoard(player) {
        const gameBoard = document.createElement("div");
        gameBoard.classList.add("gameboard");

        const fillerCell = document.createElement("div");
        gameBoard.appendChild(fillerCell);

        let columnLabel = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
        for (let i = 0; i < 10; i++) {
            const gameBoardCell = document.createElement("div");
            gameBoardCell.classList.add("gameboard-label");
            gameBoardCell.textContent = columnLabel[i];
            gameBoard.appendChild(gameBoardCell);
        }

        let rowCount = 1;
        for (let i = 0; i < 100; i++) {
            if (i % 10 === 0) {
                const gameBoardCell = document.createElement("div");
                gameBoardCell.classList.add("gameboard-label");
                gameBoardCell.textContent = rowCount;
                gameBoard.appendChild(gameBoardCell);
                rowCount++;
            }
            const gameBoardCell = document.createElement("div");
            gameBoardCell.classList.add(
                player + "-gameboard-cell",
                "gameboard-cell"
            );
            gameBoard.appendChild(gameBoardCell);
        }
        document.querySelector(".gameboards-container").appendChild(gameBoard);
    }
    function checkDuplicate(allPlacements, testCoord, length) {
        for (let i = 0; i < length; i++) {
            if (
                JSON.stringify(allPlacements).includes(
                    JSON.stringify([testCoord[0], testCoord[1] + i])
                )
            ) {
                console.log("coord");
                return true;
            }
        }
    }
    function generateAiShipPlacementWorker(player, index, allPlacements) {
        const shipList = player.playerGameBoard.shipList;
        const coord1 = Math.floor(Math.random() * 10 + 1);
        let coord2 = Math.floor(Math.random() * 10 + 1);
        if ((coord2 + shipList[index].length - 1) / 10 > 1) {
            coord2 -= shipList[index].length;
        }
        const coordinate = [coord1, coord2];
        if (checkDuplicate(allPlacements, coordinate, shipList[index].length)) {
            console.log("dupe");
            generateAiShipPlacementWorker(player, index, allPlacements);
        } else {
            player.playerGameBoard.placeShip(
                player.name,
                shipList[index],
                coordinate
            );
            shipList[index].placement.forEach((place) => {
                allPlacements.push(place);
            });
        }
        return allPlacements;
    }
    function generateAiShipPlacement(player) {
        const shipList = player.playerGameBoard.shipList;
        let allPlacements = [];
        for (let i = 0; i < shipList.length; i++) {
            allPlacements = generateAiShipPlacementWorker(
                player,
                i,
                allPlacements
            );
        }
    }
    function fillCell(playerName, coordinate, i, color) {
        let index = (coordinate[0] - 1) * 10 + (coordinate[1] + i - 1);
        let cells = document.querySelectorAll(`.${playerName}-gameboard-cell`);
        cells[index].style.backgroundColor = color;
        // cells[index].classList.toggle("inactive-cell");
    }
    function fillAttackCell(player, coordinate) {
        if (player.playerGameBoard.receiveAttack(coordinate)) {
            fillCell(player.name, coordinate, 0, "red");
            displayMessage("Hit!");
        } else {
            fillCell(player.name, coordinate, 0, "blue");
        }
    }
    // Event listener to attack cells
    function addAttackEventListener(player2) {
        const enemyCells = document.querySelectorAll(
            `.${player2.name}-gameboard-cell`
        );
        for (let i = 0; i < enemyCells.length; i++) {
            // enemyCells[i].style.backgroundColor = "white";
            enemyCells[i].addEventListener("click", () => {
                const coordinate = [Math.floor(i / 10 + 1), (i % 10) + 1];
                toggleGameBoard(player2.name);
                setTimeout(() => displayMessage(`${player2.name}'s turn`), 0);
                fillAttackCell(player2, coordinate);
                setTimeout(function () {
                    if (gameHandler.gameLoop()) {
                        displayMessage(`${gameHandler.player1.name}'s turn`);
                    }
                }, 0);
            });
        }
    }
    // Disable attacking gameboard when not player's turn
    function toggleGameBoard(playerName) {
        let cells = document.querySelectorAll(`.${playerName}-gameboard-cell`);
        cells.forEach((cell) => {
            cell.classList.toggle("inactive-cell");
        });
    }
    function clearBoardDisplay(player1Name, player2Name) {
        console.log("clear");
        let cells = document.querySelectorAll(`.${player1Name}-gameboard-cell`);
        cells.forEach((cell) => {
            cell.classList.remove("hover-cell");
            cell.style.removeProperty("background-color");
            cell.replaceWith(cell.cloneNode());
        });
        let enemyCells = document.querySelectorAll(
            `.${player2Name}-gameboard-cell`
        );
        enemyCells.forEach((cell) => {
            cell.style.removeProperty("background-color");
            cell.replaceWith(cell.cloneNode());
        });
    }
    function displayMessage(message) {
        const messageBar = document.querySelector(".message-bar-content");
        messageBar.textContent = message;
    }
    document.querySelector(".new-game-btn").addEventListener("click", () => {
        displayHandler.clearBoardDisplay(
            gameHandler.player1.name,
            gameHandler.player2.name
        );
        toggleGameBoard(gameHandler.player1.name, gameHandler.player2.name);
        toggleHoverCell(gameHandler.player1, 0);
    });
    return {
        inputPlayerName,
        generateGameBoard,
        toggleHoverCell,
        fillCell,
        fillAttackCell,
        addAttackEventListener,
        toggleGameBoard,
        clearBoardDisplay,
        displayMessage,
    };
})();

const gameHandler = (() => {
    let player1;
    let player2;
    // document.getElementById("start-btn").addEventListener("click", () => {
    //     let player1Name = displayHandler.inputPlayerName();
    let player1Name = "brandon";
    player1 = player(player1Name, GameBoard());
    displayHandler.generateGameBoard(player1Name);
    displayHandler.toggleHoverCell(player1, 0);
    player2 = player("AI", GameBoard());

    displayHandler.generateGameBoard(player2.name);
    // });

    let player1Turn = true;
    function gameLoop() {
        if (
            player2.playerGameBoard.checkAllShips() ||
            player1.playerGameBoard.checkAllShips()
        ) {
            let winner;
            if (!player1Turn) {
                winner = player1.name;
            } else {
                winner = player2.name;
            }
            console.log("game over!");
            displayHandler.displayMessage(`Game over! Winner is ${winner}`);
            player1.playerGameBoard = GameBoard();
            player2.playerGameBoard = GameBoard();
            document.querySelector(".new-game-btn").classList.add("show");
            player1Turn = true;
            displayHandler.toggleGameBoard(player2.name);
            console.log(player1);
            return false;
        }
        if (!player1Turn) {
            let aiAttack = player2.generateAttack();
            displayHandler.fillAttackCell(player1, aiAttack);
            player1Turn = true;
            displayHandler.toggleGameBoard(player2.name);
        }
        player1Turn = false;
        return true;
        console.log(player1);
        console.log(player2);
    }
    return {
        gameLoop,
        player1,
        player2,
    };
})();

// let testShip = ship(3, [], false);
// let testGameBoard = GameBoard();

// module.exports.hit = testShip.hit;
// module.exports.isSunk = testShip.isSunk;

// module.exports.placeShip = testGameBoard.placeShip;
// module.exports.receiveAttack = testGameBoard.receiveAttack;
// module.exports.checkAllShips = testGameBoard.checkAllShips;
