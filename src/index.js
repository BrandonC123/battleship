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
        {
            name: "destroyer",
            sunk: true,
            placement: [
                [4, 3],
                [4, 4],
                [4, 5],
            ],
        },
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
    return {
        generateGameBoard,
        fillShipCell,
    };
})();

const gameLoop = (() => {
    function newGame(player1Name, player2Name) {
        let player1 = player(player1Name, GameBoard());
        let player2 = player(player2Name, GameBoard());

        displayHandler.generateGameBoard("brandon");
        displayHandler.generateGameBoard("ai");
        player1.playerGameBoard.placeShip(
            player1Name,
            ship(5, [], false),
            [4, 2]
        );
        player1.playerGameBoard.placeShip(
            player1Name,
            ship(4, [], false),
            [1, 1]
        );
        player1.playerGameBoard.placeShip(
            player1Name,
            ship(4, [], false),
            [8, 5]
        );
        player1.playerGameBoard.placeShip(
            player1Name,
            ship(3, [], false),
            [6, 2]
        );
        player1.playerGameBoard.placeShip(
            player1Name,
            ship(2, [], false),
            [3, 7]
        );

        console.log(player1);
        console.log(player2);
    }
    newGame("brandon", "ai");
})();

let testShip = ship(3, [], false);
// console.log(testShip)
let testGameBoard = GameBoard();

module.exports.hit = testShip.hit;
module.exports.isSunk = testShip.isSunk;

module.exports.placeShip = testGameBoard.placeShip;
module.exports.receiveAttack = testGameBoard.receiveAttack;
module.exports.checkAllShips = testGameBoard.checkAllShips;
