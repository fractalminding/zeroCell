"use strict";
let table = {
    createArray: function(width, height) {
        table.array = [];
        for (let i = 0; i < height; i++) {
            table.array[i] = table.row.create(width);
        }
    },
    originArrayUpdate: function() {
        return JSON.parse(JSON.stringify(table.array));
    },
    updateHistory: function() {
        table.history.push(JSON.parse(JSON.stringify(table.array)));
    },
    restoreArrayFromOrigin: function() {
        table.array = JSON.parse(JSON.stringify(table.originArray));
    },
    downgradeBigNumbers: function() {
        let isFinished = true;
        table.array.forEach(function(row, y) {
            row.forEach(function(cellText, x) {
                if (table.cell.isTooBig(x, y)) {
                    //console.log(x, y, cellText);
                    table.array[y][x] = table.array[y][x] - 1;
                    isFinished = false;
                }
            });
        });
        if (isFinished) return; 
            else table.downgradeBigNumbers();
    },
    row: {
        create: function(length) {
            let rowArray = [];
            for (let i = 0; i < length; i++) {
                rowArray.push(table.cell.getRandomNumber(
                    1, table.cell.maxRandomNumber
                ));
            }
            return rowArray;
        }
    },
    cell: {
        getRandomNumber: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        },
        downgrade: function(x, y) {
            let cellText = table.array[y][x];
            if (cellText != 0) {
                table.array[y][x] = cellText - 1;
            }
        },
        upgrade: function(x, y) {
            let cellText = table.array[y][x];
            if (cellText != 0) {
                table.array[y][x] = cellText + 1;
            }
        },
        isTooBig: function(x, y) {
            let currentCellValue = table.array[y][x];
            
            for (let cellCoords of table.getAmbientCells(x, y)) {
                let cellValue = table.array[cellCoords[1]][cellCoords[0]];
                if (cellValue >= currentCellValue) {
                    //console.log('--- ', x, y, currentCellValue, 
                    //cellValue, cellCoords);
                    return false;
                }
            }
            //console.log(x, y, currentCellValue, true);
            return true;
        }
    },
    isExistActiveCells: function() {
        let existing = false;
        table.array.forEach(function(row, y) {
            row.forEach(function(cellText, x) {
                if (cellText != 0) {
                    if (table.isExistAmbient(x, y)) existing = true;
                    //console.log(x, y, existing);
                }
            });
        });
        //console.log(existing);
        return existing;
    },
    isExistCells: function() {
        let existing = false;
        table.array.forEach(function(row, y) {
            row.forEach(function(cellText, x) {
                if (cellText > 0) existing = true;
            });
        });
        //console.log(existing);
        return existing;
    },
    getAmbientCells: function(x, y) {
        let cellsArray = [];
        cellsArray.push([x - 1, y - 1]);
        cellsArray.push([x, y - 1]);
        cellsArray.push([x + 1, y - 1]);
        cellsArray.push([x - 1, y]);
        cellsArray.push([x + 1, y]);
        cellsArray.push([x - 1, y + 1]);
        cellsArray.push([x, y + 1]);
        cellsArray.push([x + 1, y + 1]);
        return cellsArray.filter(function(elem) {
            if (elem[0] >= 0 && elem[0] <= 9 && elem[1] >= 0 && elem[1] <= 9) 
                return elem;
        });
    },
    isExistAmbient: function(x, y) {
        return table.getAmbientCells(x, y).filter(function(coords) {
            if (table.array[coords[1]][coords[0]] > 0) return coords;
        }).length > 0 ? true : false;
    }
};
let canvas = {
    rectColors:
        //цвета для клеток по рангу (по порядку: от 0)
        ['#ffefe0', 
        '#fdcb9e', '#fdcb9e', 
        '#00b7c2', '#00b7c2',
        '#0f4c75', '#0f4c75', 
        '#1b262c', '#1b262c'],
    drawRectByCoordinates(x, y) {
        let coordX = x * 40;
        let coordY = y * 40;
        let width = 40;
        let height = 40;
        let cellText = table.array[y][x];
        let context = canvas.context;
        context.fillStyle = canvas.rectColors[cellText];
        context.fillRect(coordX, coordY, width, height);
    },
    drawFinishScreen() {
        if (table.isExistCells()) {
            game.showFallScreen();
        } else {
            game.showWinScreen();
        }
    },
    drawTextLabelByCoordinates(x, y) {
        let coordX = x * 40 + 10;
        let coordY = y * 40 + 30;
        let color = 'white';
        let text = table.array[y][x];
        if (text == 0) return;
        let context = canvas.context;
        context.fillStyle = color;
        context.font = "30px Arial";
        context.fillText(text, coordX, coordY);
    },
    draw: function() {
        table.array.forEach(function(row, y) {
            row.forEach(function(cellText, x) {
                canvas.drawRectByCoordinates(x, y);
                canvas.drawTextLabelByCoordinates(x, y);
            });
        });
    }
}
let game = {
    init: function() {
        table.array = [];
        canvas.element = document.getElementById('game');
        canvas.context = canvas.element.getContext('2d');
        /* table.createArray(10, 10);
        table.downgradeBigNumbers();
        canvas.draw(); */
        canvas.element.addEventListener('click', game.actions.click);
        game.balance.element = document.getElementById('balance');
        //game.balance.unitedValue = game.balance.getValue();
        //game.balance.refresh();
        game.newGameButton = document.getElementById('newGame');
        game.newGameButton.addEventListener('click', function() {
            game.hideGameScreen();
            game.showNewGameScreen();
        });
        game.refreshButton = document.getElementById('restart');
        game.refreshButton.addEventListener('click', game.actions.restart);
        game.backButton = document.getElementById('back');
        game.backButton.addEventListener('click', game.actions.back);
        table.originArray = table.originArrayUpdate();
        //table.history = [JSON.parse(JSON.stringify(table.array))];
        
        game.startEasyGame = document.querySelector('.levelEasy');
        game.startEasyGame.addEventListener('click', function() {
            game.actions.newGame('easy');
        });
        game.startMediumGame = document.querySelector('.levelMedium');
        game.startMediumGame.addEventListener('click', function() {
            game.actions.newGame('medium');
        });
        game.startHardGame = document.querySelector('.levelHard');
        game.startHardGame.addEventListener('click', function() {
            game.actions.newGame('hard');
        });
        game.showNewGameScreen();
    },
    showNewGameScreen: function() {
        let newGameScreen = document.getElementById('newGameScreen');
        newGameScreen.style.display = 'table';
    },
    showGameScreen: function() {
        let gameScreen = document.getElementById('gameScreen');
        gameScreen.style.display = 'table';
    },
    hideNewGameScreen: function() {
        let newGameScreen = document.getElementById('newGameScreen');
        newGameScreen.style.display = 'none';
    },
    hideGameScreen: function() {
        let gameScreen = document.getElementById('gameScreen');
        gameScreen.style.display = 'none';
    },
    showWinScreen: function() {
        let context = canvas.context;
        context.fillStyle = 'rgba(0, 184, 194, 0.5)';
        context.fillRect(0, 0, 400, 400);
    },
    showFallScreen() {
        let context = canvas.context;
        context.fillStyle = 'rgba(218, 7, 7, 0.5)';
        context.fillRect(0, 0, 400, 400);
    },
    checkEnd: function() {
        if (!table.isExistActiveCells()) game.actions.end();
    },
    balance: {
        refresh: function() {
            let element = game.balance.element;
            let balanceText = `passed ${game.balance.get()} %`
            element.innerHTML = balanceText;
        },
        get: function() {
            let passed = game.balance.unitedValue - game.balance.getValue();
            //console.log(passed);
            return Math.floor(passed / (game.balance.unitedValue / 100));
        },
        getValue: function() {
            let unitedValue = 0;
            table.array.forEach(function(row, y) {
                row.forEach(function(cellValue, x) {
                    //console.log(cellValue);
                    unitedValue += cellValue;
                });
            });
            //console.log(unitedValue);
            return unitedValue;
        }
    },
    actions: {
        click: function(event) {
            let x = Math.floor(event.offsetX / 40); 
            let y = Math.floor(event.offsetY / 40);
            if (table.array[y][x] == 0) return;
            if (!table.isExistAmbient(x, y)) return;
            table.cell.downgrade(x, y);
            for (let coords of table.getAmbientCells(x, y)) {
                table.cell.downgrade(coords[0], coords[1]);
            }
            canvas.draw();
            game.balance.refresh();
            table.updateHistory();
            game.checkEnd();
        },
        end: function() {
            canvas.drawFinishScreen();
        },
        newGame: function(level) {
            table.cell.maxRandomNumber = 8;
            if (level == 'easy') {
                table.cell.maxRandomNumber = 4;
            } else if (level == 'medium') {
                table.cell.maxRandomNumber = 6;
            } else if (level == 'hard') {
                table.cell.maxRandomNumber = 8;
            }
            table.createArray(10, 10);
            table.downgradeBigNumbers();
            table.originArray = table.originArrayUpdate();
            canvas.draw();
            game.balance.unitedValue = game.balance.getValue();
            game.balance.refresh();
            table.history = [JSON.parse(JSON.stringify(table.array))];
            game.hideNewGameScreen();
            game.showGameScreen();
        },
        restart: function() {
            
            table.restoreArrayFromOrigin();
            //console.log(table.array);
            canvas.draw();
            game.balance.unitedValue = game.balance.getValue();
            game.balance.refresh();
            
            table.history = [JSON.parse(JSON.stringify(table.array))];
            
        },
        back: function() {
            //console.log(table.history);
            if (table.history.length > 1) {
                table.history.pop();
                let tableFromHistory = JSON.parse(JSON.stringify(
                    table.history[table.history.length - 1])
                );
                table.array = tableFromHistory;
                canvas.draw();
                game.balance.refresh();
                //console.log(table.array);
            }
        }
    }
}
game.init();
