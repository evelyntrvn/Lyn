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
                i >= x && i <= x + w && 
                j <= y + h && j >= y 
            ) {
                poking(i, j, 0, 255, 0 );
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


export function hexToRgbA(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return [((c>>16)&255)/255, ((c>>8)&255)/255, (c&255/255), 1];
    }
    throw new Error('Bad Hex');
}