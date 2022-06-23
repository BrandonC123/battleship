function ship(length, hitList, sunk) {
    return {
        length: length,
        hitList: hitList,
        sunk: sunk,
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
        [],
        [],
        [],
        [],
        [],
        [],
    ];
    let missedAttackList = [];
    return {
        gameBoardArray,
        placeShip(ship, coordinate) {
            for (let i = 0; i < ship.length; i++) {
                gameBoardArray[coordinate[0] - 1][coordinate[1] - 1 + i] = [
                    coordinate[0],
                    coordinate[1] + i,
                ];
            }
            return gameBoardArray[coordinate[0] - 1];
        },
        receiveAttack(coordinate) {
            try {
                const coordinateTest =
                    gameBoardArray[coordinate[0] - 1][coordinate[1] - 1];
                if (
                    JSON.stringify(coordinateTest) ===
                    JSON.stringify(coordinate)
                ) {
                    return true;
                }
            } catch {
                missedAttackList.push(coordinate)
                return false;
            }
        },
        missedAttackList,
    };
};

let testShip = ship(3, [], false);
let testGameBoard = GameBoard();

module.exports.hit = testShip.hit;
module.exports.isSunk = testShip.isSunk;

module.exports.placeShip = testGameBoard.placeShip;
module.exports.receiveAttack = testGameBoard.receiveAttack;
