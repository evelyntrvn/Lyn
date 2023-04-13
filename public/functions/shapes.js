/**********SHAPE FUNCTIONS ********/

import poking from "../../main.js"


export function fill() { 
    for (var i = 0; i < window.innerWidth; i++) {
        for (var j = 0; j < window.innerHeight; j++) {
            poking(i, j, 255, 0, 0);
        }
    }
}

export function dots(){
    for (var i = 0; i < window.innerWidth; i++) {
        for (var j = 0; j < window.innerHeight; j++) {
            if (Math.random() > .90) {
                poking(i, j, 0, 255, 0)
            }
        }
    }
}

export function rect(x, y, w, h) {    // TODO: Fix coordinates 
    for (var i = 0; i < window.innerWidth; i++) {
        for (var j = 0; j < window.innerHeight; j++) {
            if (
                i >= x && i <= x + w &&
                j <= y + h && j >= y
            ) {
                poking(i, j, 0, 255, 0);
            } 
            // else {
            //     poking(i, j, 255, 0, 0);
            // }
        }
    }
    console.log("rect")
}

export function circle(x, y, r) {
    for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {

            var rad = Math.sqrt(Math.abs(i - x) ^ 2 + Math.abs(j - y))
            //console.log(rad)
            if (rad <= r) {
                poking(i, j, 0, 255);
            } else {
                poking(i, j, 255, 0);
            }
        }
    }
}


