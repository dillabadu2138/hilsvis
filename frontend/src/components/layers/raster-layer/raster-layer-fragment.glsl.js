export default `
#define SHADER_NAME raster-layer-fragment-shader

#ifdef GL_ES
precision highp float;
#endif

uniform float opacity;
uniform vec2 colorRange;
uniform vec4 imageBounds;
uniform sampler2D imageTexture;
uniform sampler2D paletteTexture;

varying vec2 vTexCoord;
varying vec2 vTexPos;

/* projection utils */
const float TILE_SIZE = 512.0;
const float PI = 3.1415926536;
const float WORLD_SCALE = TILE_SIZE / PI / 2.0;

// from degrees to Web Mercator
vec2 lnglat_to_mercator(vec2 lnglat) {
  float x = lnglat.x;
  float y = clamp(lnglat.y, -89.9, 89.9);
  return vec2(
    radians(x) + PI,
    PI + log(tan(PI * 0.25 + radians(y) * 0.5))
  ) * WORLD_SCALE;
}

// from Web Mercator to degrees
vec2 mercator_to_lnglat(vec2 xy) {
  xy /= WORLD_SCALE;
  return degrees(vec2(
    xy.x - PI,
    atan(exp(xy.y - PI)) * 2.0 - PI * 0.5
  ));
}
/* End projection utils */

vec2 getUV(vec2 pos) {
  return vec2(
    (pos.x - imageBounds[0]) / (imageBounds[2] - imageBounds[0]),
    (pos.y - imageBounds[3]) / (imageBounds[1] - imageBounds[3])
  );
}

void main(void){
  vec2 uv = vTexCoord;
  vec2 lnglat = mercator_to_lnglat(vTexPos);
  uv = getUV(lnglat);

  // fetch the texel (the pixel within the texture) based on the value of the texture coord
  vec4 texel = texture2D(imageTexture, uv);

  // filter out nodata
  if (texel.r <= -32678.0) {
    discard;
  }

  // pixel value 0 to 1
  float pixel = (texel.x - colorRange.x) / (colorRange.y - colorRange.x);

  // use the pixel value to look up a color from palette
  vec4 color = texture2D(paletteTexture, vec2(pixel, 0.5));

  gl_FragColor = vec4(color.rgb, color.a * opacity);
}
`;
