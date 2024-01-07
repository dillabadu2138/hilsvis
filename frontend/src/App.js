import React from 'react';

// CSS
import 'mapbox-gl/dist/mapbox-gl.css';

// Components
import Menu from './components/menu/Menu';
import Panel from './components/panel/Panel';
import CustomAlert from './components/layout/CustomAlert';
import HilsDemo from './HilsDemo';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      viewport: {
        width: 500,
        height: 500,
        longitude: 129,
        latitude: 36,
        zoom: 4,
        pitch: 0,
        bearing: 0.65,
      },
    };

    // bind methods defined within a component's Class to the current object's lexical `this` instance
    this._onResize = this._onResize.bind(this);
    this._updateViewport = this._updateViewport.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this._onResize);
    this._onResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._onResize);
  }

  _onResize() {
    this._updateViewport({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  _updateViewport(viewport) {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport },
    });
  }

  render() {
    const { viewport } = this.state;

    return (
      <React.Fragment>
        <HilsDemo viewport={viewport} />
        <Menu />
        <Panel />
        <CustomAlert />
      </React.Fragment>
    );
  }
}
