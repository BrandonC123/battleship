const ship = require("../index")

test("target successfully hit", () => {
    expect(ship.hit(12)).toContain(12)
})

test("target successfully hit", () => {
    expect(ship.hit(12)).not.toContain(13)
})

test("ship is sunk!", () => {
    expect(ship.isSunk()).toBe(false);
})