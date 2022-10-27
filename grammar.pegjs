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
                    add / mult / subtract / divide / modulo / test/
                    colorA / colorB / rateA / rateB / feed / kill / $[^{} \t\n\r] +

diffuse  = "diffuse" { return "@diffuse"; }	// main function for reactive diffusion

// Input and other
audio = "audio" { return "@audio";} //i want to be able to set audio on and off
time = "time" { return Date.getTime; }
test = "test" { return "@test" }

// Shapes and styles
circle = "circle" { return "@circle"; }
rect = "rect" { return "@rect"; }
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
//sin = "sin(" p:int ")" { return Math.sin(p); }


/****** Diffuse attributes ****/
colorA = "colorA(" h:hex ")"{ return `@colorA(${h})` ; }
colorB = "colorB(" h:hex ")"{ return `@colorB(${h})` ; }
rateA = "rateA(" r:float ")"{ return `@rateA(${r})` ; } //change to primary
rateB = "rateB(" r:float ")"{ return `@rateB(${r})` ; } 
feed = "feed(" f:float ")" { return `@feed(${f})` ; } 
kill = "kill(" k:float ")" { return `@kill(${k})` ; } 

     