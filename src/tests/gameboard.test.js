const gameBoard = require("../index");

test("ship has been placed!", () => {
    expect(
        gameBoard.placeShip(
            {
                length: 3,
                hitList: [],
                sunk: false,
                placement: [],
            },
            [3, 3]
        )
    ).toContainEqual([3, 3]);
});

test("attack successful!", () => {
    expect(gameBoard.receiveAttack([3,4])).toBeTruthy()
})

test("attack not successful!", () => {
    expect(gameBoard.receiveAttack([4,1])).not.toBeTruthy()
})

