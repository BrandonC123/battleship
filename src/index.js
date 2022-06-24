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
    let shipList = [];
    let missedAttackList = [];
    return {
        gameBoardArray,
        placeShip(playerName, ship, coordinate) {
            for (let i = 0; i < ship.length; i++) {
                gameBoardArray[coordinate[0] - 1][coordinate[1] - 1 + i] = [
                    coordinate[0],
                    coordinate[1] + i,
                ];
                displayHandler.fillShipCell(playerName, coordinate, i);
                ship.placement.push([coordinate[0], coordinate[1] + i]);
            }
            shipList.push(ship);
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
    function generateGameBoard(player) {
        const gameBoard = document.createElement("div");
        gameBoard.classList.add("gameboard");
        for (let i = 0; i < 100; i++) {
            const gameBoardCell = document.createElement("div");
            gameBoardCell.classList.add(
                player + "-gameboard-cell",
                "gameboard-cell"
            );
            gameBoard.appendChild(gameBoardCell);
        }
        document.querySelector(".gameboards-container").appendChild(gameBoard);
    }
    function fillShipCell(playerName, coordinate, i) {
        let index = (coordinate[0] - 1) * 10 + (coordinate[1] + i - 1);
        let cells = document.querySelectorAll(`.${playerName}-gameboard-cell`);
        cells[index].style.backgroundColor = "gray";
    }
    function addAttackEventListener(player2) {
        const enemyCells = document.querySelectorAll(
            `.${player2.name}-gameboard-cell`
        );
        for (let i = 0; i < enemyCells.length; i++) {
            enemyCells[i].addEventListener("click", () => {
                console.log(i);
                const coordinate = [Math.floor(i / 10 + 1), (i % 10) + 1];
                player2.playerGameBoard.receiveAttack(coordinate);
                console.log(player2);
                gameHandler.gameLoop();
            });
        }
    }
    return {
        generateGameBoard,
        fillShipCell,
        addAttackEventListener,
    };
})();

const gameHandler = (() => {
    let player1Name = "brandon";
    let player2Name = "ai";
    let player1 = player(player1Name, GameBoard());
    let player2 = player(player2Name, GameBoard());

    displayHandler.generateGameBoard("brandon");
    displayHandler.generateGameBoard("ai");
    displayHandler.addAttackEventListener(player2);

    player1.playerGameBoard.placeShip(player1Name, ship(5, [], false), [4, 2]);
    player1.playerGameBoard.placeShip(player1Name, ship(4, [], false), [1, 1]);
    player1.playerGameBoard.placeShip(player1Name, ship(4, [], false), [8, 5]);
    player1.playerGameBoard.placeShip(player1Name, ship(3, [], false), [6, 2]);
    player1.playerGameBoard.placeShip(player1Name, ship(2, [], false), [3, 7]);

    player2.playerGameBoard.placeShip(player2Name, ship(5, [], false), [4, 2]);
    player2.playerGameBoard.placeShip(player2Name, ship(4, [], false), [1, 1]);
    player2.playerGameBoard.placeShip(player2Name, ship(4, [], false), [8, 5]);
    player2.playerGameBoard.placeShip(player2Name, ship(3, [], false), [6, 2]);
    player2.playerGameBoard.placeShip(player2Name, ship(2, [], false), [9, 7]);

    let player1Turn = true;
    function gameLoop() {
        if (!player1Turn) {
            let aiAttack = player2.generateAttack();
            player1.playerGameBoard.receiveAttack(aiAttack)
            player1Turn = true;
        }
        if (player2.playerGameBoard.checkAllShips()) {
            console.log("game over!");
        }
        player1Turn = false;
        console.log(player1);
        console.log(player2);
    }
    return {
        gameLoop,
    };
})();

// let testShip = ship(3, [], false);
// let testGameBoard = GameBoard();

// module.exports.hit = testShip.hit;
// module.exports.isSunk = testShip.isSunk;

// module.exports.placeShip = testGameBoard.placeShip;
// module.exports.receiveAttack = testGameBoard.receiveAttack;
// module.exports.checkAllShips = testGameBoard.checkAllShips;
