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
keyword "keyword" = col / difFct / cellFct / 
                    effects /reset / music / audio / time / rect /
					     wait / primary /
                    hex  / $[^{} \t\n\r] +

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
playMusic = "playMusic(" trackNum:int ")" { return `playMusic(${trackNum})` }
pauseMusic = "pauseMusic" { return `pauseMusic()` } 

/** colors **/

hexChar = h:[0-9A-Fa-f] { return `${h}`; }
hex =  "#" h:(hexChar hexChar hexChar hexChar hexChar hexChar) { return `"#${h.join("")}"` } 

rgb = "rgb(" primary "," primary "," primary ")"{ return text();} 

col = colorA / colorB 
colInput = hex / rgb
colorA = "colorA(" h:colInput ")"{ return `col.setColor( "A", ${h} )` ; } // 
colorB = "colorB(" h:expr ")"{ return `col.setColor("B", "${h}")` ; }

/** Post Processing **/
effects = editAttribute / noEffect / effect
postProcess = "kal" / "blur" / "celShade" / "foggy" / "light" / "noise" / "oldFilm" / "vignette"
attribute = "size" / "side" 


noEffect = "noEffect"{ return `noEffect()` }
effect = func:postProcess _ { return `postEffect("${func}")`} 
effectAttribute = attr:attribute { return `${attr}` }


editAttribute = e:postProcess POINT att:effectAttribute "(" val:primary ")"{ return `setEffect('${e}', '${att}', ${val})`}
