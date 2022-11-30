/**********SHAPE FUNCTIONS ********/

import poking from "../script.js"

export function start(){
    for (var i = 0; i < window.innerWidth; i++) {
        for (var j = 0; j < window.innerHeight; j++) {
            if ( i%500 === 0 && j%500 === 0 ) {
                poking(i, j, 0, 0, 255);
            } else {
                poking(i, j, 255, 0, 0);
            }
        }
    }
}


/*
Draw a rectangle based on given width, height, x coord, and y coord
the (x,y) is the top left corner
*/
export function rect( x, y, w, h ){    // TODO: Fix coordinates 
    for (var i = 0; i < window.innerWidth; i++) {
        for (var j = 0; j < window.innerHeight; j++) {
            if (
                (i >= x && i <= x + 20 ||
                i <= x + w && i >= x + w - 20) &&
                (j >= y && j <= y + 20 ||
                j <= h && j >= h -20)
            ) {
                poking(i, j, 0, 0, 255);
            } else {
                poking(i, j, 255, 0, 0);
            }
        }
    }
    console.log("rect")
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



