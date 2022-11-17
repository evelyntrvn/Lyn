// Diffuse function
export function setDiffuse(){
    diffuse = !diffuse
    gl.uniform1f(uDiffuse, diffuse);
    return 
}

export function rateA(x){
    dA = checkAudio(x)
    gl.uniform1f(uDA, dA);
}

export function rateB(x){
    dB = checkAudio(x)
    gl.uniform1f(uDB, dB);
}

export function kill(x){
    k = checkAudio(x)
    gl.uniform1f(uKill, k);
}

export function feed(x){
    f = checkAudio(x)
    gl.uniform1f(uFeed, f);
}

export function size(x){
    s = checkAudio(x)
    gl.uniform1f(uSize, s);
}

export function checkAudio(x){
    console.log(x)
    if(x ==="audio"){
        console.log("setting audio")
        return audioData;
    }else {
        console.log("no audio")
        return x
    }
}