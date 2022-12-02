import * as parser from "./grammar.js";
// import {checkAudio, setDiffuse, rateA, rateB, kill, feed, size} from "./functions/diffuse.js"
import * as shape from "./functions/shapes.js"

let gl, framebuffer, simulationProgram, drawProgram,
    uTime, uSimulationState, uRes, uAudio, uDA, uDB,
    uFeed, uKill, uSize, uDiffuse,
    textureBack, textureFront,
    dimensions = { width: null, height: null },
    dA, dB, f, k, s, diffuse = false,
    audio, audioData, bufferLength, analyser, audioContext, audioElement,
    playing = false,
    mic = false,
    width, height;

window.onload = function () {
    navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then(function (stream) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            audioElement = document.querySelector("audio");
            //const track = audioContext.createMediaStreamSource(stream);
            const track = audioContext.createMediaElementSource(audioElement);

            analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            bufferLength = analyser.frequencyBinCount;
            audio = new Uint8Array(bufferLength);

            console.log(bufferLength);

            track.connect(analyser);
            analyser.connect(audioContext.destination);

            analyser.getByteFrequencyData(audio);
            console.log(audio);
            //getAudioData(audio)
            mic = true;

            if (playing) {
                audioElement.play();
            }

            audioElement.addEventListener(
                "ended",
                () => {
                    playButton.dataset.playing = "false";
                },
                false
            );
        });

    const canvas = document.getElementById("gl");
    gl = canvas.getContext("webgl");
    width = canvas.width = dimensions.width = window.innerWidth;
    height = canvas.height = dimensions.height = window.innerHeight;

    // define drawing area of webgl canvas. bottom corner, width / height
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

    makeBuffer();
    makeShaders();
    makeTextures();
    setInitialState();

    const cm = CodeMirror(document.getElementById("editor"), {
        value:
`feed(0.029)
kill(0.057)
rateA(1)
rateB(0.2)
diffuse(true)

feed(0.015)
kill(0.049)
rateA(0.21)
rateB(0.105)
diffuse(true)

diffuse(false)

playMusic
pauseMusic
rateB(audio)`,
        mode: "javascript",
        lineNumbers: true
    });

    // TODO: MAIN MQP PORTION
    cm.setOption("extraKeys", {
        "Ctrl-Enter": function (cm) {
            var code = cm.getValue();
            //console.log(code)
            var parsedCode = parser.parse(code)
            //console.log(parsedCode);
            eval("(" + parsedCode + ")");
        },
        "Shift-Enter": function (cm) {
            runSelected(cm)
        }
    });

    var helpIcon = document.getElementById('helpIcon')
    helpIcon.addEventListener("click", (event)=>{
        document.getElementsByClassName("containerPopup").style.zIndex = 5
        document.getElementById('helpPopup').style.zIndex = 5
    })

};

function poke(x, y, r, g, b, texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texSubImage2D(
        gl.TEXTURE_2D, 0,
        // x offset, y offset, width, height
        x, y, 1, 1,
        gl.RGBA, gl.UNSIGNED_BYTE,
        // is supposed to be a typed array
        new Uint8Array([r, g, b, 255])
    );
}

var poking = function poking(x, y, r, g, b) {
    poke(x, y, r, g, b, textureBack)
}

function setInitialState() {
    dA = 1.0;
    dB = 0.5;
    f = 0.055;
    k = 0.062;
    s = 3;

    gl.uniform1f(uDA, dA);
    gl.uniform1f(uDB, dB);
    gl.uniform1f(uFeed, f);
    gl.uniform1f(uKill, k);
    gl.uniform1f(uSize, s);

    var x = width / 2 - 100,
        y = height / 2 - 200;

    shape.rect(x, y, 100, 100);
    //shape.start()
}

function makeBuffer() {
    // create a buffer object to store vertices
    const buffer = gl.createBuffer();

    // point buffer at graphic context's ARRAY_BUFFER
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    const triangles = new Float32Array([
        -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]);

    // initialize memory for buffer and populate it. Give
    // open gl hint contents will not change dynamically.
    gl.bufferData(gl.ARRAY_BUFFER, triangles, gl.STATIC_DRAW);
}

function makeShaders() {
    // create vertex shader
    let shaderScript = document.getElementById('vertex')
    let shaderSource = shaderScript.text
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vertexShader, shaderSource)
    gl.compileShader(vertexShader)

    // create fragment shader
    shaderScript = document.getElementById('render')
    shaderSource = shaderScript.text
    const drawFragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(drawFragmentShader, shaderSource)
    gl.compileShader(drawFragmentShader)
    console.log(gl.getShaderInfoLog(drawFragmentShader))

    // create render program that draws to screen
    drawProgram = gl.createProgram()
    gl.attachShader(drawProgram, vertexShader)
    gl.attachShader(drawProgram, drawFragmentShader)

    gl.linkProgram(drawProgram)
    gl.useProgram(drawProgram)

    uRes = gl.getUniformLocation(drawProgram, 'resolution')
    gl.uniform2f(uRes, gl.drawingBufferWidth, gl.drawingBufferHeight)

    // get position attribute location in shader
    let position = gl.getAttribLocation(drawProgram, 'a_position')
    // enable the attribute
    gl.enableVertexAttribArray(position)
    // this will point to the vertices in the last bound array buffer.
    // In this example, we only use one array buffer, where we're storing 
    // our vertices
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    shaderScript = document.getElementById('simulation')
    shaderSource = shaderScript.text
    const simulationFragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(simulationFragmentShader, shaderSource)
    gl.compileShader(simulationFragmentShader)
    console.log(gl.getShaderInfoLog(simulationFragmentShader))

    // create simulation program
    simulationProgram = gl.createProgram()
    gl.attachShader(simulationProgram, vertexShader)
    gl.attachShader(simulationProgram, simulationFragmentShader)

    gl.linkProgram(simulationProgram)
    gl.useProgram(simulationProgram)

    uRes = gl.getUniformLocation(simulationProgram, "resolution");
    gl.uniform2f(uRes, gl.drawingBufferWidth, gl.drawingBufferHeight);

    // find a pointer to the uniform "time" in our fragment shader
    uTime = gl.getUniformLocation(simulationProgram, "time");
    uDA = gl.getUniformLocation(simulationProgram, "dA");
    uDB = gl.getUniformLocation(simulationProgram, "dB");
    uFeed = gl.getUniformLocation(simulationProgram, "feed");
    uKill = gl.getUniformLocation(simulationProgram, "kill");
    uSize = gl.getUniformLocation(simulationProgram, "size");
    uDiffuse = gl.getUniformLocation(simulationProgram, "diffuse");
    uAudio = gl.getUniformLocation(simulationProgram, "audioData");
    uSimulationState = gl.getUniformLocation(simulationProgram, 'state');
    position = gl.getAttribLocation(simulationProgram, "a_position");
    gl.enableVertexAttribArray(simulationProgram);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
}

function makeTextures() {
    gl.getExtension("EXT_color_buffer_float");
    textureBack = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, textureBack);

    // these two lines are needed for non-power-of-2 textures
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // how to map when texture element is less than one pixel
    // use gl.NEAREST to avoid linear interpolation
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    // how to map when texture element is more than one pixel
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // specify texture format, see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        dimensions.width,
        dimensions.height,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        null
    );

    textureFront = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, textureFront);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        dimensions.width,
        dimensions.height,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        null
    );

    // Create a framebuffer and attach the texture.
    framebuffer = gl.createFramebuffer();

    render();
}

// keep track of time via incremental frame counter
let time = 0;
function render() {
    window.requestAnimationFrame(render);

    gl.useProgram(simulationProgram);    // use our simulation shader


    if (mic === true) {
        if (playing) {
            audioElement.play();
        }

        analyser.getByteFrequencyData(audio);
        let sum = 0;
        for (var i = 0; i < bufferLength; i++) {
            sum += audio[i];
        }

        audioData = sum / bufferLength;
        // console.log(audioData)

    }

    // update time on CPU and GPU
    time++;
    gl.uniform1f(uTime, time);
    gl.uniform1f(uDA, dA);
    gl.uniform1f(uDB, dB);
    gl.uniform1f(uFeed, f);
    gl.uniform1f(uKill, k);
    gl.uniform1f(uSize, s);
    gl.uniform1f(uDiffuse, diffuse);
    gl.uniform1f(uAudio, audioData);

    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

    gl.framebufferTexture2D(    // use the framebuffer to write to our texFront texture
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        textureFront,
        0
    );

    gl.viewport(0, 0, dimensions.width, dimensions.height);     // set viewport to be the size of our state 

    gl.activeTexture(gl.TEXTURE0);                              // in our shaders, read from texBack, which is where we poked to
    gl.bindTexture(gl.TEXTURE_2D, textureBack);
    gl.uniform1i(uSimulationState, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);                         // run shader

    let tmp = textureFront;                                    // swap our front and back textures
    textureFront = textureBack;
    textureBack = tmp;

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);                   // use the default framebuffer object by passing null
    gl.viewport(0, 0, dimensions.width, dimensions.height);     // set our viewport to be the size of our canvas
    gl.bindTexture(gl.TEXTURE_2D, textureFront);                // select the texture we would like to draw to the screen.
    gl.useProgram(drawProgram);                                 // use our drawing (copy) shader
    gl.drawArrays(gl.TRIANGLES, 0, 6);                          // put simulation on screen

}

function map(value, min1, max1, min2, max2) {
    return min2 + ((value - min1) * (max2 - min2)) / (max1 - min1);
}

function getK(c) {
    return map(c, 0, 255, 0.045, 0.1);
}

/**********SHAPE FUNCTIONS ********/

function wait(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds) {
        if (diffuse) {
            render()
        }
    };

}

function reset() {
    setInitialState();
}

// Diffuse function
export function setDiffuse(x) {

    diffuse = x
    gl.uniform1f(uDiffuse, diffuse);
    console.log(diffuse)
}

export function rateA(x) {
    dA = checkAudio(x, 0, 1)
    gl.uniform1f(uDA, dA);
}

export function rateB(x) {
    dB = checkAudio(x, 0, 1)
    gl.uniform1f(uDB, dB);
}

export function kill(x) {
    k = checkAudio(x, 0, 0.1)
    gl.uniform1f(uKill, k);
    console.log(k)
}

export function feed(x) {
    f = checkAudio(x, 0, 0.1)
    gl.uniform1f(uFeed, f);
}

export function size(x) {
    s = checkAudio(x)
    gl.uniform1f(uSize, s);
}

function playMusic() {
    playing = true
    audioElement.play()
}

function pauseMusic() {
    playing = false
    audioElement.pause()
}

export function checkAudio(x, min, max) {
    //console.log(x)
    if (x === "audio") {
        console.log(audioData)
        audioData = map(audioData, 0, 150, min, max)

        return audioData;
    } else {
        //console.log("no audio")
        return x
    }
}

export default poking


// running code via different keyboard shortcuts

function runSelected(cm) {
    let pos = cm.getCursor(),
        text = null

    text = cm.getDoc().getSelection()

    //check if no selection; use line
    if (text === "") {
        text = cm.getLine(pos.line)
    } else {
        pos = { start: cm.getCursor('start'), end: cm.getCursor('end') }
    }

    if (pos.start === undefined) {
        let lineNumber = pos.line,
            start = 0,
            end = text.length

        pos = { start: { line: lineNumber, ch: start }, end: { line: lineNumber, ch: end } }
    }

    console.log(text)
    var parsedCode = parser.parse(text)
    console.log(parsedCode);
    eval("(" + parsedCode + ")");
}