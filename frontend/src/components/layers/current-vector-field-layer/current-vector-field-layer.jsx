import { Layer, project32, picking } from '@deck.gl/core';
import GL from '@luma.gl/constants';
import { Model, Geometry } from '@luma.gl/core';

// Shaders
import vertex from './current-vector-field-layer-vertex.glsl';
import fragment from './current-vector-field-layer-fragment.glsl';

const DEFAULT_COLOR = [255, 255, 255, 255]; // white

const defaultProps = {
  // radius in pixels
  radiusPixels: { type: 'number', min: 0, value: 5 },
  // Center of each circle, in [longitude, latitude, (z)]
  getPosition: { type: 'accessor', value: (d) => d.position },
  //
  getDirection: { type: 'accessor', value: (d) => d.direction },
  // Color of each circle, in [R, G, B, (A)]
  getColor: { type: 'accessor', value: DEFAULT_COLOR },
};

// Current Arrow Layer
export default class CurrentVectorFieldLayer extends Layer {
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
      /* this attribute is automatically filled by the return value of `props.getColor` */
      instanceColors: {
        size: 4,
        type: GL.UNSIGNED_BYTE,
        normalized: true,
        accessor: 'getColor',
        defaultValue: DEFAULT_COLOR,
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
  }

  draw({ uniforms }) {
    // destructure layer props
    const { radiusPixels } = this.props;

    // renders the model with provided uniforms
    this.state.model.setUniforms(uniforms).setUniforms({ radiusPixels: radiusPixels }).draw();
  }

  /* 
    A model is luma.gl Model instance that defines what will be drawn to the WebGL context
  */
  _getModel(gl) {
    // create a square that minimally cover the unit circle
    const positions = [-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0];

    // return a luma.gl model instance
    return new Model(gl, {
      ...this.getShaders(),
      id: this.props.id,
      geometry: new Geometry({
        drawMode: GL.TRIANGLE_FAN,
        vertexCount: 4,
        attributes: {
          positions: { size: 3, value: new Float32Array(positions) },
        },
      }),
      isInstanced: true,
    });
  }
}

CurrentVectorFieldLayer.layerName = 'CurrentVectorFieldLayer';
CurrentVectorFieldLayer.defaultProps = defaultProps;
