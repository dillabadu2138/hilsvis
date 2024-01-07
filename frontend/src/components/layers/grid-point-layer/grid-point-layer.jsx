import { Layer, project32, picking } from '@deck.gl/core';
import GL from '@luma.gl/constants';
import { Model, Geometry } from '@luma.gl/core';

// Shaders
import vertex from './grid-point-layer-vertex.glsl';
import fragment from './grid-point-layer-fragment.glsl';

// const DEFAULT_COLOR = [255, 255, 255, 255]; // white
const DEFAULT_COLOR = [0, 0, 0, 225]; // black

const defaultProps = {
  // radius in pixels
  radiusPixels: { type: 'number', min: 0, value: 10 },
  // Center of each circle, in [longitude, latitude, (z)]
  getPosition: { type: 'accessor', value: (d) => d.position },
  // Color of each circle, in [R, G, B, (A)]
  getColor: { type: 'accessor', value: DEFAULT_COLOR },
};

export default class GridPointLayer extends Layer {
  getShaders() {
    return super.getShaders({
      vs: vertex,
      fs: fragment,
      modules: [project32, picking],
    });
  }

  initializeState() {
    // register attributes
    this.getAttributeManager().addInstanced({
      /* this attribute is automatically filled by the return value of `props.getPosition` */
      instancePositions: {
        size: 3, //
        type: GL.DOUBLE,
        f64: this.use64bitPositions(),
        accessor: 'getPosition',
      },
      /* this attribute is automatically filled by the return value of `props.getColor` */
      instanceColor: {
        size: 4, // RGBA
        type: GL.UNSIGNED_BYTE,
        normalized: true,
        accessor: 'getColor',
        defaultValue: DEFAULT_COLOR,
      },
    });

    // get an access to a WebGL context
    const { gl } = this.context;

    // save the model in the layer state
    this.setState({
      model: this._getModel(gl),
    });
  }

  updateState(params) {
    super.updateState(params);

    // destructure
    const { props, oldProps, changeFlags } = params;

    // set up model first
    if (changeFlags.extensionsChanged) {
      if (this.state.model) {
        this.state.model.delete();
      }
      const { gl } = this.context;
      this.state.model = this._getModel(gl);
      this.getAttributeManager().invalidateAll();
    }
  }

  draw({ uniforms }) {
    // destructure layer props
    const { radiusPixels } = this.props;

    // set uniforms
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

GridPointLayer.layerName = 'GridPointLayer';
GridPointLayer.defaultProps = defaultProps;
