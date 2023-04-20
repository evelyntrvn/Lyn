(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const style = "";
function peg$subclass(child, parent) {
  function C() {
    this.constructor = child;
  }
  C.prototype = parent.prototype;
  child.prototype = new C();
}
function peg$SyntaxError(message, expected, found, location) {
  var self2 = Error.call(this, message);
  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(self2, peg$SyntaxError.prototype);
  }
  self2.expected = expected;
  self2.found = found;
  self2.location = location;
  self2.name = "SyntaxError";
  return self2;
}
peg$subclass(peg$SyntaxError, Error);
function peg$padEnd(str, targetLength, padString) {
  padString = padString || " ";
  if (str.length > targetLength) {
    return str;
  }
  targetLength -= str.length;
  padString += padString.repeat(targetLength);
  return str + padString.slice(0, targetLength);
}
peg$SyntaxError.prototype.format = function(sources) {
  var str = "Error: " + this.message;
  if (this.location) {
    var src = null;
    var k;
    for (k = 0; k < sources.length; k++) {
      if (sources[k].source === this.location.source) {
        src = sources[k].text.split(/\r\n|\n|\r/g);
        break;
      }
    }
    var s = this.location.start;
    var loc = this.location.source + ":" + s.line + ":" + s.column;
    if (src) {
      var e = this.location.end;
      var filler = peg$padEnd("", s.line.toString().length, " ");
      var line = src[s.line - 1];
      var last = s.line === e.line ? e.column : line.length + 1;
      var hatLen = last - s.column || 1;
      str += "\n --> " + loc + "\n" + filler + " |\n" + s.line + " | " + line + "\n" + filler + " | " + peg$padEnd("", s.column - 1, " ") + peg$padEnd("", hatLen, "^");
    } else {
      str += "\n at " + loc;
    }
  }
  return str;
};
peg$SyntaxError.buildMessage = function(expected, found) {
  var DESCRIBE_EXPECTATION_FNS = {
    literal: function(expectation) {
      return '"' + literalEscape(expectation.text) + '"';
    },
    class: function(expectation) {
      var escapedParts = expectation.parts.map(function(part) {
        return Array.isArray(part) ? classEscape(part[0]) + "-" + classEscape(part[1]) : classEscape(part);
      });
      return "[" + (expectation.inverted ? "^" : "") + escapedParts.join("") + "]";
    },
    any: function() {
      return "any character";
    },
    end: function() {
      return "end of input";
    },
    other: function(expectation) {
      return expectation.description;
    }
  };
  function hex(ch) {
    return ch.charCodeAt(0).toString(16).toUpperCase();
  }
  function literalEscape(s) {
    return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(ch) {
      return "\\x0" + hex(ch);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) {
      return "\\x" + hex(ch);
    });
  }
  function classEscape(s) {
    return s.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\^/g, "\\^").replace(/-/g, "\\-").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(ch) {
      return "\\x0" + hex(ch);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) {
      return "\\x" + hex(ch);
    });
  }
  function describeExpectation(expectation) {
    return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
  }
  function describeExpected(expected2) {
    var descriptions = expected2.map(describeExpectation);
    var i, j;
    descriptions.sort();
    if (descriptions.length > 0) {
      for (i = 1, j = 1; i < descriptions.length; i++) {
        if (descriptions[i - 1] !== descriptions[i]) {
          descriptions[j] = descriptions[i];
          j++;
        }
      }
      descriptions.length = j;
    }
    switch (descriptions.length) {
      case 1:
        return descriptions[0];
      case 2:
        return descriptions[0] + " or " + descriptions[1];
      default:
        return descriptions.slice(0, -1).join(", ") + ", or " + descriptions[descriptions.length - 1];
    }
  }
  function describeFound(found2) {
    return found2 ? '"' + literalEscape(found2) + '"' : "end of input";
  }
  return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
};
function peg$parse(input, options) {
  options = options !== void 0 ? options : {};
  var peg$FAILED = {};
  var peg$source = options.grammarSource;
  var peg$startRuleFunctions = { start: peg$parsestart };
  var peg$startRuleFunction = peg$parsestart;
  var peg$c0 = ".";
  var peg$c1 = ",";
  var peg$c2 = "true";
  var peg$c3 = "True";
  var peg$c4 = "false";
  var peg$c5 = "False";
  var peg$c6 = "{";
  var peg$c7 = "}";
  var peg$c8 = "audio";
  var peg$c9 = "rect(";
  var peg$c10 = ")";
  var peg$c11 = "dots()";
  var peg$c12 = "diffuse(";
  var peg$c13 = "dA(";
  var peg$c14 = "dB(";
  var peg$c15 = "feed(";
  var peg$c16 = "kill(";
  var peg$c17 = "size(";
  var peg$c18 = "reset()";
  var peg$c19 = "automata(";
  var peg$c20 = "playMusic(";
  var peg$c21 = "pauseMusic()";
  var peg$c22 = "time";
  var peg$c23 = "#";
  var peg$c24 = "rgb(";
  var peg$c25 = "colorA(";
  var peg$c26 = "colorB(";
  var peg$c27 = "kal";
  var peg$c28 = "blur";
  var peg$c29 = "celShade";
  var peg$c30 = "foggy";
  var peg$c31 = "light";
  var peg$c32 = "noise";
  var peg$c33 = "oldFilm";
  var peg$c34 = "vignette";
  var peg$c35 = "size";
  var peg$c36 = "side";
  var peg$c37 = "period";
  var peg$c38 = "speed";
  var peg$c39 = "intensity";
  var peg$c40 = "speckIntensity";
  var peg$c41 = "lineIntensity";
  var peg$c42 = "grainIntensity";
  var peg$c43 = "blurScalar";
  var peg$c44 = "brightnessScalar";
  var peg$c45 = "brightnessExponent";
  var peg$c46 = "noEffect";
  var peg$c47 = "()";
  var peg$c48 = "(";
  var peg$r0 = /^[0-9]/;
  var peg$r1 = /^[1-9]/;
  var peg$r2 = /^[^{}]/;
  var peg$r3 = /^[ \t\n\r]/;
  var peg$r4 = /^[^{} \t\n\r]/;
  var peg$r5 = /^[0-9A-Fa-f]/;
  var peg$e0 = peg$otherExpectation("start");
  var peg$e1 = peg$otherExpectation("term");
  var peg$e2 = peg$literalExpectation(".", false);
  var peg$e3 = peg$literalExpectation(",", false);
  var peg$e4 = peg$classExpectation([["0", "9"]], false, false);
  var peg$e5 = peg$classExpectation([["1", "9"]], false, false);
  var peg$e6 = peg$literalExpectation("true", false);
  var peg$e7 = peg$literalExpectation("True", false);
  var peg$e8 = peg$literalExpectation("false", false);
  var peg$e9 = peg$literalExpectation("False", false);
  var peg$e10 = peg$classExpectation(["{", "}"], true, false);
  var peg$e11 = peg$literalExpectation("{", false);
  var peg$e12 = peg$literalExpectation("}", false);
  var peg$e13 = peg$otherExpectation("whitespace");
  var peg$e14 = peg$classExpectation([" ", "	", "\n", "\r"], false, false);
  var peg$e15 = peg$literalExpectation("audio", false);
  var peg$e16 = peg$otherExpectation("keyword");
  var peg$e17 = peg$classExpectation(["{", "}", " ", "	", "\n", "\r"], true, false);
  var peg$e18 = peg$literalExpectation("rect(", false);
  var peg$e19 = peg$literalExpectation(")", false);
  var peg$e20 = peg$literalExpectation("dots()", false);
  var peg$e21 = peg$literalExpectation("diffuse(", false);
  var peg$e22 = peg$literalExpectation("dA(", false);
  var peg$e23 = peg$literalExpectation("dB(", false);
  var peg$e24 = peg$literalExpectation("feed(", false);
  var peg$e25 = peg$literalExpectation("kill(", false);
  var peg$e26 = peg$literalExpectation("size(", false);
  var peg$e27 = peg$literalExpectation("reset()", false);
  var peg$e28 = peg$literalExpectation("automata(", false);
  var peg$e29 = peg$literalExpectation("playMusic(", false);
  var peg$e30 = peg$literalExpectation("pauseMusic()", false);
  var peg$e31 = peg$literalExpectation("time", false);
  var peg$e32 = peg$classExpectation([["0", "9"], ["A", "F"], ["a", "f"]], false, false);
  var peg$e33 = peg$literalExpectation("#", false);
  var peg$e34 = peg$literalExpectation("rgb(", false);
  var peg$e35 = peg$literalExpectation("colorA(", false);
  var peg$e36 = peg$literalExpectation("colorB(", false);
  var peg$e37 = peg$literalExpectation("kal", false);
  var peg$e38 = peg$literalExpectation("blur", false);
  var peg$e39 = peg$literalExpectation("celShade", false);
  var peg$e40 = peg$literalExpectation("foggy", false);
  var peg$e41 = peg$literalExpectation("light", false);
  var peg$e42 = peg$literalExpectation("noise", false);
  var peg$e43 = peg$literalExpectation("oldFilm", false);
  var peg$e44 = peg$literalExpectation("vignette", false);
  var peg$e45 = peg$literalExpectation("size", false);
  var peg$e46 = peg$literalExpectation("side", false);
  var peg$e47 = peg$literalExpectation("period", false);
  var peg$e48 = peg$literalExpectation("speed", false);
  var peg$e49 = peg$literalExpectation("intensity", false);
  var peg$e50 = peg$literalExpectation("speckIntensity", false);
  var peg$e51 = peg$literalExpectation("lineIntensity", false);
  var peg$e52 = peg$literalExpectation("grainIntensity", false);
  var peg$e53 = peg$literalExpectation("blurScalar", false);
  var peg$e54 = peg$literalExpectation("brightnessScalar", false);
  var peg$e55 = peg$literalExpectation("brightnessExponent", false);
  var peg$e56 = peg$literalExpectation("noEffect", false);
  var peg$e57 = peg$literalExpectation("()", false);
  var peg$e58 = peg$literalExpectation("(", false);
  var peg$f0 = function(body) {
    return body;
  };
  var peg$f1 = function() {
    return "true";
  };
  var peg$f2 = function() {
    return "false";
  };
  var peg$f3 = function(first, dec) {
    return parseFloat(`${first}`) + parseFloat(`${dec}`);
  };
  var peg$f4 = function(point, num) {
    return parseFloat(`.${num}`);
  };
  var peg$f5 = function(first, dig) {
    return parseInt(`${text2()}`);
  };
  var peg$f6 = function() {
    return text2();
  };
  var peg$f7 = function(expr) {
    return expr.join("");
  };
  var peg$f8 = function() {
    return "'audio'";
  };
  var peg$f9 = function(x, y, w, h) {
    return `shape.rect( ${x}, ${y}, ${w}, ${h} )`;
  };
  var peg$f10 = function() {
    return `shape.dots()`;
  };
  var peg$f11 = function(bool) {
    return `setDiffuse(${bool})`;
  };
  var peg$f12 = function(r) {
    return `rateA(${r})`;
  };
  var peg$f13 = function(r) {
    return `rateB(${r})`;
  };
  var peg$f14 = function(f) {
    return `feed(${f})`;
  };
  var peg$f15 = function(k) {
    return `kill(${k})`;
  };
  var peg$f16 = function(s) {
    return `size(${s})`;
  };
  var peg$f17 = function() {
    return `reset()`;
  };
  var peg$f18 = function(bool) {
    return `setAutomata(${bool})`;
  };
  var peg$f19 = function(trackNum) {
    return `playMusic(${trackNum})`;
  };
  var peg$f20 = function() {
    return `pauseMusic()`;
  };
  var peg$f21 = function() {
    return Date.getTime;
  };
  var peg$f22 = function(h) {
    return `${h}`;
  };
  var peg$f23 = function(h) {
    return `"#${h.join("")}"`;
  };
  var peg$f24 = function() {
    return text2();
  };
  var peg$f25 = function(h) {
    return `col.setColor( "A", ${h} )`;
  };
  var peg$f26 = function(h) {
    return `col.setColor("B", ${h})`;
  };
  var peg$f27 = function() {
    return `effects.noEffect()`;
  };
  var peg$f28 = function(func) {
    return `effects.postEffect("${func}")`;
  };
  var peg$f29 = function(attr) {
    return `${attr}`;
  };
  var peg$f30 = function(e, att, val) {
    return `effects.setEffect('${e}', '${att}', ${val})`;
  };
  var peg$currPos = 0;
  var peg$savedPos = 0;
  var peg$posDetailsCache = [{ line: 1, column: 1 }];
  var peg$maxFailPos = 0;
  var peg$maxFailExpected = [];
  var peg$silentFails = 0;
  var peg$result;
  if ("startRule" in options) {
    if (!(options.startRule in peg$startRuleFunctions)) {
      throw new Error(`Can't start parsing from rule "` + options.startRule + '".');
    }
    peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
  }
  function text2() {
    return input.substring(peg$savedPos, peg$currPos);
  }
  function offset() {
    return peg$savedPos;
  }
  function range() {
    return {
      source: peg$source,
      start: peg$savedPos,
      end: peg$currPos
    };
  }
  function location() {
    return peg$computeLocation(peg$savedPos, peg$currPos);
  }
  function expected(description, location2) {
    location2 = location2 !== void 0 ? location2 : peg$computeLocation(peg$savedPos, peg$currPos);
    throw peg$buildStructuredError(
      [peg$otherExpectation(description)],
      input.substring(peg$savedPos, peg$currPos),
      location2
    );
  }
  function error(message, location2) {
    location2 = location2 !== void 0 ? location2 : peg$computeLocation(peg$savedPos, peg$currPos);
    throw peg$buildSimpleError(message, location2);
  }
  function peg$literalExpectation(text3, ignoreCase) {
    return { type: "literal", text: text3, ignoreCase };
  }
  function peg$classExpectation(parts, inverted, ignoreCase) {
    return { type: "class", parts, inverted, ignoreCase };
  }
  function peg$anyExpectation() {
    return { type: "any" };
  }
  function peg$endExpectation() {
    return { type: "end" };
  }
  function peg$otherExpectation(description) {
    return { type: "other", description };
  }
  function peg$computePosDetails(pos2) {
    var details = peg$posDetailsCache[pos2];
    var p;
    if (details) {
      return details;
    } else {
      p = pos2 - 1;
      while (!peg$posDetailsCache[p]) {
        p--;
      }
      details = peg$posDetailsCache[p];
      details = {
        line: details.line,
        column: details.column
      };
      while (p < pos2) {
        if (input.charCodeAt(p) === 10) {
          details.line++;
          details.column = 1;
        } else {
          details.column++;
        }
        p++;
      }
      peg$posDetailsCache[pos2] = details;
      return details;
    }
  }
  function peg$computeLocation(startPos, endPos) {
    var startPosDetails = peg$computePosDetails(startPos);
    var endPosDetails = peg$computePosDetails(endPos);
    return {
      source: peg$source,
      start: {
        offset: startPos,
        line: startPosDetails.line,
        column: startPosDetails.column
      },
      end: {
        offset: endPos,
        line: endPosDetails.line,
        column: endPosDetails.column
      }
    };
  }
  function peg$fail(expected2) {
    if (peg$currPos < peg$maxFailPos) {
      return;
    }
    if (peg$currPos > peg$maxFailPos) {
      peg$maxFailPos = peg$currPos;
      peg$maxFailExpected = [];
    }
    peg$maxFailExpected.push(expected2);
  }
  function peg$buildSimpleError(message, location2) {
    return new peg$SyntaxError(message, null, null, location2);
  }
  function peg$buildStructuredError(expected2, found, location2) {
    return new peg$SyntaxError(
      peg$SyntaxError.buildMessage(expected2, found),
      expected2,
      found,
      location2
    );
  }
  function peg$parsestart() {
    var s0, s1;
    peg$silentFails++;
    s0 = [];
    s1 = peg$parseterm();
    if (s1 !== peg$FAILED) {
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        s1 = peg$parseterm();
      }
    } else {
      s0 = peg$FAILED;
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e0);
      }
    }
    return s0;
  }
  function peg$parseterm() {
    var s0, s1, s2, s3;
    peg$silentFails++;
    s0 = peg$currPos;
    s1 = peg$parse_();
    s2 = peg$parsekeyword();
    if (s2 === peg$FAILED) {
      s2 = peg$parsesentence();
    }
    if (s2 !== peg$FAILED) {
      s3 = peg$parse_();
      peg$savedPos = s0;
      s0 = peg$f0(s2);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e1);
      }
    }
    return s0;
  }
  function peg$parsePOINT() {
    var s0;
    if (input.charCodeAt(peg$currPos) === 46) {
      s0 = peg$c0;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e2);
      }
    }
    return s0;
  }
  function peg$parseCOMMA() {
    var s0;
    if (input.charCodeAt(peg$currPos) === 44) {
      s0 = peg$c1;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e3);
      }
    }
    return s0;
  }
  function peg$parseDIGIT() {
    var s0;
    if (peg$r0.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e4);
      }
    }
    return s0;
  }
  function peg$parseINTDIGIT() {
    var s0;
    if (peg$r1.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e5);
      }
    }
    return s0;
  }
  function peg$parseTRUE() {
    var s0, s1;
    if (input.substr(peg$currPos, 4) === peg$c2) {
      s0 = peg$c2;
      peg$currPos += 4;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e6);
      }
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c3) {
        s1 = peg$c3;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e7);
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$f1();
      }
      s0 = s1;
    }
    return s0;
  }
  function peg$parseFALSE() {
    var s0, s1;
    if (input.substr(peg$currPos, 5) === peg$c4) {
      s0 = peg$c4;
      peg$currPos += 5;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e8);
      }
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c5) {
        s1 = peg$c5;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e9);
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$f2();
      }
      s0 = s1;
    }
    return s0;
  }
  function peg$parsePRIMARY() {
    var s0;
    s0 = peg$parsefloat();
    if (s0 === peg$FAILED) {
      s0 = peg$parseint();
    }
    return s0;
  }
  function peg$parsefloat() {
    var s0, s1, s2;
    s0 = peg$currPos;
    s1 = peg$parseint();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsedec();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f3(s1, s2);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsedec() {
    var s0, s1, s2, s3;
    s0 = peg$currPos;
    s1 = peg$parsePOINT();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parseDIGIT();
      if (s3 !== peg$FAILED) {
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseDIGIT();
        }
      } else {
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f4(s1, s2);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseint() {
    var s0, s1, s2, s3;
    s0 = peg$currPos;
    s1 = peg$parseINTDIGIT();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parseDIGIT();
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$parseDIGIT();
      }
      peg$savedPos = s0;
      s0 = peg$f5(s1, s2);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseboolean() {
    var s0;
    s0 = peg$parseTRUE();
    if (s0 === peg$FAILED) {
      s0 = peg$parseFALSE();
    }
    return s0;
  }
  function peg$parseregular() {
    var s0, s1, s2;
    s0 = peg$currPos;
    s1 = [];
    if (peg$r2.test(input.charAt(peg$currPos))) {
      s2 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e10);
      }
    }
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        if (peg$r2.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e10);
          }
        }
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f6();
    }
    s0 = s1;
    return s0;
  }
  function peg$parseexpr() {
    var s0, s1;
    s0 = [];
    s1 = peg$parseregular();
    while (s1 !== peg$FAILED) {
      s0.push(s1);
      s1 = peg$parseregular();
    }
    return s0;
  }
  function peg$parsesentence() {
    var s0, s1, s2, s3;
    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 123) {
      s1 = peg$c6;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e11);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseexpr();
      if (input.charCodeAt(peg$currPos) === 125) {
        s3 = peg$c7;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e12);
        }
      }
      if (s3 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f7(s2);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parseregular();
    }
    return s0;
  }
  function peg$parse_() {
    var s0, s1;
    peg$silentFails++;
    s0 = [];
    if (peg$r3.test(input.charAt(peg$currPos))) {
      s1 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e14);
      }
    }
    while (s1 !== peg$FAILED) {
      s0.push(s1);
      if (peg$r3.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e14);
        }
      }
    }
    peg$silentFails--;
    s1 = peg$FAILED;
    if (peg$silentFails === 0) {
      peg$fail(peg$e13);
    }
    return s0;
  }
  function peg$parseaudio() {
    var s0, s1;
    s0 = peg$currPos;
    if (input.substr(peg$currPos, 5) === peg$c8) {
      s1 = peg$c8;
      peg$currPos += 5;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e15);
      }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f8();
    }
    s0 = s1;
    return s0;
  }
  function peg$parsekeyword() {
    var s0, s1, s2;
    peg$silentFails++;
    s0 = peg$parsecol();
    if (s0 === peg$FAILED) {
      s0 = peg$parsedifFct();
      if (s0 === peg$FAILED) {
        s0 = peg$parseautomata();
        if (s0 === peg$FAILED) {
          s0 = peg$parseeffects();
          if (s0 === peg$FAILED) {
            s0 = peg$parsereset();
            if (s0 === peg$FAILED) {
              s0 = peg$parsemusic();
              if (s0 === peg$FAILED) {
                s0 = peg$parseshapes();
                if (s0 === peg$FAILED) {
                  s0 = peg$parsecolInput();
                  if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = [];
                    if (peg$r4.test(input.charAt(peg$currPos))) {
                      s2 = input.charAt(peg$currPos);
                      peg$currPos++;
                    } else {
                      s2 = peg$FAILED;
                      if (peg$silentFails === 0) {
                        peg$fail(peg$e17);
                      }
                    }
                    if (s2 !== peg$FAILED) {
                      while (s2 !== peg$FAILED) {
                        s1.push(s2);
                        if (peg$r4.test(input.charAt(peg$currPos))) {
                          s2 = input.charAt(peg$currPos);
                          peg$currPos++;
                        } else {
                          s2 = peg$FAILED;
                          if (peg$silentFails === 0) {
                            peg$fail(peg$e17);
                          }
                        }
                      }
                    } else {
                      s1 = peg$FAILED;
                    }
                    if (s1 !== peg$FAILED) {
                      s0 = input.substring(s0, peg$currPos);
                    } else {
                      s0 = s1;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e16);
      }
    }
    return s0;
  }
  function peg$parseshapes() {
    var s0;
    s0 = peg$parserect();
    if (s0 === peg$FAILED) {
      s0 = peg$parsedots();
    }
    return s0;
  }
  function peg$parserect() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14;
    s0 = peg$currPos;
    if (input.substr(peg$currPos, 5) === peg$c9) {
      s1 = peg$c9;
      peg$currPos += 5;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e18);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      s3 = peg$parsePRIMARY();
      if (s3 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 44) {
          s4 = peg$c1;
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e3);
          }
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parse_();
          s6 = peg$parsePRIMARY();
          if (s6 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 44) {
              s7 = peg$c1;
              peg$currPos++;
            } else {
              s7 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$e3);
              }
            }
            if (s7 !== peg$FAILED) {
              s8 = peg$parse_();
              s9 = peg$parsePRIMARY();
              if (s9 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 44) {
                  s10 = peg$c1;
                  peg$currPos++;
                } else {
                  s10 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$e3);
                  }
                }
                if (s10 !== peg$FAILED) {
                  s11 = peg$parse_();
                  s12 = peg$parsePRIMARY();
                  if (s12 !== peg$FAILED) {
                    s13 = peg$parse_();
                    if (input.charCodeAt(peg$currPos) === 41) {
                      s14 = peg$c10;
                      peg$currPos++;
                    } else {
                      s14 = peg$FAILED;
                      if (peg$silentFails === 0) {
                        peg$fail(peg$e19);
                      }
                    }
                    if (s14 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s0 = peg$f9(s3, s6, s9, s12);
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsedots() {
    var s0, s1;
    s0 = peg$currPos;
    if (input.substr(peg$currPos, 6) === peg$c11) {
      s1 = peg$c11;
      peg$currPos += 6;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e20);
      }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f10();
    }
    s0 = s1;
    return s0;
  }
  function peg$parsedifFct() {
    var s0;
    s0 = peg$parsediffuse();
    if (s0 === peg$FAILED) {
      s0 = peg$parserateA();
      if (s0 === peg$FAILED) {
        s0 = peg$parserateB();
        if (s0 === peg$FAILED) {
          s0 = peg$parsefeed();
          if (s0 === peg$FAILED) {
            s0 = peg$parsekill();
            if (s0 === peg$FAILED) {
              s0 = peg$parsesize();
            }
          }
        }
      }
    }
    return s0;
  }
  function peg$parsedifInput() {
    var s0;
    s0 = peg$parsePRIMARY();
    if (s0 === peg$FAILED) {
      s0 = peg$parseaudio();
    }
    return s0;
  }
  function peg$parsediffuse() {
    var s0, s1, s2, s3;
    s0 = peg$currPos;
    if (input.substr(peg$currPos, 8) === peg$c12) {
      s1 = peg$c12;
      peg$currPos += 8;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e21);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseboolean();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 41) {
          s3 = peg$c10;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e19);
          }
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f11(s2);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parserateA() {
    var s0, s1, s2, s3;
    s0 = peg$currPos;
    if (input.substr(peg$currPos, 3) === peg$c13) {
      s1 = peg$c13;
      peg$currPos += 3;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e22);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsedifInput();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 41) {
          s3 = peg$c10;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e19);
          }
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f12(s2);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parserateB() {
    var s0, s1, s2, s3;
    s0 = peg$currPos;
    if (input.substr(peg$currPos, 3) === peg$c14) {
      s1 = peg$c14;
      peg$currPos += 3;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e23);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsedifInput();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 41) {
          s3 = peg$c10;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e19);
          }
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f13(s2);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsefeed() {
    var s0, s1, s2, s3;
    s0 = peg$currPos;
    if (input.substr(peg$currPos, 5) === peg$c15) {
      s1 = peg$c15;
      peg$currPos += 5;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e24);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsedifInput();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 41) {
          s3 = peg$c10;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e19);
          }
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f14(s2);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsekill() {
    var s0, s1, s2, s3;
    s0 = peg$currPos;
    if (input.substr(peg$currPos, 5) === peg$c16) {
      s1 = peg$c16;
      peg$currPos += 5;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e25);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsedifInput();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 41) {
          s3 = peg$c10;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e19);
          }
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f15(s2);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsesize() {
    var s0, s1, s2, s3;
    s0 = peg$currPos;
    if (input.substr(peg$currPos, 5) === peg$c17) {
      s1 = peg$c17;
      peg$currPos += 5;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e26);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsedifInput();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 41) {
          s3 = peg$c10;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e19);
          }
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f16(s2);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsereset() {
    var s0, s1;
    s0 = peg$currPos;
    if (input.substr(peg$currPos, 7) === peg$c18) {
      s1 = peg$c18;
      peg$currPos += 7;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e27);
      }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f17();
    }
    s0 = s1;
    return s0;
  }
  function peg$parseautomata() {
    var s0, s1, s2, s3;
    s0 = peg$currPos;
    if (input.substr(peg$currPos, 9) === peg$c19) {
      s1 = peg$c19;
      peg$currPos += 9;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e28);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseboolean();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 41) {
          s3 = peg$c10;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e19);
          }
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f18(s2);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsemusic() {
    var s0;
    s0 = peg$parseplayMusic();
    if (s0 === peg$FAILED) {
      s0 = peg$parsepauseMusic();
      if (s0 === peg$FAILED) {
        s0 = peg$parsetime();
      }
    }
    return s0;
  }
  function peg$parseplayMusic() {
    var s0, s1, s2, s3;
    s0 = peg$currPos;
    if (input.substr(peg$currPos, 10) === peg$c20) {
      s1 = peg$c20;
      peg$currPos += 10;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e29);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseint();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 41) {
          s3 = peg$c10;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e19);
          }
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f19(s2);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsepauseMusic() {
    var s0, s1;
    s0 = peg$currPos;
    if (input.substr(peg$currPos, 12) === peg$c21) {
      s1 = peg$c21;
      peg$currPos += 12;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e30);
      }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f20();
    }
    s0 = s1;
    return s0;
  }
  function peg$parsetime() {
    var s0, s1;
    s0 = peg$currPos;
    if (input.substr(peg$currPos, 4) === peg$c22) {
      s1 = peg$c22;
      peg$currPos += 4;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e31);
      }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f21();
    }
    s0 = s1;
    return s0;
  }
  function peg$parsehexChar() {
    var s0, s1;
    s0 = peg$currPos;
    if (peg$r5.test(input.charAt(peg$currPos))) {
      s1 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e32);
      }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f22(s1);
    }
    s0 = s1;
    return s0;
  }
  function peg$parsehex() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8;
    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 35) {
      s1 = peg$c23;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e33);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$currPos;
      s3 = peg$parsehexChar();
      if (s3 !== peg$FAILED) {
        s4 = peg$parsehexChar();
        if (s4 !== peg$FAILED) {
          s5 = peg$parsehexChar();
          if (s5 !== peg$FAILED) {
            s6 = peg$parsehexChar();
            if (s6 !== peg$FAILED) {
              s7 = peg$parsehexChar();
              if (s7 !== peg$FAILED) {
                s8 = peg$parsehexChar();
                if (s8 !== peg$FAILED) {
                  s3 = [s3, s4, s5, s6, s7, s8];
                  s2 = s3;
                } else {
                  peg$currPos = s2;
                  s2 = peg$FAILED;
                }
              } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f23(s2);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsergb() {
    var s0, s1, s2, s3, s4, s5, s6, s7;
    s0 = peg$currPos;
    if (input.substr(peg$currPos, 4) === peg$c24) {
      s1 = peg$c24;
      peg$currPos += 4;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e34);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsePRIMARY();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 44) {
          s3 = peg$c1;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e3);
          }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parsePRIMARY();
          if (s4 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 44) {
              s5 = peg$c1;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$e3);
              }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parsePRIMARY();
              if (s6 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 41) {
                  s7 = peg$c10;
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$e19);
                  }
                }
                if (s7 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s0 = peg$f24();
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsecol() {
    var s0;
    s0 = peg$parsecolorA();
    if (s0 === peg$FAILED) {
      s0 = peg$parsecolorB();
    }
    return s0;
  }
  function peg$parsecolInput() {
    var s0;
    s0 = peg$parsehex();
    if (s0 === peg$FAILED) {
      s0 = peg$parsergb();
    }
    return s0;
  }
  function peg$parsecolorA() {
    var s0, s1, s2, s3;
    s0 = peg$currPos;
    if (input.substr(peg$currPos, 7) === peg$c25) {
      s1 = peg$c25;
      peg$currPos += 7;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e35);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsecolInput();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 41) {
          s3 = peg$c10;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e19);
          }
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f25(s2);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsecolorB() {
    var s0, s1, s2, s3;
    s0 = peg$currPos;
    if (input.substr(peg$currPos, 7) === peg$c26) {
      s1 = peg$c26;
      peg$currPos += 7;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e36);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsecolInput();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 41) {
          s3 = peg$c10;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e19);
          }
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f26(s2);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseeffects() {
    var s0;
    s0 = peg$parseeditAttribute();
    if (s0 === peg$FAILED) {
      s0 = peg$parsenoEffect();
      if (s0 === peg$FAILED) {
        s0 = peg$parseeffect();
      }
    }
    return s0;
  }
  function peg$parsepostProcess() {
    var s0;
    if (input.substr(peg$currPos, 3) === peg$c27) {
      s0 = peg$c27;
      peg$currPos += 3;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e37);
      }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 4) === peg$c28) {
        s0 = peg$c28;
        peg$currPos += 4;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e38);
        }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 8) === peg$c29) {
          s0 = peg$c29;
          peg$currPos += 8;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e39);
          }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 5) === peg$c30) {
            s0 = peg$c30;
            peg$currPos += 5;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e40);
            }
          }
          if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 5) === peg$c31) {
              s0 = peg$c31;
              peg$currPos += 5;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$e41);
              }
            }
            if (s0 === peg$FAILED) {
              if (input.substr(peg$currPos, 5) === peg$c32) {
                s0 = peg$c32;
                peg$currPos += 5;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$e42);
                }
              }
              if (s0 === peg$FAILED) {
                if (input.substr(peg$currPos, 7) === peg$c33) {
                  s0 = peg$c33;
                  peg$currPos += 7;
                } else {
                  s0 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$e43);
                  }
                }
                if (s0 === peg$FAILED) {
                  if (input.substr(peg$currPos, 8) === peg$c34) {
                    s0 = peg$c34;
                    peg$currPos += 8;
                  } else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$e44);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return s0;
  }
  function peg$parseattribute() {
    var s0;
    if (input.substr(peg$currPos, 4) === peg$c35) {
      s0 = peg$c35;
      peg$currPos += 4;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e45);
      }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 4) === peg$c36) {
        s0 = peg$c36;
        peg$currPos += 4;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e46);
        }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 6) === peg$c37) {
          s0 = peg$c37;
          peg$currPos += 6;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e47);
          }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 5) === peg$c38) {
            s0 = peg$c38;
            peg$currPos += 5;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e48);
            }
          }
          if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 9) === peg$c39) {
              s0 = peg$c39;
              peg$currPos += 9;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$e49);
              }
            }
            if (s0 === peg$FAILED) {
              if (input.substr(peg$currPos, 14) === peg$c40) {
                s0 = peg$c40;
                peg$currPos += 14;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$e50);
                }
              }
              if (s0 === peg$FAILED) {
                if (input.substr(peg$currPos, 13) === peg$c41) {
                  s0 = peg$c41;
                  peg$currPos += 13;
                } else {
                  s0 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$e51);
                  }
                }
                if (s0 === peg$FAILED) {
                  if (input.substr(peg$currPos, 14) === peg$c42) {
                    s0 = peg$c42;
                    peg$currPos += 14;
                  } else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$e52);
                    }
                  }
                  if (s0 === peg$FAILED) {
                    if (input.substr(peg$currPos, 10) === peg$c43) {
                      s0 = peg$c43;
                      peg$currPos += 10;
                    } else {
                      s0 = peg$FAILED;
                      if (peg$silentFails === 0) {
                        peg$fail(peg$e53);
                      }
                    }
                    if (s0 === peg$FAILED) {
                      if (input.substr(peg$currPos, 16) === peg$c44) {
                        s0 = peg$c44;
                        peg$currPos += 16;
                      } else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) {
                          peg$fail(peg$e54);
                        }
                      }
                      if (s0 === peg$FAILED) {
                        if (input.substr(peg$currPos, 18) === peg$c45) {
                          s0 = peg$c45;
                          peg$currPos += 18;
                        } else {
                          s0 = peg$FAILED;
                          if (peg$silentFails === 0) {
                            peg$fail(peg$e55);
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return s0;
  }
  function peg$parsenoEffect() {
    var s0, s1;
    s0 = peg$currPos;
    if (input.substr(peg$currPos, 8) === peg$c46) {
      s1 = peg$c46;
      peg$currPos += 8;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e56);
      }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f27();
    }
    s0 = s1;
    return s0;
  }
  function peg$parseeffect() {
    var s0, s1, s2, s3;
    s0 = peg$currPos;
    s1 = peg$parsepostProcess();
    if (s1 !== peg$FAILED) {
      if (input.substr(peg$currPos, 2) === peg$c47) {
        s2 = peg$c47;
        peg$currPos += 2;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e57);
        }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parse_();
        peg$savedPos = s0;
        s0 = peg$f28(s1);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseeffectAttribute() {
    var s0, s1;
    s0 = peg$currPos;
    s1 = peg$parseattribute();
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f29(s1);
    }
    s0 = s1;
    return s0;
  }
  function peg$parseeditAttribute() {
    var s0, s1, s2, s3, s4, s5, s6;
    s0 = peg$currPos;
    s1 = peg$parsepostProcess();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsePOINT();
      if (s2 !== peg$FAILED) {
        s3 = peg$parseeffectAttribute();
        if (s3 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 40) {
            s4 = peg$c48;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e58);
            }
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parsePRIMARY();
            if (s5 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 41) {
                s6 = peg$c10;
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$e19);
                }
              }
              if (s6 !== peg$FAILED) {
                peg$savedPos = s0;
                s0 = peg$f30(s1, s3, s5);
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  peg$result = peg$startRuleFunction();
  if (peg$result !== peg$FAILED && peg$currPos === input.length) {
    return peg$result;
  } else {
    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
      peg$fail(peg$endExpectation());
    }
    throw peg$buildStructuredError(
      peg$maxFailExpected,
      peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
      peg$maxFailPos < input.length ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1) : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
    );
  }
}
const Parser = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SyntaxError: peg$SyntaxError,
  parse: peg$parse
}, Symbol.toStringTag, { value: "Module" }));
function fill() {
  for (var i = 0; i < window.innerWidth; i++) {
    for (var j = 0; j < window.innerHeight; j++) {
      poking$1(i, j, 255, 0, 0);
    }
  }
}
function dots() {
  for (var i = 0; i < window.innerWidth; i++) {
    for (var j = 0; j < window.innerHeight; j++) {
      if (Math.random() > 0.9) {
        poking$1(i, j, 0, 255, 0);
      }
    }
  }
}
function rect(x, y, w, h) {
  for (var i = 0; i < window.innerWidth; i++) {
    for (var j = 0; j < window.innerHeight; j++) {
      if (i >= x && i <= x + w && j <= y + h && j >= y) {
        poking$1(i, j, 0, 255, 0);
      }
    }
  }
  console.log("rect");
}
const Shape = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  dots,
  fill,
  rect
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_color_name = __commonJS({
  "node_modules/color-name/index.js"(exports, module) {
    "use strict";
    module.exports = {
      "aliceblue": [240, 248, 255],
      "antiquewhite": [250, 235, 215],
      "aqua": [0, 255, 255],
      "aquamarine": [127, 255, 212],
      "azure": [240, 255, 255],
      "beige": [245, 245, 220],
      "bisque": [255, 228, 196],
      "black": [0, 0, 0],
      "blanchedalmond": [255, 235, 205],
      "blue": [0, 0, 255],
      "blueviolet": [138, 43, 226],
      "brown": [165, 42, 42],
      "burlywood": [222, 184, 135],
      "cadetblue": [95, 158, 160],
      "chartreuse": [127, 255, 0],
      "chocolate": [210, 105, 30],
      "coral": [255, 127, 80],
      "cornflowerblue": [100, 149, 237],
      "cornsilk": [255, 248, 220],
      "crimson": [220, 20, 60],
      "cyan": [0, 255, 255],
      "darkblue": [0, 0, 139],
      "darkcyan": [0, 139, 139],
      "darkgoldenrod": [184, 134, 11],
      "darkgray": [169, 169, 169],
      "darkgreen": [0, 100, 0],
      "darkgrey": [169, 169, 169],
      "darkkhaki": [189, 183, 107],
      "darkmagenta": [139, 0, 139],
      "darkolivegreen": [85, 107, 47],
      "darkorange": [255, 140, 0],
      "darkorchid": [153, 50, 204],
      "darkred": [139, 0, 0],
      "darksalmon": [233, 150, 122],
      "darkseagreen": [143, 188, 143],
      "darkslateblue": [72, 61, 139],
      "darkslategray": [47, 79, 79],
      "darkslategrey": [47, 79, 79],
      "darkturquoise": [0, 206, 209],
      "darkviolet": [148, 0, 211],
      "deeppink": [255, 20, 147],
      "deepskyblue": [0, 191, 255],
      "dimgray": [105, 105, 105],
      "dimgrey": [105, 105, 105],
      "dodgerblue": [30, 144, 255],
      "firebrick": [178, 34, 34],
      "floralwhite": [255, 250, 240],
      "forestgreen": [34, 139, 34],
      "fuchsia": [255, 0, 255],
      "gainsboro": [220, 220, 220],
      "ghostwhite": [248, 248, 255],
      "gold": [255, 215, 0],
      "goldenrod": [218, 165, 32],
      "gray": [128, 128, 128],
      "green": [0, 128, 0],
      "greenyellow": [173, 255, 47],
      "grey": [128, 128, 128],
      "honeydew": [240, 255, 240],
      "hotpink": [255, 105, 180],
      "indianred": [205, 92, 92],
      "indigo": [75, 0, 130],
      "ivory": [255, 255, 240],
      "khaki": [240, 230, 140],
      "lavender": [230, 230, 250],
      "lavenderblush": [255, 240, 245],
      "lawngreen": [124, 252, 0],
      "lemonchiffon": [255, 250, 205],
      "lightblue": [173, 216, 230],
      "lightcoral": [240, 128, 128],
      "lightcyan": [224, 255, 255],
      "lightgoldenrodyellow": [250, 250, 210],
      "lightgray": [211, 211, 211],
      "lightgreen": [144, 238, 144],
      "lightgrey": [211, 211, 211],
      "lightpink": [255, 182, 193],
      "lightsalmon": [255, 160, 122],
      "lightseagreen": [32, 178, 170],
      "lightskyblue": [135, 206, 250],
      "lightslategray": [119, 136, 153],
      "lightslategrey": [119, 136, 153],
      "lightsteelblue": [176, 196, 222],
      "lightyellow": [255, 255, 224],
      "lime": [0, 255, 0],
      "limegreen": [50, 205, 50],
      "linen": [250, 240, 230],
      "magenta": [255, 0, 255],
      "maroon": [128, 0, 0],
      "mediumaquamarine": [102, 205, 170],
      "mediumblue": [0, 0, 205],
      "mediumorchid": [186, 85, 211],
      "mediumpurple": [147, 112, 219],
      "mediumseagreen": [60, 179, 113],
      "mediumslateblue": [123, 104, 238],
      "mediumspringgreen": [0, 250, 154],
      "mediumturquoise": [72, 209, 204],
      "mediumvioletred": [199, 21, 133],
      "midnightblue": [25, 25, 112],
      "mintcream": [245, 255, 250],
      "mistyrose": [255, 228, 225],
      "moccasin": [255, 228, 181],
      "navajowhite": [255, 222, 173],
      "navy": [0, 0, 128],
      "oldlace": [253, 245, 230],
      "olive": [128, 128, 0],
      "olivedrab": [107, 142, 35],
      "orange": [255, 165, 0],
      "orangered": [255, 69, 0],
      "orchid": [218, 112, 214],
      "palegoldenrod": [238, 232, 170],
      "palegreen": [152, 251, 152],
      "paleturquoise": [175, 238, 238],
      "palevioletred": [219, 112, 147],
      "papayawhip": [255, 239, 213],
      "peachpuff": [255, 218, 185],
      "peru": [205, 133, 63],
      "pink": [255, 192, 203],
      "plum": [221, 160, 221],
      "powderblue": [176, 224, 230],
      "purple": [128, 0, 128],
      "rebeccapurple": [102, 51, 153],
      "red": [255, 0, 0],
      "rosybrown": [188, 143, 143],
      "royalblue": [65, 105, 225],
      "saddlebrown": [139, 69, 19],
      "salmon": [250, 128, 114],
      "sandybrown": [244, 164, 96],
      "seagreen": [46, 139, 87],
      "seashell": [255, 245, 238],
      "sienna": [160, 82, 45],
      "silver": [192, 192, 192],
      "skyblue": [135, 206, 235],
      "slateblue": [106, 90, 205],
      "slategray": [112, 128, 144],
      "slategrey": [112, 128, 144],
      "snow": [255, 250, 250],
      "springgreen": [0, 255, 127],
      "steelblue": [70, 130, 180],
      "tan": [210, 180, 140],
      "teal": [0, 128, 128],
      "thistle": [216, 191, 216],
      "tomato": [255, 99, 71],
      "turquoise": [64, 224, 208],
      "violet": [238, 130, 238],
      "wheat": [245, 222, 179],
      "white": [255, 255, 255],
      "whitesmoke": [245, 245, 245],
      "yellow": [255, 255, 0],
      "yellowgreen": [154, 205, 50]
    };
  }
});
var require_conversions = __commonJS({
  "node_modules/color-convert/conversions.js"(exports, module) {
    var cssKeywords = require_color_name();
    var reverseKeywords = {};
    for (const key of Object.keys(cssKeywords)) {
      reverseKeywords[cssKeywords[key]] = key;
    }
    var convert2 = {
      rgb: { channels: 3, labels: "rgb" },
      hsl: { channels: 3, labels: "hsl" },
      hsv: { channels: 3, labels: "hsv" },
      hwb: { channels: 3, labels: "hwb" },
      cmyk: { channels: 4, labels: "cmyk" },
      xyz: { channels: 3, labels: "xyz" },
      lab: { channels: 3, labels: "lab" },
      lch: { channels: 3, labels: "lch" },
      hex: { channels: 1, labels: ["hex"] },
      keyword: { channels: 1, labels: ["keyword"] },
      ansi16: { channels: 1, labels: ["ansi16"] },
      ansi256: { channels: 1, labels: ["ansi256"] },
      hcg: { channels: 3, labels: ["h", "c", "g"] },
      apple: { channels: 3, labels: ["r16", "g16", "b16"] },
      gray: { channels: 1, labels: ["gray"] }
    };
    module.exports = convert2;
    for (const model of Object.keys(convert2)) {
      if (!("channels" in convert2[model])) {
        throw new Error("missing channels property: " + model);
      }
      if (!("labels" in convert2[model])) {
        throw new Error("missing channel labels property: " + model);
      }
      if (convert2[model].labels.length !== convert2[model].channels) {
        throw new Error("channel and label counts mismatch: " + model);
      }
      const { channels, labels } = convert2[model];
      delete convert2[model].channels;
      delete convert2[model].labels;
      Object.defineProperty(convert2[model], "channels", { value: channels });
      Object.defineProperty(convert2[model], "labels", { value: labels });
    }
    convert2.rgb.hsl = function(rgb) {
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const min = Math.min(r, g, b);
      const max = Math.max(r, g, b);
      const delta = max - min;
      let h;
      let s;
      if (max === min) {
        h = 0;
      } else if (r === max) {
        h = (g - b) / delta;
      } else if (g === max) {
        h = 2 + (b - r) / delta;
      } else if (b === max) {
        h = 4 + (r - g) / delta;
      }
      h = Math.min(h * 60, 360);
      if (h < 0) {
        h += 360;
      }
      const l = (min + max) / 2;
      if (max === min) {
        s = 0;
      } else if (l <= 0.5) {
        s = delta / (max + min);
      } else {
        s = delta / (2 - max - min);
      }
      return [h, s * 100, l * 100];
    };
    convert2.rgb.hsv = function(rgb) {
      let rdif;
      let gdif;
      let bdif;
      let h;
      let s;
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const v = Math.max(r, g, b);
      const diff = v - Math.min(r, g, b);
      const diffc = function(c) {
        return (v - c) / 6 / diff + 1 / 2;
      };
      if (diff === 0) {
        h = 0;
        s = 0;
      } else {
        s = diff / v;
        rdif = diffc(r);
        gdif = diffc(g);
        bdif = diffc(b);
        if (r === v) {
          h = bdif - gdif;
        } else if (g === v) {
          h = 1 / 3 + rdif - bdif;
        } else if (b === v) {
          h = 2 / 3 + gdif - rdif;
        }
        if (h < 0) {
          h += 1;
        } else if (h > 1) {
          h -= 1;
        }
      }
      return [
        h * 360,
        s * 100,
        v * 100
      ];
    };
    convert2.rgb.hwb = function(rgb) {
      const r = rgb[0];
      const g = rgb[1];
      let b = rgb[2];
      const h = convert2.rgb.hsl(rgb)[0];
      const w = 1 / 255 * Math.min(r, Math.min(g, b));
      b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));
      return [h, w * 100, b * 100];
    };
    convert2.rgb.cmyk = function(rgb) {
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const k = Math.min(1 - r, 1 - g, 1 - b);
      const c = (1 - r - k) / (1 - k) || 0;
      const m = (1 - g - k) / (1 - k) || 0;
      const y = (1 - b - k) / (1 - k) || 0;
      return [c * 100, m * 100, y * 100, k * 100];
    };
    function comparativeDistance(x, y) {
      return (x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2 + (x[2] - y[2]) ** 2;
    }
    convert2.rgb.keyword = function(rgb) {
      const reversed = reverseKeywords[rgb];
      if (reversed) {
        return reversed;
      }
      let currentClosestDistance = Infinity;
      let currentClosestKeyword;
      for (const keyword of Object.keys(cssKeywords)) {
        const value = cssKeywords[keyword];
        const distance = comparativeDistance(rgb, value);
        if (distance < currentClosestDistance) {
          currentClosestDistance = distance;
          currentClosestKeyword = keyword;
        }
      }
      return currentClosestKeyword;
    };
    convert2.keyword.rgb = function(keyword) {
      return cssKeywords[keyword];
    };
    convert2.rgb.xyz = function(rgb) {
      let r = rgb[0] / 255;
      let g = rgb[1] / 255;
      let b = rgb[2] / 255;
      r = r > 0.04045 ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92;
      g = g > 0.04045 ? ((g + 0.055) / 1.055) ** 2.4 : g / 12.92;
      b = b > 0.04045 ? ((b + 0.055) / 1.055) ** 2.4 : b / 12.92;
      const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
      const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
      const z = r * 0.0193 + g * 0.1192 + b * 0.9505;
      return [x * 100, y * 100, z * 100];
    };
    convert2.rgb.lab = function(rgb) {
      const xyz = convert2.rgb.xyz(rgb);
      let x = xyz[0];
      let y = xyz[1];
      let z = xyz[2];
      x /= 95.047;
      y /= 100;
      z /= 108.883;
      x = x > 8856e-6 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
      y = y > 8856e-6 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
      z = z > 8856e-6 ? z ** (1 / 3) : 7.787 * z + 16 / 116;
      const l = 116 * y - 16;
      const a = 500 * (x - y);
      const b = 200 * (y - z);
      return [l, a, b];
    };
    convert2.hsl.rgb = function(hsl) {
      const h = hsl[0] / 360;
      const s = hsl[1] / 100;
      const l = hsl[2] / 100;
      let t2;
      let t3;
      let val;
      if (s === 0) {
        val = l * 255;
        return [val, val, val];
      }
      if (l < 0.5) {
        t2 = l * (1 + s);
      } else {
        t2 = l + s - l * s;
      }
      const t1 = 2 * l - t2;
      const rgb = [0, 0, 0];
      for (let i = 0; i < 3; i++) {
        t3 = h + 1 / 3 * -(i - 1);
        if (t3 < 0) {
          t3++;
        }
        if (t3 > 1) {
          t3--;
        }
        if (6 * t3 < 1) {
          val = t1 + (t2 - t1) * 6 * t3;
        } else if (2 * t3 < 1) {
          val = t2;
        } else if (3 * t3 < 2) {
          val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
        } else {
          val = t1;
        }
        rgb[i] = val * 255;
      }
      return rgb;
    };
    convert2.hsl.hsv = function(hsl) {
      const h = hsl[0];
      let s = hsl[1] / 100;
      let l = hsl[2] / 100;
      let smin = s;
      const lmin = Math.max(l, 0.01);
      l *= 2;
      s *= l <= 1 ? l : 2 - l;
      smin *= lmin <= 1 ? lmin : 2 - lmin;
      const v = (l + s) / 2;
      const sv = l === 0 ? 2 * smin / (lmin + smin) : 2 * s / (l + s);
      return [h, sv * 100, v * 100];
    };
    convert2.hsv.rgb = function(hsv) {
      const h = hsv[0] / 60;
      const s = hsv[1] / 100;
      let v = hsv[2] / 100;
      const hi = Math.floor(h) % 6;
      const f = h - Math.floor(h);
      const p = 255 * v * (1 - s);
      const q = 255 * v * (1 - s * f);
      const t = 255 * v * (1 - s * (1 - f));
      v *= 255;
      switch (hi) {
        case 0:
          return [v, t, p];
        case 1:
          return [q, v, p];
        case 2:
          return [p, v, t];
        case 3:
          return [p, q, v];
        case 4:
          return [t, p, v];
        case 5:
          return [v, p, q];
      }
    };
    convert2.hsv.hsl = function(hsv) {
      const h = hsv[0];
      const s = hsv[1] / 100;
      const v = hsv[2] / 100;
      const vmin = Math.max(v, 0.01);
      let sl;
      let l;
      l = (2 - s) * v;
      const lmin = (2 - s) * vmin;
      sl = s * vmin;
      sl /= lmin <= 1 ? lmin : 2 - lmin;
      sl = sl || 0;
      l /= 2;
      return [h, sl * 100, l * 100];
    };
    convert2.hwb.rgb = function(hwb) {
      const h = hwb[0] / 360;
      let wh = hwb[1] / 100;
      let bl = hwb[2] / 100;
      const ratio = wh + bl;
      let f;
      if (ratio > 1) {
        wh /= ratio;
        bl /= ratio;
      }
      const i = Math.floor(6 * h);
      const v = 1 - bl;
      f = 6 * h - i;
      if ((i & 1) !== 0) {
        f = 1 - f;
      }
      const n = wh + f * (v - wh);
      let r;
      let g;
      let b;
      switch (i) {
        default:
        case 6:
        case 0:
          r = v;
          g = n;
          b = wh;
          break;
        case 1:
          r = n;
          g = v;
          b = wh;
          break;
        case 2:
          r = wh;
          g = v;
          b = n;
          break;
        case 3:
          r = wh;
          g = n;
          b = v;
          break;
        case 4:
          r = n;
          g = wh;
          b = v;
          break;
        case 5:
          r = v;
          g = wh;
          b = n;
          break;
      }
      return [r * 255, g * 255, b * 255];
    };
    convert2.cmyk.rgb = function(cmyk) {
      const c = cmyk[0] / 100;
      const m = cmyk[1] / 100;
      const y = cmyk[2] / 100;
      const k = cmyk[3] / 100;
      const r = 1 - Math.min(1, c * (1 - k) + k);
      const g = 1 - Math.min(1, m * (1 - k) + k);
      const b = 1 - Math.min(1, y * (1 - k) + k);
      return [r * 255, g * 255, b * 255];
    };
    convert2.xyz.rgb = function(xyz) {
      const x = xyz[0] / 100;
      const y = xyz[1] / 100;
      const z = xyz[2] / 100;
      let r;
      let g;
      let b;
      r = x * 3.2406 + y * -1.5372 + z * -0.4986;
      g = x * -0.9689 + y * 1.8758 + z * 0.0415;
      b = x * 0.0557 + y * -0.204 + z * 1.057;
      r = r > 31308e-7 ? 1.055 * r ** (1 / 2.4) - 0.055 : r * 12.92;
      g = g > 31308e-7 ? 1.055 * g ** (1 / 2.4) - 0.055 : g * 12.92;
      b = b > 31308e-7 ? 1.055 * b ** (1 / 2.4) - 0.055 : b * 12.92;
      r = Math.min(Math.max(0, r), 1);
      g = Math.min(Math.max(0, g), 1);
      b = Math.min(Math.max(0, b), 1);
      return [r * 255, g * 255, b * 255];
    };
    convert2.xyz.lab = function(xyz) {
      let x = xyz[0];
      let y = xyz[1];
      let z = xyz[2];
      x /= 95.047;
      y /= 100;
      z /= 108.883;
      x = x > 8856e-6 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
      y = y > 8856e-6 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
      z = z > 8856e-6 ? z ** (1 / 3) : 7.787 * z + 16 / 116;
      const l = 116 * y - 16;
      const a = 500 * (x - y);
      const b = 200 * (y - z);
      return [l, a, b];
    };
    convert2.lab.xyz = function(lab) {
      const l = lab[0];
      const a = lab[1];
      const b = lab[2];
      let x;
      let y;
      let z;
      y = (l + 16) / 116;
      x = a / 500 + y;
      z = y - b / 200;
      const y2 = y ** 3;
      const x2 = x ** 3;
      const z2 = z ** 3;
      y = y2 > 8856e-6 ? y2 : (y - 16 / 116) / 7.787;
      x = x2 > 8856e-6 ? x2 : (x - 16 / 116) / 7.787;
      z = z2 > 8856e-6 ? z2 : (z - 16 / 116) / 7.787;
      x *= 95.047;
      y *= 100;
      z *= 108.883;
      return [x, y, z];
    };
    convert2.lab.lch = function(lab) {
      const l = lab[0];
      const a = lab[1];
      const b = lab[2];
      let h;
      const hr = Math.atan2(b, a);
      h = hr * 360 / 2 / Math.PI;
      if (h < 0) {
        h += 360;
      }
      const c = Math.sqrt(a * a + b * b);
      return [l, c, h];
    };
    convert2.lch.lab = function(lch) {
      const l = lch[0];
      const c = lch[1];
      const h = lch[2];
      const hr = h / 360 * 2 * Math.PI;
      const a = c * Math.cos(hr);
      const b = c * Math.sin(hr);
      return [l, a, b];
    };
    convert2.rgb.ansi16 = function(args, saturation = null) {
      const [r, g, b] = args;
      let value = saturation === null ? convert2.rgb.hsv(args)[2] : saturation;
      value = Math.round(value / 50);
      if (value === 0) {
        return 30;
      }
      let ansi = 30 + (Math.round(b / 255) << 2 | Math.round(g / 255) << 1 | Math.round(r / 255));
      if (value === 2) {
        ansi += 60;
      }
      return ansi;
    };
    convert2.hsv.ansi16 = function(args) {
      return convert2.rgb.ansi16(convert2.hsv.rgb(args), args[2]);
    };
    convert2.rgb.ansi256 = function(args) {
      const r = args[0];
      const g = args[1];
      const b = args[2];
      if (r === g && g === b) {
        if (r < 8) {
          return 16;
        }
        if (r > 248) {
          return 231;
        }
        return Math.round((r - 8) / 247 * 24) + 232;
      }
      const ansi = 16 + 36 * Math.round(r / 255 * 5) + 6 * Math.round(g / 255 * 5) + Math.round(b / 255 * 5);
      return ansi;
    };
    convert2.ansi16.rgb = function(args) {
      let color2 = args % 10;
      if (color2 === 0 || color2 === 7) {
        if (args > 50) {
          color2 += 3.5;
        }
        color2 = color2 / 10.5 * 255;
        return [color2, color2, color2];
      }
      const mult = (~~(args > 50) + 1) * 0.5;
      const r = (color2 & 1) * mult * 255;
      const g = (color2 >> 1 & 1) * mult * 255;
      const b = (color2 >> 2 & 1) * mult * 255;
      return [r, g, b];
    };
    convert2.ansi256.rgb = function(args) {
      if (args >= 232) {
        const c = (args - 232) * 10 + 8;
        return [c, c, c];
      }
      args -= 16;
      let rem;
      const r = Math.floor(args / 36) / 5 * 255;
      const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
      const b = rem % 6 / 5 * 255;
      return [r, g, b];
    };
    convert2.rgb.hex = function(args) {
      const integer = ((Math.round(args[0]) & 255) << 16) + ((Math.round(args[1]) & 255) << 8) + (Math.round(args[2]) & 255);
      const string = integer.toString(16).toUpperCase();
      return "000000".substring(string.length) + string;
    };
    convert2.hex.rgb = function(args) {
      const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
      if (!match) {
        return [0, 0, 0];
      }
      let colorString = match[0];
      if (match[0].length === 3) {
        colorString = colorString.split("").map((char) => {
          return char + char;
        }).join("");
      }
      const integer = parseInt(colorString, 16);
      const r = integer >> 16 & 255;
      const g = integer >> 8 & 255;
      const b = integer & 255;
      return [r, g, b];
    };
    convert2.rgb.hcg = function(rgb) {
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const max = Math.max(Math.max(r, g), b);
      const min = Math.min(Math.min(r, g), b);
      const chroma = max - min;
      let grayscale;
      let hue;
      if (chroma < 1) {
        grayscale = min / (1 - chroma);
      } else {
        grayscale = 0;
      }
      if (chroma <= 0) {
        hue = 0;
      } else if (max === r) {
        hue = (g - b) / chroma % 6;
      } else if (max === g) {
        hue = 2 + (b - r) / chroma;
      } else {
        hue = 4 + (r - g) / chroma;
      }
      hue /= 6;
      hue %= 1;
      return [hue * 360, chroma * 100, grayscale * 100];
    };
    convert2.hsl.hcg = function(hsl) {
      const s = hsl[1] / 100;
      const l = hsl[2] / 100;
      const c = l < 0.5 ? 2 * s * l : 2 * s * (1 - l);
      let f = 0;
      if (c < 1) {
        f = (l - 0.5 * c) / (1 - c);
      }
      return [hsl[0], c * 100, f * 100];
    };
    convert2.hsv.hcg = function(hsv) {
      const s = hsv[1] / 100;
      const v = hsv[2] / 100;
      const c = s * v;
      let f = 0;
      if (c < 1) {
        f = (v - c) / (1 - c);
      }
      return [hsv[0], c * 100, f * 100];
    };
    convert2.hcg.rgb = function(hcg) {
      const h = hcg[0] / 360;
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      if (c === 0) {
        return [g * 255, g * 255, g * 255];
      }
      const pure = [0, 0, 0];
      const hi = h % 1 * 6;
      const v = hi % 1;
      const w = 1 - v;
      let mg = 0;
      switch (Math.floor(hi)) {
        case 0:
          pure[0] = 1;
          pure[1] = v;
          pure[2] = 0;
          break;
        case 1:
          pure[0] = w;
          pure[1] = 1;
          pure[2] = 0;
          break;
        case 2:
          pure[0] = 0;
          pure[1] = 1;
          pure[2] = v;
          break;
        case 3:
          pure[0] = 0;
          pure[1] = w;
          pure[2] = 1;
          break;
        case 4:
          pure[0] = v;
          pure[1] = 0;
          pure[2] = 1;
          break;
        default:
          pure[0] = 1;
          pure[1] = 0;
          pure[2] = w;
      }
      mg = (1 - c) * g;
      return [
        (c * pure[0] + mg) * 255,
        (c * pure[1] + mg) * 255,
        (c * pure[2] + mg) * 255
      ];
    };
    convert2.hcg.hsv = function(hcg) {
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      const v = c + g * (1 - c);
      let f = 0;
      if (v > 0) {
        f = c / v;
      }
      return [hcg[0], f * 100, v * 100];
    };
    convert2.hcg.hsl = function(hcg) {
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      const l = g * (1 - c) + 0.5 * c;
      let s = 0;
      if (l > 0 && l < 0.5) {
        s = c / (2 * l);
      } else if (l >= 0.5 && l < 1) {
        s = c / (2 * (1 - l));
      }
      return [hcg[0], s * 100, l * 100];
    };
    convert2.hcg.hwb = function(hcg) {
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      const v = c + g * (1 - c);
      return [hcg[0], (v - c) * 100, (1 - v) * 100];
    };
    convert2.hwb.hcg = function(hwb) {
      const w = hwb[1] / 100;
      const b = hwb[2] / 100;
      const v = 1 - b;
      const c = v - w;
      let g = 0;
      if (c < 1) {
        g = (v - c) / (1 - c);
      }
      return [hwb[0], c * 100, g * 100];
    };
    convert2.apple.rgb = function(apple) {
      return [apple[0] / 65535 * 255, apple[1] / 65535 * 255, apple[2] / 65535 * 255];
    };
    convert2.rgb.apple = function(rgb) {
      return [rgb[0] / 255 * 65535, rgb[1] / 255 * 65535, rgb[2] / 255 * 65535];
    };
    convert2.gray.rgb = function(args) {
      return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
    };
    convert2.gray.hsl = function(args) {
      return [0, 0, args[0]];
    };
    convert2.gray.hsv = convert2.gray.hsl;
    convert2.gray.hwb = function(gray) {
      return [0, 100, gray[0]];
    };
    convert2.gray.cmyk = function(gray) {
      return [0, 0, 0, gray[0]];
    };
    convert2.gray.lab = function(gray) {
      return [gray[0], 0, 0];
    };
    convert2.gray.hex = function(gray) {
      const val = Math.round(gray[0] / 100 * 255) & 255;
      const integer = (val << 16) + (val << 8) + val;
      const string = integer.toString(16).toUpperCase();
      return "000000".substring(string.length) + string;
    };
    convert2.rgb.gray = function(rgb) {
      const val = (rgb[0] + rgb[1] + rgb[2]) / 3;
      return [val / 255 * 100];
    };
  }
});
var require_route = __commonJS({
  "node_modules/color-convert/route.js"(exports, module) {
    var conversions = require_conversions();
    function buildGraph() {
      const graph2 = {};
      const models = Object.keys(conversions);
      for (let len = models.length, i = 0; i < len; i++) {
        graph2[models[i]] = {
          // http://jsperf.com/1-vs-infinity
          // micro-opt, but this is simple.
          distance: -1,
          parent: null
        };
      }
      return graph2;
    }
    function deriveBFS(fromModel) {
      const graph2 = buildGraph();
      const queue = [fromModel];
      graph2[fromModel].distance = 0;
      while (queue.length) {
        const current = queue.pop();
        const adjacents = Object.keys(conversions[current]);
        for (let len = adjacents.length, i = 0; i < len; i++) {
          const adjacent = adjacents[i];
          const node = graph2[adjacent];
          if (node.distance === -1) {
            node.distance = graph2[current].distance + 1;
            node.parent = current;
            queue.unshift(adjacent);
          }
        }
      }
      return graph2;
    }
    function link(from, to) {
      return function(args) {
        return to(from(args));
      };
    }
    function wrapConversion(toModel, graph2) {
      const path = [graph2[toModel].parent, toModel];
      let fn = conversions[graph2[toModel].parent][toModel];
      let cur = graph2[toModel].parent;
      while (graph2[cur].parent) {
        path.unshift(graph2[cur].parent);
        fn = link(conversions[graph2[cur].parent][cur], fn);
        cur = graph2[cur].parent;
      }
      fn.conversion = path;
      return fn;
    }
    module.exports = function(fromModel) {
      const graph2 = deriveBFS(fromModel);
      const conversion = {};
      const models = Object.keys(graph2);
      for (let len = models.length, i = 0; i < len; i++) {
        const toModel = models[i];
        const node = graph2[toModel];
        if (node.parent === null) {
          continue;
        }
        conversion[toModel] = wrapConversion(toModel, graph2);
      }
      return conversion;
    };
  }
});
var require_color_convert = __commonJS({
  "node_modules/color-convert/index.js"(exports, module) {
    var conversions = require_conversions();
    var route = require_route();
    var convert2 = {};
    var models = Object.keys(conversions);
    function wrapRaw(fn) {
      const wrappedFn = function(...args) {
        const arg0 = args[0];
        if (arg0 === void 0 || arg0 === null) {
          return arg0;
        }
        if (arg0.length > 1) {
          args = arg0;
        }
        return fn(args);
      };
      if ("conversion" in fn) {
        wrappedFn.conversion = fn.conversion;
      }
      return wrappedFn;
    }
    function wrapRounded(fn) {
      const wrappedFn = function(...args) {
        const arg0 = args[0];
        if (arg0 === void 0 || arg0 === null) {
          return arg0;
        }
        if (arg0.length > 1) {
          args = arg0;
        }
        const result = fn(args);
        if (typeof result === "object") {
          for (let len = result.length, i = 0; i < len; i++) {
            result[i] = Math.round(result[i]);
          }
        }
        return result;
      };
      if ("conversion" in fn) {
        wrappedFn.conversion = fn.conversion;
      }
      return wrappedFn;
    }
    models.forEach((fromModel) => {
      convert2[fromModel] = {};
      Object.defineProperty(convert2[fromModel], "channels", { value: conversions[fromModel].channels });
      Object.defineProperty(convert2[fromModel], "labels", { value: conversions[fromModel].labels });
      const routes = route(fromModel);
      const routeModels = Object.keys(routes);
      routeModels.forEach((toModel) => {
        const fn = routes[toModel];
        convert2[fromModel][toModel] = wrapRounded(fn);
        convert2[fromModel][toModel].raw = wrapRaw(fn);
      });
    });
    module.exports = convert2;
  }
});
const __vite__cjsImport0_colorConvert = require_color_convert();
const convert = __vite__cjsImport0_colorConvert;
var colors = {
  "A": color("#370F5E"),
  "B": color("#9257e6")
};
function setColor(col2, color2) {
  var c;
  if (color2.startsWith("rgb")) {
    c = hexToRgb(convert.rgb.hex(color2));
  } else if (color2.startsWith("#")) {
    c = hexToRgb(color2);
  } else {
    c = hexToRgb(convert.keyword.hex(color2));
  }
  colors[col2] = c;
  console.log(colors[col2]);
}
function getColor(col2) {
  return colors[col2];
}
function color(hex) {
  var result = hexToRgb(hex);
  return result;
}
function hexToRgb(hex) {
  var c = hex.substring(1);
  var r = parseInt(c.slice(0, 2), 16), g = parseInt(c.slice(2, 4), 16), b = parseInt(c.slice(4, 6), 16);
  var result = [r / 255, g / 255, b / 255];
  return result;
}
const Col = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  color,
  getColor,
  setColor
}, Symbol.toStringTag, { value: "Module" }));
var margin = { top: 5, right: 5, bottom: 5, left: 5 }, width$1 = 125 - margin.left - margin.right, height$1 = 50 - margin.top - margin.bottom;
var svg = d3.select("#graphParams").append("svg").attr("width", width$1 + margin.left + margin.right).attr("height", height$1 + margin.left + margin.right).append("g").attr(
  "transform",
  "translate(" + margin.left + "," + margin.top + ")"
);
var xMin = 0, xMax = 10;
var data = [];
function update(uVar2, t) {
  for (let v in uVar2) {
    var dataPoint = {
      time: t / 100,
      type: v,
      val: uVar2[v][0]
    };
    data.push(dataPoint);
  }
  let numOfV = 4;
  while (data.length > 10 * numOfV) {
    data.shift();
  }
  if (data.length === 10 * numOfV) {
    xMax++;
    xMin++;
  }
  makeGraph();
}
function makeGraph() {
  var audioDur = document.querySelector("audio").duration;
  var sumstat = d3.nest().key(function(d) {
    return d.type;
  }).entries(data);
  var res = sumstat.map(function(d) {
    return d.type;
  });
  var color2 = d3.scaleOrdinal().domain(res).range(["#e41a1c", "#377eb8", "#4daf4a", "#984ea3"]);
  var x = d3.scaleTime().domain([xMin, xMax]).range([0, width$1]);
  svg.append("g").attr("transform", "translate(0," + height$1 + ")").call(d3.axisBottom(x).ticks(10));
  var y = d3.scaleLinear().domain([0, 1]).range([height$1, 0]);
  svg.append("g").call(d3.axisLeft(y));
  d3.selectAll("path.line").remove();
  svg.selectAll(".line").data(sumstat).enter().append("path").attr("class", "line").attr("fill", "none").attr("stroke", function(d) {
    return color2(d.key);
  }).attr("stroke-width", 1).attr("d", function(d) {
    return d3.line().x(function(d2) {
      return x(d2.time);
    }).y(function(d2) {
      return y(d2.val);
    })(d.values);
  });
}
const Graph = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  makeGraph,
  update
}, Symbol.toStringTag, { value: "Module" }));
var require_settings = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/settings.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.settings = void 0;
    exports.settings = {
      /**
       * set to 1 if you want reasonable logging for debugging, such as the
       * generated GLSL code and program tree. set to 100 if you want texture debug
       * info (you probably don't want to do this, as it logs many lines every
       * frame!)
       */
      verbosity: 0,
      /** texture offset */
      offset: 0
    };
  }
});
var require_webglprogramloop = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/webglprogramloop.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebGLProgramLoop = exports.WebGLProgramLeaf = exports.updateNeeds = void 0;
    var settings_1 = require_settings();
    function updateNeeds(acc, curr) {
      return {
        neighborSample: acc.neighborSample || curr.neighborSample,
        centerSample: acc.centerSample || curr.centerSample,
        sceneBuffer: acc.sceneBuffer || curr.sceneBuffer,
        timeUniform: acc.timeUniform || curr.timeUniform,
        mouseUniform: acc.mouseUniform || curr.mouseUniform,
        passCount: acc.passCount || curr.passCount,
        extraBuffers: /* @__PURE__ */ new Set([...acc.extraBuffers, ...curr.extraBuffers])
      };
    }
    exports.updateNeeds = updateNeeds;
    var WebGLProgramLeaf = class {
      constructor(program, totalNeeds, effects2) {
        this.program = program;
        this.totalNeeds = totalNeeds;
        this.effects = effects2;
      }
    };
    exports.WebGLProgramLeaf = WebGLProgramLeaf;
    function getLoc(programElement, gl2, name) {
      gl2.useProgram(programElement.program);
      const loc = gl2.getUniformLocation(programElement.program, name);
      if (loc === null) {
        throw new Error("could not get the " + name + " uniform location");
      }
      return loc;
    }
    var WebGLProgramLoop = class {
      constructor(programElement, loopInfo, gl2) {
        this.last = false;
        this.counter = 0;
        this.programElement = programElement;
        this.loopInfo = loopInfo;
        if (this.programElement instanceof WebGLProgramLeaf) {
          if (gl2 === void 0) {
            throw new Error("program element is a program but context is undefined");
          }
          if (this.programElement.totalNeeds.timeUniform) {
            this.timeLoc = getLoc(this.programElement, gl2, "uTime");
          }
          if (this.programElement.totalNeeds.mouseUniform) {
            this.mouseLoc = getLoc(this.programElement, gl2, "uMouse");
          }
          if (this.programElement.totalNeeds.passCount) {
            this.countLoc = getLoc(this.programElement, gl2, "uCount");
          }
        }
      }
      /** get all needs from all programs */
      getTotalNeeds() {
        if (!(this.programElement instanceof WebGLProgramLeaf)) {
          const allNeeds = [];
          for (const p of this.programElement) {
            allNeeds.push(p.getTotalNeeds());
          }
          return allNeeds.reduce(updateNeeds);
        }
        return this.programElement.totalNeeds;
      }
      /**
       * recursively uses all programs in the loop, binding the appropriate
       * textures and setting the appropriate uniforms; the user should only have
       * to call [[draw]] on [[Merger]] and never this function directly
       */
      run(gl2, tex, framebuffer2, uniformLocs, last, defaultUniforms, outerLoop) {
        let savedTexture;
        if (this.loopInfo.target !== void 0 && // if there is a target switch:
        (outerLoop === null || outerLoop === void 0 ? void 0 : outerLoop.loopInfo.target) !== this.loopInfo.target) {
          savedTexture = tex.back;
          if (this.loopInfo.target !== -1) {
            tex.back = tex.bufTextures[this.loopInfo.target];
          } else {
            if (tex.scene === void 0) {
              throw new Error("tried to target -1 but scene texture was undefined");
            }
            tex.back = tex.scene;
          }
          tex.bufTextures[this.loopInfo.target] = savedTexture;
          if (settings_1.settings.verbosity > 99)
            console.log("saved texture: " + savedTexture.name);
        }
        if (this.programElement instanceof WebGLProgramLeaf) {
          if (this.programElement.totalNeeds.sceneBuffer) {
            if (tex.scene === void 0) {
              throw new Error("needs scene buffer, but scene texture is somehow undefined");
            }
            gl2.activeTexture(gl2.TEXTURE1 + settings_1.settings.offset);
            if (this.loopInfo.target === -1) {
              gl2.bindTexture(gl2.TEXTURE_2D, savedTexture.tex);
            } else {
              gl2.bindTexture(gl2.TEXTURE_2D, tex.scene.tex);
            }
          }
          for (const n of this.programElement.totalNeeds.extraBuffers) {
            gl2.activeTexture(gl2.TEXTURE2 + n + settings_1.settings.offset);
            gl2.bindTexture(gl2.TEXTURE_2D, tex.bufTextures[n].tex);
          }
          gl2.useProgram(this.programElement.program);
          for (const effect of this.programElement.effects) {
            effect.applyUniforms(gl2, uniformLocs);
          }
          if (this.programElement.totalNeeds.timeUniform) {
            if (this.timeLoc === void 0 || defaultUniforms.timeVal === void 0) {
              throw new Error("time or location is undefined");
            }
            gl2.uniform1f(this.timeLoc, defaultUniforms.timeVal);
          }
          if (this.programElement.totalNeeds.mouseUniform) {
            if (this.mouseLoc === void 0 || defaultUniforms.mouseX === void 0 || defaultUniforms.mouseY === void 0) {
              throw new Error("mouse uniform or location is undefined");
            }
            gl2.uniform2f(this.mouseLoc, defaultUniforms.mouseX, defaultUniforms.mouseY);
          }
          if (this.programElement.totalNeeds.passCount && outerLoop !== void 0) {
            if (this.countLoc === void 0) {
              throw new Error("count location is undefined");
            }
            if (outerLoop !== void 0) {
              gl2.uniform1i(this.countLoc, outerLoop.counter);
            }
            this.counter++;
            const mod = outerLoop === void 0 ? 1 : outerLoop.loopInfo.num;
            this.counter %= mod;
          }
        }
        for (let i = 0; i < this.loopInfo.num; i++) {
          const newLast = i === this.loopInfo.num - 1;
          if (this.programElement instanceof WebGLProgramLeaf) {
            if (newLast && last && this.last) {
              gl2.bindFramebuffer(gl2.FRAMEBUFFER, null);
            } else {
              gl2.bindFramebuffer(gl2.FRAMEBUFFER, framebuffer2);
              gl2.framebufferTexture2D(gl2.FRAMEBUFFER, gl2.COLOR_ATTACHMENT0, gl2.TEXTURE_2D, tex.front.tex, 0);
            }
            gl2.activeTexture(gl2.TEXTURE0 + settings_1.settings.offset);
            gl2.bindTexture(gl2.TEXTURE_2D, tex.back.tex);
            gl2.drawArrays(gl2.TRIANGLES, 0, 6);
            if (settings_1.settings.verbosity > 99) {
              console.log("intermediate back", tex.back.name);
              console.log("intermediate front", tex.front.name);
            }
            [tex.back, tex.front] = [tex.front, tex.back];
            for (const n of this.programElement.totalNeeds.extraBuffers) {
              gl2.activeTexture(gl2.TEXTURE2 + n + settings_1.settings.offset);
              gl2.bindTexture(gl2.TEXTURE_2D, null);
            }
            gl2.activeTexture(gl2.TEXTURE1 + settings_1.settings.offset);
            gl2.bindTexture(gl2.TEXTURE_2D, null);
          } else {
            if (this.loopInfo.func !== void 0) {
              this.loopInfo.func(i);
            }
            for (const p of this.programElement) {
              p.run(
                gl2,
                tex,
                framebuffer2,
                uniformLocs,
                newLast,
                defaultUniforms,
                this
                // this is now the outer loop
              );
            }
          }
        }
        if (savedTexture !== void 0) {
          const target = this.loopInfo.target;
          if (settings_1.settings.verbosity > 99) {
            console.log("pre final back", tex.back.name);
            console.log("pre final front", tex.front.name);
          }
          if (this.loopInfo.target !== -1) {
            tex.bufTextures[target] = tex.back;
          } else {
            if (tex.scene === void 0) {
              throw new Error("tried to replace -1 but scene texture was undefined");
            }
            tex.scene = tex.back;
          }
          tex.back = savedTexture;
          if (settings_1.settings.verbosity > 99) {
            console.log("post final back", tex.back.name);
            console.log("post final front", tex.front.name);
            console.log("channel texture", tex.bufTextures[target].name);
          }
        }
      }
      delete(gl2) {
        if (this.programElement instanceof WebGLProgramLeaf) {
          gl2.deleteProgram(this.programElement.program);
        } else {
          for (const p of this.programElement) {
            p.delete(gl2);
          }
        }
      }
    };
    exports.WebGLProgramLoop = WebGLProgramLoop;
  }
});
var require_glslfunctions = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/glslfunctions.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.glslFuncs = void 0;
    exports.glslFuncs = {
      // TODO bad to calculate single pixel width every time; maybe it can be a need
      texture2D_region: `vec4 texture2D_region(
  float r_x_min,
  float r_y_min,
  float r_x_max,
  float r_y_max,
  sampler2D sampler,
  vec2 uv
) {
  vec2 d = vec2(1., 1.) / uResolution; // pixel width
  return texture2D(sampler, clamp(uv, vec2(r_x_min + d.x, r_y_min + d.x), vec2(r_x_max - d.y, r_y_max - d.y)));
}`,
      // TODO replace with a better one
      // adapted from The Book of Shaders
      random: `float random(vec2 st) {
  return fract(sin(dot(st.xy / 99., vec2(12.9898, 78.233))) * 43758.5453123);
}`,
      // adapted from The Book of Shaders
      random2: `vec2 random2(vec2 st) {
  st = vec2(dot(st,vec2(127.1,311.7)), dot(st,vec2(269.5,183.3)));
  return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}`,
      rotate2d: `vec2 rotate2d(vec2 v, float angle) {
  return mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * v;
}`,
      // adapted from The Book of Shaders
      hsv2rgb: `vec4 hsv2rgb(vec4 co){
  vec3 c = co.xyz;
  vec3 rgb = clamp(abs(mod(
    c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  rgb = rgb * rgb * (3.0 - 2.0 * rgb);
  vec3 hsv = c.z * mix(vec3(1.0), rgb, c.y);
  return vec4(hsv.x, hsv.y, hsv.z, co.a);
}`,
      // adapted from The Book of Shaders
      rgb2hsv: `vec4 rgb2hsv(vec4 co){
  vec3 c = co.rgb;
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec4(abs(q.z + (q.w - q.y) / (6.0 * d + e)),
              d / (q.x + e),
              q.x, co.a);
}`,
      // all gaussian blurs adapted from:
      // https://github.com/Jam3/glsl-fast-gaussian-blur/blob/master/5.glsl
      gauss5: `vec4 gauss5(vec2 dir) {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec4 col = vec4(0.0);
  vec2 off1 = vec2(1.3333333333333333) * dir;
  col += texture2D(uSampler, uv) * 0.29411764705882354;
  col += texture2D(uSampler, uv + (off1 / uResolution)) * 0.35294117647058826;
  col += texture2D(uSampler, uv - (off1 / uResolution)) * 0.35294117647058826;
  return col;
}`,
      gauss9: `vec4 gauss9(vec2 dir) {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec4 col = vec4(0.0);
  vec2 off1 = vec2(1.3846153846) * dir;
  vec2 off2 = vec2(3.2307692308) * dir;
  col += texture2D(uSampler, uv) * 0.2270270270;
  col += texture2D(uSampler, uv + (off1 / uResolution)) * 0.3162162162;
  col += texture2D(uSampler, uv - (off1 / uResolution)) * 0.3162162162;
  col += texture2D(uSampler, uv + (off2 / uResolution)) * 0.0702702703;
  col += texture2D(uSampler, uv - (off2 / uResolution)) * 0.0702702703;
  return col;
}`,
      gauss13: `vec4 gauss13(vec2 dir) {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec4 col = vec4(0.0);
  vec2 off1 = vec2(1.411764705882353) * dir;
  vec2 off2 = vec2(3.2941176470588234) * dir;
  vec2 off3 = vec2(5.176470588235294) * dir;
  col += texture2D(uSampler, uv) * 0.1964825501511404;
  col += texture2D(uSampler, uv + (off1 / uResolution)) * 0.2969069646728344;
  col += texture2D(uSampler, uv - (off1 / uResolution)) * 0.2969069646728344;
  col += texture2D(uSampler, uv + (off2 / uResolution)) * 0.09447039785044732;
  col += texture2D(uSampler, uv - (off2 / uResolution)) * 0.09447039785044732;
  col += texture2D(uSampler, uv + (off3 / uResolution)) * 0.010381362401148057;
  col += texture2D(uSampler, uv - (off3 / uResolution)) * 0.010381362401148057;
  return col;
}`,
      contrast: `vec4 contrast(float val, vec4 col) {
  col.rgb /= col.a;
  col.rgb = ((col.rgb - 0.5) * val) + 0.5;
  col.rgb *= col.a;
  return col;
}`,
      brightness: `vec4 brightness(float val, vec4 col) {
  col.rgb /= col.a;
  col.rgb += val;
  col.rgb *= col.a;
  return col;
}`,
      // adapted from https://www.shadertoy.com/view/ls3GWS which was adapted from
      // http://www.geeks3d.com/20110405/fxaa-fast-approximate-anti-aliasing-demo-glsl-opengl-test-radeon-geforce/3/
      // original algorithm created by Timothy Lottes
      fxaa: `vec4 fxaa() {
  float FXAA_SPAN_MAX = 8.0;
  float FXAA_REDUCE_MUL = 1.0 / FXAA_SPAN_MAX;
  float FXAA_REDUCE_MIN = 1.0 / 128.0;
  float FXAA_SUBPIX_SHIFT = 1.0 / 4.0;

  vec2 rcpFrame = 1. / uResolution.xy;
  vec2 t_uv = gl_FragCoord.xy / uResolution.xy; 
  vec4 uv = vec4(t_uv, t_uv - (rcpFrame * (0.5 + FXAA_SUBPIX_SHIFT)));

  vec3 rgbNW = texture2D(uSampler, uv.zw).xyz;
  vec3 rgbNE = texture2D(uSampler, uv.zw + vec2(1,0) * rcpFrame.xy).xyz;
  vec3 rgbSW = texture2D(uSampler, uv.zw + vec2(0,1) * rcpFrame.xy).xyz;
  vec3 rgbSE = texture2D(uSampler, uv.zw + vec2(1,1) * rcpFrame.xy).xyz;
  vec4 rgbMfull = texture2D(uSampler, uv.xy);
  vec3 rgbM = rgbMfull.xyz;
  float alpha = rgbMfull.a;

  vec3 luma = vec3(0.299, 0.587, 0.114);
  float lumaNW = dot(rgbNW, luma);
  float lumaNE = dot(rgbNE, luma);
  float lumaSW = dot(rgbSW, luma);
  float lumaSE = dot(rgbSE, luma);
  float lumaM = dot(rgbM,  luma);

  float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));
  float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));

  vec2 dir;
  dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));
  dir.y = ((lumaNW + lumaSW) - (lumaNE + lumaSE));

  float dirReduce = max(
    (lumaNW + lumaNE + lumaSW + lumaSE) * (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);
  float rcpDirMin = 1.0/(min(abs(dir.x), abs(dir.y)) + dirReduce);

  dir = min(vec2(FXAA_SPAN_MAX,  FXAA_SPAN_MAX),
    max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),
    dir * rcpDirMin)) * rcpFrame.xy;

  vec3 rgbA = (1.0 / 2.0) * (
    texture2D(uSampler, uv.xy + dir * (1.0 / 3.0 - 0.5)).xyz +
    texture2D(uSampler, uv.xy + dir * (2.0 / 3.0 - 0.5)).xyz);
  vec3 rgbB = rgbA * (1.0 / 2.0) + (1.0 / 4.0) * (
    texture2D(uSampler, uv.xy + dir * (0.0 / 3.0 - 0.5)).xyz +
    texture2D(uSampler, uv.xy + dir * (3.0 / 3.0 - 0.5)).xyz);

  float lumaB = dot(rgbB, luma);

  if (lumaB < lumaMin || lumaB > lumaMax) {
    return vec4(rgbA.r, rgbA.g, rgbA.b, alpha);
  }

  return vec4(rgbB.r, rgbB.g, rgbB.b, alpha);
}`,
      // normal curve is a = 0 and b = 1
      gaussian: `float gaussian(float x, float a, float b) {
  float e = 2.71828;
  return pow(e, -pow(x - a, 2.) / b);
}`,
      // for calculating the true distance from 0 to 1 depth buffer
      // the small delta is to prevent division by zero, which is undefined behavior
      truedepth: `float truedepth(float i) {
  i = max(i, 0.00000001);
  return (1. - i) / i;
}`,
      // based off of https://fabiensanglard.net/lightScattering/index.php
      godrays: `vec4 godrays(
  vec4 col,
  float exposure,
  float decay,
  float density,
  float weight,
  vec2 lightPos,
  float threshold,
  vec4 newColor
) {
  vec2 texCoord = gl_FragCoord.xy / uResolution;
  vec2 deltaTexCoord = texCoord - lightPos;

  const int NUM_SAMPLES = 100;
  deltaTexCoord *= 1. / float(NUM_SAMPLES) * density;
  float illuminationDecay = 1.0;

  for (int i=0; i < NUM_SAMPLES; i++) {
    texCoord -= deltaTexCoord;
    vec4 sample = texture2D(uSampler, texCoord);
    //uncomment sample = depth2occlusion(sample, newColor, threshold);
    sample *= illuminationDecay * weight;
    col += sample;
    illuminationDecay *= decay;
  }
  return col * exposure;
}`,
      depth2occlusion: `vec4 depth2occlusion(vec4 depthCol, vec4 newCol, float threshold) {
  float red = 1. - ceil(depthCol.r - threshold);
  return vec4(newCol.rgb * red, 1.0);
}`,
      // adapted from The Book of Shaders, which was adapted from Inigo Quilez
      // from this example: https://www.shadertoy.com/view/XdXGW8
      gradientnoise: `float gradientnoise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(mix(dot(random2(i + vec2(0.0,0.0)), f - vec2(0.0, 0.0)),
                     dot(random2(i + vec2(1.0,0.0)), f - vec2(1.0, 0.0)), u.x),
             mix(dot(random2(i + vec2(0.0,1.0)), f - vec2(0.0, 1.0)),
                 dot(random2(i + vec2(1.0,1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
}`,
      // adapted from The Book of Shaders
      // https://thebookofshaders.com/edit.php#11/2d-snoise-clear.frag
      // this was adapted from this fast implementation
      // https://github.com/ashima/webgl-noise
      // simplex noise invented by Ken Perlin
      simplexnoise: `float simplexnoise(vec2 v) {
  // Precompute values for skewed triangular grid
  const vec4 C = vec4(0.211324865405187,
                      // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,
                      // 0.5*(sqrt(3.0)-1.0)
                      -0.577350269189626,
                      // -1.0 + 2.0 * C.x
                      0.024390243902439);
                      // 1.0 / 41.0

  // First corner (x0)
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);

  // Other two corners (x1, x2)
  vec2 i1 = vec2(0.0);
  i1 = (x0.x > x0.y)? vec2(1.0, 0.0):vec2(0.0, 1.0);
  vec2 x1 = x0.xy + C.xx - i1;
  vec2 x2 = x0.xy + C.zz;

  // Do some permutations to avoid
  // truncation effects in permutation
  i = mod289_2(i);
  vec3 p = permute(
          permute( i.y + vec3(0.0, i1.y, 1.0))
              + i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(
                      dot(x0,x0),
                      dot(x1,x1),
                      dot(x2,x2)
                      ), 0.0);

  m = m*m ;
  m = m*m ;

  // Gradients:
  //  41 pts uniformly over a line, mapped onto a diamond
  //  The ring size 17*17 = 289 is close to a multiple
  //      of 41 (41*7 = 287)

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  // Normalise gradients implicitly by scaling m
  // Approximation of: m *= inversesqrt(a0*a0 + h*h);
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);

  // Compute final noise value at P
  vec3 g = vec3(0.0);
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);
  return 130.0 * dot(m, g);
}`,
      // only useful for simplex noise
      simplexhelpers: `vec3 mod289_3(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289_2(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289_3(((x*34.0)+1.0)*x); }`,
      // sobel adapted from https://gist.github.com/Hebali/6ebfc66106459aacee6a9fac029d0115
      sobel: `vec4 sobel() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec4 k[8];

  float w = 1. / uResolution.x;
  float h = 1. / uResolution.y;

  k[0] = texture2D(uSampler, uv + vec2(-w, -h));
  k[1] = texture2D(uSampler, uv + vec2(0., -h));
  k[2] = texture2D(uSampler, uv + vec2(w, -h));
  k[3] = texture2D(uSampler, uv + vec2(-w, 0.));

  k[4] = texture2D(uSampler, uv + vec2(w, 0.));
  k[5] = texture2D(uSampler, uv + vec2(-w, h));
  k[6] = texture2D(uSampler, uv + vec2(0., h));
  k[7] = texture2D(uSampler, uv + vec2(w, h));

  vec4 edge_h = k[2] + (2. * k[4]) + k[7] - (k[0] + (2. * k[3]) + k[5]);
  vec4 edge_v = k[0] + (2. * k[1]) + k[2] - (k[5] + (2. * k[6]) + k[7]);
  vec4 sob = sqrt(edge_h * edge_h + edge_v * edge_v);

  return vec4(1. - sob.rgb, 1.);
}`,
      // inlining a similar function will substitute in the full expression for
      // every component, so it's more efficient to have a function
      monochrome: `vec4 monochrome(vec4 col) {
  return vec4(vec3((col.r + col.g + col.b) / 3.), col.a);
}`,
      invert: `vec4 invert(vec4 col) {
  return vec4(vec3(1., 1., 1.) - col.rgb, col.a);
}`,
      channel: `vec4 channel(vec2 uv, sampler2D sampler) {
  return texture2D(sampler, uv);
}`
    };
  }
});
var require_utils = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.brandWithRegion = exports.brandWithChannel = exports.captureAndAppend = void 0;
    var glslfunctions_1 = require_glslfunctions();
    function captureAndAppend(str, reg, suffix) {
      const matches = str.match(reg);
      if (matches === null)
        throw new Error("no match in the given string");
      return str.replace(reg, matches[0] + suffix);
    }
    exports.captureAndAppend = captureAndAppend;
    function nameExtractor(sourceLists, extra) {
      const origFuncName = sourceLists.sections[0];
      const ending = origFuncName[origFuncName.length - 1] === ")" ? ")" : "";
      const newFuncName = origFuncName.substr(0, origFuncName.length - 1 - ~~(ending === ")")) + extra + "(" + ending;
      return { origFuncName, newFuncName, ending };
    }
    function brandWithChannel(sourceLists, funcs, needs, funcIndex, samplerNum) {
      samplerNum === void 0 || samplerNum === -1 ? needs.neighborSample = true : needs.extraBuffers = /* @__PURE__ */ new Set([samplerNum]);
      if (samplerNum === void 0 || samplerNum === -1)
        return;
      const { origFuncName, newFuncName, ending } = nameExtractor(sourceLists, samplerNum !== void 0 ? "_" + samplerNum : "");
      sourceLists.sections[0] = sourceLists.sections[0].split(origFuncName).join(newFuncName);
      funcs[funcIndex] = funcs[funcIndex].split(origFuncName).join(newFuncName).split("uSampler").join("uBufferSampler" + samplerNum);
    }
    exports.brandWithChannel = brandWithChannel;
    function brandWithRegion(expr, funcIndex, space) {
      if (!Array.isArray(space))
        return;
      const sourceLists = expr.sourceLists;
      const funcs = expr.externalFuncs;
      const needs = expr.needs;
      if (expr.regionBranded || !needs.neighborSample && needs.extraBuffers.size === 0)
        return;
      const { origFuncName, newFuncName, ending } = nameExtractor(sourceLists, "_region");
      const openFuncName = newFuncName.substr(0, newFuncName.length - ~~(ending === ")"));
      const newFuncDeclaration = openFuncName + "float r_x_min, float r_y_min, float r_x_max, float r_y_max" + (ending === ")" ? ")" : ", ");
      const origTextureName = "texture2D(";
      const newTextureName = "texture2D_region(r_x_min, r_y_min, r_x_max, r_y_max, ";
      funcs[funcIndex] = funcs[funcIndex].split(origFuncName).join(newFuncDeclaration).split(origTextureName).join(newTextureName);
      sourceLists.sections.shift();
      if (ending === ")")
        sourceLists.sections.unshift(")");
      for (let i = 0; i < 4 - ~~(ending === ")"); i++) {
        sourceLists.sections.unshift(", ");
      }
      sourceLists.sections.unshift(newFuncName.substr(0, newFuncName.length - ~~(ending === ")")));
      sourceLists.values.unshift(...space);
      funcs.unshift(glslfunctions_1.glslFuncs.texture2D_region);
      expr.regionBranded = true;
    }
    exports.brandWithRegion = brandWithRegion;
  }
});
var require_expr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/expr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.tag = exports.wrapInValue = exports.pfloat = exports.Operator = exports.WrappedExpr = exports.ExprVec4 = exports.ExprVec3 = exports.ExprVec2 = exports.float = exports.ExprFloat = exports.BasicFloat = exports.ExprVec = exports.BasicVec4 = exports.BasicVec3 = exports.BasicVec2 = exports.BasicVec = exports.PrimitiveVec4 = exports.PrimitiveVec3 = exports.PrimitiveVec2 = exports.PrimitiveVec = exports.PrimitiveFloat = exports.Primitive = exports.mut = exports.Mutable = exports.cvec4 = exports.cvec3 = exports.cvec2 = exports.cfloat = exports.Expr = void 0;
    var mergepass_1 = require_mergepass();
    var webglprogramloop_1 = require_webglprogramloop();
    var utils_1 = require_utils();
    function toGLSLFloatString(num) {
      let str = "" + num;
      if (!str.includes("."))
        str += ".";
      return str;
    }
    var Expr = class {
      constructor(sourceLists, defaultNames) {
        this.needs = {
          neighborSample: false,
          centerSample: false,
          sceneBuffer: false,
          timeUniform: false,
          mouseUniform: false,
          passCount: false,
          extraBuffers: /* @__PURE__ */ new Set()
        };
        this.uniformValChangeMap = {};
        this.defaultNameMap = {};
        this.externalFuncs = [];
        this.sourceCode = "";
        this.funcIndex = 0;
        this.regionBranded = false;
        this.id = "_id_" + Expr.count;
        Expr.count++;
        if (sourceLists.sections.length - sourceLists.values.length !== 1) {
          throw new Error("wrong lengths for source and values");
        }
        if (sourceLists.values.length !== defaultNames.length) {
          console.log(sourceLists);
          console.log(defaultNames);
          throw new Error("default names list length doesn't match values list length");
        }
        this.sourceLists = sourceLists;
        this.defaultNames = defaultNames;
      }
      applyUniforms(gl2, uniformLocs) {
        for (const name in this.uniformValChangeMap) {
          const loc = uniformLocs[name];
          if (this.uniformValChangeMap[name].changed) {
            this.uniformValChangeMap[name].val.applyUniform(gl2, loc.locs[loc.counter]);
          }
          loc.counter++;
          loc.counter %= loc.locs.length;
          if (loc.counter === 0) {
            this.uniformValChangeMap[name].changed = false;
          }
        }
      }
      getSampleNum(mult = 1) {
        return this.needs.neighborSample ? mult : this.sourceLists.values.map((v) => v.getSampleNum()).reduce((acc, curr) => acc + curr, 0) > 0 ? mult : 0;
      }
      /**
       * set a uniform by name directly
       * @param name uniform name in the source code
       * @param newVal value to set the uniform to
       */
      setUniform(name, newVal) {
        var _a, _b;
        newVal = wrapInValue(newVal);
        const originalName = name;
        if (typeof newVal === "number") {
          newVal = wrapInValue(newVal);
        }
        if (!(newVal instanceof Primitive)) {
          throw new Error("cannot set a non-primitive");
        }
        if (((_a = this.uniformValChangeMap[name]) === null || _a === void 0 ? void 0 : _a.val) === void 0) {
          name = this.defaultNameMap[name];
        }
        const oldVal = (_b = this.uniformValChangeMap[name]) === null || _b === void 0 ? void 0 : _b.val;
        if (oldVal === void 0) {
          throw new Error("tried to set uniform " + name + " which doesn't exist. original name: " + originalName);
        }
        if (oldVal.typeString() !== newVal.typeString()) {
          throw new Error("tried to set uniform " + name + " to a new type");
        }
        this.uniformValChangeMap[name].val = newVal;
        this.uniformValChangeMap[name].changed = true;
      }
      /**
       * parses this expression into a string, adding info as it recurses into
       * nested expressions
       */
      parse(buildInfo) {
        this.sourceCode = "";
        buildInfo.exprs.push(this);
        buildInfo.needs = webglprogramloop_1.updateNeeds(buildInfo.needs, this.needs);
        this.externalFuncs.forEach((func) => buildInfo.externalFuncs.add(func));
        for (let i = 0; i < this.sourceLists.values.length; i++) {
          this.sourceCode += this.sourceLists.sections[i] + this.sourceLists.values[i].parse(buildInfo, this.defaultNames[i], this);
        }
        this.sourceCode += this.sourceLists.sections[this.sourceLists.sections.length - 1];
        return this.sourceCode;
      }
      addFuncs(funcs) {
        this.externalFuncs.push(...funcs);
        return this;
      }
      brandExprWithChannel(funcIndex, samplerNum) {
        utils_1.brandWithChannel(this.sourceLists, this.externalFuncs, this.needs, funcIndex, samplerNum);
        return this;
      }
      brandExprWithRegion(space) {
        utils_1.brandWithRegion(this, this.funcIndex, space);
        for (const v of this.sourceLists.values) {
          v.brandExprWithRegion(space);
        }
        return this;
      }
    };
    exports.Expr = Expr;
    Expr.count = 0;
    function genCustomNames(sourceLists) {
      const names = [];
      for (let i = 0; i < sourceLists.values.length; i++) {
        names.push("uCustomName" + i);
      }
      return names;
    }
    function cfloat(sourceLists, externalFuncs = []) {
      return new ExprFloat(sourceLists, genCustomNames(sourceLists)).addFuncs(externalFuncs);
    }
    exports.cfloat = cfloat;
    function cvec2(sourceLists, externalFuncs = []) {
      return new ExprVec2(sourceLists, genCustomNames(sourceLists)).addFuncs(externalFuncs);
    }
    exports.cvec2 = cvec2;
    function cvec3(sourceLists, externalFuncs = []) {
      return new ExprVec3(sourceLists, genCustomNames(sourceLists)).addFuncs(externalFuncs);
    }
    exports.cvec3 = cvec3;
    function cvec4(sourceLists, externalFuncs = []) {
      return new ExprVec4(sourceLists, genCustomNames(sourceLists)).addFuncs(externalFuncs);
    }
    exports.cvec4 = cvec4;
    var Mutable = class {
      constructor(primitive, name) {
        this.primitive = primitive;
        this.name = name;
      }
      parse(buildInfo, defaultName, enc) {
        if (enc === void 0) {
          throw new Error("tried to put a mutable expression at the top level");
        }
        if (this.name === void 0)
          this.name = defaultName + enc.id;
        buildInfo.uniformTypes[this.name] = this.primitive.typeString();
        enc.uniformValChangeMap[this.name] = {
          val: this.primitive,
          changed: true
        };
        enc.defaultNameMap[defaultName + enc.id] = this.name;
        return this.name;
      }
      applyUniform(gl2, loc) {
        this.primitive.applyUniform(gl2, loc);
      }
      typeString() {
        return this.primitive.typeString();
      }
      getSampleNum() {
        return 0;
      }
      brandExprWithRegion(space) {
        return this;
      }
    };
    exports.Mutable = Mutable;
    function mut(val, name) {
      const primitive = typeof val === "number" ? wrapInValue(val) : val;
      return new Mutable(primitive, name);
    }
    exports.mut = mut;
    var Primitive = class {
      parse() {
        return this.toString();
      }
      getSampleNum() {
        return 0;
      }
      brandExprWithRegion(space) {
        return this;
      }
    };
    exports.Primitive = Primitive;
    var PrimitiveFloat = class extends Primitive {
      constructor(num) {
        if (!isFinite(num))
          throw new Error("number not finite");
        super();
        this.value = num;
      }
      toString() {
        let str = "" + this.value;
        if (!str.includes("."))
          str += ".";
        return str;
      }
      typeString() {
        return "float";
      }
      applyUniform(gl2, loc) {
        gl2.uniform1f(loc, this.value);
      }
    };
    exports.PrimitiveFloat = PrimitiveFloat;
    var PrimitiveVec = class extends Primitive {
      constructor(comps) {
        super();
        this.values = comps;
      }
      typeString() {
        return "vec" + this.values.length;
      }
      toString() {
        return `${this.typeString()}(${this.values.map((n) => toGLSLFloatString(n)).join(", ")})`;
      }
    };
    exports.PrimitiveVec = PrimitiveVec;
    var PrimitiveVec2 = class extends PrimitiveVec {
      applyUniform(gl2, loc) {
        gl2.uniform2f(loc, this.values[0], this.values[1]);
      }
    };
    exports.PrimitiveVec2 = PrimitiveVec2;
    var PrimitiveVec3 = class extends PrimitiveVec {
      applyUniform(gl2, loc) {
        gl2.uniform3f(loc, this.values[0], this.values[1], this.values[2]);
      }
    };
    exports.PrimitiveVec3 = PrimitiveVec3;
    var PrimitiveVec4 = class extends PrimitiveVec {
      applyUniform(gl2, loc) {
        gl2.uniform4f(loc, this.values[0], this.values[1], this.values[2], this.values[3]);
      }
    };
    exports.PrimitiveVec4 = PrimitiveVec4;
    var BasicVec = class extends Expr {
      constructor(sourceLists, defaultNames) {
        super(sourceLists, defaultNames);
        const values = sourceLists.values;
        this.values = values;
        this.defaultNames = defaultNames;
      }
      typeString() {
        return "vec" + this.values.length;
      }
      /** sets a component of the vector */
      setComp(index, primitive) {
        if (index < 0 || index >= this.values.length) {
          throw new Error("out of bounds of setting component");
        }
        this.setUniform(this.defaultNames[index] + this.id, wrapInValue(primitive));
      }
    };
    exports.BasicVec = BasicVec;
    var BasicVec2 = class extends BasicVec {
      constructor() {
        super(...arguments);
        this.bvec2 = void 0;
      }
    };
    exports.BasicVec2 = BasicVec2;
    var BasicVec3 = class extends BasicVec {
      constructor() {
        super(...arguments);
        this.bvec3 = void 0;
      }
    };
    exports.BasicVec3 = BasicVec3;
    var BasicVec4 = class extends BasicVec {
      constructor() {
        super(...arguments);
        this.bvec4 = void 0;
      }
    };
    exports.BasicVec4 = BasicVec4;
    var ExprVec = class extends Expr {
      constructor(sourceLists, defaultNames) {
        super(sourceLists, defaultNames);
        const values = sourceLists.values;
        this.values = values;
        this.defaultNames = defaultNames;
      }
    };
    exports.ExprVec = ExprVec;
    var BasicFloat = class extends Expr {
      constructor(sourceLists, defaultNames) {
        super(sourceLists, defaultNames);
        this.float = void 0;
      }
      setVal(primitive) {
        this.setUniform("uFloat" + this.id, wrapInValue(primitive));
      }
      typeString() {
        return "float";
      }
    };
    exports.BasicFloat = BasicFloat;
    var ExprFloat = class extends Expr {
      constructor(sourceLists, defaultNames) {
        super(sourceLists, defaultNames);
        this.float = void 0;
      }
      setVal(primitive) {
        this.setUniform("uFloat" + this.id, wrapInValue(primitive));
      }
      typeString() {
        return "float";
      }
    };
    exports.ExprFloat = ExprFloat;
    function float(value) {
      if (typeof value === "number")
        value = wrapInValue(value);
      return new BasicFloat({ sections: ["", ""], values: [value] }, ["uFloat"]);
    }
    exports.float = float;
    var ExprVec2 = class extends ExprVec {
      constructor() {
        super(...arguments);
        this.vec2 = void 0;
      }
      typeString() {
        return "vec2";
      }
    };
    exports.ExprVec2 = ExprVec2;
    var ExprVec3 = class extends ExprVec {
      constructor() {
        super(...arguments);
        this.vec3 = void 0;
      }
      typeString() {
        return "vec3";
      }
    };
    exports.ExprVec3 = ExprVec3;
    var ExprVec4 = class extends ExprVec {
      constructor() {
        super(...arguments);
        this.vec4 = void 0;
      }
      repeat(num) {
        return new mergepass_1.EffectLoop([this], { num });
      }
      genPrograms(gl2, vShader, uniformLocs, shaders) {
        return new mergepass_1.EffectLoop([this], { num: 1 }).genPrograms(gl2, vShader, uniformLocs, shaders);
      }
      typeString() {
        return "vec4";
      }
    };
    exports.ExprVec4 = ExprVec4;
    var WrappedExpr = class {
      constructor(expr) {
        this.expr = expr;
      }
      typeString() {
        return this.expr.typeString();
      }
      parse(buildInfo, defaultName, enc) {
        return this.expr.parse(buildInfo, defaultName, enc);
      }
      getSampleNum() {
        return this.expr.getSampleNum();
      }
      brandExprWithRegion(space) {
        return this.expr.brandExprWithRegion(space);
      }
    };
    exports.WrappedExpr = WrappedExpr;
    var Operator = class extends Expr {
      constructor(ret, sourceLists, defaultNames) {
        super(sourceLists, defaultNames);
        this.ret = ret;
      }
      typeString() {
        return this.ret.typeString();
      }
    };
    exports.Operator = Operator;
    function pfloat(num) {
      return new PrimitiveFloat(num);
    }
    exports.pfloat = pfloat;
    function wrapInValue(num) {
      if (num === void 0)
        return void 0;
      if (typeof num === "number")
        return pfloat(num);
      return num;
    }
    exports.wrapInValue = wrapInValue;
    function tag(strings, ...values) {
      return { sections: strings.concat([]), values };
    }
    exports.tag = tag;
  }
});
var require_codebuilder = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/codebuilder.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CodeBuilder = exports.channelSamplerName = void 0;
    var expr_1 = require_expr();
    var webglprogramloop_1 = require_webglprogramloop();
    var settings_1 = require_settings();
    var FRAG_SET = `  gl_FragColor = texture2D(uSampler, gl_FragCoord.xy / uResolution);
`;
    var SCENE_SET = `uniform sampler2D uSceneSampler;
`;
    var TIME_SET = `uniform mediump float uTime;
`;
    var MOUSE_SET = `uniform mediump vec2 uMouse;
`;
    var COUNT_SET = `uniform int uCount;
`;
    var BOILERPLATE = `#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uSampler;
uniform mediump vec2 uResolution;
`;
    function channelSamplerName(num) {
      return num === -1 ? "uSampler" : `uBufferSampler${num}`;
    }
    exports.channelSamplerName = channelSamplerName;
    function channelSamplerDeclaration(num) {
      return `uniform sampler2D ${channelSamplerName(num)};`;
    }
    var CodeBuilder = class {
      constructor(effectLoop) {
        this.calls = [];
        this.externalFuncs = /* @__PURE__ */ new Set();
        this.uniformDeclarations = /* @__PURE__ */ new Set();
        this.counter = 0;
        this.baseLoop = effectLoop;
        const buildInfo = {
          uniformTypes: {},
          externalFuncs: /* @__PURE__ */ new Set(),
          exprs: [],
          // update me on change to needs
          needs: {
            centerSample: false,
            neighborSample: false,
            sceneBuffer: false,
            timeUniform: false,
            mouseUniform: false,
            passCount: false,
            extraBuffers: /* @__PURE__ */ new Set()
          }
        };
        this.addEffectLoop(effectLoop, 1, buildInfo);
        for (const name in buildInfo.uniformTypes) {
          const typeName = buildInfo.uniformTypes[name];
          this.uniformDeclarations.add(`uniform mediump ${typeName} ${name};`);
        }
        buildInfo.externalFuncs.forEach((func) => this.externalFuncs.add(func));
        this.totalNeeds = buildInfo.needs;
        this.exprs = buildInfo.exprs;
      }
      addEffectLoop(effectLoop, indentLevel, buildInfo, topLevel = true) {
        const needsLoop = !topLevel && effectLoop.loopInfo.num > 1;
        if (needsLoop) {
          const iName = "i" + this.counter;
          indentLevel++;
          const forStart = "  ".repeat(indentLevel - 1) + `for (int ${iName} = 0; ${iName} < ${effectLoop.loopInfo.num}; ${iName}++) {`;
          this.calls.push(forStart);
        }
        for (const e of effectLoop.effects) {
          if (e instanceof expr_1.Expr) {
            e.parse(buildInfo);
            this.calls.push("  ".repeat(indentLevel) + "gl_FragColor = " + e.sourceCode + ";");
            this.counter++;
          } else {
            this.addEffectLoop(e, indentLevel, buildInfo, false);
          }
        }
        if (needsLoop) {
          this.calls.push("  ".repeat(indentLevel - 1) + "}");
        }
      }
      /** generate the code and compile the program into a loop */
      compileProgram(gl2, vShader, uniformLocs, shaders = []) {
        const fShader = gl2.createShader(gl2.FRAGMENT_SHADER);
        if (fShader === null) {
          throw new Error("problem creating fragment shader");
        }
        const fullCode = BOILERPLATE + (this.totalNeeds.sceneBuffer ? SCENE_SET : "") + (this.totalNeeds.timeUniform ? TIME_SET : "") + (this.totalNeeds.mouseUniform ? MOUSE_SET : "") + (this.totalNeeds.passCount ? COUNT_SET : "") + Array.from(this.totalNeeds.extraBuffers).map((n) => channelSamplerDeclaration(n)).join("\n") + "\n" + [...this.uniformDeclarations].join("\n") + "\n" + [...this.externalFuncs].join("\n") + "\nvoid main() {\n" + (this.totalNeeds.centerSample ? FRAG_SET : "") + this.calls.join("\n") + "\n}";
        if (settings_1.settings.verbosity > 0)
          console.log(fullCode);
        gl2.shaderSource(fShader, fullCode);
        gl2.compileShader(fShader);
        const program = gl2.createProgram();
        if (program === null) {
          throw new Error("problem creating program");
        }
        gl2.attachShader(program, vShader);
        gl2.attachShader(program, fShader);
        shaders.push(fShader);
        const shaderLog = (name, shader) => {
          const output = gl2.getShaderInfoLog(shader);
          if (output)
            console.log(`${name} shader info log
${output}`);
        };
        shaderLog("vertex", vShader);
        shaderLog("fragment", fShader);
        gl2.linkProgram(program);
        gl2.useProgram(program);
        for (const expr of this.exprs) {
          for (const name in expr.uniformValChangeMap) {
            const location = gl2.getUniformLocation(program, name);
            if (location === null) {
              throw new Error("couldn't find uniform " + name);
            }
            if (uniformLocs[name] === void 0) {
              uniformLocs[name] = { locs: [], counter: 0 };
            }
            uniformLocs[name].locs.push(location);
          }
        }
        const uResolution = gl2.getUniformLocation(program, "uResolution");
        gl2.uniform2f(uResolution, gl2.drawingBufferWidth, gl2.drawingBufferHeight);
        if (this.totalNeeds.sceneBuffer) {
          const location = gl2.getUniformLocation(program, "uSceneSampler");
          gl2.uniform1i(location, 1 + settings_1.settings.offset);
        }
        for (const b of this.totalNeeds.extraBuffers) {
          const location = gl2.getUniformLocation(program, channelSamplerName(b));
          gl2.uniform1i(location, b + 2 + settings_1.settings.offset);
        }
        if (settings_1.settings.offset !== 0) {
          const location = gl2.getUniformLocation(program, "uSampler");
          gl2.uniform1i(location, settings_1.settings.offset);
        }
        const position = gl2.getAttribLocation(program, "aPosition");
        gl2.enableVertexAttribArray(position);
        gl2.vertexAttribPointer(position, 2, gl2.FLOAT, false, 0, 0);
        return new webglprogramloop_1.WebGLProgramLoop(new webglprogramloop_1.WebGLProgramLeaf(program, this.totalNeeds, this.exprs), this.baseLoop.loopInfo, gl2);
      }
    };
    exports.CodeBuilder = CodeBuilder;
  }
});
var require_fragcolorexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/fragcolorexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fcolor = exports.FragColorExpr = void 0;
    var expr_1 = require_expr();
    var FragColorExpr = class extends expr_1.ExprVec4 {
      constructor() {
        super(expr_1.tag`gl_FragColor`, []);
        this.needs.centerSample = true;
      }
    };
    exports.FragColorExpr = FragColorExpr;
    function fcolor() {
      return new FragColorExpr();
    }
    exports.fcolor = fcolor;
  }
});
var require_getcompexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/getcompexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.get4comp = exports.get3comp = exports.get2comp = exports.getcomp = exports.Get4CompExpr = exports.Get3CompExpr = exports.Get2CompExpr = exports.GetCompExpr = exports.checkLegalComponents = exports.typeStringToLength = void 0;
    var expr_1 = require_expr();
    function typeStringToLength(str) {
      switch (str) {
        case "float":
          return 1;
        case "vec2":
          return 2;
        case "vec3":
          return 3;
        case "vec4":
          return 4;
      }
    }
    exports.typeStringToLength = typeStringToLength;
    function genCompSource(vec, components) {
      return {
        sections: ["", "." + components],
        values: [vec]
      };
    }
    function checkLegalComponents(comps, vec) {
      const check = (range, domain) => {
        let inside = 0;
        let outside = 0;
        for (const c of range) {
          domain.includes(c) ? inside++ : outside++;
        }
        return inside === inside && !outside;
      };
      const inLen = typeStringToLength(vec.typeString());
      const rgbaCheck = check(comps, "rgba".substr(0, inLen));
      const xyzwCheck = check(comps, "xyzw".substr(0, inLen));
      const stpqCheck = check(comps, "stpq".substr(0, inLen));
      if (!(rgbaCheck || xyzwCheck || stpqCheck)) {
        throw new Error("component sets are mixed or incorrect entirely");
      }
    }
    exports.checkLegalComponents = checkLegalComponents;
    function checkGetComponents(comps, outLen, vec) {
      if (comps.length > outLen)
        throw new Error("too many components");
      checkLegalComponents(comps, vec);
    }
    var GetCompExpr = class extends expr_1.ExprFloat {
      constructor(vec, comps) {
        checkGetComponents(comps, 1, vec);
        super(genCompSource(vec, comps), ["uVec1Min"]);
        this.vec1Min = vec;
      }
      setVec(vec) {
        this.setUniform("uVec1Min", vec);
        this.vec1Min = vec;
      }
    };
    exports.GetCompExpr = GetCompExpr;
    var Get2CompExpr = class extends expr_1.ExprVec2 {
      constructor(vec, comps) {
        checkGetComponents(comps, 2, vec);
        super(genCompSource(vec, comps), ["uVec2Min"]);
        this.vec2Min = vec;
      }
      setVec(vec) {
        this.setUniform("uVec2Min", vec);
        this.vec2Min = vec;
      }
    };
    exports.Get2CompExpr = Get2CompExpr;
    var Get3CompExpr = class extends expr_1.ExprVec3 {
      constructor(vec, comps) {
        checkGetComponents(comps, 3, vec);
        super(genCompSource(vec, comps), ["uVec3Min"]);
        this.vec3Min = vec;
      }
      setVec(vec) {
        this.setUniform("uVec3Min", vec);
        this.vec3Min = vec;
      }
    };
    exports.Get3CompExpr = Get3CompExpr;
    var Get4CompExpr = class extends expr_1.ExprVec4 {
      constructor(vec, comps) {
        checkGetComponents(comps, 4, vec);
        super(genCompSource(vec, comps), ["uVec4Min"]);
        this.vec4Min = vec;
      }
      setVec(vec) {
        this.setUniform("uVec4Min", vec);
        this.vec4Min = vec;
      }
    };
    exports.Get4CompExpr = Get4CompExpr;
    function getcomp(vec, comps) {
      return new GetCompExpr(vec, comps);
    }
    exports.getcomp = getcomp;
    function get2comp(vec, comps) {
      return new Get2CompExpr(vec, comps);
    }
    exports.get2comp = get2comp;
    function get3comp(vec, comps) {
      return new Get3CompExpr(vec, comps);
    }
    exports.get3comp = get3comp;
    function get4comp(vec, comps) {
      return new Get4CompExpr(vec, comps);
    }
    exports.get4comp = get4comp;
  }
});
var require_normfragcoordexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/normfragcoordexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.pos = exports.NormFragCoordExpr = void 0;
    var expr_1 = require_expr();
    var NormFragCoordExpr = class extends expr_1.ExprVec2 {
      constructor() {
        super(expr_1.tag`(gl_FragCoord.xy / uResolution)`, []);
      }
    };
    exports.NormFragCoordExpr = NormFragCoordExpr;
    function pos2() {
      return new NormFragCoordExpr();
    }
    exports.pos = pos2;
  }
});
var require_opexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/opexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.op = exports.OpExpr = void 0;
    var expr_1 = require_expr();
    function genOpSourceList(left, op2, right) {
      return {
        sections: ["(", ` ${op2} `, ")"],
        values: [left, right]
      };
    }
    var OpExpr = class extends expr_1.Operator {
      constructor(left, op2, right) {
        super(left, genOpSourceList(left, op2, right), ["uLeft", "uRight"]);
        this.left = left;
        this.right = right;
      }
      setLeft(left) {
        this.setUniform("uLeft" + this.id, left);
        this.left = expr_1.wrapInValue(left);
      }
      setRight(right) {
        this.setUniform("uRight" + this.id, right);
        this.right = expr_1.wrapInValue(right);
      }
    };
    exports.OpExpr = OpExpr;
    function op(left, op2, right) {
      return new OpExpr(expr_1.wrapInValue(left), op2, expr_1.wrapInValue(right));
    }
    exports.op = op;
  }
});
var require_ternaryexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/ternaryexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ternary = exports.TernaryExpr = void 0;
    var expr_1 = require_expr();
    function genTernarySourceList(floats, success, failure, not) {
      const sourceList = {
        sections: [`(${not ? "!" : ""}(`],
        values: []
      };
      let counter = 0;
      if (floats !== null) {
        for (const f of floats) {
          counter++;
          const last = counter === floats.length;
          sourceList.values.push(f);
          sourceList.sections.push(` > 0.${last ? ") ? " : " && "}`);
        }
      } else {
        sourceList.sections[0] += "uCount == 0) ? ";
      }
      sourceList.values.push(success);
      sourceList.sections.push(" : ");
      sourceList.values.push(failure);
      sourceList.sections.push(")");
      return sourceList;
    }
    var TernaryExpr = class extends expr_1.Operator {
      constructor(floats, success, failure, not) {
        super(success, genTernarySourceList(floats, success, failure, not), [
          ...floats !== null ? Array.from(floats, (val, index) => "uFloat" + index) : [],
          "uSuccess",
          "uFailure"
        ]);
        this.success = success;
        this.failure = failure;
        this.needs.passCount = floats === null;
      }
    };
    exports.TernaryExpr = TernaryExpr;
    function ternary(floats, success, failure, not = false) {
      if (!Array.isArray(floats) && floats !== null)
        floats = [floats].map((f) => expr_1.wrapInValue(f));
      return new TernaryExpr(floats, expr_1.wrapInValue(success), expr_1.wrapInValue(failure), not);
    }
    exports.ternary = ternary;
  }
});
var require_regiondecorator = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/regiondecorator.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.region = void 0;
    var mergepass_1 = require_mergepass();
    var expr_1 = require_expr();
    var getcompexpr_1 = require_getcompexpr();
    var normfragcoordexpr_1 = require_normfragcoordexpr();
    var opexpr_1 = require_opexpr();
    var ternaryexpr_1 = require_ternaryexpr();
    var fragcolorexpr_1 = require_fragcolorexpr();
    function createDifferenceFloats(floats) {
      const axes = "xy";
      const differences = [];
      if (floats.length !== 4) {
        throw new Error("incorrect amount of points specified for region");
      }
      for (let i = 0; i < 2; i++) {
        differences.push(opexpr_1.op(getcompexpr_1.getcomp(normfragcoordexpr_1.pos(), axes[i]), "-", floats[i]));
      }
      for (let i = 2; i < floats.length; i++) {
        differences.push(opexpr_1.op(floats[i], "-", getcompexpr_1.getcomp(normfragcoordexpr_1.pos(), axes[i - 2])));
      }
      return differences;
    }
    function region(space, success, failure, not = false) {
      const floats = Array.isArray(space) ? space.map((f) => expr_1.wrapInValue(f)) : typeof space === "number" ? expr_1.wrapInValue(space) : space;
      if (failure instanceof mergepass_1.EffectLoop) {
        if (!(success instanceof mergepass_1.EffectLoop)) {
          [success, failure] = [failure, success];
          not = !not;
        }
      }
      if (success instanceof mergepass_1.EffectLoop) {
        if (!(failure instanceof mergepass_1.EffectLoop)) {
          return success.regionWrap(floats, failure, true, not);
        }
        return mergepass_1.loop([
          success.regionWrap(floats, fragcolorexpr_1.fcolor(), false, not),
          failure.regionWrap(floats, fragcolorexpr_1.fcolor(), true, !not)
        ]);
      }
      return ternaryexpr_1.ternary(Array.isArray(floats) ? createDifferenceFloats(floats) : floats, success.brandExprWithRegion(floats), failure.brandExprWithRegion(floats), not);
    }
    exports.region = region;
  }
});
var require_scenesampleexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/scenesampleexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.input = exports.SceneSampleExpr = void 0;
    var expr_1 = require_expr();
    var normfragcoordexpr_1 = require_normfragcoordexpr();
    var SceneSampleExpr = class extends expr_1.ExprVec4 {
      constructor(coord = normfragcoordexpr_1.pos()) {
        super(expr_1.tag`texture2D(uSceneSampler, ${coord})`, ["uCoord"]);
        this.coord = coord;
        this.needs.sceneBuffer = true;
      }
      /** sets coordinate where scene is being sampled from */
      setCoord(coord) {
        this.setUniform("uCoord", coord);
        this.coord = coord;
      }
    };
    exports.SceneSampleExpr = SceneSampleExpr;
    function input(vec) {
      return new SceneSampleExpr(vec);
    }
    exports.input = input;
  }
});
var require_setcolorexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/setcolorexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SetColorExpr = void 0;
    var expr_1 = require_expr();
    var SetColorExpr = class extends expr_1.ExprVec4 {
      constructor(vec) {
        super(expr_1.tag`(${vec})`, ["uVal"]);
        this.vec = vec;
      }
    };
    exports.SetColorExpr = SetColorExpr;
  }
});
var require_mergepass = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/mergepass.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sendTexture = exports.makeTexture = exports.Merger = exports.loop = exports.EffectLoop = exports.EffectDictionary = void 0;
    var codebuilder_1 = require_codebuilder();
    var expr_1 = require_expr();
    var fragcolorexpr_1 = require_fragcolorexpr();
    var regiondecorator_1 = require_regiondecorator();
    var scenesampleexpr_1 = require_scenesampleexpr();
    var setcolorexpr_1 = require_setcolorexpr();
    var ternaryexpr_1 = require_ternaryexpr();
    var settings_1 = require_settings();
    var webglprogramloop_1 = require_webglprogramloop();
    function wrapInSetColors(effects2) {
      return effects2.map((e) => e instanceof expr_1.ExprVec4 || e instanceof EffectLoop ? e : new setcolorexpr_1.SetColorExpr(e));
    }
    function processEffectMap(eMap) {
      const result = {};
      for (const name in eMap) {
        const val = eMap[name];
        result[name] = wrapInSetColors(val);
      }
      return result;
    }
    var EffectDictionary = class {
      constructor(effectMap) {
        this.effectMap = processEffectMap(effectMap);
      }
      toProgramMap(gl2, vShader, uniformLocs, fShaders) {
        const programMap = {};
        let needs = {
          neighborSample: false,
          centerSample: false,
          sceneBuffer: false,
          timeUniform: false,
          mouseUniform: false,
          passCount: false,
          extraBuffers: /* @__PURE__ */ new Set()
        };
        for (const name in this.effectMap) {
          const effects2 = this.effectMap[name];
          const effectLoop = new EffectLoop(effects2, { num: 1 });
          if (effectLoop.effects.length === 0) {
            throw new Error("list of effects was empty");
          }
          const programLoop = effectLoop.genPrograms(gl2, vShader, uniformLocs, fShaders);
          let atBottom = false;
          let currProgramLoop = programLoop;
          while (!atBottom) {
            if (currProgramLoop.programElement instanceof webglprogramloop_1.WebGLProgramLeaf) {
              currProgramLoop.last = true;
              atBottom = true;
            } else {
              currProgramLoop = currProgramLoop.programElement[currProgramLoop.programElement.length - 1];
            }
          }
          needs = webglprogramloop_1.updateNeeds(needs, programLoop.getTotalNeeds());
          programMap[name] = programLoop;
        }
        return { programMap, needs };
      }
    };
    exports.EffectDictionary = EffectDictionary;
    var EffectLoop = class {
      constructor(effects2, loopInfo) {
        this.effects = wrapInSetColors(effects2);
        this.loopInfo = loopInfo;
      }
      /** @ignore */
      getSampleNum(mult = 1, sliceStart = 0, sliceEnd = this.effects.length) {
        mult *= this.loopInfo.num;
        let acc = 0;
        const sliced = this.effects.slice(sliceStart, sliceEnd);
        for (const e of sliced) {
          acc += e.getSampleNum(mult);
        }
        return acc;
      }
      /**
       * @ignore
       * places effects into loops broken up by sampling effects
       */
      regroup() {
        let sampleCount = 0;
        let prevSampleCount = 0;
        let prevEffects = [];
        const regroupedEffects = [];
        let prevTarget;
        let currTarget;
        let mustBreakCounter = 0;
        const breakOff = () => {
          mustBreakCounter--;
          if (prevEffects.length > 0) {
            if (prevEffects.length === 1) {
              regroupedEffects.push(prevEffects[0]);
            } else {
              regroupedEffects.push(new EffectLoop(prevEffects, { num: 1 }));
            }
            sampleCount -= prevSampleCount;
            prevEffects = [];
          }
        };
        for (const e of this.effects) {
          const sampleNum = e.getSampleNum();
          prevSampleCount = sampleCount;
          sampleCount += sampleNum;
          if (e instanceof EffectLoop) {
            currTarget = e.loopInfo.target;
            if (e.hasTargetSwitch()) {
              mustBreakCounter = 2;
            }
          } else {
            currTarget = this.loopInfo.target;
          }
          if (sampleCount > 0 || currTarget !== prevTarget || mustBreakCounter > 0) {
            breakOff();
          }
          prevEffects.push(e);
          prevTarget = currTarget;
        }
        breakOff();
        return regroupedEffects;
      }
      genPrograms(gl2, vShader, uniformLocs, shaders) {
        const fullSampleNum = this.getSampleNum() / this.loopInfo.num;
        const firstSampleNum = this.getSampleNum(void 0, 0, 1) / this.loopInfo.num;
        const restSampleNum = this.getSampleNum(void 0, 1) / this.loopInfo.num;
        if (!this.hasTargetSwitch() && (fullSampleNum === 0 || firstSampleNum === 1 && restSampleNum === 0)) {
          const codeBuilder = new codebuilder_1.CodeBuilder(this);
          const program = codeBuilder.compileProgram(gl2, vShader, uniformLocs, shaders);
          return program;
        }
        this.effects = this.regroup();
        return new webglprogramloop_1.WebGLProgramLoop(this.effects.map((e) => e.genPrograms(gl2, vShader, uniformLocs, shaders)), this.loopInfo, gl2);
      }
      /**
       * changes the render target of an effect loop (-1 targest the scene texture;
       * this is used internally)
       */
      target(num) {
        this.loopInfo.target = num;
        return this;
      }
      /** @ignore */
      hasTargetSwitch() {
        for (const e of this.effects) {
          if (e instanceof EffectLoop) {
            if (e.loopInfo.target !== this.loopInfo.target || e.hasTargetSwitch())
              return true;
          }
        }
        return false;
      }
      /** @ignore */
      regionWrap(space, failure, finalPath = true, not) {
        this.effects = this.effects.map((e, index) => (
          // loops that aren't all the way to the right can't terminate the count ternery
          // don't wrap fcolors in a ternery (it's redundant)
          e instanceof EffectLoop ? e.regionWrap(space, failure, index === this.effects.length - 1, not) : new setcolorexpr_1.SetColorExpr(regiondecorator_1.region(space, e.brandExprWithRegion(space), index === this.effects.length - 1 && finalPath ? !(failure instanceof fragcolorexpr_1.FragColorExpr) ? ternaryexpr_1.ternary(null, failure, fragcolorexpr_1.fcolor()) : failure : fragcolorexpr_1.fcolor(), not))
        ));
        return this;
      }
    };
    exports.EffectLoop = EffectLoop;
    function loop(effects2, rep = 1) {
      return new EffectLoop(effects2, { num: rep });
    }
    exports.loop = loop;
    var V_SOURCE = `attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;
    var Merger = class {
      /**
       * constructs the object that runs the effects
       * @param effects list of effects that define the final effect
       * @param source the source image or texture
       * @param gl the target rendering context
       * @param options additional options for the texture
       */
      constructor(effects2, source, gl2, options) {
        this.uniformLocs = {};
        this.channels = [];
        this.fShaders = [];
        this.textureMode = source instanceof WebGLTexture;
        if ((options === null || options === void 0 ? void 0 : options.channels) !== void 0)
          this.channels = options === null || options === void 0 ? void 0 : options.channels;
        if (!(effects2 instanceof EffectDictionary)) {
          effects2 = new EffectDictionary({ default: effects2 });
        }
        if (this.textureMode) {
          if (settings_1.settings.verbosity > 1) {
            console.log("we are in texture mode!");
          }
          for (const name in effects2.effectMap) {
            const list = effects2.effectMap[name];
            list.unshift(loop([scenesampleexpr_1.input()]).target(-1));
          }
        }
        this.source = source;
        this.gl = gl2;
        this.options = options;
        this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
        const vertexBuffer = this.gl.createBuffer();
        if (vertexBuffer === null) {
          throw new Error("problem creating vertex buffer");
        }
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
        const vertexArray = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
        const triangles = new Float32Array(vertexArray);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, triangles, this.gl.STATIC_DRAW);
        this.vertexBuffer = vertexBuffer;
        const vShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        if (vShader === null) {
          throw new Error("problem creating the vertex shader");
        }
        this.vShader = vShader;
        this.gl.shaderSource(vShader, V_SOURCE);
        this.gl.compileShader(vShader);
        this.tex = {
          // make the front texture the source if we're given a texture instead of
          // an image
          back: {
            name: "orig_back",
            tex: source instanceof WebGLTexture ? source : makeTexture(this.gl, this.options)
          },
          front: { name: "orig_front", tex: makeTexture(this.gl, this.options) },
          scene: void 0,
          bufTextures: []
        };
        const framebuffer2 = gl2.createFramebuffer();
        if (framebuffer2 === null) {
          throw new Error("problem creating the framebuffer");
        }
        this.framebuffer = framebuffer2;
        const { programMap, needs } = effects2.toProgramMap(this.gl, this.vShader, this.uniformLocs, this.fShaders);
        this.programMap = programMap;
        if (needs.sceneBuffer || this.textureMode) {
          this.tex.scene = {
            name: "scene",
            tex: makeTexture(this.gl, this.options)
          };
        }
        if (programMap["default"] === void 0) {
          throw new Error("no default program");
        }
        this.programLoop = programMap["default"];
        const channelsNeeded = Math.max(...needs.extraBuffers) + 1;
        const channelsSupplied = this.channels.length;
        if (channelsNeeded > channelsSupplied) {
          throw new Error("not enough channels supplied for this effect");
        }
        for (let i = 0; i < this.channels.length; i++) {
          const texOrImage = this.channels[i];
          if (!(texOrImage instanceof WebGLTexture)) {
            const texture = makeTexture(this.gl, this.options);
            this.tex.bufTextures.push({ name: "tex_channel_" + i, tex: texture });
          } else {
            this.tex.bufTextures.push({
              name: "img_channel_" + i,
              tex: texOrImage
            });
          }
        }
        if (settings_1.settings.verbosity > 0) {
          console.log(effects2);
          console.log(this.programMap);
        }
      }
      /**
       * use the source and channels to draw effect to target context; mouse
       * position (as with all positions) are stored from the bottom left corner as
       * this is how texture data is stored
       * @param timeVal number to set the time uniform to (supply this if you plan to
       * use [[time]])
       * @param mouseX the x position of the mouse (supply this if you plan to use
       * [[mouse]] or [[nmouse]])
       * @param mouseY the y position of the mouse (supply this if you plan to use
       * [[mouse]] or [[nmouse]])
       */
      draw(timeVal = 0, mouseX = 0, mouseY = 0) {
        this.gl.activeTexture(this.gl.TEXTURE0 + settings_1.settings.offset);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.tex.back.tex);
        sendTexture(this.gl, this.source);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        if (this.programLoop.getTotalNeeds().sceneBuffer && this.tex.scene !== void 0) {
          this.gl.activeTexture(this.gl.TEXTURE1 + settings_1.settings.offset);
          this.gl.bindTexture(this.gl.TEXTURE_2D, this.tex.scene.tex);
          sendTexture(this.gl, this.source);
          this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        }
        let counter = 0;
        for (const b of this.channels) {
          this.gl.activeTexture(this.gl.TEXTURE2 + counter + settings_1.settings.offset);
          this.gl.bindTexture(this.gl.TEXTURE_2D, this.tex.bufTextures[counter].tex);
          sendTexture(this.gl, b);
          this.gl.bindTexture(this.gl.TEXTURE_2D, null);
          counter++;
        }
        this.programLoop.run(this.gl, this.tex, this.framebuffer, this.uniformLocs, this.programLoop.last, { timeVal, mouseX, mouseY });
      }
      /**
       * delete all resources created by construction of this [[Merger]]; use right before
       * intentionally losing a reference to this merger object. this is useful if you want
       * to construct another [[Merger]] to use new effects
       */
      delete() {
        for (let i = 0; i < 2 + this.tex.bufTextures.length; i++) {
          this.gl.activeTexture(this.gl.TEXTURE0 + i + settings_1.settings.offset);
          this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        }
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.programLoop.delete(this.gl);
        this.gl.deleteTexture(this.tex.front.tex);
        this.gl.deleteTexture(this.tex.back.tex);
        for (const c of this.tex.bufTextures) {
          this.gl.deleteTexture(c.tex);
        }
        this.gl.deleteBuffer(this.vertexBuffer);
        this.gl.deleteFramebuffer(this.framebuffer);
        this.gl.deleteShader(this.vShader);
        for (const f of this.fShaders) {
          this.gl.deleteShader(f);
        }
      }
      /**
       * changes the current program loop
       * @param str key in the program map
       */
      changeProgram(str) {
        if (this.programMap[str] === void 0) {
          throw new Error(`program "${str}" doesn't exist on this merger`);
        }
        this.programLoop = this.programMap[str];
      }
    };
    exports.Merger = Merger;
    function makeTexture(gl2, options) {
      const texture = gl2.createTexture();
      if (texture === null) {
        throw new Error("problem creating texture");
      }
      gl2.pixelStorei(gl2.UNPACK_FLIP_Y_WEBGL, true);
      gl2.bindTexture(gl2.TEXTURE_2D, texture);
      gl2.texImage2D(gl2.TEXTURE_2D, 0, gl2.RGBA, gl2.drawingBufferWidth, gl2.drawingBufferHeight, 0, gl2.RGBA, gl2.UNSIGNED_BYTE, null);
      const filterMode = (f) => f === void 0 || f === "linear" ? gl2.LINEAR : gl2.NEAREST;
      gl2.texParameteri(gl2.TEXTURE_2D, gl2.TEXTURE_MIN_FILTER, filterMode(options === null || options === void 0 ? void 0 : options.minFilterMode));
      gl2.texParameteri(gl2.TEXTURE_2D, gl2.TEXTURE_MAG_FILTER, filterMode(options === null || options === void 0 ? void 0 : options.maxFilterMode));
      if ((options === null || options === void 0 ? void 0 : options.edgeMode) !== "wrap") {
        gl2.texParameteri(gl2.TEXTURE_2D, gl2.TEXTURE_WRAP_S, gl2.CLAMP_TO_EDGE);
        gl2.texParameteri(gl2.TEXTURE_2D, gl2.TEXTURE_WRAP_T, gl2.CLAMP_TO_EDGE);
      }
      return texture;
    }
    exports.makeTexture = makeTexture;
    function sendTexture(gl2, src) {
      if (src instanceof WebGLTexture || src === null)
        return;
      gl2.texImage2D(gl2.TEXTURE_2D, 0, gl2.RGBA, gl2.RGBA, gl2.UNSIGNED_BYTE, src);
    }
    exports.sendTexture = sendTexture;
  }
});
var require_exprtypes = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprtypes.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});
var require_blurexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/blurexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.gauss = exports.BlurExpr = void 0;
    var glslfunctions_1 = require_glslfunctions();
    var expr_1 = require_expr();
    function genBlurSource(direction, taps) {
      return {
        sections: [`gauss${taps}(`, ")"],
        values: [direction]
      };
    }
    function tapsToFuncSource(taps) {
      switch (taps) {
        case 5:
          return glslfunctions_1.glslFuncs.gauss5;
        case 9:
          return glslfunctions_1.glslFuncs.gauss9;
        case 13:
          return glslfunctions_1.glslFuncs.gauss13;
      }
    }
    var BlurExpr = class extends expr_1.ExprVec4 {
      constructor(direction, taps = 5, samplerNum) {
        if (![5, 9, 13].includes(taps)) {
          throw new Error("taps for gauss blur can only be 5, 9 or 13");
        }
        super(genBlurSource(direction, taps), ["uDirection"]);
        this.direction = direction;
        this.externalFuncs = [tapsToFuncSource(taps)];
        this.brandExprWithChannel(0, samplerNum);
      }
      /** set the blur direction (keep magnitude no greater than 1 for best effect) */
      setDirection(direction) {
        this.setUniform("uDirection" + this.id, direction);
        this.direction = direction;
      }
    };
    exports.BlurExpr = BlurExpr;
    function gauss(direction, taps = 5, samplerNum) {
      return new BlurExpr(direction, taps, samplerNum);
    }
    exports.gauss = gauss;
  }
});
var require_vecexprs = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/vecexprs.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.pvec4 = exports.pvec3 = exports.pvec2 = exports.vec4 = exports.vec3 = exports.vec2 = void 0;
    var expr_1 = require_expr();
    function vecSourceList(...components) {
      const sections = ["vec" + components.length + "("];
      for (let i = 0; i < components.length - 1; i++) {
        sections.push(", ");
      }
      const defaultNames = [];
      for (let i = 0; i < components.length; i++) {
        defaultNames.push("uComp" + i);
      }
      sections.push(")");
      return [{ sections, values: components }, defaultNames];
    }
    function vec2(comp1, comp2) {
      return new expr_1.BasicVec2(...vecSourceList(...[comp1, comp2].map((c) => expr_1.wrapInValue(c))));
    }
    exports.vec2 = vec2;
    function vec3(comp1, comp2, comp3) {
      return new expr_1.BasicVec3(...vecSourceList(...[comp1, comp2, comp3].map((c) => expr_1.wrapInValue(c))));
    }
    exports.vec3 = vec3;
    function vec4(comp1, comp2, comp3, comp4) {
      return new expr_1.BasicVec4(...vecSourceList(...[comp1, comp2, comp3, comp4].map((c) => expr_1.wrapInValue(c))));
    }
    exports.vec4 = vec4;
    function pvec2(comp1, comp2) {
      return new expr_1.PrimitiveVec2([comp1, comp2]);
    }
    exports.pvec2 = pvec2;
    function pvec3(comp1, comp2, comp3) {
      return new expr_1.PrimitiveVec3([comp1, comp2, comp3]);
    }
    exports.pvec3 = pvec3;
    function pvec4(comp1, comp2, comp3, comp4) {
      return new expr_1.PrimitiveVec4([comp1, comp2, comp3, comp4]);
    }
    exports.pvec4 = pvec4;
  }
});
var require_powerblur = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/powerblur.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.pblur = exports.PowerBlurLoop = void 0;
    var mergepass_1 = require_mergepass();
    var blurexpr_1 = require_blurexpr();
    var vecexprs_1 = require_vecexprs();
    var expr_1 = require_expr();
    var baseLog = (x, y) => Math.log(y) / Math.log(x);
    var PowerBlurLoop = class extends mergepass_1.EffectLoop {
      constructor(size) {
        const side = blurexpr_1.gauss(expr_1.mut(vecexprs_1.pvec2(size, 0)));
        const up = blurexpr_1.gauss(expr_1.mut(vecexprs_1.pvec2(0, size)));
        const reps = Math.ceil(baseLog(2, size));
        super([side, up], {
          num: reps + 1
        });
        this.size = size;
        this.loopInfo.func = (i) => {
          const distance = this.size / Math.pow(2, i);
          up.setDirection(vecexprs_1.pvec2(0, distance));
          side.setDirection(vecexprs_1.pvec2(distance, 0));
        };
      }
      /** sets the size of the radius */
      setSize(size) {
        this.size = size;
        this.loopInfo.num = Math.ceil(baseLog(2, size));
      }
    };
    exports.PowerBlurLoop = PowerBlurLoop;
    function pblur(size) {
      return new PowerBlurLoop(size);
    }
    exports.pblur = pblur;
  }
});
var require_blur2dloop = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/blur2dloop.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.blur2d = exports.Blur2dLoop = void 0;
    var mergepass_1 = require_mergepass();
    var blurexpr_1 = require_blurexpr();
    var expr_1 = require_expr();
    var vecexprs_1 = require_vecexprs();
    var Blur2dLoop = class extends mergepass_1.EffectLoop {
      constructor(horizontal = expr_1.float(expr_1.mut(1)), vertical = expr_1.float(expr_1.mut(1)), reps = 2, taps, samplerNum) {
        const side = blurexpr_1.gauss(vecexprs_1.vec2(horizontal, 0), taps, samplerNum);
        const up = blurexpr_1.gauss(vecexprs_1.vec2(0, vertical), taps, samplerNum);
        super([side, up], { num: reps });
        this.horizontal = horizontal;
        this.vertical = vertical;
      }
      /**
       * set the horizontal stretch of the blur effect (no greater than 1 for best
       * effect)
       */
      setHorizontal(num) {
        if (!(this.horizontal instanceof expr_1.BasicFloat))
          throw new Error("horizontal expression not basic float");
        this.horizontal.setVal(num);
      }
      /**
       * set the vertical stretch of the blur effect (no greater than 1 for best
       * effect)
       */
      setVertical(num) {
        if (!(this.vertical instanceof expr_1.BasicFloat))
          throw new Error("vertical expression not basic float");
        this.vertical.setVal(num);
      }
    };
    exports.Blur2dLoop = Blur2dLoop;
    function blur2d(horizontalExpr, verticalExpr, reps, taps, samplerNum) {
      return new Blur2dLoop(expr_1.wrapInValue(horizontalExpr), expr_1.wrapInValue(verticalExpr), reps, taps, samplerNum);
    }
    exports.blur2d = blur2d;
  }
});
var require_lenexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/lenexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.len = exports.LenExpr = void 0;
    var expr_1 = require_expr();
    var LenExpr = class extends expr_1.ExprFloat {
      constructor(vec) {
        super(expr_1.tag`length(${vec})`, ["uVec"]);
        this.vec = vec;
      }
      setVec(vec) {
        this.setUniform("uVec" + this.id, vec);
        this.vec = vec;
      }
    };
    exports.LenExpr = LenExpr;
    function len(vec) {
      return new LenExpr(vec);
    }
    exports.len = len;
  }
});
var require_normexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/normexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.norm = exports.NormExpr = void 0;
    var expr_1 = require_expr();
    var NormExpr = class extends expr_1.Operator {
      constructor(vec) {
        super(vec, expr_1.tag`normalize(${vec})`, ["uVec"]);
        this.vec = vec;
      }
      /** sets the vec to normalize */
      setVec(vec) {
        this.setUniform("uVec" + this.id, vec);
        this.vec = vec;
      }
    };
    exports.NormExpr = NormExpr;
    function norm(vec) {
      return new NormExpr(vec);
    }
    exports.norm = norm;
  }
});
var require_fragcoordexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/fragcoordexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.pixel = exports.FragCoordExpr = void 0;
    var expr_1 = require_expr();
    var FragCoordExpr = class extends expr_1.ExprVec2 {
      constructor() {
        super(expr_1.tag`gl_FragCoord.xy`, []);
      }
    };
    exports.FragCoordExpr = FragCoordExpr;
    function pixel() {
      return new FragCoordExpr();
    }
    exports.pixel = pixel;
  }
});
var require_normcenterfragcoordexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/normcenterfragcoordexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.center = exports.NormCenterFragCoordExpr = void 0;
    var expr_1 = require_expr();
    var NormCenterFragCoordExpr = class extends expr_1.ExprVec2 {
      constructor() {
        super(expr_1.tag`(gl_FragCoord.xy / uResolution - 0.5)`, []);
      }
    };
    exports.NormCenterFragCoordExpr = NormCenterFragCoordExpr;
    function center() {
      return new NormCenterFragCoordExpr();
    }
    exports.center = center;
  }
});
var require_brightnessexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/brightnessexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.brightness = exports.Brightness = void 0;
    var glslfunctions_1 = require_glslfunctions();
    var expr_1 = require_expr();
    var fragcolorexpr_1 = require_fragcolorexpr();
    var Brightness = class extends expr_1.ExprVec4 {
      constructor(brightness2, col2 = fragcolorexpr_1.fcolor()) {
        super(expr_1.tag`brightness(${brightness2}, ${col2})`, ["uBrightness", "uColor"]);
        this.brightness = brightness2;
        this.externalFuncs = [glslfunctions_1.glslFuncs.brightness];
      }
      /** set the brightness (should probably be between -1 and 1) */
      setBrightness(brightness2) {
        this.setUniform("uBrightness" + this.id, brightness2);
        this.brightness = expr_1.wrapInValue(brightness2);
      }
    };
    exports.Brightness = Brightness;
    function brightness(val, col2) {
      return new Brightness(expr_1.wrapInValue(val), col2);
    }
    exports.brightness = brightness;
  }
});
var require_contrastexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/contrastexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.contrast = exports.ContrastExpr = void 0;
    var glslfunctions_1 = require_glslfunctions();
    var expr_1 = require_expr();
    var fragcolorexpr_1 = require_fragcolorexpr();
    var ContrastExpr = class extends expr_1.ExprVec4 {
      constructor(contrast2, col2 = fragcolorexpr_1.fcolor()) {
        super(expr_1.tag`contrast(${contrast2}, ${col2})`, ["uVal", "uCol"]);
        this.contrast = contrast2;
        this.externalFuncs = [glslfunctions_1.glslFuncs.contrast];
      }
      /** sets the contrast */
      setContrast(contrast2) {
        this.setUniform("uContrast" + this.id, contrast2);
        this.contrast = expr_1.wrapInValue(contrast2);
      }
    };
    exports.ContrastExpr = ContrastExpr;
    function contrast(val, col2) {
      return new ContrastExpr(expr_1.wrapInValue(val), col2);
    }
    exports.contrast = contrast;
  }
});
var require_grainexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/grainexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.grain = exports.GrainExpr = void 0;
    var glslfunctions_1 = require_glslfunctions();
    var expr_1 = require_expr();
    var GrainExpr = class extends expr_1.ExprVec4 {
      constructor(grain2) {
        super(expr_1.tag`vec4((1.0 - ${grain2} * random(gl_FragCoord.xy)) * gl_FragColor.rgb, gl_FragColor.a);`, ["uGrain"]);
        this.grain = grain2;
        this.externalFuncs = [glslfunctions_1.glslFuncs.random];
        this.needs.centerSample = true;
      }
      /** sets the grain level  */
      setGrain(grain2) {
        this.setUniform("uGrain" + this.id, grain2);
        this.grain = expr_1.wrapInValue(grain2);
      }
    };
    exports.GrainExpr = GrainExpr;
    function grain(val) {
      return new GrainExpr(expr_1.wrapInValue(val));
    }
    exports.grain = grain;
  }
});
var require_changecompexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/changecompexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.changecomp = exports.ChangeCompExpr = void 0;
    var expr_1 = require_expr();
    var getcompexpr_1 = require_getcompexpr();
    function getChangeFunc(typ, id, setter, comps, op = "") {
      return `${typ} changecomp_${id}(${typ} col, ${setter.typeString()} setter) {
  col.${comps} ${op}= setter;
  return col;
}`;
    }
    function checkChangeComponents(comps, setter, vec) {
      if (comps.length !== getcompexpr_1.typeStringToLength(setter.typeString())) {
        throw new Error("components length must be equal to the target float/vec");
      }
      if (duplicateComponents(comps)) {
        throw new Error("duplicate components not allowed on left side");
      }
      getcompexpr_1.checkLegalComponents(comps, vec);
    }
    function duplicateComponents(comps) {
      return new Set(comps.split("")).size !== comps.length;
    }
    var ChangeCompExpr = class extends expr_1.Operator {
      constructor(vec, setter, comps, op) {
        checkChangeComponents(comps, setter, vec);
        const operation = op === "+" ? "plus" : op === "-" ? "minus" : op === "*" ? "mult" : op === "/" ? "div" : "assign";
        const suffix = `${vec.typeString()}_${setter.typeString()}_${comps}_${operation}`;
        super(vec, { sections: [`changecomp_${suffix}(`, ", ", ")"], values: [vec, setter] }, ["uOriginal", "uNew"]);
        this.originalVec = vec;
        this.newVal = setter;
        this.externalFuncs = [
          getChangeFunc(vec.typeString(), suffix, setter, comps, op)
        ];
      }
      /** set the original vector */
      setOriginal(originalVec) {
        this.setUniform("uOriginal" + this.id, originalVec);
        this.originalVec = originalVec;
      }
      /** set the neww vector */
      setNew(newVal) {
        this.setUniform("uNew" + this.id, newVal);
        this.newVal = expr_1.wrapInValue(newVal);
      }
    };
    exports.ChangeCompExpr = ChangeCompExpr;
    function changecomp(vec, setter, comps, op) {
      return new ChangeCompExpr(vec, expr_1.wrapInValue(setter), comps, op);
    }
    exports.changecomp = changecomp;
  }
});
var require_rgbtohsvexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/rgbtohsvexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.rgb2hsv = exports.RGBToHSVExpr = void 0;
    var expr_1 = require_expr();
    var glslfunctions_1 = require_glslfunctions();
    var RGBToHSVExpr = class extends expr_1.ExprVec4 {
      constructor(color2) {
        super(expr_1.tag`rgb2hsv(${color2})`, ["uRGBCol"]);
        this.color = color2;
        this.externalFuncs = [glslfunctions_1.glslFuncs.rgb2hsv];
      }
      /** sets the color to convert */
      setColor(color2) {
        this.setUniform("uRGBCol", color2);
        this.color = color2;
      }
    };
    exports.RGBToHSVExpr = RGBToHSVExpr;
    function rgb2hsv(col2) {
      return new RGBToHSVExpr(col2);
    }
    exports.rgb2hsv = rgb2hsv;
  }
});
var require_hsvtorgbexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/hsvtorgbexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.hsv2rgb = exports.HSVToRGBExpr = void 0;
    var expr_1 = require_expr();
    var glslfunctions_1 = require_glslfunctions();
    var HSVToRGBExpr = class extends expr_1.ExprVec4 {
      constructor(color2) {
        super(expr_1.tag`hsv2rgb(${color2})`, ["uHSVCol"]);
        this.color = color2;
        this.externalFuncs = [glslfunctions_1.glslFuncs.hsv2rgb];
      }
      /** sets the color to convert */
      setColor(color2) {
        this.setUniform("uHSVCol", color2);
        this.color = color2;
      }
    };
    exports.HSVToRGBExpr = HSVToRGBExpr;
    function hsv2rgb(col2) {
      return new HSVToRGBExpr(col2);
    }
    exports.hsv2rgb = hsv2rgb;
  }
});
var require_timeexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/timeexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.time = exports.TimeExpr = void 0;
    var expr_1 = require_expr();
    var TimeExpr = class extends expr_1.ExprFloat {
      constructor() {
        super(expr_1.tag`uTime`, []);
        this.needs.timeUniform = true;
      }
    };
    exports.TimeExpr = TimeExpr;
    function time2() {
      return new TimeExpr();
    }
    exports.time = time2;
  }
});
var require_arity1 = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/arity1.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.a1 = exports.Arity1HomogenousExpr = void 0;
    var expr_1 = require_expr();
    function genArity1SourceList(name, val) {
      return {
        sections: [name + "(", ")"],
        values: [val]
      };
    }
    var Arity1HomogenousExpr = class extends expr_1.Operator {
      constructor(val, operation) {
        super(val, genArity1SourceList(operation, val), ["uVal"]);
        this.val = val;
      }
      /** set the value being passed into the arity 1 homogenous function */
      setVal(val) {
        this.setUniform("uVal" + this.id, val);
        this.val = expr_1.wrapInValue(val);
      }
    };
    exports.Arity1HomogenousExpr = Arity1HomogenousExpr;
    function a1(name, val) {
      return new Arity1HomogenousExpr(expr_1.wrapInValue(val), name);
    }
    exports.a1 = a1;
  }
});
var require_arity2 = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/arity2.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.a2 = exports.Arity2HomogenousExpr = void 0;
    var expr_1 = require_expr();
    function genArity1SourceList(name, val1, val2) {
      return {
        sections: [name + "(", ",", ")"],
        values: [val1, val2]
      };
    }
    var Arity2HomogenousExpr = class extends expr_1.Operator {
      constructor(name, val1, val2) {
        super(val1, genArity1SourceList(name, val1, val2), ["uVal1", "uVal2"]);
        this.val1 = val1;
        this.val2 = val2;
      }
      /** set the first value being passed into the arity 2 homogenous function */
      setFirstVal(val1) {
        this.setUniform("uVal1" + this.id, val1);
        this.val1 = expr_1.wrapInValue(val1);
      }
      /** set the second value being passed into the arity 2 homogenous function */
      setSecondVal(val2) {
        this.setUniform("uVal2" + this.id, val2);
        this.val2 = expr_1.wrapInValue(val2);
      }
    };
    exports.Arity2HomogenousExpr = Arity2HomogenousExpr;
    function a2(name, val1, val2) {
      return new Arity2HomogenousExpr(name, expr_1.wrapInValue(val1), expr_1.wrapInValue(val2));
    }
    exports.a2 = a2;
  }
});
var require_fxaaexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/fxaaexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fxaa = void 0;
    var expr_1 = require_expr();
    var glslfunctions_1 = require_glslfunctions();
    var FXAAExpr = class extends expr_1.ExprVec4 {
      constructor() {
        super(expr_1.tag`fxaa()`, []);
        this.externalFuncs = [glslfunctions_1.glslFuncs.fxaa];
        this.needs.neighborSample = true;
      }
    };
    function fxaa() {
      return new FXAAExpr();
    }
    exports.fxaa = fxaa;
  }
});
var require_channelsampleexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/channelsampleexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.channel = exports.ChannelSampleExpr = void 0;
    var codebuilder_1 = require_codebuilder();
    var expr_1 = require_expr();
    var normfragcoordexpr_1 = require_normfragcoordexpr();
    var glslfunctions_1 = require_glslfunctions();
    function genChannelSampleSource(buf, coord) {
      return {
        sections: ["channel(", `, ${codebuilder_1.channelSamplerName(buf)})`],
        values: [coord]
      };
    }
    var ChannelSampleExpr = class extends expr_1.ExprVec4 {
      constructor(buf, coord = normfragcoordexpr_1.pos()) {
        super(genChannelSampleSource(buf, coord), ["uVec"]);
        this.coord = coord;
        this.externalFuncs = [glslfunctions_1.glslFuncs.channel];
        if (buf !== -1)
          this.needs.extraBuffers = /* @__PURE__ */ new Set([buf]);
        else
          this.needs.neighborSample = true;
      }
      setCoord(coord) {
        this.setUniform("uVec", coord);
        this.coord = coord;
      }
    };
    exports.ChannelSampleExpr = ChannelSampleExpr;
    function channel(channel2, vec) {
      return new ChannelSampleExpr(channel2, vec);
    }
    exports.channel = channel;
  }
});
var require_gaussianexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/gaussianexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.gaussian = exports.GaussianExpr = void 0;
    var glslfunctions_1 = require_glslfunctions();
    var expr_1 = require_expr();
    var GaussianExpr = class extends expr_1.ExprFloat {
      constructor(x, a, b) {
        super(expr_1.tag`gaussian(${x}, ${a}, ${b})`, ["uFloatX", "uFloatA", "uFloatB"]);
        this.x = x;
        this.a = a;
        this.b = b;
        this.externalFuncs = [glslfunctions_1.glslFuncs.gaussian];
      }
      setX(x) {
        this.setUniform("uFloatX" + this.id, x);
        this.x = expr_1.wrapInValue(x);
      }
      setA(a) {
        this.setUniform("uFloatA" + this.id, a);
        this.a = expr_1.wrapInValue(a);
      }
      setB(b) {
        this.setUniform("uFloatB" + this.id, b);
        this.b = expr_1.wrapInValue(b);
      }
    };
    exports.GaussianExpr = GaussianExpr;
    function gaussian(x, a = 0, b = 1) {
      return new GaussianExpr(expr_1.wrapInValue(x), expr_1.wrapInValue(a), expr_1.wrapInValue(b));
    }
    exports.gaussian = gaussian;
  }
});
var require_dofloop = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/dofloop.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dof = exports.DoFLoop = void 0;
    var mergepass_1 = require_mergepass();
    var arity2_1 = require_arity2();
    var blurexpr_1 = require_blurexpr();
    var channelsampleexpr_1 = require_channelsampleexpr();
    var expr_1 = require_expr();
    var gaussianexpr_1 = require_gaussianexpr();
    var getcompexpr_1 = require_getcompexpr();
    var opexpr_1 = require_opexpr();
    var vecexprs_1 = require_vecexprs();
    var DoFLoop = class extends mergepass_1.EffectLoop {
      constructor(depth = expr_1.mut(expr_1.pfloat(0.3)), rad = expr_1.mut(expr_1.pfloat(0.01)), depthInfo = getcompexpr_1.getcomp(channelsampleexpr_1.channel(0), "r"), reps = 2, taps = 13) {
        let guassianExpr = gaussianexpr_1.gaussian(depthInfo, depth, rad);
        const side = blurexpr_1.gauss(vecexprs_1.vec2(arity2_1.a2("pow", opexpr_1.op(1, "-", guassianExpr), 4), 0), taps);
        const up = blurexpr_1.gauss(vecexprs_1.vec2(0, arity2_1.a2("pow", opexpr_1.op(1, "-", guassianExpr), 4)), taps);
        super([side, up], { num: reps });
        this.gaussian = guassianExpr;
      }
      setDepth(depth) {
        this.gaussian.setA(depth);
      }
      setRadius(radius) {
        this.gaussian.setB(radius);
      }
    };
    exports.DoFLoop = DoFLoop;
    function dof(depth, rad, depthInfo, reps) {
      return new DoFLoop(expr_1.wrapInValue(depth), expr_1.wrapInValue(rad), expr_1.wrapInValue(depthInfo), reps);
    }
    exports.dof = dof;
  }
});
var require_truedepthexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/truedepthexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.truedepth = exports.TrueDepthExpr = void 0;
    var expr_1 = require_expr();
    var glslfunctions_1 = require_glslfunctions();
    var TrueDepthExpr = class extends expr_1.ExprFloat {
      constructor(depth) {
        super(expr_1.tag`truedepth(${depth})`, ["uDist"]);
        this.depth = depth;
        this.externalFuncs = [glslfunctions_1.glslFuncs.truedepth];
      }
      /** sets the distance to convert to the true depth */
      setDist(depth) {
        this.setUniform("uDist", depth);
        this.depth = expr_1.wrapInValue(depth);
      }
    };
    exports.TrueDepthExpr = TrueDepthExpr;
    function truedepth(depth) {
      return new TrueDepthExpr(expr_1.wrapInValue(depth));
    }
    exports.truedepth = truedepth;
  }
});
var require_godraysexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/godraysexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.godrays = exports.GodRaysExpr = void 0;
    var glslfunctions_1 = require_glslfunctions();
    var expr_1 = require_expr();
    var fragcolorexpr_1 = require_fragcolorexpr();
    var vecexprs_1 = require_vecexprs();
    var DEFAULT_SAMPLES = 100;
    var GodRaysExpr = class extends expr_1.ExprVec4 {
      // sane godray defaults from https://github.com/Erkaman/glsl-godrays/blob/master/example/index.js
      constructor(col2 = fragcolorexpr_1.fcolor(), exposure = expr_1.mut(1), decay = expr_1.mut(1), density = expr_1.mut(1), weight = expr_1.mut(0.01), lightPos = expr_1.mut(vecexprs_1.pvec2(0.5, 0.5)), samplerNum = 0, numSamples = DEFAULT_SAMPLES, convertDepth) {
        const sourceLists = expr_1.tag`${col2}, ${exposure}, ${decay}, ${density}, ${weight}, ${lightPos}, ${convertDepth !== void 0 ? convertDepth.threshold : expr_1.float(0)}, ${convertDepth !== void 0 ? convertDepth.newColor : vecexprs_1.vec4(0, 0, 0, 0)})`;
        const customName = `godrays${convertDepth !== void 0 ? "_depth" : ""}${numSamples !== 100 ? "_s" + numSamples : ""}(`;
        sourceLists.sections[0] = customName;
        super(sourceLists, [
          "uCol",
          "uExposure",
          "uDecay",
          "uDensity",
          "uWeight",
          "uLightPos",
          "uThreshold",
          "uNewColor"
        ]);
        this.col = col2;
        this.exposure = exposure;
        this.decay = decay;
        this.density = density;
        this.weight = weight;
        this.lightPos = lightPos;
        this.threshold = convertDepth === null || convertDepth === void 0 ? void 0 : convertDepth.threshold;
        this.newColor = convertDepth === null || convertDepth === void 0 ? void 0 : convertDepth.newColor;
        this.funcIndex = ~~(convertDepth !== void 0);
        let customGodRayFunc = glslfunctions_1.glslFuncs.godrays.split("godrays(").join(customName).replace(`NUM_SAMPLES = ${DEFAULT_SAMPLES}`, "NUM_SAMPLES = " + numSamples);
        if (convertDepth !== void 0) {
          customGodRayFunc = customGodRayFunc.replace(/\/\/uncomment\s/g, "");
          this.externalFuncs.push(glslfunctions_1.glslFuncs.depth2occlusion);
        }
        this.externalFuncs.push(customGodRayFunc);
        this.brandExprWithChannel(this.funcIndex, samplerNum);
      }
      /** sets the light color */
      setColor(color2) {
        this.setUniform("uCol" + this.id, color2);
        this.col = color2;
      }
      /** sets the exposure */
      setExposure(exposure) {
        this.setUniform("uExposure" + this.id, exposure);
        this.exposure = expr_1.wrapInValue(exposure);
      }
      /** sets the decay */
      setDecay(decay) {
        this.setUniform("uDecay" + this.id, decay);
        this.decay = expr_1.wrapInValue(decay);
      }
      /** sets the density */
      setDensity(density) {
        this.setUniform("uDensity" + this.id, density);
        this.density = expr_1.wrapInValue(density);
      }
      /** sets the weight */
      setWeight(weight) {
        this.setUniform("uWeight" + this.id, weight);
        this.weight = expr_1.wrapInValue(weight);
      }
      /** sets the light position */
      setLightPos(lightPos) {
        this.setUniform("uLightPos" + this.id, lightPos);
        this.lightPos = lightPos;
      }
      // these only matter when you're using a depth buffer and not an occlusion
      // buffer (although right now, you'll still be able to set them)
      setThreshold(threshold) {
        this.setUniform("uThreshold" + this.id, threshold);
        this.threshold = expr_1.wrapInValue(threshold);
      }
      setNewColor(newColor) {
        this.setUniform("uNewColor" + this.id, newColor);
        this.newColor = newColor;
      }
    };
    exports.GodRaysExpr = GodRaysExpr;
    function godrays(options = {}) {
      return new GodRaysExpr(options.color, expr_1.wrapInValue(options.exposure), expr_1.wrapInValue(options.decay), expr_1.wrapInValue(options.density), expr_1.wrapInValue(options.weight), options.lightPos, options.samplerNum, options.numSamples, options.convertDepth === void 0 ? void 0 : {
        threshold: expr_1.wrapInValue(options.convertDepth.threshold),
        newColor: options.convertDepth.newColor
      });
    }
    exports.godrays = godrays;
  }
});
var require_depthtoocclusionexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/depthtoocclusionexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.depth2occlusion = exports.DepthToOcclusionExpr = void 0;
    var channelsampleexpr_1 = require_channelsampleexpr();
    var expr_1 = require_expr();
    var vecexprs_1 = require_vecexprs();
    var DepthToOcclusionExpr = class extends expr_1.ExprVec4 {
      constructor(depthCol = channelsampleexpr_1.channel(0), newCol = expr_1.mut(vecexprs_1.pvec4(1, 1, 1, 1)), threshold = expr_1.mut(expr_1.pfloat(0.01))) {
        super(expr_1.tag`depth2occlusion(${depthCol}, ${newCol}, ${threshold})`, [
          "uDepth",
          "uNewCol",
          "uThreshold"
        ]);
        this.depthCol = depthCol;
        this.newCol = newCol;
        this.threshold = threshold;
      }
      setDepthColor(depthCol) {
        this.setUniform("uDepth" + this.id, depthCol);
        this.depthCol = depthCol;
      }
      setNewColor(newCol) {
        this.setUniform("uNewCol" + this.id, newCol);
        this.newCol = newCol;
      }
      setThreshold(threshold) {
        this.setUniform("uThreshold" + this.id, threshold);
        this.threshold = expr_1.wrapInValue(threshold);
      }
    };
    exports.DepthToOcclusionExpr = DepthToOcclusionExpr;
    function depth2occlusion(depthCol, newCol, threshold) {
      return new DepthToOcclusionExpr(depthCol, newCol, expr_1.wrapInValue(threshold));
    }
    exports.depth2occlusion = depth2occlusion;
  }
});
var require_resolutionexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/resolutionexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.resolution = exports.ResolutionExpr = void 0;
    var expr_1 = require_expr();
    var ResolutionExpr = class extends expr_1.ExprVec2 {
      constructor() {
        super(expr_1.tag`uResolution`, []);
      }
    };
    exports.ResolutionExpr = ResolutionExpr;
    function resolution() {
      return new ResolutionExpr();
    }
    exports.resolution = resolution;
  }
});
var require_mouseexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/mouseexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mouse = exports.MouseExpr = void 0;
    var expr_1 = require_expr();
    var MouseExpr = class extends expr_1.ExprVec2 {
      constructor() {
        super(expr_1.tag`uMouse`, []);
        this.needs.mouseUniform = true;
      }
    };
    exports.MouseExpr = MouseExpr;
    function mouse() {
      return new MouseExpr();
    }
    exports.mouse = mouse;
  }
});
var require_rotateexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/rotateexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.rotate = exports.RotateExpr = void 0;
    var glslfunctions_1 = require_glslfunctions();
    var expr_1 = require_expr();
    var RotateExpr = class extends expr_1.ExprVec2 {
      constructor(vec, angle) {
        super(expr_1.tag`rotate2d(${vec}, ${angle})`, ["uVec", "uAngle"]);
        this.vec = vec;
        this.angle = angle;
        this.externalFuncs = [glslfunctions_1.glslFuncs.rotate2d];
      }
      /** set the vector to rotate */
      setVec(vec) {
        this.setUniform("uVec" + this.id, vec);
        this.vec = vec;
      }
      /** set the angle to rotate by */
      setAngle(angle) {
        this.setUniform("uAngle" + this.id, angle);
        this.angle = expr_1.wrapInValue(angle);
      }
    };
    exports.RotateExpr = RotateExpr;
    function rotate(vec, angle) {
      return new RotateExpr(vec, expr_1.wrapInValue(angle));
    }
    exports.rotate = rotate;
  }
});
var require_translateexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/translateexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.translate = exports.TranslateExpr = void 0;
    var expr_1 = require_expr();
    var TranslateExpr = class extends expr_1.ExprVec2 {
      constructor(vec, pos2) {
        super(expr_1.tag`(${vec} + ${pos2})`, ["uVec", "uPos"]);
        this.vec = vec;
        this.pos = pos2;
      }
      /** sets the starting position */
      setVec(vec) {
        this.setUniform("uVec" + this.id, vec);
        this.vec = vec;
      }
      /** sets how far the vector will be translated */
      setPos(pos2) {
        this.setUniform("uPos" + this.id, pos2);
        this.pos = pos2;
      }
    };
    exports.TranslateExpr = TranslateExpr;
    function translate(vec, pos2) {
      return new TranslateExpr(vec, pos2);
    }
    exports.translate = translate;
  }
});
var require_normmouseexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/normmouseexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.nmouse = exports.NormMouseExpr = void 0;
    var expr_1 = require_expr();
    var NormMouseExpr = class extends expr_1.ExprVec2 {
      constructor() {
        super(expr_1.tag`(uMouse / uResolution.xy)`, []);
        this.needs.mouseUniform = true;
      }
    };
    exports.NormMouseExpr = NormMouseExpr;
    function nmouse() {
      return new NormMouseExpr();
    }
    exports.nmouse = nmouse;
  }
});
var require_perlinexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/perlinexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fractalize = exports.perlin = exports.PerlinExpr = void 0;
    var glslfunctions_1 = require_glslfunctions();
    var expr_1 = require_expr();
    var opexpr_1 = require_opexpr();
    var PerlinExpr = class extends expr_1.ExprFloat {
      // TODO include a default
      constructor(pos2) {
        super(expr_1.tag`gradientnoise(${pos2})`, ["uPos"]);
        this.pos = pos2;
        this.externalFuncs = [glslfunctions_1.glslFuncs.random2, glslfunctions_1.glslFuncs.gradientnoise];
      }
      /** sets the position to calculate noise value of */
      setPos(pos2) {
        this.setUniform("uPos", pos2);
        this.pos = pos2;
      }
    };
    exports.PerlinExpr = PerlinExpr;
    function perlin(pos2) {
      return new PerlinExpr(pos2);
    }
    exports.perlin = perlin;
    function fractalize(pos2, octaves, func) {
      if (octaves < 0)
        throw new Error("octaves can't be < 0");
      const recurse = (pos22, size, level) => {
        if (level <= 0)
          return expr_1.pfloat(0);
        return opexpr_1.op(func(opexpr_1.op(pos22, "/", size * 2)), "+", recurse(pos22, size / 2, level - 1));
      };
      return recurse(pos2, 0.5, octaves);
    }
    exports.fractalize = fractalize;
  }
});
var require_simplexexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/simplexexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.simplex = exports.SimplexNoise = void 0;
    var glslfunctions_1 = require_glslfunctions();
    var expr_1 = require_expr();
    var SimplexNoise = class extends expr_1.ExprFloat {
      constructor(pos2) {
        super(expr_1.tag`simplexnoise(${pos2})`, ["uPos"]);
        this.pos = pos2;
        this.externalFuncs = [glslfunctions_1.glslFuncs.simplexhelpers, glslfunctions_1.glslFuncs.simplexnoise];
      }
      setPos(pos2) {
        this.setUniform("uPos", pos2);
        this.pos = pos2;
      }
    };
    exports.SimplexNoise = SimplexNoise;
    function simplex(pos2) {
      return new SimplexNoise(pos2);
    }
    exports.simplex = simplex;
  }
});
var require_motionblurloop = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/motionblurloop.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.motionblur = exports.MotionBlurLoop = void 0;
    var mergepass_1 = require_mergepass();
    var channelsampleexpr_1 = require_channelsampleexpr();
    var expr_1 = require_expr();
    var fragcolorexpr_1 = require_fragcolorexpr();
    var opexpr_1 = require_opexpr();
    var MotionBlurLoop = class extends mergepass_1.EffectLoop {
      constructor(target = 0, persistence = expr_1.float(expr_1.mut(0.3))) {
        const col1 = opexpr_1.op(channelsampleexpr_1.channel(target), "*", persistence);
        const col2 = opexpr_1.op(fragcolorexpr_1.fcolor(), "*", opexpr_1.op(1, "-", persistence));
        const effects2 = [
          mergepass_1.loop([opexpr_1.op(col1, "+", col2)]).target(target),
          channelsampleexpr_1.channel(target)
        ];
        super(effects2, { num: 1 });
        this.persistence = persistence;
      }
      /** set the persistence (keep between 0 and 1) */
      setPersistence(float) {
        if (!(this.persistence instanceof expr_1.BasicFloat))
          throw new Error("persistence expression not basic float");
        this.persistence.setVal(float);
      }
    };
    exports.MotionBlurLoop = MotionBlurLoop;
    function motionblur(target, persistence) {
      return new MotionBlurLoop(target, expr_1.wrapInValue(persistence));
    }
    exports.motionblur = motionblur;
  }
});
var require_randomexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/randomexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.random = exports.RandomExpr = void 0;
    var glslfunctions_1 = require_glslfunctions();
    var expr_1 = require_expr();
    var normfragcoordexpr_1 = require_normfragcoordexpr();
    var RandomExpr = class extends expr_1.ExprFloat {
      constructor(seed = normfragcoordexpr_1.pos()) {
        super(expr_1.tag`random(${seed})`, ["uSeed"]);
        this.seed = seed;
        this.externalFuncs = [glslfunctions_1.glslFuncs.random];
      }
      /** sets the seed (vary this over time to get a moving effect) */
      setSeed(seed) {
        this.setUniform("uSeed", seed);
        this.seed = seed;
      }
    };
    exports.RandomExpr = RandomExpr;
    function random(seed) {
      return new RandomExpr(seed);
    }
    exports.random = random;
  }
});
var require_sobelexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/sobelexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sobel = exports.SobelExpr = void 0;
    var glslfunctions_1 = require_glslfunctions();
    var expr_1 = require_expr();
    var SobelExpr = class extends expr_1.ExprVec4 {
      constructor(samplerNum) {
        super(expr_1.tag`sobel()`, []);
        this.externalFuncs = [glslfunctions_1.glslFuncs.sobel];
        this.brandExprWithChannel(0, samplerNum);
      }
    };
    exports.SobelExpr = SobelExpr;
    function sobel(samplerNum) {
      return new SobelExpr(samplerNum);
    }
    exports.sobel = sobel;
  }
});
var require_bloomloop = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/bloomloop.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.bloom = exports.BloomLoop = void 0;
    var mergepass_1 = require_mergepass();
    var arity2_1 = require_arity2();
    var blurexpr_1 = require_blurexpr();
    var brightnessexpr_1 = require_brightnessexpr();
    var channelsampleexpr_1 = require_channelsampleexpr();
    var contrastexpr_1 = require_contrastexpr();
    var expr_1 = require_expr();
    var fragcolorexpr_1 = require_fragcolorexpr();
    var opexpr_1 = require_opexpr();
    var vecexprs_1 = require_vecexprs();
    var BloomLoop = class extends mergepass_1.EffectLoop {
      constructor(threshold = expr_1.float(expr_1.mut(0.4)), horizontal = expr_1.float(expr_1.mut(1)), vertical = expr_1.float(expr_1.mut(1)), boost = expr_1.float(expr_1.mut(1.3)), samplerNum = 1, taps = 9, reps = 3) {
        const bright = expr_1.cfloat(expr_1.tag`((${channelsampleexpr_1.channel(samplerNum)}.r + ${channelsampleexpr_1.channel(samplerNum)}.g + ${channelsampleexpr_1.channel(samplerNum)}.b) / 3.)`);
        const step = arity2_1.a2("step", bright, threshold);
        const col2 = expr_1.cvec4(expr_1.tag`vec4(${channelsampleexpr_1.channel(samplerNum)}.rgb * (1. - ${step}), 1.)`);
        const list = [
          mergepass_1.loop([col2]).target(samplerNum),
          mergepass_1.loop([
            blurexpr_1.gauss(vecexprs_1.vec2(horizontal, 0), taps),
            blurexpr_1.gauss(vecexprs_1.vec2(0, vertical), taps),
            brightnessexpr_1.brightness(0.1),
            contrastexpr_1.contrast(boost)
          ], reps).target(samplerNum),
          opexpr_1.op(fragcolorexpr_1.fcolor(), "+", channelsampleexpr_1.channel(samplerNum))
        ];
        super(list, { num: 1 });
        this.threshold = threshold;
        this.horizontal = horizontal;
        this.vertical = vertical;
        this.boost = boost;
      }
      /**
       * set the horizontal stretch of the blur effect (no greater than 1 for best
       * effect)
       */
      setHorizontal(num) {
        if (!(this.horizontal instanceof expr_1.BasicFloat))
          throw new Error("horizontal expression not basic float");
        this.horizontal.setVal(num);
      }
      /**
       * set the vertical stretch of the blur effect (no greater than 1 for best
       * effect)
       */
      setVertical(num) {
        if (!(this.vertical instanceof expr_1.BasicFloat))
          throw new Error("vertical expression not basic float");
        this.vertical.setVal(num);
      }
      /** set the treshold */
      setThreshold(num) {
        if (!(this.threshold instanceof expr_1.BasicFloat))
          throw new Error("threshold expression not basic float");
        this.threshold.setVal(num);
      }
      /** set the contrast boost */
      setBoost(num) {
        if (!(this.boost instanceof expr_1.BasicFloat))
          throw new Error("boost expression not basic float");
        this.boost.setVal(num);
      }
    };
    exports.BloomLoop = BloomLoop;
    function bloom(threshold, horizontal, vertical, boost, samplerNum, taps, reps) {
      return new BloomLoop(expr_1.wrapInValue(threshold), expr_1.wrapInValue(horizontal), expr_1.wrapInValue(vertical), expr_1.wrapInValue(boost), samplerNum, taps, reps);
    }
    exports.bloom = bloom;
  }
});
var require_monochromeexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/monochromeexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.monochrome = exports.MonochromeExpr = void 0;
    var expr_1 = require_expr();
    var glslfunctions_1 = require_glslfunctions();
    var MonochromeExpr = class extends expr_1.ExprVec4 {
      constructor(color2) {
        super(expr_1.tag`monochrome(${color2})`, ["uColor"]);
        this.externalFuncs = [glslfunctions_1.glslFuncs.monochrome];
        this.color = color2;
      }
      /** sets the color */
      setColor(color2) {
        this.setUniform("uColor", color2);
        this.color = color2;
      }
    };
    exports.MonochromeExpr = MonochromeExpr;
    function monochrome(col2) {
      return new MonochromeExpr(col2);
    }
    exports.monochrome = monochrome;
  }
});
var require_invertexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/invertexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.invert = exports.InvertExpr = void 0;
    var expr_1 = require_expr();
    var glslfunctions_1 = require_glslfunctions();
    var InvertExpr = class extends expr_1.ExprVec4 {
      constructor(color2) {
        super(expr_1.tag`invert(${color2})`, ["uColor"]);
        this.externalFuncs = [glslfunctions_1.glslFuncs.invert];
        this.color = color2;
      }
      /** sets the color */
      setColor(color2) {
        this.setUniform("uColor", color2);
        this.color = color2;
      }
    };
    exports.InvertExpr = InvertExpr;
    function invert(col2) {
      return new InvertExpr(col2);
    }
    exports.invert = invert;
  }
});
var require_edgeexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/edgeexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.edge = exports.EdgeExpr = void 0;
    var brightnessexpr_1 = require_brightnessexpr();
    var expr_1 = require_expr();
    var getcompexpr_1 = require_getcompexpr();
    var invertexpr_1 = require_invertexpr();
    var monochromeexpr_1 = require_monochromeexpr();
    var opexpr_1 = require_opexpr();
    var sobelexpr_1 = require_sobelexpr();
    var EdgeExpr = class extends expr_1.WrappedExpr {
      constructor(mult = expr_1.mut(-1), samplerNum) {
        const operator = opexpr_1.op(getcompexpr_1.getcomp(invertexpr_1.invert(monochromeexpr_1.monochrome(sobelexpr_1.sobel(samplerNum))), "r"), "*", mult);
        super(brightnessexpr_1.brightness(operator));
        this.mult = mult;
        this.operator = operator;
      }
      setMult(mult) {
        this.operator.setRight(mult);
        this.mult = expr_1.wrapInValue(mult);
      }
    };
    exports.EdgeExpr = EdgeExpr;
    function edge(style2, samplerNum) {
      const mult = style2 === "dark" ? -1 : style2 === "light" ? 1 : style2;
      return new EdgeExpr(expr_1.wrapInValue(mult), samplerNum);
    }
    exports.edge = edge;
  }
});
var require_edgecolorexpr = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/exprs/edgecolorexpr.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.edgecolor = exports.EdgeColorExpr = void 0;
    var arity2_1 = require_arity2();
    var expr_1 = require_expr();
    var fragcolorexpr_1 = require_fragcolorexpr();
    var monochromeexpr_1 = require_monochromeexpr();
    var sobelexpr_1 = require_sobelexpr();
    var vecexprs_1 = require_vecexprs();
    var EdgeColorExpr = class extends expr_1.WrappedExpr {
      constructor(color2, samplerNum, stepped = true) {
        const expr = stepped ? expr_1.cvec4(expr_1.tag`mix(${color2}, ${fragcolorexpr_1.fcolor()}, ${monochromeexpr_1.monochrome(arity2_1.a2("step", vecexprs_1.vec4(0.5, 0.5, 0.5, 0), sobelexpr_1.sobel(samplerNum)))})`) : expr_1.cvec4(expr_1.tag`mix(${color2}, ${fragcolorexpr_1.fcolor()}, ${monochromeexpr_1.monochrome(sobelexpr_1.sobel(samplerNum))})`);
        super(expr);
        this.color = color2;
        this.expr = expr;
      }
      setColor(color2) {
        this.expr.setUniform("uCustomName0" + this.expr.id, color2);
        this.color = color2;
      }
    };
    exports.EdgeColorExpr = EdgeColorExpr;
    function edgecolor(color2, samplerNum, stepped) {
      return new EdgeColorExpr(color2, samplerNum, stepped);
    }
    exports.edgecolor = edgecolor;
  }
});
var require_dist = __commonJS({
  "node_modules/@bandaloo/merge-pass/dist/index.js"(exports) {
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !exports2.hasOwnProperty(p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_mergepass(), exports);
    __exportStar(require_exprtypes(), exports);
    __exportStar(require_glslfunctions(), exports);
    __exportStar(require_settings(), exports);
    __exportStar(require_blurexpr(), exports);
    __exportStar(require_fragcolorexpr(), exports);
    __exportStar(require_vecexprs(), exports);
    __exportStar(require_opexpr(), exports);
    __exportStar(require_powerblur(), exports);
    __exportStar(require_blur2dloop(), exports);
    __exportStar(require_lenexpr(), exports);
    __exportStar(require_normexpr(), exports);
    __exportStar(require_fragcoordexpr(), exports);
    __exportStar(require_normfragcoordexpr(), exports);
    __exportStar(require_normcenterfragcoordexpr(), exports);
    __exportStar(require_scenesampleexpr(), exports);
    __exportStar(require_brightnessexpr(), exports);
    __exportStar(require_contrastexpr(), exports);
    __exportStar(require_grainexpr(), exports);
    __exportStar(require_getcompexpr(), exports);
    __exportStar(require_changecompexpr(), exports);
    __exportStar(require_rgbtohsvexpr(), exports);
    __exportStar(require_hsvtorgbexpr(), exports);
    __exportStar(require_timeexpr(), exports);
    __exportStar(require_arity1(), exports);
    __exportStar(require_arity2(), exports);
    __exportStar(require_fxaaexpr(), exports);
    __exportStar(require_channelsampleexpr(), exports);
    __exportStar(require_dofloop(), exports);
    __exportStar(require_truedepthexpr(), exports);
    __exportStar(require_godraysexpr(), exports);
    __exportStar(require_depthtoocclusionexpr(), exports);
    __exportStar(require_resolutionexpr(), exports);
    __exportStar(require_mouseexpr(), exports);
    __exportStar(require_rotateexpr(), exports);
    __exportStar(require_translateexpr(), exports);
    __exportStar(require_normmouseexpr(), exports);
    __exportStar(require_perlinexpr(), exports);
    __exportStar(require_simplexexpr(), exports);
    __exportStar(require_motionblurloop(), exports);
    __exportStar(require_randomexpr(), exports);
    __exportStar(require_sobelexpr(), exports);
    __exportStar(require_bloomloop(), exports);
    __exportStar(require_monochromeexpr(), exports);
    __exportStar(require_invertexpr(), exports);
    __exportStar(require_edgeexpr(), exports);
    __exportStar(require_edgecolorexpr(), exports);
    __exportStar(require_ternaryexpr(), exports);
    __exportStar(require_regiondecorator(), exports);
    __exportStar(require_expr(), exports);
  }
});
var require_foggyrays = __commonJS({
  "node_modules/postpre/dist/foggyrays.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.foggyrays = exports.FoggyRaysExpr = void 0;
    var merge_pass_1 = require_dist();
    var FoggyRaysExpr = class extends merge_pass_1.WrappedExpr {
      constructor(period, speed, throwDistance, numSamples, samplerNum, convertDepthColor) {
        const periodFloat = merge_pass_1.float(period);
        const speedFloat = merge_pass_1.float(speed);
        const throwDistanceFloat = merge_pass_1.float(throwDistance);
        const fog = merge_pass_1.op(merge_pass_1.op(merge_pass_1.simplex(merge_pass_1.op(merge_pass_1.op(merge_pass_1.pos(), "+", merge_pass_1.op(merge_pass_1.op(merge_pass_1.time(), "*", speedFloat), "/", periodFloat)), "*", merge_pass_1.op(merge_pass_1.resolution(), "/", merge_pass_1.op(periodFloat, "*", 2)))), "*", merge_pass_1.simplex(merge_pass_1.op(merge_pass_1.op(merge_pass_1.pos(), "+", merge_pass_1.op(merge_pass_1.op(merge_pass_1.time(), "*", speedFloat), "/", merge_pass_1.op(periodFloat, "*", -2))), "*", merge_pass_1.op(merge_pass_1.resolution(), "/", merge_pass_1.op(periodFloat, "*", 4))))), "*", 0.5);
        const expr = merge_pass_1.godrays({
          weight: 9e-3,
          density: merge_pass_1.op(throwDistanceFloat, "+", merge_pass_1.op(fog, "*", 0.5)),
          convertDepth: convertDepthColor !== void 0 ? { threshold: 0.01, newColor: convertDepthColor } : void 0,
          samplerNum,
          numSamples
        });
        super(expr);
        this.periodFloat = periodFloat;
        this.speedFloat = speedFloat;
        this.throwDistanceFloat = throwDistanceFloat;
        this.godraysExpr = expr;
        this.convertsDepth = convertDepthColor !== void 0;
        this.period = period;
        this.speed = speed;
        this.throwDistance = throwDistance;
      }
      setPeriod(period) {
        this.periodFloat.setVal(merge_pass_1.wrapInValue(period));
        this.period = merge_pass_1.wrapInValue(period);
      }
      setSpeed(speed) {
        this.speedFloat.setVal(merge_pass_1.wrapInValue(speed));
        this.speed = merge_pass_1.wrapInValue(speed);
      }
      setThrowDistance(throwDistance) {
        this.throwDistanceFloat.setVal(merge_pass_1.wrapInValue(throwDistance));
        this.throwDistance = merge_pass_1.wrapInValue(throwDistance);
      }
      setNewColor(newColor) {
        if (this.convertsDepth === void 0) {
          throw new Error("can only set new color if you are converting from a depth buffer");
        }
        this.godraysExpr.setNewColor(newColor);
      }
    };
    exports.FoggyRaysExpr = FoggyRaysExpr;
    function foggyrays(period = merge_pass_1.mut(100), speed = merge_pass_1.mut(1), throwDistance = merge_pass_1.mut(0.3), numSamples = 100, samplerNum, convertDepthColor) {
      return new FoggyRaysExpr(merge_pass_1.wrapInValue(period), merge_pass_1.wrapInValue(speed), merge_pass_1.wrapInValue(throwDistance), numSamples, samplerNum, convertDepthColor);
    }
    exports.foggyrays = foggyrays;
  }
});
var require_vignette = __commonJS({
  "node_modules/postpre/dist/vignette.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.vignette = exports.Vignette = void 0;
    var merge_pass_1 = require_dist();
    var Vignette = class extends merge_pass_1.EffectLoop {
      constructor(blurScalar, brightnessScalar, brightnessExponent) {
        const blurScalarFloat = merge_pass_1.float(blurScalar);
        const brightnessScalarFloat = merge_pass_1.float(brightnessScalar);
        const brightnessExponentFloat = merge_pass_1.float(brightnessExponent);
        const blurLen = merge_pass_1.op(merge_pass_1.len(merge_pass_1.center()), "*", blurScalarFloat);
        const blurExpr = merge_pass_1.blur2d(blurLen, blurLen);
        const brightLen = merge_pass_1.a2("pow", merge_pass_1.len(merge_pass_1.center()), brightnessExponentFloat);
        const brightExpr = merge_pass_1.brightness(merge_pass_1.op(brightLen, "*", merge_pass_1.op(brightnessScalarFloat, "*", -1)));
        super([blurExpr, brightExpr], { num: 1 });
        this.blurScalarFloat = blurScalarFloat;
        this.brightnessScalarFloat = brightnessScalarFloat;
        this.brightnessExponentFloat = brightnessExponentFloat;
        this.blurScalar = blurScalar;
        this.brightnessScalar = brightnessScalar;
        this.brightnessExponent = brightnessExponent;
      }
      setBlurScalar(blurScalar) {
        this.blurScalarFloat.setVal(merge_pass_1.wrapInValue(blurScalar));
        this.blurScalar = merge_pass_1.wrapInValue(blurScalar);
      }
      setBrightnessScalar(brightnessScalar) {
        this.brightnessScalarFloat.setVal(merge_pass_1.wrapInValue(brightnessScalar));
        this.brightnessScalar = merge_pass_1.wrapInValue(brightnessScalar);
      }
      setBrightnessExponent(brightnessExponent) {
        this.brightnessExponentFloat.setVal(merge_pass_1.wrapInValue(brightnessExponent));
        this.brightnessExponent = merge_pass_1.wrapInValue(brightnessExponent);
      }
    };
    exports.Vignette = Vignette;
    function vignette(blurScalar = merge_pass_1.mut(3), brightnessScalar = merge_pass_1.mut(1.8), brightnessExponent = merge_pass_1.mut(1.8)) {
      return new Vignette(merge_pass_1.wrapInValue(blurScalar), merge_pass_1.wrapInValue(brightnessScalar), merge_pass_1.wrapInValue(brightnessExponent));
    }
    exports.vignette = vignette;
  }
});
var require_blurandtrace = __commonJS({
  "node_modules/postpre/dist/blurandtrace.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.blurandtrace = exports.BlurAndTrace = void 0;
    var merge_pass_1 = require_dist();
    var BlurAndTrace = class extends merge_pass_1.EffectLoop {
      constructor(brightness, blurSize, reps, taps, samplerNum, useDepth) {
        const brightnessFloat = merge_pass_1.float(brightness);
        const blurSizeFloat = merge_pass_1.float(blurSize);
        super([
          ...!useDepth ? [merge_pass_1.loop([merge_pass_1.channel(samplerNum)]).target(samplerNum)] : [],
          merge_pass_1.blur2d(blurSizeFloat, blurSizeFloat, reps, taps),
          merge_pass_1.edge(brightnessFloat, samplerNum)
        ], { num: 1 });
        this.brightnessFloat = brightnessFloat;
        this.blurSizeFloat = blurSizeFloat;
        this.brightness = brightness;
        this.blurSize = blurSize;
      }
      setBrightness(brightness) {
        this.brightnessFloat.setVal(merge_pass_1.wrapInValue(brightness));
        this.brightness = merge_pass_1.wrapInValue(brightness);
      }
      setBlurSize(blurSize) {
        this.blurSizeFloat.setVal(merge_pass_1.wrapInValue(blurSize));
        this.blurSize = merge_pass_1.wrapInValue(blurSize);
      }
    };
    exports.BlurAndTrace = BlurAndTrace;
    function blurandtrace(brightness = merge_pass_1.mut(1), blurSize = merge_pass_1.mut(1), reps = 4, taps = 9, samplerNum = 0, useDepth = false) {
      return new BlurAndTrace(merge_pass_1.wrapInValue(brightness), merge_pass_1.wrapInValue(blurSize), reps, taps, samplerNum, useDepth);
    }
    exports.blurandtrace = blurandtrace;
  }
});
var require_lightbands = __commonJS({
  "node_modules/postpre/dist/lightbands.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.lightbands = exports.LightBands = void 0;
    var merge_pass_1 = require_dist();
    var LightBands = class extends merge_pass_1.WrappedExpr {
      constructor(speed, intensity, threshold, samplerNum) {
        const speedFloat = merge_pass_1.float(speed);
        const intensityFloat = merge_pass_1.float(intensity);
        const thresholdFloat = merge_pass_1.float(threshold);
        const expr = merge_pass_1.brightness(merge_pass_1.ternary(merge_pass_1.op(merge_pass_1.getcomp(merge_pass_1.channel(0), "r"), "-", thresholdFloat), merge_pass_1.op(merge_pass_1.a1("sin", merge_pass_1.op(merge_pass_1.op(merge_pass_1.time(), "*", speedFloat), "+", merge_pass_1.truedepth(merge_pass_1.getcomp(merge_pass_1.channel(samplerNum), "r")))), "*", intensityFloat), 0));
        super(expr);
        this.speedFloat = speedFloat;
        this.intensityFloat = intensityFloat;
        this.thresholdFloat = thresholdFloat;
        this.speed = speed;
        this.intensity = intensity;
        this.threshold = threshold;
      }
      setSpeed(speed) {
        this.speedFloat.setVal(merge_pass_1.wrapInValue(speed));
        this.speed = merge_pass_1.wrapInValue(speed);
      }
      setIntensity(intensity) {
        this.intensityFloat.setVal(merge_pass_1.wrapInValue(intensity));
        this.intensity = merge_pass_1.wrapInValue(intensity);
      }
      setThreshold(threshold) {
        this.thresholdFloat.setVal(merge_pass_1.wrapInValue(threshold));
        this.threshold = merge_pass_1.wrapInValue(threshold);
      }
    };
    exports.LightBands = LightBands;
    function lightbands(speed = merge_pass_1.mut(4), intensity = merge_pass_1.mut(0.3), threshold = merge_pass_1.mut(0.01), samplerNum = 0) {
      return new LightBands(merge_pass_1.wrapInValue(speed), merge_pass_1.wrapInValue(intensity), merge_pass_1.wrapInValue(threshold), samplerNum);
    }
    exports.lightbands = lightbands;
  }
});
var require_noisedisplacement = __commonJS({
  "node_modules/postpre/dist/noisedisplacement.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.noisedisplacement = exports.NoiseDisplacement = void 0;
    var merge_pass_1 = require_dist();
    var X_OFF = 1234;
    var Y_OFF = 5678;
    var NoiseDisplacement = class extends merge_pass_1.WrappedExpr {
      constructor(period, speed, intensity) {
        const periodFloat = merge_pass_1.float(period);
        const speedFloat = merge_pass_1.float(speed);
        const intensityFloat = merge_pass_1.float(intensity);
        const noise = (comp) => merge_pass_1.simplex(merge_pass_1.op(merge_pass_1.op(merge_pass_1.changecomp(merge_pass_1.op(merge_pass_1.pos(), "/", periodFloat), merge_pass_1.op(merge_pass_1.time(), "*", speedFloat), comp, "+"), "*", merge_pass_1.op(merge_pass_1.resolution(), "/", merge_pass_1.getcomp(merge_pass_1.resolution(), "y"))), "+", comp === "x" ? X_OFF : Y_OFF));
        super(merge_pass_1.channel(-1, merge_pass_1.op(merge_pass_1.op(merge_pass_1.op(merge_pass_1.vec2(noise("x"), noise("y")), "*", intensityFloat), "*", merge_pass_1.op(merge_pass_1.get2comp(merge_pass_1.resolution(), "yx"), "/", merge_pass_1.getcomp(merge_pass_1.resolution(), "y"))), "+", merge_pass_1.pos())));
        this.periodFloat = periodFloat;
        this.speedFloat = speedFloat;
        this.intensityFloat = intensityFloat;
        this.period = period;
        this.speed = speed;
        this.intensity = intensity;
      }
      setPeriod(period) {
        this.periodFloat.setVal(merge_pass_1.wrapInValue(period));
        this.period = merge_pass_1.wrapInValue(period);
      }
      setSpeed(speed) {
        this.speedFloat.setVal(merge_pass_1.wrapInValue(speed));
        this.speed = merge_pass_1.wrapInValue(speed);
      }
      setIntensity(intensity) {
        this.intensityFloat.setVal(merge_pass_1.wrapInValue(intensity));
        this.speed = merge_pass_1.wrapInValue(intensity);
      }
    };
    exports.NoiseDisplacement = NoiseDisplacement;
    function noisedisplacement(period = merge_pass_1.mut(0.1), speed = merge_pass_1.mut(1), intensity = merge_pass_1.mut(5e-3)) {
      return new NoiseDisplacement(merge_pass_1.wrapInValue(period), merge_pass_1.wrapInValue(speed), merge_pass_1.wrapInValue(intensity));
    }
    exports.noisedisplacement = noisedisplacement;
  }
});
var require_oldfilm = __commonJS({
  "node_modules/postpre/dist/oldfilm.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.oldfilm = exports.OldFilm = void 0;
    var merge_pass_1 = require_dist();
    var OldFilm = class extends merge_pass_1.WrappedExpr {
      constructor(speckIntensity, lineIntensity, grainIntensity) {
        const speckIntensityFloat = merge_pass_1.float(speckIntensity);
        const lineIntensityFloat = merge_pass_1.float(lineIntensity);
        const grainIntensityFloat = merge_pass_1.float(grainIntensity);
        const ftime = merge_pass_1.a1("floor", merge_pass_1.op(merge_pass_1.time(), "*", 24));
        const grainy = merge_pass_1.op(merge_pass_1.random(merge_pass_1.op(merge_pass_1.pixel(), "+", merge_pass_1.a2("mod", merge_pass_1.op(ftime, "*", 99), 3e3))), "*", grainIntensityFloat);
        const rate = 10;
        const triangles = merge_pass_1.op(merge_pass_1.op(merge_pass_1.op(merge_pass_1.a1("abs", merge_pass_1.op(merge_pass_1.op(2, "*", merge_pass_1.a1("fract", merge_pass_1.op(rate, "*", merge_pass_1.getcomp(merge_pass_1.pos(), "x")))), "-", 1)), "-", 0.5), "*", 2), "*", lineIntensityFloat);
        const stepping = merge_pass_1.a2("step", merge_pass_1.op(1, "-", merge_pass_1.op(1, "/", rate * 12)), merge_pass_1.a2("mod", merge_pass_1.op(merge_pass_1.getcomp(merge_pass_1.pos(), "x"), "+", merge_pass_1.random(merge_pass_1.op(merge_pass_1.vec2(50, 50), "*", merge_pass_1.time()))), 1));
        const lines = merge_pass_1.op(triangles, "*", stepping);
        const spos = merge_pass_1.a2("mod", merge_pass_1.op(merge_pass_1.op(merge_pass_1.pos(), "*", merge_pass_1.op(merge_pass_1.resolution(), "/", merge_pass_1.getcomp(merge_pass_1.resolution(), "y"))), "+", ftime), merge_pass_1.vec2(100, 100));
        const fsimplex = merge_pass_1.op(merge_pass_1.op(merge_pass_1.simplex(merge_pass_1.op(spos, "*", 7)), "*", 0.44), "+", 0.5);
        const spots = merge_pass_1.op(merge_pass_1.a2("step", fsimplex, 0.08), "*", speckIntensityFloat);
        super(merge_pass_1.monochrome(merge_pass_1.brightness(spots, merge_pass_1.brightness(lines, merge_pass_1.brightness(grainy)))));
        this.speckIntensityFloat = speckIntensityFloat;
        this.lineIntensityFloat = lineIntensityFloat;
        this.grainIntensityFloat = grainIntensityFloat;
        this.speckIntensity = speckIntensity;
        this.lineIntensity = lineIntensity;
        this.grainIntensity = grainIntensity;
      }
      setSpeckIntensity(speckIntensity) {
        this.speckIntensityFloat.setVal(merge_pass_1.wrapInValue(speckIntensity));
        this.speckIntensity = merge_pass_1.wrapInValue(speckIntensity);
      }
      setLineIntensity(lineIntensity) {
        this.lineIntensityFloat.setVal(merge_pass_1.wrapInValue(lineIntensity));
        this.lineIntensity = merge_pass_1.wrapInValue(lineIntensity);
      }
      setGrainIntensity(grainIntensity) {
        this.grainIntensityFloat.setVal(merge_pass_1.wrapInValue(grainIntensity));
        this.grainIntensity = merge_pass_1.wrapInValue(grainIntensity);
      }
    };
    exports.OldFilm = OldFilm;
    function oldfilm(speckIntensity = merge_pass_1.mut(0.4), lineIntensity = merge_pass_1.mut(0.12), grainIntensity = merge_pass_1.mut(0.11)) {
      return new OldFilm(merge_pass_1.wrapInValue(speckIntensity), merge_pass_1.wrapInValue(lineIntensity), merge_pass_1.wrapInValue(grainIntensity));
    }
    exports.oldfilm = oldfilm;
  }
});
var require_kaleidoscope = __commonJS({
  "node_modules/postpre/dist/kaleidoscope.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.kaleidoscope = exports.Kaleidoscope = void 0;
    var merge_pass_1 = require_dist();
    var Kaleidoscope = class extends merge_pass_1.WrappedExpr {
      constructor(sides, scale) {
        const sidesFloat = merge_pass_1.float(sides);
        const scaleFloat = merge_pass_1.float(scale);
        const tpos = merge_pass_1.op(merge_pass_1.translate(merge_pass_1.pos(), merge_pass_1.vec2(-0.5, -0.5)), "/", scaleFloat);
        const angle = merge_pass_1.a2("atan", merge_pass_1.getcomp(tpos, "y"), merge_pass_1.getcomp(tpos, "x"));
        const b = merge_pass_1.op(2 * Math.PI, "*", merge_pass_1.op(1, "/", sidesFloat));
        const mangle = merge_pass_1.op(merge_pass_1.a1("floor", merge_pass_1.op(angle, "/", b)), "*", b);
        const a = merge_pass_1.op(angle, "-", mangle);
        const flip = merge_pass_1.op(b, "-", merge_pass_1.op(2, "*", a));
        const sign = merge_pass_1.a1("floor", merge_pass_1.op(merge_pass_1.a2("mod", merge_pass_1.op(mangle, "+", 0.1), merge_pass_1.op(b, "*", 2)), "/", b));
        const spos = merge_pass_1.translate(merge_pass_1.rotate(tpos, merge_pass_1.op(mangle, "-", merge_pass_1.op(flip, "*", sign))), merge_pass_1.vec2(0.5, 0.5));
        super(merge_pass_1.channel(-1, spos));
        this.sidesFloat = sidesFloat;
        this.scaleFloat = scaleFloat;
        this.sides = sides;
        this.scale = scale;
      }
      setSides(sides) {
        this.sidesFloat.setVal(merge_pass_1.wrapInValue(sides));
        this.sides = merge_pass_1.wrapInValue(sides);
      }
      setScale(scale) {
        this.scaleFloat.setVal(merge_pass_1.wrapInValue(scale));
        this.scale = merge_pass_1.wrapInValue(scale);
      }
    };
    exports.Kaleidoscope = Kaleidoscope;
    function kaleidoscope(sides = merge_pass_1.mut(8), scale = merge_pass_1.mut(1)) {
      return new Kaleidoscope(merge_pass_1.wrapInValue(sides), merge_pass_1.wrapInValue(scale));
    }
    exports.kaleidoscope = kaleidoscope;
  }
});
var require_celshade = __commonJS({
  "node_modules/postpre/dist/celshade.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.celshade = exports.CelShade = void 0;
    var merge_pass_1 = require_dist();
    var CelShade = class extends merge_pass_1.WrappedExpr {
      constructor(mult, bump, center, edge) {
        const multFloat = merge_pass_1.float(mult);
        const bumpFloat = merge_pass_1.float(bump);
        const centerFloat = merge_pass_1.float(center);
        const edgeFloat = merge_pass_1.float(edge);
        const smooth = merge_pass_1.cfloat(merge_pass_1.tag`(smoothstep(-${edgeFloat} + ${centerFloat}, ${edgeFloat} + ${centerFloat}, ${merge_pass_1.rgb2hsv(merge_pass_1.fcolor())}.z) * ${multFloat} + ${bumpFloat})`);
        const expr = merge_pass_1.hsv2rgb(merge_pass_1.changecomp(merge_pass_1.rgb2hsv(merge_pass_1.fcolor()), smooth, "z"));
        super(expr);
        this.multFloat = multFloat;
        this.bumpFloat = bumpFloat;
        this.centerFloat = centerFloat;
        this.edgeFloat = edgeFloat;
        this.mult = mult;
        this.bump = bump;
        this.center = center;
        this.edge = edge;
      }
      setMult(mult) {
        this.multFloat.setVal(merge_pass_1.wrapInValue(mult));
        this.mult = merge_pass_1.wrapInValue(mult);
      }
      setBump(bump) {
        this.bumpFloat.setVal(merge_pass_1.wrapInValue(bump));
        this.bump = merge_pass_1.wrapInValue(bump);
      }
      setCenter(center) {
        this.centerFloat.setVal(merge_pass_1.wrapInValue(center));
        this.center = merge_pass_1.wrapInValue(center);
      }
      setEdge(edge) {
        this.edgeFloat.setVal(merge_pass_1.wrapInValue(edge));
        this.edge = merge_pass_1.wrapInValue(edge);
      }
    };
    exports.CelShade = CelShade;
    function celshade(mult = merge_pass_1.mut(0.8), bump = merge_pass_1.mut(0.3), center = merge_pass_1.mut(0.3), edge = merge_pass_1.mut(0.03)) {
      return new CelShade(merge_pass_1.wrapInValue(mult), merge_pass_1.wrapInValue(bump), merge_pass_1.wrapInValue(center), merge_pass_1.wrapInValue(edge));
    }
    exports.celshade = celshade;
  }
});
var require_dist2 = __commonJS({
  "node_modules/postpre/dist/index.js"(exports) {
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !exports2.hasOwnProperty(p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_foggyrays(), exports);
    __exportStar(require_vignette(), exports);
    __exportStar(require_blurandtrace(), exports);
    __exportStar(require_lightbands(), exports);
    __exportStar(require_noisedisplacement(), exports);
    __exportStar(require_oldfilm(), exports);
    __exportStar(require_kaleidoscope(), exports);
    __exportStar(require_celshade(), exports);
  }
});
const __vite__cjsImport0_postpre = require_dist2();
const __vite__cjsImport1__bandaloo_mergePass = require_dist();
const P = __vite__cjsImport0_postpre;
const MP = __vite__cjsImport1__bandaloo_mergePass;
const canvas = document.getElementById("gl"), processed = document.getElementById("processed"), gl$1 = processed.getContext("webgl");
var effectParams = {
  kal: { side: 12, size: 1 },
  blur: { brightness: 1, blurSize: 1, reps: 4, taps: 9, samplerNum: 0, useDepth: false },
  celShade: { mult: 0.8, bump: 0.3, center: 0.3, edge: 0.3 },
  foggyRays: { period: 100, speed: 1, throwDistance: 0.3, numSamples: 100, samplerNum: void 0 },
  light: { speed: 4, intensity: 0.3, threshold: 0.01, samplerNum: 0 },
  noise: { period: 0.1, speed: 1, intensity: 5e-3 },
  oldFilm: { speckIntensity: 0.4, lineIntensity: 0.12, grainIntensity: 0.11 },
  vignette: { blurScalar: 3, brightnessScalar: 1.8, brightnessExponent: 1.8 }
}, processCanvas = false;
function kal() {
  if (!processCanvas) {
    swapCanvas();
  }
  let ka;
  const merger = new MP.Merger(
    [ka = P.kaleidoscope(effectParams.kal.side, effectParams.kal.side)],
    canvas,
    gl$1
  );
  let frame = 0;
  const step = (t = 0) => {
    merger.draw(t / 1e3);
    requestAnimationFrame(step);
    frame++;
  };
  step(0);
}
function postEffect(effect) {
  if (!processCanvas) {
    swapCanvas();
  }
  gl$1.clear(gl$1.COLOR_CLEAR_VALUE);
  var merger;
  switch (effect) {
    case "kal":
      let ka;
      merger = new MP.Merger(
        [ka = P.kaleidoscope(effectParams.kal.side, effectParams.kal.side)],
        canvas,
        gl$1
      );
      break;
    case "blur":
      let bt;
      merger = new MP.Merger(
        [bt = P.blurandtrace(
          effectParams.blur.brightness,
          effectParams.blur.blurSize,
          effectParams.blur.reps,
          effectParams.blur.taps,
          effectParams.blur.samplerNum
        )],
        canvas,
        gl$1
      );
      break;
    case "celShade":
      let cs;
      merger = new MP.Merger(
        [cs = P.celShade(
          effectParams.celShade.mult,
          effectParams.celShade.bump,
          effectParams.celShade.center,
          effectParams.celShade.edge
        )],
        canvas,
        gl$1
      );
      break;
    case "foggyRays":
      let fg;
      merger = new MP.Merger(
        [fg = P.foggyrays(
          effectParams.foggyRays.period,
          effectParams.foggyRays.speed,
          effectParams.foggyRays.throwDistance,
          effectParams.foggyRays.numSamples,
          effectParams.foggyRays.samplerNum
        )],
        canvas,
        gl$1
      );
      break;
    case "light":
      let lb;
      merger = new MP.Merger(
        [lb = P.lightbands(
          effectParams.light.speed,
          effectParams.foggyRays.intensity,
          effectParams.foggyRays.threshold,
          effectParams.foggyRays.samplerNum
        )],
        canvas,
        gl$1
      );
      break;
    case "noise":
      let nd;
      merger = new MP.Merger(
        [nd = P.noisedisplacement(
          effectParams.noise.period,
          effectParams.noise.speed,
          effectParams.noise.intensity
        )],
        canvas,
        gl$1
      );
      break;
    case "oldFilm":
      let olf;
      merger = new MP.Merger(
        [olf = P.oldfilm(
          effectParams.oldFilm.speckIntensity,
          effectParams.oldFilm.lineIntensity,
          effectParams.oldFilm.grainIntensity
        )],
        canvas,
        gl$1
      );
      break;
    case "vignette":
      let v;
      merger = new MP.Merger(
        [v = P.vignette(
          effectParams.vignette.blurScalar,
          effectParams.vignette.brightnessScalar,
          effectParams.vignette.brightnessExponent
        )],
        canvas,
        gl$1
      );
      break;
  }
  let frame = 0;
  const step = (t = 0) => {
    merger.draw(t / 1e3);
    requestAnimationFrame(step);
    frame++;
  };
  step(0);
}
function noEffect() {
  if (processCanvas) {
    gl$1.clear(gl$1.COLOR_CLEAR_VALUE);
    swapCanvas();
  }
}
function swapCanvas() {
  console.log("swapping");
  if (processCanvas) {
    canvas.style.zIndex = 0;
    processed.style.zIndex = -1;
  } else {
    canvas.style.zIndex = -1;
    processed.style.zIndex = 0;
  }
  processCanvas = !processCanvas;
}
function setEffect(effect, at, val) {
  effectParams[effect][at] = val;
  console.log(effectParams[effect][at]);
  postEffect(effect);
}
const Effects = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  kal,
  noEffect,
  postEffect,
  setEffect
}, Symbol.toStringTag, { value: "Module" }));
var shape = Shape, parser = Parser, col = Col, graph = Graph, effects = Effects;
let gl, framebuffer, simulationProgram, drawProgram, uTime, uSimulationState, uRes, uAudio, uDA, uDB, uFeed, uKill, uSize, uDiffuse, uColA, uColB, uAutomata, textureBack, textureFront, dimensions = { width: null, height: null }, diffuse = false, automata = false, colA = col.getColor("A"), colB = col.getColor("B"), audio, audioData, bufferLength, analyser, audioContext, audioElement, uVar = {
  dA: [1, false, 0, 1],
  dB: [0.5, false, 0, 1],
  f: [0.055, false, 0, 0.1],
  k: [0.062, false, 0, 0.1]
}, playing = false, mic = false, width, height, previous_time = 0;
const presets = [
  { dA: 1, dB: 0.2, f: 0.029, k: 0.057 },
  { dA: 0.21, dB: 0.105, f: 0.022, k: 0.049 },
  { dA: 0.21, dB: 0.105, f: 0.015, k: 0.049 },
  { dA: 0.21, dB: 0.105, f: 0.049, k: 0.061 }
];
let prevShuffle = -1;
window.onload = function() {
  document.getElementById("infoContainer").style.visibility = "visible";
  document.getElementById("paramContainer").style.visibility = "visible";
  document.getElementById("paramB").style.visibility = "visible";
  document.getElementById("loading").style.display = "none";
  navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(function(stream) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioElement = document.querySelector("audio");
    const track = audioContext.createMediaElementSource(audioElement);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    bufferLength = analyser.frequencyBinCount;
    audio = new Uint8Array(bufferLength);
    track.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.getByteFrequencyData(audio);
    mic = true;
    if (playing) {
      audioElement.play();
    }
    audioElement.addEventListener(
      "ended",
      () => {
      },
      false
    );
  });
  const canvas = document.getElementById("gl"), processed = document.getElementById("processed");
  gl = canvas.getContext("webgl");
  width = canvas.width = processed.width = dimensions.width = document.body.clientWidth;
  height = canvas.height = processed.height = dimensions.height = document.body.clientHeight;
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  makeBuffer();
  makeShaders();
  makeTextures();
  setInitialState();
  const cm = CodeMirror(document.getElementById("editor"), {
    value: ``,
    mode: "javascript",
    lineNumbers: true,
    colorpicker: {
      mode: "edit",
      type: "mini",
      outputFormat: "hex"
      //doesn't work
    }
  });
  cm.setOption("extraKeys", {
    "Ctrl-Enter": function(cm) {
      var code = cm.getValue();
      var parsedCode = parser.parse(code);
      console.log(parsedCode);
      eval("(" + parsedCode + ")");
    },
    "Shift-Enter": function(cm2) {
      runSelected(cm2);
    }
  });
  var helpIcon = document.getElementById("helpIcon"), overlay = document.getElementById("popupContainer"), shuffleIcon = document.getElementById("shuffleIcon"), tabHeader = document.getElementsByClassName("tab-header")[0], tabIndicator = document.getElementsByClassName("tab-indicator")[0], tabBody = document.getElementsByClassName("tab-body")[0], tabs = tabHeader.getElementsByTagName("div"), paramB = document.getElementById("paramB");
  helpIcon.addEventListener("click", (e) => {
    let popup = document.getElementById("helpPopup");
    popup.classList.add("open-popup");
    overlay.style.visibility = "visible";
    console.log("click");
  });
  overlay.addEventListener("click", (e) => {
    let popups = document.getElementsByClassName("popup");
    overlay.style.visibility = "hidden";
    for (let p of popups) {
      p.classList.remove("open-popup");
    }
  });
  shuffleIcon.addEventListener("click", (e) => {
    let i = Math.floor(Math.random() * (presets.length - 1));
    while (i === prevShuffle) {
      i = Math.floor(Math.random() * (presets.length - 1));
    }
    console.log(i);
    uVar.dA[0] = presets[i].dA;
    uVar.dB[0] = presets[i].dB;
    uVar.f[0] = presets[i].f;
    uVar.k[0] = presets[i].k;
    uVar.dA[1] = false;
    uVar.dB[1] = false;
    uVar.f[1] = false;
    uVar.k[1] = false;
    prevShuffle = i;
  });
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", (e) => {
      tabHeader.getElementsByClassName("active-tab")[0].classList.remove("active-tab");
      tabs[i].classList.add("active-tab");
      tabBody.getElementsByClassName("active-tab")[0].classList.remove("active-tab");
      tabBody.getElementsByTagName("div")[i].classList.add("active-tab");
      tabIndicator.style.left = `calc(calc(100% / 5) * ${i})`;
    });
  }
  paramB.addEventListener("click", (e) => {
    var paramContent = document.getElementsByClassName("paramContent");
    console.log("click");
    for (var i = 0; i < paramContent.length; i++) {
      if (paramContent[i].style.display === "none") {
        paramContent[i].style.display = "block";
      } else {
        paramContent[i].style.display = "none";
      }
    }
  });
  paramInfo();
};
function paramInfo() {
  var printParams = document.getElementById("textParams");
  while (printParams.firstChild) {
    printParams.removeChild(printParams.firstChild);
  }
  for (let v in uVar) {
    let varInfo = document.createElement("p");
    let num = parseFloat(uVar[v][0]).toFixed(4);
    varInfo.textContent = v + ": " + num + "\n";
    printParams.append(varInfo);
  }
}
function poke(x, y, r, g, b, texture) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texSubImage2D(
    gl.TEXTURE_2D,
    0,
    // x offset, y offset, width, height
    x,
    y,
    1,
    1,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    // is supposed to be a typed array
    new Uint8Array([r, g, b, 255])
  );
}
var poking = function poking2(x, y, r, g, b) {
  poke(x, y, r, g, b, textureBack);
};
function setInitialState() {
  gl.uniform1f(uDA, uVar.dA[0]);
  gl.uniform1f(uDB, uVar.dB[0]);
  gl.uniform1f(uFeed, uVar.f[0]);
  gl.uniform1f(uKill, uVar.k[0]);
  shape.fill();
}
function makeBuffer() {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  const triangles = new Float32Array([
    -1,
    -1,
    1,
    -1,
    -1,
    1,
    -1,
    1,
    1,
    -1,
    1,
    1
  ]);
  gl.bufferData(gl.ARRAY_BUFFER, triangles, gl.STATIC_DRAW);
}
function makeShaders() {
  let shaderScript = document.getElementById("vertex");
  let shaderSource = shaderScript.text;
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, shaderSource);
  gl.compileShader(vertexShader);
  shaderScript = document.getElementById("render");
  shaderSource = shaderScript.text;
  const drawFragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(drawFragmentShader, shaderSource);
  gl.compileShader(drawFragmentShader);
  console.log(gl.getShaderInfoLog(drawFragmentShader));
  drawProgram = gl.createProgram();
  gl.attachShader(drawProgram, vertexShader);
  gl.attachShader(drawProgram, drawFragmentShader);
  gl.linkProgram(drawProgram);
  gl.useProgram(drawProgram);
  uRes = gl.getUniformLocation(drawProgram, "resolution");
  uColA = gl.getUniformLocation(drawProgram, "colA");
  uColB = gl.getUniformLocation(drawProgram, "colB");
  colA = col.getColor("A");
  colB = col.getColor("B");
  gl.uniform2f(uRes, gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.uniform3f(uColA, colA[0], colA[1], colA[2]);
  gl.uniform3f(uColB, colB[0], colB[1], colB[2]);
  let position = gl.getAttribLocation(drawProgram, "a_position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  shaderScript = document.getElementById("simulation");
  shaderSource = shaderScript.text;
  const simulationFragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(simulationFragmentShader, shaderSource);
  gl.compileShader(simulationFragmentShader);
  console.log(gl.getShaderInfoLog(simulationFragmentShader));
  simulationProgram = gl.createProgram();
  gl.attachShader(simulationProgram, vertexShader);
  gl.attachShader(simulationProgram, simulationFragmentShader);
  gl.linkProgram(simulationProgram);
  gl.useProgram(simulationProgram);
  uRes = gl.getUniformLocation(simulationProgram, "resolution");
  gl.uniform2f(uRes, gl.drawingBufferWidth, gl.drawingBufferHeight);
  uTime = gl.getUniformLocation(simulationProgram, "time");
  uDA = gl.getUniformLocation(simulationProgram, "dA");
  uDB = gl.getUniformLocation(simulationProgram, "dB");
  uFeed = gl.getUniformLocation(simulationProgram, "feed");
  uKill = gl.getUniformLocation(simulationProgram, "kill");
  uSize = gl.getUniformLocation(simulationProgram, "size");
  uDiffuse = gl.getUniformLocation(simulationProgram, "diffuse");
  uAutomata = gl.getUniformLocation(simulationProgram, "automata");
  uAudio = gl.getUniformLocation(simulationProgram, "audioData");
  uSimulationState = gl.getUniformLocation(simulationProgram, "state");
  position = gl.getAttribLocation(simulationProgram, "a_position");
  gl.enableVertexAttribArray(simulationProgram);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
}
function makeTextures() {
  gl.getExtension("EXT_color_buffer_float");
  textureBack = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, textureBack);
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
  framebuffer = gl.createFramebuffer();
  render();
}
let time = 0;
function render() {
  window.requestAnimationFrame(render);
  gl.useProgram(simulationProgram);
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
    for (let v in uVar) {
      if (uVar[v][1] === true) {
        let min = uVar[v][2], max = uVar[v][3];
        audioData = map(audioData, 0, 200, min, max);
        uVar[v][0] = audioData;
      }
    }
  }
  time++;
  colA = col.getColor("A");
  colB = col.getColor("B");
  gl.uniform1f(uTime, time);
  gl.uniform1f(uDA, uVar.dA[0]);
  gl.uniform1f(uDB, uVar.dB[0]);
  gl.uniform1f(uFeed, uVar.f[0]);
  gl.uniform1f(uKill, uVar.k[0]);
  gl.uniform1f(uDiffuse, diffuse);
  gl.uniform1f(uAutomata, automata);
  gl.uniform1f(uAudio, audioData);
  if (time % 100 === 0) {
    paramInfo();
    graph.update(uVar, time);
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(
    // use the framebuffer to write to our texFront texture
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    textureFront,
    0
  );
  gl.viewport(0, 0, dimensions.width, dimensions.height);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, textureBack);
  gl.uniform1i(uSimulationState, 0);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  if (automata) {
    var now = Date.now();
    var frame_rate = 100;
    var elapsed_time = now - previous_time;
    if (elapsed_time >= frame_rate) {
      let tmp = textureFront;
      textureFront = textureBack;
      textureBack = tmp;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, dimensions.width, dimensions.height);
      gl.bindTexture(gl.TEXTURE_2D, textureFront);
      gl.useProgram(drawProgram);
      gl.uniform3f(uColA, colA[0], colA[1], colA[2]);
      gl.uniform3f(uColB, colB[0], colB[1], colB[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      previous_time = now;
    }
  } else {
    let tmp = textureFront;
    textureFront = textureBack;
    textureBack = tmp;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, dimensions.width, dimensions.height);
    gl.bindTexture(gl.TEXTURE_2D, textureFront);
    gl.useProgram(drawProgram);
    gl.uniform3f(uColA, colA[0], colA[1], colA[2]);
    gl.uniform3f(uColB, colB[0], colB[1], colB[2]);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}
function map(value, min1, max1, min2, max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
function getK(c) {
  return map(c, 0, 255, 0.045, 0.1);
}
function reset() {
  setInitialState();
}
function setDiffuse(x) {
  diffuse = x;
  gl.uniform1f(uDiffuse, diffuse);
}
function rateA(x) {
  if (x === "audio") {
    uVar.dA[1] = true;
    let min = uVar.dA[2], max = uVar.dA[3];
    audioData = map(audioData, 0, 150, min, max);
    uVar.dA[0] = audioData;
  } else {
    uVar.dA[1] = false;
    uVar.dA[0] = x;
  }
  gl.uniform1f(uDA, uVar.dA[0]);
}
function rateB(x) {
  if (x === "audio") {
    uVar.dB[1] = true;
    let min = uVar.dB[2], max = uVar.dB[3];
    audioData = map(audioData, 0, 150, min, max);
    uVar.dB[0] = audioData;
  } else {
    uVar.dB[1] = false;
    uVar.dB[0] = x;
  }
  gl.uniform1f(uDB, uVar.dB[0]);
}
function kill(x) {
  if (x === "audio") {
    uVar.k[1] = true;
    let min = uVar.k[2], max = uVar.k[3];
    audioData = map(audioData, 0, 150, min, max);
    uVar.k[0] = audioData;
  } else {
    uVar.k[1] = false;
    uVar.k[0] = x;
  }
  gl.uniform1f(uKill, uVar.k[0]);
}
function feed(x) {
  if (x === "audio") {
    console.log("audio");
    uVar.f[1] = true;
    let min = uVar.f[2], max = uVar.f[3];
    audioData = map(audioData, 0, 150, min, max);
    uVar.f[0] = audioData;
  } else {
    uVar.f[1] = false;
    uVar.f[0] = x;
  }
  gl.uniform1f(uFeed, uVar.f[0]);
}
function setAutomata(x) {
  console.log("auto = " + x);
  automata = x;
  gl.uniform1f(uAutomata, automata);
}
function playMusic(track) {
  if (checkAudio(track)) {
    var audioFile = document.getElementsByClassName("audio-input")[track - 1].files[0];
    var fr = new FileReader();
    fr.onload = (e) => {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      ctx.decodeAudioData(e.target.result).then(function(buffer) {
        var audioSource = ctx.createBufferSource();
        audioSource.buffer = buffer;
      });
    };
    fr.readAsArrayBuffer(audioFile);
    const urlObj = URL.createObjectURL(audioFile);
    audioElement.addEventListener("load", () => {
      URL.revokeObjectURL(urlObj);
    });
    audioElement.src = urlObj;
    playing = true;
    audioElement.play();
  } else {
    console.log("audio file is invalid");
  }
  function checkAudio(track2) {
    let audioFile2 = document.getElementsByClassName("audio-input")[track2 - 1].files[0];
    if (audioFile2 !== null) {
      return true;
    }
    return false;
  }
}
function pauseMusic() {
  playing = false;
  audioElement.pause();
}
const poking$1 = poking;
function runSelected(cm) {
  let pos = cm.getCursor(), text = null;
  text = cm.getDoc().getSelection();
  if (text === "") {
    text = cm.getLine(pos.line);
  } else {
    pos = { start: cm.getCursor("start"), end: cm.getCursor("end") };
  }
  if (pos.start === void 0) {
    let lineNumber = pos.line, start = 0, end = text.length;
    pos = { start: { line: lineNumber, ch: start }, end: { line: lineNumber, ch: end } };
  }
  console.log(text);
  var parsedCode = parser.parse(text);
  console.log(parsedCode);
  flash(cm, pos);
  eval("(" + parsedCode + ")");
}
function flash(cm2, pos2) {
  let sel, cb = function() {
    sel.clear();
  };
  if (pos2 !== null) {
    if (pos2.start) {
      sel = cm2.markText(pos2.start, pos2.end, { className: "CodeMirror-highlight" });
    } else {
      sel = cm2.markText({ line: pos2.line, ch: 0 }, { line: pos2.line, ch: null }, { className: "CodeMirror-highlight" });
    }
  } else {
    self = cm2.markText(cm2.getCursor(true, cm2.getCursor(false, { className: "CodeMirror-highlight" })));
    window.setTimeout(cb, 250);
  }
  console.log("highlighted");
}
