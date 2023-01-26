// Post-processing
import * as P from "postpre";
import * as MP from "@bandaloo/merge-pass";


const canvas = document.getElementById("gl"),
    processed = document.getElementById("processed"),
    gl = processed.getContext("webgl");

export function kal(sides = 8, size = 1) {
    let ka;
    const merger = new MP.Merger([(ka = P.kaleidoscope(sides, size))], canvas, gl);

    let frame = 0;
    const step = (t = 0) => {
        merger.draw(t / 1000);
        requestAnimationFrame(step)
        frame++;
    };
    step(0);

}