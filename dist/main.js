/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (() => {

eval("function ship(length, hitList, sunk) {\r\n    return {\r\n        length: length,\r\n        hitList: hitList,\r\n        sunk: sunk,\r\n        placement: [],\r\n        hit(coordinate) {\r\n            hitList.push(coordinate);\r\n            return hitList;\r\n        },\r\n        isSunk() {\r\n            if (hitList.length === length) {\r\n                sunk = true;\r\n                return true;\r\n            } else {\r\n                return false;\r\n            }\r\n        },\r\n    };\r\n}\r\n\r\nconst GameBoard = () => {\r\n    let gameBoardArray = [\r\n        [[], [], [], [], [], [], [], [], [], []],\r\n        [[], [], [], [], [], [], [], [], [], []],\r\n        [[], [], [], [], [], [], [], [], [], []],\r\n        [[], [], [], [], [], [], [], [], [], []],\r\n        [[], [], [], [], [], [], [], [], [], []],\r\n        [[], [], [], [], [], [], [], [], [], []],\r\n        [[], [], [], [], [], [], [], [], [], []],\r\n        [[], [], [], [], [], [], [], [], [], []],\r\n        [[], [], [], [], [], [], [], [], [], []],\r\n        [[], [], [], [], [], [], [], [], [], []],\r\n    ];\r\n    let shipList = [\r\n        ship(5, [], false),\r\n        ship(4, [], false),\r\n        ship(3, [], false),\r\n        ship(3, [], false),\r\n        ship(2, [], false),\r\n    ];\r\n    let missedAttackList = [];\r\n    return {\r\n        gameBoardArray,\r\n        placeShip(playerName, ship, coordinate, color) {\r\n            for (let i = 0; i < ship.length; i++) {\r\n                gameBoardArray[coordinate[0] - 1][coordinate[1] - 1 + i] = [\r\n                    coordinate[0],\r\n                    coordinate[1] + i,\r\n                ];\r\n                displayHandler.fillCell(playerName, coordinate, i, color);\r\n                ship.placement.push([coordinate[0], coordinate[1] + i]);\r\n            }\r\n            return gameBoardArray[coordinate[0] - 1];\r\n        },\r\n        receiveAttack(coordinate) {\r\n            const coordinateTest =\r\n                gameBoardArray[coordinate[0] - 1][coordinate[1] - 1];\r\n            if (coordinateTest.length !== 0) {\r\n                if (\r\n                    JSON.stringify(coordinateTest) ===\r\n                    JSON.stringify(coordinate)\r\n                ) {\r\n                    let index;\r\n                    for (let i = 0; i < shipList.length; i++) {\r\n                        shipList[i].placement.forEach((coord) => {\r\n                            if (\r\n                                JSON.stringify(coord) ===\r\n                                JSON.stringify(coordinate)\r\n                            ) {\r\n                                index = i;\r\n                            }\r\n                        });\r\n                    }\r\n                    shipList[index].hitList.push(coordinate);\r\n                    if (shipList[index].isSunk()) {\r\n                        shipList[index].sunk = true;\r\n                    }\r\n                    console.log(shipList);\r\n                    return true;\r\n                }\r\n            } else {\r\n                missedAttackList.push(coordinate);\r\n                return false;\r\n            }\r\n        },\r\n        checkAllShips() {\r\n            let counter = 0;\r\n            shipList.forEach((ship) => {\r\n                if (ship.sunk) {\r\n                    counter++;\r\n                }\r\n            });\r\n            if (counter === shipList.length) {\r\n                return true;\r\n            } else {\r\n                return false;\r\n            }\r\n        },\r\n        missedAttackList,\r\n        shipList,\r\n    };\r\n};\r\n\r\nfunction player(name, playerGameBoard) {\r\n    function generateAttack() {\r\n        const coord1 = Math.floor(Math.random() * 10 + 1);\r\n        const coord2 = Math.floor(Math.random() * 10 + 1);\r\n        return [coord1, coord2];\r\n    }\r\n    return {\r\n        name: name,\r\n        playerGameBoard: playerGameBoard,\r\n        generateAttack,\r\n    };\r\n}\r\n\r\nconst displayHandler = (() => {\r\n    function inputPlayerName() {\r\n        document.querySelector(\".player1-name\").value =\r\n            document.getElementById(\"player1-name-input\").value;\r\n        document.getElementById(\"start-card\").classList.toggle(\"hide\");\r\n        return document.getElementById(\"player1-name-input\").value;\r\n    }\r\n    function hoverCell(ship, index, offset) {\r\n        const cells = document.querySelectorAll(\".Brandon-gameboard-cell\");\r\n        if (offset < 10) {\r\n            // If ship is longer than board horizontally cancel hover\r\n            if (\r\n                index + (ship.length - offset) <=\r\n                Math.floor(index / 10) * 10 + 10\r\n            ) {\r\n                cells[index + offset].classList.toggle(\"hover-cell\");\r\n            } else {\r\n                return;\r\n            }\r\n        } else {\r\n            // If ship is longer than board vertically cancel hover\r\n            if (index + offset < 100) {\r\n                cells[index + offset].classList.toggle(\"hover-cell\");\r\n            } else {\r\n                return;\r\n            }\r\n        }\r\n    }\r\n    function toggleHoverCell(player, count, horizontal) {\r\n        console.log(count);\r\n        const ship = player.playerGameBoard.shipList[count];\r\n        let cells = document.querySelectorAll(`.${player.name}-gameboard-cell`);\r\n\r\n        document.querySelector(\".rotate-btn\").addEventListener(\"click\", () => {\r\n            const cells = document.querySelectorAll(\".Brandon-gameboard-cell\");\r\n            cells.forEach((cell) => {\r\n                cell.replaceWith(cell.cloneNode());\r\n            });\r\n            toggleHoverCell(player, count, !horizontal);\r\n        });\r\n        displayMessage(\r\n            `Place your ships! ${\r\n                player.playerGameBoard.shipList.length - count\r\n            } remaining`\r\n        );\r\n\r\n        for (let i = 0; i < cells.length; i++) {\r\n            cells[i].addEventListener(\"mouseover\", () => {\r\n                for (let j = 0; j < ship.length; j++) {\r\n                    if (horizontal) {\r\n                        hoverCell(ship, i, j);\r\n                    } else {\r\n                        hoverCell(ship, i, j * 10);\r\n                    }\r\n                }\r\n            });\r\n            cells[i].addEventListener(\"mouseout\", () => {\r\n                for (let j = 0; j < ship.length; j++) {\r\n                    if (horizontal) {\r\n                        hoverCell(ship, i, j);\r\n                    } else {\r\n                        hoverCell(ship, i, j * 10);\r\n                    }\r\n                }\r\n            });\r\n            cells[i].addEventListener(\"click\", () => {\r\n                const shipList = player.playerGameBoard.shipList;\r\n                const coordinate = [Math.floor(i / 10 + 1), (i % 10) + 1];\r\n                if ((coordinate[1] + shipList[count].length - 1) / 10 > 1) {\r\n                    return;\r\n                }\r\n                player.playerGameBoard.placeShip(\r\n                    player.name,\r\n                    shipList[count],\r\n                    coordinate,\r\n                    \"gray\"\r\n                );\r\n                if (count < 4) {\r\n                    // Replace nodes to remove event listeners\r\n                    cells.forEach((cell) => {\r\n                        cell.replaceWith(cell.cloneNode());\r\n                    });\r\n                    toggleHoverCell(player, ++count, horizontal);\r\n                } else {\r\n                    displayMessage(\"Game Start, attack the enemy!\");\r\n                    cells.forEach((cell) => {\r\n                        cell.classList.add(\"inactive-cell\");\r\n                    });\r\n                    console.log(gameHandler.player1);\r\n                    generateAiShipPlacement(gameHandler.player2);\r\n                    displayHandler.addAttackEventListener(gameHandler.player2);\r\n                    gameHandler.gameLoop();\r\n                }\r\n            });\r\n        }\r\n    }\r\n    function generateGameBoard(player) {\r\n        const gameBoard = document.createElement(\"div\");\r\n        gameBoard.classList.add(\"gameboard\");\r\n\r\n        const fillerCell = document.createElement(\"div\");\r\n        gameBoard.appendChild(fillerCell);\r\n\r\n        let columnLabel = [\"A\", \"B\", \"C\", \"D\", \"E\", \"F\", \"G\", \"H\", \"I\", \"J\"];\r\n        for (let i = 0; i < 10; i++) {\r\n            const gameBoardCell = document.createElement(\"div\");\r\n            gameBoardCell.classList.add(\"gameboard-label\");\r\n            gameBoardCell.textContent = columnLabel[i];\r\n            gameBoard.appendChild(gameBoardCell);\r\n        }\r\n\r\n        let rowCount = 1;\r\n        for (let i = 0; i < 100; i++) {\r\n            if (i % 10 === 0) {\r\n                const gameBoardCell = document.createElement(\"div\");\r\n                gameBoardCell.classList.add(\"gameboard-label\");\r\n                gameBoardCell.textContent = rowCount;\r\n                gameBoard.appendChild(gameBoardCell);\r\n                rowCount++;\r\n            }\r\n            const gameBoardCell = document.createElement(\"div\");\r\n            gameBoardCell.classList.add(\r\n                player + \"-gameboard-cell\",\r\n                \"gameboard-cell\"\r\n            );\r\n            gameBoard.appendChild(gameBoardCell);\r\n        }\r\n        document.querySelector(\".gameboards-container\").appendChild(gameBoard);\r\n    }\r\n    function checkDuplicate(allPlacements, testCoord, length) {\r\n        for (let i = 0; i < length; i++) {\r\n            if (\r\n                JSON.stringify(allPlacements).includes(\r\n                    JSON.stringify([testCoord[0], testCoord[1] + i])\r\n                )\r\n            ) {\r\n                console.log(\"coord\");\r\n                return true;\r\n            }\r\n        }\r\n    }\r\n    function generateAiShipPlacementWorker(player, index, allPlacements) {\r\n        const shipList = player.playerGameBoard.shipList;\r\n        const coord1 = Math.floor(Math.random() * 10 + 1);\r\n        let coord2 = Math.floor(Math.random() * 10 + 1);\r\n        if ((coord2 + shipList[index].length - 1) / 10 > 1) {\r\n            coord2 -= shipList[index].length;\r\n        }\r\n        const coordinate = [coord1, coord2];\r\n        if (checkDuplicate(allPlacements, coordinate, shipList[index].length)) {\r\n            console.log(\"dupe\");\r\n            generateAiShipPlacementWorker(player, index, allPlacements);\r\n        } else {\r\n            player.playerGameBoard.placeShip(\r\n                player.name,\r\n                shipList[index],\r\n                coordinate,\r\n                \"white\"\r\n            );\r\n            shipList[index].placement.forEach((place) => {\r\n                allPlacements.push(place);\r\n            });\r\n        }\r\n        return allPlacements;\r\n    }\r\n    function generateAiShipPlacement(player) {\r\n        console.log(player);\r\n        const shipList = player.playerGameBoard.shipList;\r\n        let allPlacements = [];\r\n        for (let i = 0; i < shipList.length; i++) {\r\n            allPlacements = generateAiShipPlacementWorker(\r\n                player,\r\n                i,\r\n                allPlacements\r\n            );\r\n        }\r\n    }\r\n    function fillCell(playerName, coordinate, i, color) {\r\n        let index = (coordinate[0] - 1) * 10 + (coordinate[1] + i - 1);\r\n        let cells = document.querySelectorAll(`.${playerName}-gameboard-cell`);\r\n        cells[index].style.backgroundColor = color;\r\n        // cells[index].classList.toggle(\"inactive-cell\");\r\n    }\r\n    function fillAttackCell(player, coordinate) {\r\n        if (player.playerGameBoard.receiveAttack(coordinate)) {\r\n            fillCell(player.name, coordinate, 0, \"red\");\r\n            displayMessage(\"Hit!\");\r\n        } else {\r\n            fillCell(player.name, coordinate, 0, \"blue\");\r\n        }\r\n    }\r\n    // Event listener to attack cells\r\n    function addAttackEventListener(player2) {\r\n        const enemyCells = document.querySelectorAll(\r\n            `.${player2.name}-gameboard-cell`\r\n        );\r\n        for (let i = 0; i < enemyCells.length; i++) {\r\n            enemyCells[i].addEventListener(\"click\", () => {\r\n                const coordinate = [Math.floor(i / 10 + 1), (i % 10) + 1];\r\n                toggleGameBoard(player2.name);\r\n                setTimeout(\r\n                    () => displayMessage(`${player2.name}'s turn`),\r\n                    1000\r\n                );\r\n                fillAttackCell(player2, coordinate);\r\n                setTimeout(function () {\r\n                    if (gameHandler.gameLoop()) {\r\n                        displayMessage(`${gameHandler.player1.name}'s turn`);\r\n                    }\r\n                }, 3000);\r\n            });\r\n        }\r\n    }\r\n    // Disable attacking gameboard when not player's turn\r\n    function toggleGameBoard(playerName) {\r\n        let cells = document.querySelectorAll(`.${playerName}-gameboard-cell`);\r\n        cells.forEach((cell) => {\r\n            cell.classList.toggle(\"inactive-cell\");\r\n        });\r\n    }\r\n    function clearBoardDisplay(player1Name, player2Name) {\r\n        console.log(\"clear\");\r\n        let cells = document.querySelectorAll(`.${player1Name}-gameboard-cell`);\r\n        cells.forEach((cell) => {\r\n            cell.classList.remove(\"hover-cell\");\r\n            cell.style.removeProperty(\"background-color\");\r\n            cell.replaceWith(cell.cloneNode());\r\n        });\r\n        let enemyCells = document.querySelectorAll(\r\n            `.${player2Name}-gameboard-cell`\r\n        );\r\n        enemyCells.forEach((cell) => {\r\n            cell.style.removeProperty(\"background-color\");\r\n            cell.replaceWith(cell.cloneNode());\r\n        });\r\n    }\r\n    function displayMessage(message) {\r\n        const messageBar = document.querySelector(\".message-bar-content\");\r\n        messageBar.textContent = message;\r\n    }\r\n    document.querySelector(\".new-game-btn\").addEventListener(\"click\", () => {\r\n        displayHandler.clearBoardDisplay(\r\n            gameHandler.player1.name,\r\n            gameHandler.player2.name\r\n        );\r\n        toggleGameBoard(gameHandler.player1.name, gameHandler.player2.name);\r\n        toggleHoverCell(gameHandler.player1, 0);\r\n    });\r\n    return {\r\n        inputPlayerName,\r\n        generateGameBoard,\r\n        toggleHoverCell,\r\n        fillCell,\r\n        fillAttackCell,\r\n        addAttackEventListener,\r\n        toggleGameBoard,\r\n        clearBoardDisplay,\r\n        displayMessage,\r\n    };\r\n})();\r\n\r\nconst gameHandler = (() => {\r\n    let player1;\r\n    let player2;\r\n    // document.getElementById(\"start-btn\").addEventListener(\"click\", function () {\r\n    let player1Name = displayHandler.inputPlayerName();\r\n    player1 = player(player1Name, GameBoard());\r\n    player2 = player(\"AI\", GameBoard());\r\n    // gameHandler.player1 = player1;\r\n    // gameHandler.player2 = player2;\r\n    displayHandler.generateGameBoard(player1Name);\r\n    displayHandler.generateGameBoard(player2.name);\r\n    displayHandler.toggleHoverCell(player1, 0, true);\r\n    // });\r\n\r\n    let player1Turn = true;\r\n    function gameLoop() {\r\n        if (\r\n            player2.playerGameBoard.checkAllShips() ||\r\n            player1.playerGameBoard.checkAllShips()\r\n        ) {\r\n            let winner;\r\n            if (!player1Turn) {\r\n                winner = player1.name;\r\n            } else {\r\n                winner = player2.name;\r\n            }\r\n            console.log(\"game over!\");\r\n            displayHandler.displayMessage(`Game over! Winner is ${winner}`);\r\n            player1.playerGameBoard = GameBoard();\r\n            player2.playerGameBoard = GameBoard();\r\n            document.querySelector(\".new-game-btn\").classList.add(\"show\");\r\n            player1Turn = true;\r\n            displayHandler.toggleGameBoard(player2.name);\r\n            console.log(player1);\r\n            return false;\r\n        }\r\n        if (!player1Turn) {\r\n            let aiAttack = player2.generateAttack();\r\n            displayHandler.fillAttackCell(player1, aiAttack);\r\n            player1Turn = true;\r\n            displayHandler.toggleGameBoard(player2.name);\r\n        }\r\n        player1Turn = false;\r\n        console.log(player1);\r\n        console.log(player2);\r\n        return true;\r\n    }\r\n    return {\r\n        gameLoop,\r\n        player1,\r\n        player2,\r\n    };\r\n})();\r\n\r\n// let testShip = ship(3, [], false);\r\n// let testGameBoard = GameBoard();\r\n\r\n// module.exports.hit = testShip.hit;\r\n// module.exports.isSunk = testShip.isSunk;\r\n\r\n// module.exports.placeShip = testGameBoard.placeShip;\r\n// module.exports.receiveAttack = testGameBoard.receiveAttack;\r\n// module.exports.checkAllShips = testGameBoard.checkAllShips;\r\n\n\n//# sourceURL=webpack://battleship/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.js"]();
/******/ 	
/******/ })()
;