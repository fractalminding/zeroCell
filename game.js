"use strict";
let table = {
    createObject: function(width, height) {
        for (let i = 0; i < height; i++) {
            table.array[i] = table.row.create(width);
        }
        //console.log(table.array);
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
        }
    },
    draw: function() {
        table.array.forEach(function(row, y) {
            row.forEach(function(cellText, x) {
                canvas.drawRect(x * 40, y * 40, 40, 40, cellText);
                canvas.drawTextLabel(x * 40 + 10, y * 40 + 30, '#282e28', cellText);
            });
        });
    }
};
let canvas = {
    rectColors:
        ['#cbeacb', '#b6d2b6', '#a2bba2', '#8ea38e', '#798c79', '#657565'],
    drawRect(x, y, width, height, cellText) {
        let context = canvas.context;
        context.fillStyle = canvas.rectColors[cellText];
        context.fillRect(x, y, width, height);
    },
    drawTextLabel(x, y, color, text) {
        let context = canvas.context;
        context.fillStyle = color;
        context.font = "30px Arial";
        context.fillText(text, x, y);
    }
}
let game = {
    init: function() {
        canvas.element = document.getElementById('game');
        canvas.context = canvas.element.getContext('2d');
        table.createObject(10, 10);
        table.draw();
    }
}
game.init();
