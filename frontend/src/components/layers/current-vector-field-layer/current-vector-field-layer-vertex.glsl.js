export default `\
#define SHADER_NAME grid-point-layer-vertex-shader
#define PI 3.1415926535

attribute vec3 positions;

attribute vec4 instanceColors;
attribute vec3 instancePositions;
attribute vec3 instancePositions64Low;

// new attributes
attribute float instanceDirections;

uniform float opacity;
uniform float radiusPixels;

varying vec4 vColor;
varying vec2 unitPosition;
varying float outerRadiusPixels;

// rotate
vec3 rotateZ(vec3 vector, float angle) {
    /*
      참고: 
      https://en.wikipedia.org/wiki/Rotation_matrix
      https://stackoverflow.com/questions/21484558/how-to-calculate-wind-direction-from-u-and-v-wind-components-in-r
    */
    mat2 rotationMatrix = mat2(cos(angle), sin(angle), -sin(angle), cos(angle));

    // mat2 rotationMatrix = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));

    return vec3(rotationMatrix * vector.xy, vector.z);
  }

void main(void){
  geometry.worldPosition = instancePositions;

  // get position on the containing square in [-1, 1] space
  unitPosition = positions.xy;
  geometry.uv = unitPosition;

  vec3 center = instancePositions;
  vec3 vertex = positions*radiusPixels/15.0;

  // Rotate by instanceDirections
  vertex = rotateZ(vertex, instanceDirections);
  vec3 newinstancePositions  = rotateZ(instancePositions, instanceDirections);

  // find the center of the point and add the current vertex
  vec3 offset = vec3(positions.xy * project_size_to_pixel(radiusPixels, 2), 0.0);

  // gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, vec3(0.), geometry.position);
  gl_Position = project_position_to_clipspace(center + vertex, center + vertex, vec3(0.0), geometry.position);
  gl_Position.xy += project_pixel_size_to_clipspace(offset.xy);

  // apply opacity to instance color, or return instance picking color
  vColor = vec4(instanceColors.rgb, instanceColors.a * opacity);
}
`;
