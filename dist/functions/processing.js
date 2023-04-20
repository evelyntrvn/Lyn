// Post-processing
import * as P from "postpre";
import * as MP from "@bandaloo/merge-pass";


const canvas = document.getElementById("gl"),
    processed = document.getElementById("processed"),
    gl = processed.getContext("webgl");

var effectParams = {
    kal: { side: 12, size: 1 },
    blur: { brightness: 1, blurSize: 1, reps: 4, taps: 9, samplerNum: 0, useDepth: false },
    celShade: { mult: 0.8, bump: 0.3, center: 0.3, edge: 0.3 },
    foggyRays: { period: 100, speed: 1, throwDistance: 0.3, numSamples: 100, samplerNum: undefined },
    light: { speed: 4, intensity: 0.3, threshold: 0.01, samplerNum: 0 },
    noise: { period: 0.1, speed: 1, intensity: 0.005 },
    oldFilm: { speckIntensity: 0.4, lineIntensity: 0.12, grainIntensity: 0.11 },
    vignette: { blurScalar: 3, brightnessScalar: 1.8, brightnessExponent: 1.8 }
},
    processCanvas = false       // if false, canvas is on top; if true, processed is on top

export function kal() {
    if (!processCanvas) {
        swapCanvas()
    }

    let ka;
    const merger = new MP.Merger([(ka = P.kaleidoscope(effectParams.kal.side, effectParams.kal.side))],
        canvas, gl);

    let frame = 0;
    const step = (t = 0) => {
        merger.draw(t / 1000);
        requestAnimationFrame(step)
        frame++;
    };
    step(0);
}

export function postEffect(effect) {
    if (!processCanvas) {
        swapCanvas()
    }
    gl.clear(gl.COLOR_CLEAR_VALUE);

    var merger;
    switch (effect) {
        case "kal":
            let ka;
            merger = new MP.Merger([(ka = P.kaleidoscope(effectParams.kal.side, effectParams.kal.side))],
                canvas, gl);
            break;
        case "blur":
            let bt;
            merger = new MP.Merger([(bt = P.blurandtrace(
                effectParams.blur.brightness,
                effectParams.blur.blurSize,
                effectParams.blur.reps,
                effectParams.blur.taps,
                effectParams.blur.samplerNum))],
            canvas, gl);
            break;
        case "celShade":
            let cs;
            merger = new MP.Merger([(cs = P.celShade(
                effectParams.celShade.mult,
                effectParams.celShade.bump,
                effectParams.celShade.center,
                effectParams.celShade.edge
            ))],
            canvas, gl);
            break;
        case "foggyRays":
            let fg;
            merger = new MP.Merger([(fg = P.foggyrays(
                effectParams.foggyRays.period,
                effectParams.foggyRays.speed,
                effectParams.foggyRays.throwDistance,
                effectParams.foggyRays.numSamples,
                effectParams.foggyRays.samplerNum
            ))],
            canvas, gl);
            break;

        case "light":
            let lb;
            merger = new MP.Merger([(lb = P.lightbands(
                effectParams.light.speed,
                effectParams.foggyRays.intensity,
                effectParams.foggyRays.threshold,
                effectParams.foggyRays.samplerNum
            ))],
            canvas, gl);
            break;

        case "noise":
            let nd;
            merger = new MP.Merger([(nd = P.noisedisplacement(
                effectParams.noise.period,
                effectParams.noise.speed,
                effectParams.noise.intensity
            ))],
            canvas, gl);
            break;

        case "oldFilm":
            let olf;
            merger = new MP.Merger([(olf = P.oldfilm(
                effectParams.oldFilm.speckIntensity,
                effectParams.oldFilm.lineIntensity,
                effectParams.oldFilm.grainIntensity
            ))],
            canvas, gl);
            break;
        case "vignette":
            let v;
            merger = new MP.Merger([(v = P.vignette(
                effectParams.vignette.blurScalar,
                effectParams.vignette.brightnessScalar,
                effectParams.vignette.brightnessExponent
            ))],
            canvas, gl);
            break;
    }

    let frame = 0;
    const step = (t = 0) => {
        merger.draw(t / 1000);
        requestAnimationFrame(step)
        frame++;
    };
    step(0);
}

export function noEffect() {
    if (processCanvas) {
        gl.clear(gl.COLOR_CLEAR_VALUE);

        swapCanvas()
    }
}

function swapCanvas() {
    console.log("swapping")
    if (processCanvas) {
        canvas.style.zIndex = 0;
        processed.style.zIndex = -1;
    } else {
        canvas.style.zIndex = -1;
        processed.style.zIndex = 0;
    }
    processCanvas = !processCanvas
}


export function setEffect(effect, at, val) {
    effectParams[effect][at] = val
    console.log(effectParams[effect][at])
    postEffect(effect)
}