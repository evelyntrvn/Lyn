start "start" = term +
term "term" = _? body:(keyword / sentence) _ { return body; } // keyword to word

POINT = "." 
DIGIT = [0-9]
INTDIGIT = [1-9]
TRUE = "true" / "True" { return "true" }
FALSE = "false" / "False" { return "false" }

primary "primary" = float / int

float = first:int dec:dec { return parseFloat(`${first}`) + parseFloat(`${dec}`); } 
dec = point:POINT num:DIGIT+ { return parseFloat("." + `${num}`); }
int = first:INTDIGIT dig:DIGIT* { return parseInt(`${text()}`); }
boolean  = TRUE / FALSE

regular = [^{}]+ { return text(); }
expr = regular* 

sentence = "{" expr:expr "}" { return expr.join("") } / regular

_ "whitespace" = [ \t\n\r]*

// conditional = cond:ifStatement / while / elseif  "(" condition ")" sentence { return cond; }
// ifStatement = "if" expr "then" sentence "else" sentence /
//    "if" expr "then" sentence  // conditional statement, what to return?

/****** Key Words ******/
keyword "keyword" = difFct / cellFct / effects / reset / music / audio / time / rect /
					     rateA / rateB / feed / kill / wait / primary /
                    hex / col / $[^{} \t\n\r] +

// Input and other
audio = "audio" { return "'audio'";} //i want to be able to set audio on and off
time = "time" { return Date.getTime; }
// Shapes and styles
//circle = "circle" { return "@circle"; }
rect = "rect" _ x:primary _ y:primary _ w:primary _ h:primary { 
   var r = `shape.rect( ${x}, ${y}, ${w}, ${h} )`
   return r
   }

// triangle = "triangle" { return "@triangle"; }
// polygon = "polygon" { return "@polygon"; }
// ellipse = "ellipse" { return "@ellipse"; }
// line = "line" { return "@line"; }

// bkgdColor = "bkgd" { return "@bkgd" }
hexChar = h:[0-9A-Fa-f] { return `${h}`; }
hex =  "#" h:(hexChar hexChar hexChar hexChar hexChar hexChar) { return `"#${h.join("")}"` } 


// Math
//floor = "floor" { return "floor"; }


/****** Diffuse attributes ****/
difFct = diffuse / rateA / rateB / feed / kill / size 
difInput = primary / audio
diffuse  = "diffuse(" bool:boolean ")"{ return `setDiffuse(${bool})`;}

rateA = "rateA(" r:difInput ")"{ return `rateA(${r})` ; } //change to primary
rateB = "rateB(" r:difInput ")"{ return `rateB(${r})` ; } 
feed = "feed(" f:difInput ")" { return `feed(${f})` ; } 
kill = "kill(" k:difInput ")" { return `kill(${k})` ; } 
size = "size(" s:difInput ")" { return `size(${s})` ; } 

wait = "wait(" t:primary ")" { return `wait(${t}*1000)` } // time in sec
reset = "reset" { return `reset()` }

/****** Cellular Automata attributes ****/
cellFct = automata

automata  = "automata(" bool:boolean ")"{ return `setAutomata(${bool})`;}

/***** music ****/
music = playMusic / pauseMusic
playMusic = "playMusic" { return `playMusic()` }
pauseMusic = "pauseMusic" { return `pauseMusic()` } 

/** colors **/
col = colorA /colorB
colorA = "colorA(" h:hex ")"{ return `colorA(${h})` ; } // change to be an equals sign
colorB = "colorB(" h:hex ")"{ return `colorB(${h})` ; }

/** Post Processing **/
effects = noEffect / kalSize / kalSide / kal 

noEffect = "noEffect"{ return `noEffect()` }

kal "kal"= "kal"{ return `kal()`;}
kalSide = POINT "side(" side:primary ")"{ return `kalSide(${side})`}
kalSize = POINT "size(" size:primary ")"{ return `kalSize(${size})`}