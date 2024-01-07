import { Layer, project32, picking } from '@deck.gl/core';
import GL from '@luma.gl/constants';
import { Model, Geometry } from '@luma.gl/core';
import { Texture2D } from '@luma.gl/webgl';

// Shaders
import vertex from './current-arrow-layer-vertex.glsl';
import fragment from './current-arrow-layer-fragment.glsl';

const DEFAULT_COLOR = [0, 0, 0, 255]; // black

const defaultProps = {
  // FIXME: 나중에 엄부장님에게 어떻게 설정할지 물어보기!
  spdMin: { type: 'number', value: 0 },
  spdMax: { type: 'number', value: 5 },
  dirMin: { type: 'number', value: 0 },
  dirMax: { type: 'number', value: 360 },
  getPosition: { type: 'accessor', value: (d) => d.position },
  getSpeed: { type: 'accessor', value: (d) => d.speed },
  getDirection: { type: 'accessor', value: (d) => d.direction },
};

// Current Arrow Layer
export default class CurrentArrowLayer extends Layer {
  getShaders() {
    return super.getShaders({ vs: vertex, fs: fragment, modules: [project32, picking] });
  }

  initializeState() {
    // get the AttributeMangaer
    const attributeManager = this.getAttributeManager();

    // register attributes
    attributeManager.addInstanced({
      /* this attribute is automatically filled by the return value of `props.getPosition` */
      instancePositions: {
        size: 3,
        type: GL.DOUBLE,
        f64: this.use64bitPositions(),
        accessor: 'getPosition',
      },
      instanceSpeeds: {
        size: 1,
        accessor: 'getSpeed',
      },
      instanceDirections: {
        size: 1,
        accessor: 'getDirection',
      },
    });

    // get an access to a WebGL context
    const { gl } = this.context;

    // save the model in layer state
    this.setState({
      model: this._getModel(gl),
    });
  }

  updateState(params) {
    // TODO: update time
    // this._updateTime();

    // destructure
    const { props, oldProps, changeFlags } = params;
  }

  _updateTime() {
    // TODO: add logic here
  }

  draw({ uniforms }) {
    // renders the model with provided uniforms
    this.state.model.setUniforms(uniforms).draw();
  }

  /* 
    Create a model(luma.gl Model) instance that defines what will be drawn to the WebGL context
  */
  _getModel(gl) {
    // set vertices of an instanced triangle with the number of vertices = 3
    const vertices = new Float32Array([0, 300, 0, -100, -100, 0, 100, -100, 0]);

    const geometry = new Geometry({
      drawMode: gl.TRIANGLE_FAN,
      vertexCount: 3,
      attributes: {
        vertices: { size: 3, type: gl.FLOAT, value: vertices },
      },
    });

    // return a luma.gl model instance
    return new Model(gl, {
      ...this.getShaders(),
      id: this.props.id,
      geometry: geometry,
      isInstanced: true,
    });
  }

  _createTexture(gl, width, height) {
    const textureOptions = {
      format: gl.R32F,
      dataFormat: gl.RED,
      type: gl.FLOAT,
      width: width,
      height: height,
      // set texture parameters
      parameters: {
        [gl.TEXTURE_MAG_FILTER]: gl.NEAREST,
        [gl.TEXTURE_MIN_FILTER]: gl.NEAREST,
        [gl.TEXTURE_WRAP_S]: gl.CLAMP_TO_EDGE,
        [gl.TEXTURE_WRAP_T]: gl.CLAMP_TO_EDGE,
      },
      // pixelStore(object) - map of pixel store parameters (controls how data is interpreted when Textures are initialized from memory)
      pixelStore: {
        [gl.UNPACK_FLIP_Y_WEBGL]: true,
        [gl.UNPACK_ALIGNMENT]: 1,
        [gl.PACK_ALIGNMENT]: 1,
      },
      mipmaps: false,
    };

    return new Texture2D(gl, textureOptions);
  }
}

CurrentArrowLayer.layerName = 'CurrentArrowLayer';
CurrentArrowLayer.defaultProps = defaultProps;
