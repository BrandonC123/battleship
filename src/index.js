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
        placeShip(playerName, ship, coordinate, color, horizontal) {
            for (let i = 0; i < ship.length; i++) {
                if (horizontal) {
                    gameBoardArray[coordinate[0] - 1][coordinate[1] - 1 + i] = [
                        coordinate[0],
                        coordinate[1] + i,
                    ];
                    ship.placement.push([coordinate[0], coordinate[1] + i]);
                    displayHandler.fillCell(playerName, coordinate, i, color);
                } else {
                    gameBoardArray[coordinate[0] - 1 + i][coordinate[1] - 1] = [
                        coordinate[0] + i,
                        coordinate[1],
                    ];
                    ship.placement.push([coordinate[0] + i, coordinate[1]]);
                    displayHandler.fillCell(
                        playerName,
                        coordinate,
                        i * 10,
                        color
                    );
                }
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
    function inputPlayerName() {
        document.querySelector(".player1-name").value =
            document.getElementById("player1-name-input").value;
        document.getElementById("start-card").classList.toggle("hide");
        return document.getElementById("player1-name-input").value;
    }
    function hoverCell(cells, ship, index, offset, horizontal) {
        // const cells = document.querySelectorAll(`.brandon-gameboard-cell`);
        if (horizontal) {
            // If ship is longer than board horizontally cancel hover
            if (
                index + (ship.length - offset) <=
                Math.floor(index / 10) * 10 + 10
            ) {
                cells[index + offset].classList.toggle("hover-cell");
                return true;
            } else {
                return false;
            }
        } else {
            // If ship is longer than board vertically cancel hover
            if (index + offset < 100) {
                cells[index + offset].classList.toggle("hover-cell");
                return true;
            } else {
                return false;
            }
        }
    }
    function toggleHoverCell(player, count, horizontal) {
        const ship = player.playerGameBoard.shipList[count];
        let cells = document.querySelectorAll(`.${player.name}-gameboard-cell`);

        // Event listener to rotate ships
        document.querySelector(".rotate-btn").addEventListener("click", () => {
            cells.forEach((cell) => {
                cell.replaceWith(cell.cloneNode());
            });
            toggleHoverCell(player, count, !horizontal);
            horizontal = !horizontal;
        });
        displayMessage(
            `Place your ships! ${
                player.playerGameBoard.shipList.length - count
            } remaining`
        );
        let hover;
        for (let i = 0; i < cells.length; i++) {
            cells[i].addEventListener("mouseover", () => {
                for (let j = 0; j < ship.length; j++) {
                    if (horizontal) {
                        hover = hoverCell(cells, ship, i, j, horizontal);
                    } else if (
                        !horizontal &&
                        i < 100 - (ship.length - 1) * 10
                    ) {
                        hover = hoverCell(cells, ship, i, j * 10, horizontal);
                    }
                    if (!hover) {
                        return;
                    }
                }
            });
            cells[i].addEventListener("mouseout", () => {
                for (let j = 0; j < ship.length; j++) {
                    if (horizontal) {
                        hover = hoverCell(cells, ship, i, j, horizontal);
                    } else if (
                        !horizontal &&
                        i < 100 - (ship.length - 1) * 10
                    ) {
                        hover = hoverCell(cells, ship, i, j * 10, horizontal);
                    }
                    if (!hover) {
                        j += ship.length;
                        return;
                    }
                }
            });
            cells[i].addEventListener("click", () => {
                const shipList = player.playerGameBoard.shipList;
                const coordinate = [Math.floor(i / 10 + 1), (i % 10) + 1];

                // Detect if ship overlaps another ship
                if (
                    checkOverlap(shipList, coordinate, ship.length, horizontal)
                ) {
                    return;
                }
                // Detects when ship is longer than gameboard
                if (
                    (horizontal && coordinate[1] + ship.length - 1) / 10 > 1 ||
                    (!horizontal && coordinate[0] + ship.length - 1) / 10 > 1
                ) {
                    return;
                }
                player.playerGameBoard.placeShip(
                    player.name,
                    ship,
                    coordinate,
                    "gray",
                    horizontal
                );
                if (count < 4) {
                    // Replace nodes to remove event listeners
                    cells.forEach((cell) => {
                        cell.replaceWith(cell.cloneNode());
                    });
                    toggleHoverCell(player, ++count, horizontal);
                } else {
                    document
                        .querySelector(".rotate-btn")
                        .classList.toggle("inactive");
                    displayMessage("Game Start, attack the enemy!");
                    cells.forEach((cell) => {
                        cell.classList.add("inactive");
                    });
                    generateShipPlacementWrapper(gameHandler.player2);
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
    function getAllPlacements(shipList) {
        let allPlacements = [];
        for (let i = 0; i < shipList.length; i++) {
            allPlacements = allPlacements.concat(shipList[i].placement);
        }
        return allPlacements;
    }
    function checkOverlap(shipList, testCoord, length, horizontal) {
        const allPlacements = getAllPlacements(shipList);
        for (let i = 0; i < length; i++) {
            // Compare coordinates and all placement of ships to determine
            // if there is a duplicate (vertically & horizontally)
            const allPlacementsString = JSON.stringify(allPlacements);
            const horizontalCoord = JSON.stringify([
                testCoord[0],
                testCoord[1] + i,
            ]);
            const verticalCoord = JSON.stringify([
                testCoord[0] + i,
                testCoord[1],
            ]);
            if (allPlacementsString.includes(horizontalCoord) && horizontal) {
                return true;
            }
            if (allPlacementsString.includes(verticalCoord) && !horizontal) {
                return true;
            }
        }
    }
    function generateShipPlacementWorker(player, index) {
        const shipList = player.playerGameBoard.shipList;
        const coord1 = Math.floor(Math.random() * 10 + 1);
        let coord2 = Math.floor(Math.random() * 10 + 1);
        if ((coord2 + shipList[index].length - 1) / 10 > 1) {
            coord2 -= shipList[index].length;
        }
        const coordinate = [coord1, coord2];
        if (checkOverlap(shipList, coordinate, shipList[index].length, true)) {
            generateShipPlacementWorker(player, index);
        } else {
            player.playerGameBoard.placeShip(
                player.name,
                shipList[index],
                coordinate,
                "white",
                true
            );
        }
    }
    function generateShipPlacementWrapper(player) {
        const shipList = player.playerGameBoard.shipList;
        for (let i = 0; i < shipList.length; i++) {
            allPlacements = generateShipPlacementWorker(player, i);
        }
    }
    function fillCell(playerName, coordinate, i, color) {
        let index = (coordinate[0] - 1) * 10 + (coordinate[1] + i - 1);
        let cells = document.querySelectorAll(`.${playerName}-gameboard-cell`);
        cells[index].style.backgroundColor = color;
        if (color === "lightgray") {
            cells[index].innerHTML = "&times;";
        }
    }
    function fillAttackCell(player, coordinate) {
        if (player.playerGameBoard.receiveAttack(coordinate)) {
            fillCell(player.name, coordinate, 0, "red");
            displayMessage("Hit!");
        } else {
            fillCell(player.name, coordinate, 0, "lightgray");
        }
    }
    // Event listener to attack cells
    function addAttackEventListener(player2) {
        const enemyCells = document.querySelectorAll(
            `.${player2.name}-gameboard-cell`
        );
        for (let i = 0; i < enemyCells.length; i++) {
            enemyCells[i].addEventListener("click", () => {
                // Disable attacking same cell by turning off pointer-events
                enemyCells[i].classList.toggle("inactive");
                const coordinate = [Math.floor(i / 10 + 1), (i % 10) + 1];
                toggleGameBoard(player2.name);
                setTimeout(() => displayMessage(`${player2.name}'s turn`), 1000);
                fillAttackCell(player2, coordinate);
                setTimeout(function () {
                    if (gameHandler.gameLoop()) {
                        displayMessage(`${gameHandler.player1.name}'s turn`);
                    }
                }, 2500);
            });
        }
    }
    // Disable attacking gameboard when not player's turn
    function toggleGameBoard(playerName) {
        let cells = document.querySelectorAll(`.${playerName}-gameboard-cell`);
        cells.forEach((cell) => {
            cell.classList.toggle("inactive");
        });
    }
    function clearBoardDisplay(player1Name, player2Name) {
        const cells = document.querySelectorAll(
            `.${player1Name}-gameboard-cell`
        );
        const enemyCells = document.querySelectorAll(
            `.${player2Name}-gameboard-cell`
        );
        for (let i = 0; i < cells.length; i++) {
            cells[i].classList.remove("hover-cell");
            cells[i].style.removeProperty("background-color");
            cells[i].replaceWith(cells[i].cloneNode());

            enemyCells[i].classList.remove("inactive");
            enemyCells[i].style.removeProperty("background-color");
            enemyCells[i].replaceWith(enemyCells[i].cloneNode());
        }
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
        toggleHoverCell(gameHandler.player1, 0, true);
        document.querySelector(".rotate-btn").classList.toggle("inactive");
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
    document.getElementById("start-btn").addEventListener("click", function () {
        if (!document.querySelector(".player-form").checkValidity()) {
            document.querySelector(".player-form").reportValidity();
            return;
        }
        let player1Name = displayHandler.inputPlayerName();
        player1 = player(player1Name, GameBoard());
        player2 = player("AI", GameBoard());
        gameHandler.player1 = player1;
        gameHandler.player2 = player2;
        displayHandler.generateGameBoard(player1Name);
        displayHandler.generateGameBoard(player2.name);
        displayHandler.toggleHoverCell(player1, 0, true);
    });

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
            displayHandler.displayMessage(`Game over! Winner is ${winner}`);
            player1.playerGameBoard = GameBoard();
            player2.playerGameBoard = GameBoard();
            document.querySelector(".new-game-btn").classList.add("show");
            player1Turn = true;
            displayHandler.toggleGameBoard(player2.name);
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
