start "start" = term +
term "term" = _? body:(keyword / sentence) _? { return body; } 

POINT = "." 
COMMA = ","
DIGIT = [0-9]
INTDIGIT = [1-9]
TRUE = "true" / "True" { return "true" }
FALSE = "false" / "False" { return "false" }

PRIMARY = float / int

float = first:int dec:dec { return parseFloat(`${first}`) + parseFloat(`${dec}`); } 
dec = point:POINT num:DIGIT+ { return parseFloat("." + `${num}`); }
int = first:INTDIGIT dig:DIGIT* { return parseInt(`${text()}`); }
boolean  = TRUE / FALSE

regular = [^{}]+ { return text(); }
expr = regular* 

sentence = "{" expr:expr "}" { return expr.join("") } / regular

_ "whitespace" = [ \t\n\r]*

audio = "audio" {return "'audio'"}

// conditional = cond:ifStatement / while / elseif  "(" condition ")" sentence { return cond; }
// ifStatement = "if" expr "then" sentence "else" sentence /
//    "if" expr "then" sentence  // conditional statement, what to return?

/****** Key Words ******/
keyword "keyword" = col / difFct / cellFct / 
                    effects / reset / music / 
					     wait / shapes /
                    hex  / $[^{} \t\n\r] +

// Shapes and styles
shapes = rect / dots
//circle = "circle" { return "@circle"; }
rect = "rect(" _? x:PRIMARY "," _? y:PRIMARY "," _? w:PRIMARY "," _? h:PRIMARY ")"{ return `shape.rect( ${x}, ${y}, ${w}, ${h} )`}
dots = "dots()"{ return `shape.dots()`}

// triangle = "triangle" { return "@triangle"; }
// ellipse = "ellipse" { return "@ellipse"; }
// line = "line" { return "@line"; }


// Math


/****** Diffuse attributes ****/
difFct = diffuse / rateA / rateB / feed / kill / size 
difInput = PRIMARY / audio 
diffuse  = "diffuse(" bool:boolean ")"{ return `setDiffuse(${bool})`;}

rateA = "rateA(" r:difInput ")"{ return `rateA(${r})` ; } //change to primary
rateB = "rateB(" r:difInput ")"{ return `rateB(${r})` ; } 
feed = "feed(" f:difInput ")" { return `feed(${f})` ; } 
kill = "kill(" k:difInput ")" { return `kill(${k})` ; } 
size = "size(" s:difInput ")" { return `size(${s})` ; } 

wait = "wait(" t:PRIMARY ")" { return `wait(${t}*1000)` } // time in sec
reset = "reset" { return `reset()` }

/****** Cellular Automata attributes ****/
cellFct = automata

automata  = "automata(" bool:boolean ")"{ return `setAutomata(${bool})`;}

/***** music ****/
music = playMusic / pauseMusic / time
playMusic = "playMusic(" trackNum:int ")" { return `playMusic(${trackNum})` }
pauseMusic = "pauseMusic()" { return `pauseMusic()` } 

// Input and other
time = "time" { return Date.getTime; }

/** colors **/

hexChar = h:[0-9A-Fa-f] { return `${h}`; }
hex =  "#" h:(hexChar hexChar hexChar hexChar hexChar hexChar) { return `"#${h.join("")}"` } 

rgb = "rgb(" PRIMARY "," PRIMARY "," PRIMARY ")"{ return text();} 

col = colorA / colorB 
colInput = hex / rgb
colorA = "colorA(" h:colInput ")"{ return `col.setColor( "A", ${h} )` ; } // 
colorB = "colorB(" h:colInput ")"{ return `col.setColor("B", ${h})` ; }

/** Post Processing **/
effects = editAttribute / noEffect / effect
postProcess = "kal" / "blur" / "celShade" / "foggy" / "light" / "noise" / "oldFilm" / "vignette"
attribute = "size" / "side" 


noEffect = "noEffect"{ return `noEffect()` }
effect = func:postProcess _ { return `postEffect("${func}")`} 
effectAttribute = attr:attribute { return `${attr}` }


editAttribute = e:postProcess POINT att:effectAttribute "(" val:PRIMARY ")"{ return `setEffect('${e}', '${att}', ${val})`}
