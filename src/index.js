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
        placeShip(ship, coordinate) {
            for (let i = 0; i < ship.length; i++) {
                gameBoardArray[coordinate[0] - 1][coordinate[1] - 1 + i] = [
                    coordinate[0],
                    coordinate[1] + i,
                ];
                ship.placement.push([coordinate[0], coordinate[1] + i]);
            }
            shipList.push(ship);
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
                    let index;
                    for (let i = 0; i < shipList.length; i++) {
                        shipList[i].placement.forEach((coord) => {
                            if (  JSON.stringify(coord) ===
                            JSON.stringify(coordinate)) {
                                index = i
                            }
                        })
                    }
                    shipList[index].hitList.push(coordinate)
                    console.log(shipList[index])
                    return true;
                }
            } catch {
                missedAttackList.push(coordinate);
                return false;
            }
        },
        checkAllShips() {},
        missedAttackList,
    };
};

let testShip = ship(3, [], false);
// console.log(testShip)
let testGameBoard = GameBoard();

module.exports.hit = testShip.hit;
module.exports.isSunk = testShip.isSunk;

module.exports.placeShip = testGameBoard.placeShip;
module.exports.receiveAttack = testGameBoard.receiveAttack;
