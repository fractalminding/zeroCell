"use strict";
let table = {
    createObject: function(width, height) {
        for (let i = 0; i < height; i++) {
            table.object[i] = table.row.create(width);
        }
        console.log(table.object);
    },
    object: {},
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
        
    }
};
table.createObject(10, 10);
table.draw();