"use strict";
let table = {
    createArray: function(width, height) {
        for (let i = 0; i < height; i++) {
            table.array[i] = table.row.create(width);
        }
    },
    array: [],
    row: {
        create: function(length) {
            let rowArray = [];
            for (let i = 0; i < length; i++) {
                rowArray.push(table.cell.getRandomNumber(1, 5));
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
        }
    },
    getAmbientCells: function(x, y) {
        let cellsArray = [];
        cellsArray.push([x, y]);
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
        }).length > 1 ? true : false;
    }
};
let canvas = {
    rectColors:
        ['#e9f2e9','#cbeacb', '#b6d2b6', '#a2bba2', '#8ea38e', '#798c79', '#657565'],
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
        canvas.element = document.getElementById('game');
        canvas.context = canvas.element.getContext('2d');
        table.createArray(10, 10);
        canvas.draw();
        canvas.element.addEventListener('click', game.actions.click);
    },
    actions: {
        click: function(event) {
            let x = Math.floor(event.offsetX / 40); 
            let y = Math.floor(event.offsetY / 40);
            if (table.array[y][x] == 0) return;
            //console.log('click');
            if (!table.isExistAmbient(x, y)) return;
            
            for (let coords of table.getAmbientCells(x, y)) {
                table.cell.downgrade(coords[0], coords[1]);
                canvas.draw();
            }
        }
    }
}
game.init();
