export default `\
#define SHADER_NAME grid-point-layer-fragment-shader

//precision highp float;

varying vec4 vColor;
varying vec2 unitPosition;
varying float instanceDirections;

void main(void) {
	// calculate the length of a vector
  float distToCenter = length(unitPosition);

	// if the length is larger than 1.0, discard
  // if (distToCenter > 1.0) {
  //   discard;
  // }
  gl_FragColor = vColor;
  
  // for arrow
  if (unitPosition.x < 1.0 - abs(unitPosition.y) * 4.0) {
    gl_FragColor = vColor;
  } else {
    discard;
  }
}
`;
