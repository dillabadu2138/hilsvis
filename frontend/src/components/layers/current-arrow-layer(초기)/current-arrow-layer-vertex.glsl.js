export default `\
#define SHADER_NAME current-arrow-layer-vertex-shader
#define PI 3.1415926535

uniform vec2 boundsSpd;
uniform vec2 boundsDir;
uniform sampler2D textureSpd;
uniform sampler2D textureDir;

attribute vec3 vertices;

attribute vec3 instancePositions;
attribute vec3 instancePositions64Low;
attribute float instanceSpeeds;
attribute float instanceDirections;
attribute float instancePickingColors;


void main(void) {
  geometry.worldPosition = instancePositions;

  // get position in texture coordinates
  //float x = (instancePositions.x - bbox.x) / (bbox.y - bbox.x); // (positions.x-minLon)/(maxLon-minLon)
  //float y = (instancePositions.y - bbox.z) / (bbox.w - bbox.z); // (positions.y-minLat)/(maxLat-minLat)
  //vec2 coords = vec2(x, y);
  //vec2 coords = vec2(x, 1. - y);
  //vec4 texelSpd = texture(textureSpd, coords);
  //vec4 texelDir = texture(textureDir, coords);
  //float ang = texelDir.x;
  //float rad = ang * (PI/180.0);

  // rotate vertices
  //mat2 rotation = mat2(cos(rad), sin(rad), -sin(rad), cos(rad));
  //vec2 vertex = rotation * vertices.xy;

  // convert the coordinates of a point from the world space to the common space.
  //vec2 pos = project_position(instancePositions.xy + vertex.xy);
  
  // convert the coordinates of a point from the common space to the clip space, which can be assigned to gl_Position
  //gl_Position = project_common_position_to_clipspace(vec4(pos, 0.0, 1.0));


  // Test
  
  vec3 positionCommon = project_position(instancePositions);
  vec3 offsetCommon = instancePositions * project_size(vertices);
  gl_Position = project_common_position_to_clipspace(vec4(positionCommon, 1));
}
`;
