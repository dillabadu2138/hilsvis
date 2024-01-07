import { Layer, project32, picking, COORDINATE_SYSTEM } from '@deck.gl/core';
import GL from '@luma.gl/constants';
import { Model, Geometry } from '@luma.gl/core';
import { Texture2D } from '@luma.gl/webgl';

import createMesh from './create-mesh';

// Shaders
import vertex from './raster-layer-vertex.glsl';
import fragment from './raster-layer-fragment.glsl';

const defaultProps = {
  imageBounds: { type: 'array', value: [] },
  imageTextureSize: { type: 'array', value: [] },
  imageData: { type: 'object', value: null, compare: true },
  colorRange: { type: 'array', value: [] },
  paletteTexture: { type: 'image', value: null, async: true },
  // _imageCoordinateSystem: COORDINATE_SYSTEM.DEFAULT,
};

// Raster Layer
export default class RasterLayer extends Layer {
  getShaders() {
    return super.getShaders({ vs: vertex, fs: fragment, modules: [project32, picking] });
  }

  initializeState() {
    // get the AttributeMangaer
    const attributeManager = this.getAttributeManager();

    // remove defined attributes
    attributeManager.remove(['instancePickingColors']);

    // register attributes
    attributeManager.add({
      indices: {
        size: 1,
        isIndexed: true,
        // update (Function, optional) - the function to be called when data changes. If not supplied, the attribute will be auto-filled with accessor.
        update: (attribute) => {
          attribute.value = this.state.mesh.indices;
        },
        // noAlloc (Boolean, optional) - if this attribute should not be automatically allocated. Default to false.
        noAlloc: true,
      },
      positions: {
        size: 3,
        type: GL.DOUBLE,
        fp64: this.use64bitPositions(),
        update: (attribute) => {
          attribute.value = this.state.mesh.positions;
        },
        noAlloc: true,
      },
      texCoords: {
        size: 2,
        update: (attribute) => {
          attribute.value = this.state.mesh.texCoords;
        },
        noAlloc: true,
      },
    });

    // get an access to a WebGL context
    const { gl } = this.context;

    // destructure props
    const {
      imageTextureSize: [width, height],
    } = this.props;

    // initialize texture parameters
    this.setState({
      imageTexture: this._createImageTexture(gl, width, height),
    });
  }

  updateState(params) {
    super.updateState(params);

    // destructure
    const { props, oldProps, changeFlags } = params;

    // get the AttributeMangaer
    const attributeManager = this.getAttributeManager();

    // set up model first
    if (changeFlags.extensionsChanged) {
      if (this.state.model) {
        this.state.model.delete();
      }
      const { gl } = this.context;
      this.setState({ model: this._getModel(gl) });
      attributeManager.invalidateAll();
    }

    // if imageBounds prop changes, update mesh
    if (props.imageBounds !== oldProps.imageBounds || changeFlags.viewportChanged) {
      const oldMesh = this.state.mesh;
      const mesh = this._createMesh();
      this.state.model.setVertexCount(mesh.vertexCount);
      for (const key in mesh) {
        if (oldMesh && oldMesh[key] !== mesh[key]) {
          attributeManager.invalidate(key);
        }
      }
      this.setState({ mesh: mesh });
    }

    // if imageData prop change, update imageTexture state
    if (props.imageData && props.imageData !== oldProps.imageData) {
      // destructure
      const { imageTexture } = this.state;
      const {
        imageTextureSize: [width, height],
      } = this.props;

      // convert imageData to Float32Array
      const data =
        props.imageData instanceof Float64Array
          ? Float32Array.from(props.imageData)
          : props.imageData;

      // allocate storage and sets image data
      imageTexture.setImageData({
        data: data,
        width: width,
        height: height,
        parameters: { [GL.UNPACK_FLIP_Y_WEBGL]: true },
      });
    }
  }

  draw(opts) {
    const { uniforms } = opts;
    const { imageBounds, colorRange, paletteTexture } = this.props;
    const { model, imageTexture } = this.state;

    // early return
    if (!model || !paletteTexture) {
      return;
    }

    // render the image
    model
      .setUniforms(uniforms) // all the default uniforms to be passed to the shaders (i.e, opacity)
      .setUniforms({
        imageBounds: imageBounds,
        colorRange: colorRange,
        imageTexture: imageTexture,
        paletteTexture: paletteTexture,
      })
      .draw();
  }

  _getModel(gl) {
    // return a single geometry model
    return new Model(gl, {
      ...this.getShaders(),
      id: this.props.id,
      geometry: new Geometry({
        drawMode: GL.TRIANGLES,
        vertexCount: 6,
      }),
      isInstanced: false,
    });
  }

  _createMesh() {
    // destructure props and rename
    const { imageBounds: bounds } = this.props; // [minX, minY, maxX, maxY]

    let normalizedBounds = bounds;

    if (isRectangularBounds(bounds)) {
      normalizedBounds = [
        [bounds[0], bounds[1]], // [minX, minY]
        [bounds[0], bounds[3]], // [minX, maxY]
        [bounds[2], bounds[3]], // [maxX, maxY]
        [bounds[2], bounds[1]], // [maxX, minY]
      ];
    }

    return createMesh(normalizedBounds, this.context.viewport.resolution);
  }

  _createImageTexture(gl, width, height) {
    const textureOptions = {
      format: GL.R32F,
      dataFormat: GL.RED,
      type: GL.FLOAT,
      width: width,
      height: height,
      // set texture parameters
      parameters: {
        [GL.TEXTURE_MAG_FILTER]: GL.NEAREST,
        [GL.TEXTURE_MIN_FILTER]: GL.NEAREST,
        // [GL.TEXTURE_MAG_FILTER]: GL.LINEAR,
        // [GL.TEXTURE_MIN_FILTER]: GL.LINEAR,
        [GL.TEXTURE_WRAP_S]: GL.CLAMP_TO_EDGE,
        [GL.TEXTURE_WRAP_T]: GL.CLAMP_TO_EDGE,
      },

      // pixelStore(object) - map of pixel store parameters (controls how data is interpreted when Textures are initialized from memory)
      pixelStore: {
        [GL.UNPACK_FLIP_Y_WEBGL]: true,
        [GL.UNPACK_ALIGNMENT]: 1,
        [GL.PACK_ALIGNMENT]: 1,
      },
      mipmaps: false,
    };

    return new Texture2D(gl, textureOptions);
  }

  _getCoordinateUniforms() {
    const { LNGLAT, CARTESIAN, DEFAULT } = COORDINATE_SYSTEM;

    let { _imageCoordinateSystem: imageCoordinateSystem } = this.props;

    if (imageCoordinateSystem !== DEFAULT) {
      const { imageBounds: bounds } = this.props;

      // The default behavior (linearly interpolated tex coords)
      const defaultImageCoordinateSystem = this.context.viewport.resolution ? LNGLAT : CARTESIAN;
      imageCoordinateSystem = imageCoordinateSystem === LNGLAT ? LNGLAT : CARTESIAN;
    }

    return {
      coordinateConversion: 0,
      bounds: [0, 0, 0, 0],
    };
  }
}

RasterLayer.layerName = 'RasterLayer';
RasterLayer.defaultProps = defaultProps;

function isRectangularBounds(bounds) {
  return Number.isFinite(bounds[0]);
}
