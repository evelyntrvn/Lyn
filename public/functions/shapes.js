/**********SHAPE FUNCTIONS ********/

import poking from "../script.js"

/*
Draw a rectangle based on given width, height, x coord, and y coord
the (x,y) is the top left corner
*/
export function rect( x, y, w, h ){    // TODO: Fix coordinates 
    for (var i = 0; i < window.innerWidth; i++) {
        for (var j = 0; j < window.innerHeight; j++) {
            if (
                i >= x &&
                i <= x + w &&
                j >= y &&
                j <= h
            ) {
                poking(i, j, 0, 255);
            } else {
                poking(i, j, 255, 0);
            }
        }
    }
}

export function circle( x, y, r ){
    for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
            
            var rad = Math.sqrt(Math.abs(i-x)^2 + Math.abs(j-y))
            //console.log(rad)
            if (rad <= r) {
                poking(i, j, 0, 255);
            } else {
                poking(i, j, 255, 0);
            }
        }
    }
}



