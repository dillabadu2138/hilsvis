export default `\
#define SHADER_NAME grid-point-layer-vertex-shader

attribute vec3 positions;

attribute vec4 instanceColors;
attribute vec3 instancePositions;
attribute vec3 instancePositions64Low;

uniform float opacity;
uniform float radiusPixels;

varying vec4 vColor;
varying vec2 unitPosition;

void main(void){
  geometry.worldPosition = instancePositions;

  // get position on the containing square in [-1, 1] space
  unitPosition = positions.xy;
  geometry.uv = unitPosition;

  // find the center of the point and add the current vertex
  vec3 offset = vec3(positions.xy * project_size_to_pixel(radiusPixels, 2), 0.0);
  
  gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, vec3(0.), geometry.position);
  gl_Position.xy += project_pixel_size_to_clipspace(offset.xy);

  // apply opacity to instance color, or return instance picking color
  vColor = vec4(instanceColors.rgb, instanceColors.a * opacity);
}
`;
