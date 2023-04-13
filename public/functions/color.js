import * as convert from "color-convert"

var colors = {
    "A": color("#090326"),
    "B": color("#C33E3E")
}


export function setColor(col, color){
    console.log(colors[col])

    var c 
    if (color.startsWith("rgb")){
        c = hexToRgb(convert.rgb.hex(color))
    }else if (color.startsWith("#")){
        c = hexToRgb(color)
    }else {
        c = hexToRgb(convert.keyword.hex(color))
    }
    console.log(c)


    colors[col] = c;
}

export function getColor(col){
    return colors[col]
}

export function color(hex){
    var result = hexToRgb(hex)
    return result
}

function hexToRgb(hex) {
    var c = hex.substring(1)
    var r = parseInt(c.slice(0,2), 16),
        g = parseInt(c.slice(2,4), 16),
        b = parseInt(c.slice(4,6), 16)
    //console.log(c)
    var result = [r / 255, g / 255, b / 255];
    //console.log(r + " " + g + " " + b)
    return result
}
