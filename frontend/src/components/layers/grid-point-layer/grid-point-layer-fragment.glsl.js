export default `\
#define SHADER_NAME grid-point-layer-fragment-shader

precision highp float;

varying vec4 vColor;
varying vec2 unitPosition;

void main(void) {
  geometry.uv = unitPosition;

	// calculate the length of a vector
  float distToCenter = length(unitPosition);

	// if the length is larger than 1.0, discard
  if (distToCenter > 1.0) {
    discard;
  }

	// write to the predefined output, gl_FragColor
  gl_FragColor = vColor;

	// modify the color of the current fragment.
  //DECKGL_FILTER_COLOR(gl_FragColor, geometry);
}
`;
