// Post-processing
import * as P from "postpre";
import * as MP from "@bandaloo/merge-pass";


const canvas = document.getElementById("gl"),
    processed = document.getElementById("processed"),
    gl = processed.getContext("webgl");

export function kal() {
    let ka;
    const merger = new MP.Merger([(ka = P.kaleidoscope(5, 1))], canvas, gl);

    merger.draw()
    console.log("drawing")

}