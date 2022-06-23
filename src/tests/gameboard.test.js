const gameBoard = require("../index");

test("ship has been placed!", () => {
    expect(
        gameBoard.placeShip(
            {
                length: 3,
                hitList: [],
                sunk: false,
            },
            [3, 3]
        )
    ).toContainEqual([3, 3]);
});

test("ship has been placed!", () => {
    expect(
        gameBoard.placeShip(
            {
                length: 3,
                hitList: [],
                sunk: false,
            },
            [3, 3]
        )
    ).toContainEqual([3, 3]);
});

test("ship has been placed!", () => {
    expect(
        gameBoard.placeShip(
            {
                length: 3,
                hitList: [],
                sunk: false,
            },
            [3, 3]
        )
    ).toContainEqual([3, 5]);
});

test("attack not successful!", () => {
    expect(gameBoard.receiveAttack([3,5])).toBeTruthy()
})

test("attack not successful!", () => {
    expect(gameBoard.receiveAttack([4,1])).not.toBeTruthy()
})
