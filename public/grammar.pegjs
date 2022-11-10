start "start" = term +
term "term" = body:(keyword / sentence) _ { return body; } // keyword to word

expr = regular* 
regular = [^{}]+ { return text(); }
sentence = "{" expr:expr "}" { return expr.join("") } / regular

_ "whitespace" = [ \t\n\r]*

int = i:[0-9]* { return `${i.join("")}`; }
float = left:[0-9]+ "." right:[0-9]+ { return parseFloat(left.join("") + "." +   right.join("")); } 

primary = int / float

// conditional = cond:ifStatement / while / elseif  "(" condition ")" sentence { return cond; }
ifStatement = "if" expr "then" sentence "else" sentence /
   "if" expr "then" sentence  // conditional statement, what to return?

/****** Key Words ******/
keyword "keyword" =  diffuse / audio / time / circle / rect /
					triangle / polygon / ellipse / line / floor /
                    add / mult / subtract / divide / modulo / test /
                    colorA / colorB / rateA / rateB / feed / kill / $[^{} \t\n\r] +

diffuse  = "diffuse" { return "setDiffuse()";}

// Input and other
audio = "audio" { return "@audio";} //i want to be able to set audio on and off
time = "time" { return Date.getTime; }
test = "test" { return "@test" }

// Shapes and styles
circle = "circle" { return "@circle"; }
rect = "rect" _ x:primary _ y:primary _ w:primary _ h:primary { 
   var r = `shape.rect( ${x}, ${y}, ${w}, ${h} )`
   return r
   //rect(x, y, w, h)
//    function rect( ${x}, ${y}, ${w}, ${h} ){
//     for (var i = 0; i < window.innerWidth; i++) {
//         for (var j = 0; j < window.innerHeight; j++) {
//             if (
//                 i >= x &&
//                 i <= x + w &&
//                 j >= y &&
//                 j <= h
//             ) {
//                 poke(i, j, 0, 255, textureBack);
//             } else {
//                 poke(i, j, 255, 0, textureBack);
//             }
//         }
//       }
//    }
   }

// rect = "rect" { return ["@rect"]}
triangle = "triangle" { return "@triangle"; }
polygon = "polygon" { return "@polygon"; }
ellipse = "ellipse" { return "@ellipse"; }
line = "line" { return "@line"; }

bkgdColor = "bkgd" { return "@bkgd" }
hexChar = [0-9A-Fa-f] {return hexChar; }
hex = h:[0-9A-Fa-f]*{ return `${h.join("")}` } //is there anyways to specify a certain amount


// Math
floor = "floor" { return "@floor"; }
add = "+" { return "@+"; }
mult = "*" { return "@*"; }
subtract = "-" { return "@-"; }
divide = "/" { return "@/"; }
modulo = "%" { return "@%"; }

/****** Diffuse attributes ****/
colorA = "colorA(" h:hex ")"{ return `@colorA(${h})` ; } // change to be an equals sign
colorB = "colorB(" h:hex ")"{ return `@colorB(${h})` ; }
rateA = "rateA(" r:float ")"{ return `setRateA(${r})` ; } //change to primary
rateB = "rateB(" r:float ")"{ return `setRateB(${r})` ; } 
feed = "feed(" f:float ")" { return `setFeed(${f})` ; } 
kill = "kill(" k:float ")" { return `setKill(${k})` ; } 

   