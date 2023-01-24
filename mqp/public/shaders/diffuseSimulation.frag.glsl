#ifdef GL_ES
      precision mediump float;
  #endif

  uniform float time;
  uniform vec2 resolution;
  //uniform float dA;
  //uniform float dB;
  //uniform float feed;
  //uniform float kill;
  uniform float audioData;

  float dA = 1.;
  float dB = 0.5;
  float feed =  0.055;
  float kill  = 0.062;

  // simulation texture state, swapped each frame
  uniform sampler2D state;

  // look up individual cell values
  float getA(int x, int y) {
      return float(
        texture2D( state, ( gl_FragCoord.xy + vec2(x, y) ) / resolution ).r
      );
    }

  float getB(int x, int y) {
      return float(
        texture2D( state, ( gl_FragCoord.xy + vec2(x, y) ) / resolution ).g
      );
  }

  float laplaceA(){
      float sumA = 0.;

      sumA += getA(0,0) * -1.;
      sumA += getA(-1,0) * 0.2;
      sumA += getA(1,0) * 0.2;
      sumA += getA(0,-1) * 0.2;
      sumA += getA(0,1) * 0.2;
      sumA += getA(-1,-1) * 0.05;
      sumA += getA(1,1) * 0.05;
      sumA += getA(-1,1) * 0.05;
      sumA += getA(1,-1) * 0.05;

      return sumA;
  }

  float laplaceB(){
      float sumB = 0.;

      sumB += getB(0,0) * -1.;
      sumB += getB(-1,0) * 0.2;
      sumB += getB(1,0) * 0.2;
      sumB += getB(0,-1) * 0.2;
      sumB += getB(0,1) * 0.2;
      sumB += getB(-1,-1) * 0.05;
      sumB += getB(1,1) * 0.05;
      sumB += getB(-1,1) * 0.05;
      sumB += getB(1,-1) * 0.05;

      return sumB;
  }

  float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
  }

  void main() {
      vec2 pos = gl_FragCoord.xy / resolution;
      float a = getA(0,0);
      float b = getB(0,0);
      float c = audioData/255.;

      float nextA = a +
                  (dA * laplaceA()
                  - a * b * b
                  + feed * ( 1. - a )) ;

      float nextB = b +
                  (dB * laplaceB()
                  + a * b * b
                  - (kill + feed) * b);

      vec3 result = vec3(nextA, nextB, c);

      gl_FragColor = vec4(result, 1.);
  }