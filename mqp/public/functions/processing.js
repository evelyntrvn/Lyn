// Post-processing
import * as P from "postpre";
import * as MP from "@bandaloo/merge-pass";


const canvas = document.getElementById("gl"),
    processed = document.getElementById("processed"),
    gl = processed.getContext("webgl");

var effectParams = {
    kaleidoscope: {side: 8, size: 1},
},
    processCanvas = false       // if false, canvas is on top; if true, processed is on top

export function kal() {
    if (!processCanvas){
        swapCanvas()
    }

    let ka;
    const merger = new MP.Merger([(ka = P.kaleidoscope(effectParams.kaleidoscope.side, effectParams.kaleidoscope.side))],
    canvas, gl);

    let frame = 0;
    const step = (t = 0) => {
        merger.draw(t / 1000);
        requestAnimationFrame(step)
        frame++;
    };
    step(0);

}

export function kalSide(sides){
    effectParams.kaleidoscope.side = sides
}

export function kalSize(size){
    effectParams.kaleidoscope.size = size
}

export function noEffect(){
    if (processCanvas){
        swapCanvas()
    }
}

function swapCanvas(){
    console.log("swapping")
    if (processCanvas){
        canvas.style.zIndex = 0;
        processed.style.zIndex = -1;
    }else{
        canvas.style.zIndex = -1;
        processed.style.zIndex = 0;
    }
    processCanvas = !processCanvas
}
