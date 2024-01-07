import React from 'react';
import { connect } from 'react-redux';

// Deck.gl
import DeckGL from '@deck.gl/react';
import { Map } from 'react-map-gl';
import { DataFilterExtension } from '@deck.gl/extensions';
import MapboxLanguage from '@mapbox/mapbox-gl-language';

// Deck.gl built-in layers
import { GeoJsonLayer, ScatterplotLayer, IconLayer } from '@deck.gl/layers';

// Deck.gl custom layers
import RasterLayer from './components/layers/raster-layer/raster-layer';
import CurrentVectorFieldLayer from './components/layers/current-vector-field-layer/current-vector-field-layer';
import GridPointLayer from './components/layers/grid-point-layer/grid-point-layer';

// Components
import { loadJson } from './utils/loader';

// Utility function
import { rgb2Hex } from './utils/convertColorSpaces';

// Third-party libraries
import moment from 'moment';

// Mapbox Acess Token
import * as config from './config';
const TOKEN = config.MapboxAccessToken;

class HilsDemo extends React.Component {
  constructor(props) {
    super(props);

    // initialize local state
    this.state = {
      webGL2Supported: true,
    };

    // create a ref
    this.mapRef = React.createRef(null);

    // bind methods defined within a component's Class to the current object's lexical this instance
    this._changeLanguage = this._changeLanguage.bind(this);
    this._geojsonifyTyphoonPaths = this._geojsonifyTyphoonPaths.bind(this);
    this._createSVGIcon = this._createSVGIcon.bind(this);
    this._svgToDataURL = this._svgToDataURL.bind(this);
  }

  componentWillUnmount() {
    console.clear();
  }

  _changeLanguage = () => {
    const map = this.mapRef.current.getMap();

    map.addControl(
      new MapboxLanguage({
        defaultLanguage: 'ko',
      })
    );

    // Use setLayoutProperty to set the value of a layout property in a style layer.
    map.getStyle().layers.forEach((layer) => {
      if (layer.id.endsWith('-label')) {
        map.setLayoutProperty(layer.id, 'text-field', ['get', 'name_ko']);
      }
    });
  };

  // convert typhoon paths to geojson
  _geojsonifyTyphoonPaths(arr) {
    let geojson = {
      type: 'FeatureCollection',
      features: [],
    };

    // add points
    arr.map((obj) => {
      let icon;
      if (obj.kma_grade === null) {
        icon = `/data/typhoon/tropical depression.png`;
      } else if (obj.kma_grade === '-') {
        icon = `/data/typhoon/-.png`;
      } else if (obj.kma_grade === 'normal') {
        icon = `/data/typhoon/normal.png`;
      } else if (obj.kma_grade === 'strong') {
        icon = `/data/typhoon/strong.png`;
      } else if (obj.kma_grade === 'very strong') {
        icon = `/data/typhoon/very strong.png`;
      } else if (obj.kma_grade === 'super strong') {
        icon = `/data/typhoon/super strong.png`;
      }

      geojson.features.push({
        type: 'Feature',
        properties: {
          태풍아이디: obj.typhoon_id,
          일시: obj.datetime,
          기압: obj.kma_pres,
          풍속: obj.kma_wind,
          강풍반경: obj.kma_r15,
          강도: obj.kma_grade,
          icon: icon,
        },
        geometry: {
          type: 'Point',
          coordinates: [obj.lon, obj.lat],
        },
      });
    });

    // add lines
    const lines = arr.map((obj) => {
      return [obj.lon, obj.lat];
    });

    geojson.features.push({
      type: 'Feature',
      properties: null,
      geometry: {
        type: 'LineString',
        coordinates: lines,
      },
    });

    return geojson;
  }

  _createSVGIcon(cur_spd, cat_ts, arrow_color_flood_tide, arrow_color_ebb_tide, text_visible) {
    const fillColor = cat_ts === '창조' ? arrow_color_flood_tide : arrow_color_ebb_tide;

    const textElement =
      text_visible === true
        ? `<text x="0" y="0"  transform="rotate(90)" text-anchor="start" alignment-baseline="baseline" font-size="200px" >${cur_spd.toFixed(
            1
          )}</text>`
        : '';

    const svg = `
    <svg enable-background="new 0 0 580 580" height="580" viewBox="0 0 580 580" width="580" xmlns="http://www.w3.org/2000/svg">
      <path d="m375.552 178.084l-85.548-148.194-85.557 148.194h54.311v368.995h56.452v-3.008h3.019v-365.987z" fill="${rgb2Hex(
        ...fillColor
      )}" />
      ${textElement}
    </svg>
    `;

    return svg;
  }

  _svgToDataURL(svg) {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  render() {
    // destructure props
    const {
      viewport,
      // 위험사례(재현)
      scalar_variable,
      sband,
      vector_variable,
      mband,
      mband_data,
      opacity,
      grid_json_file,
      // 위험사례(관측) - 태풍
      typhoons_selected,
      typhoons_display_setting,
      // 해역특성
      checked_layers,
      // 해양상태
      tidal_currents_selected,
      tidal_currents_display_setting,
      tidal_currents_filter_setting,
      // 디스플레이
      basemap,
      coastline,
    } = this.props;

    // set up background layers
    const backgroundLayers = [
      // add a coastline
      coastline !== 'deactivated' &&
        new GeoJsonLayer({
          id: `coastline`,
          data: loadJson(`/data/${coastline}.json`),
          opacity: 1.0,
          fill: false,
          lineWidthScale: 10,
          lineWidthMinPixels: 2,
          stroked: true,
          getLineColor: [255, 255, 255, 255], // blue
          getPointRadius: 2,
          pointRadiusUnits: 'pixels',
          getLineWidth: 5,
        }),
    ].filter(Boolean); // filter null and undefined

    // set up data layers
    const dataLayers = [
      // 위험사례(재현)
      // single-band raster
      Object.keys(sband).length !== 0 &&
        new RasterLayer({
          id: 'single-band-raster',
          opacity: opacity / 100,
          imageBounds: [
            // [minX, minY, maxX, maxY]
            sband.metadata.ipX,
            sband.metadata.ipY,
            sband.metadata.ipX + sband.metadata.scaleX * sband.metadata.width,
            sband.metadata.ipY + sband.metadata.scaleY * sband.metadata.height,
          ],
          imageTextureSize: [sband.metadata.width, sband.metadata.height], // [width, height]
          imageData: sband.bands[0].data, // pixels data
          colorRange: [scalar_variable.min, scalar_variable.max], // [mix, max]
          paletteTexture: `/data/lut/${scalar_variable.scheme}.png`, // palette
        }),

      // 위험사례(재현) 그리드 테스트
      Object.keys(sband).length !== 0 &&
        grid_json_file !== null &&
        new ScatterplotLayer({
          id: 'single-band-raster-grid-points-only',
          data: loadJson(`/data/test/${grid_json_file}`),
          getPosition: (d) => [d.lon, d.lat],
          getFillColor: [0, 0, 0], // black
          filled: true,
          radiusUnits: 'pixels',
          radiusMinPixels: 1,
          stroked: false,
        }),

      // multi-band raster
      Object.keys(mband).length !== 0 &&
        mband_data.length !== 0 &&
        vector_variable.var_name !== 'none' &&
        new CurrentVectorFieldLayer({
          id: 'multi-band-raster',
          // opacity: opacity / 100,
          data: mband_data,
          radiusPixels: 1,
          getPosition: (d) => d.position,
          getDirection: (d) => {
            const direction = Math.atan2(d.v, d.u);

            // TODO: add case for wind
            // const direction = -(Math.atan2(d.v, d.u) + Math.PI / 2);

            return direction;
          },
          getColor: [255, 255, 255, 255], // white
        }),

      // Object.keys(mband).length !== 0 &&
      //   mband_data.length !== 0 &&
      //   vector_variable.var_name !== 'none' &&
      //   new GridPointLayer({
      //     id: 'grid-point',
      //     data: mband_data,
      //     opacity: 1,
      //     radiusPixels: 3,
      //     getPosition: (d) => d.position,
      //     getColor: [0, 0, 0, 255], // black
      //   }),

      // 위험사례(관측) - 태풍
      typhoons_selected.length > 0 &&
        typhoons_selected.map((item) => {
          // convert typhoon paths to geojson
          const data = this._geojsonifyTyphoonPaths(item.paths);

          return new GeoJsonLayer({
            id: `typhoon-${item.typhoon_id}`,
            data: data,
            pickable: typhoons_display_setting.picking,
            // Stroke Options
            stroked: true,
            getLineColor: typhoons_display_setting.line_color,
            getLineWidth: typhoons_display_setting.line_width,
            lineWidthUnits: 'pixels',
            // Point Options
            pointType: 'icon',
            getIcon: (f) => {
              let height = f.properties.icon === `/data/typhoon/tropical depression.png` ? 14 : 21;

              return { url: f.properties.icon, width: 14, height: height };
            },
            getIconSize: typhoons_display_setting.icon_size,
            iconSizeUnits: 'pixels',
          });
        }),

      // 해역특성
      checked_layers.length > 0 &&
        checked_layers.map((item) => {
          const data = item.data;

          return new GeoJsonLayer({
            id: `characteristic-${item.schema}-${item.table}`,
            data: data,
            pickable: true,
            // Fill Options
            filled: true,
            getFillColor: item.fillColor,
            pointType: 'circle',
            lineWidthScale: 5,
            lineWidthMinPixels: 2,
            // Stroke Options
            stroked: true,
            getLineColor: item.lineColor,
            getLineWidth: 2,
            // Point Options
            getPointRadius: 2,
            pointRadiusUnits: 'pixels',
          });
        }),

      // 해양상태 - 최강 창·낙조류 유향유속 화살표 & 텍스트 가시화
      tidal_currents_selected.length > 0 &&
        new IconLayer({
          id: `condition-tidal-currents-arrows`,
          data: tidal_currents_selected,
          pickable: tidal_currents_display_setting.picking,
          billboard: false,
          getPosition: (d) => [d.longitude, d.latitude],
          getSize: 30,
          getAngle: (d) => -d.cur_dir,
          getIcon: (d) => ({
            url: this._svgToDataURL(
              this._createSVGIcon(
                d.cur_spd,
                d.cat_ts,
                tidal_currents_display_setting.arrow_color_flood_tide,
                tidal_currents_display_setting.arrow_color_ebb_tide,
                tidal_currents_display_setting.text_visible
              )
            ),
            width: 32,
            height: 32,
            anchorX: 32 / 2,
            anchorY: 32,
          }),
          updateTriggers: {
            getIcon: [
              tidal_currents_display_setting.arrow_color_flood_tide,
              tidal_currents_display_setting.arrow_color_ebb_tide,
              tidal_currents_display_setting.text_visible,
            ],
            getFilterValue: [
              tidal_currents_filter_setting.show_flood,
              tidal_currents_filter_setting.show_ebb,
            ],
          },
          // filter
          getFilterValue: (d) => {
            let filterConditionFlood;
            let filterConditionEbb;
            let filterConditionObsPeriod;

            if (d.cat_ts === '창조') {
              filterConditionFlood = tidal_currents_filter_setting.show_flood === false ? 2 : 0.5;
            } else {
              filterConditionEbb = tidal_currents_filter_setting.show_ebb === false ? 2 : 0.5;
            }

            let start = moment(d.start_datetime);
            let end = moment(d.end_datetime);
            filterConditionObsPeriod = moment.duration(end.diff(start)).asDays();

            return [filterConditionFlood, filterConditionEbb, filterConditionObsPeriod];
          },
          filterRange: [
            [0, 1],
            [0, 1],
            tidal_currents_filter_setting.obs_period === 'all'
              ? [0, Infinity]
              : tidal_currents_filter_setting.obs_period === 'more than 30 days'
              ? [30, Infinity]
              : tidal_currents_filter_setting.obs_period === 'less than 30 days'
              ? [0, 30]
              : [0, 0],
          ],
          extensions: [new DataFilterExtension({ filterSize: 3 })],
        }),

      // 해양상태 - 최강 창·낙조류 관측지점 위치 포인트 가시화
      tidal_currents_selected.length > 0 &&
        new ScatterplotLayer({
          id: `condition-tidal-currents-points`,
          data: tidal_currents_selected,
          getPosition: (d) => [d.longitude, d.latitude],
          getFillColor: tidal_currents_display_setting.fill_color,
          filled: true,
          radiusUnits: 'pixels',
          radiusMinPixels: tidal_currents_display_setting.radius_min_pixels,
          stroked: false,
          updateTriggers: {
            getFilterValue: [
              tidal_currents_filter_setting.show_flood,
              tidal_currents_filter_setting.show_ebb,
            ],
          },
          // filter
          getFilterValue: (d) => {
            let filterConditionFlood;
            let filterConditionEbb;
            let filterConditionObsPeriod;

            if (d.cat_ts === '창조') {
              filterConditionFlood = tidal_currents_filter_setting.show_flood === false ? 2 : 0.5;
            } else {
              filterConditionEbb = tidal_currents_filter_setting.show_ebb === false ? 2 : 0.5;
            }

            let start = moment(d.start_datetime);
            let end = moment(d.end_datetime);
            filterConditionObsPeriod = moment.duration(end.diff(start)).asDays();

            return [filterConditionFlood, filterConditionEbb, filterConditionObsPeriod];
          },
          filterRange: [
            [0, 1],
            [0, 1],
            tidal_currents_filter_setting.obs_period === 'all'
              ? [0, Infinity]
              : tidal_currents_filter_setting.obs_period === 'more than 30 days'
              ? [30, Infinity]
              : tidal_currents_filter_setting.obs_period === 'less than 30 days'
              ? [0, 30]
              : [0, 0],
          ],
          extensions: [new DataFilterExtension({ filterSize: 3 })],
        }),
    ].filter(Boolean); // filter null and undefined

    return (
      <DeckGL
        initialViewState={{ ...viewport }}
        controller={true}
        layers={[dataLayers, backgroundLayers]}
        getTooltip={({ layer, object }) => {
          // 위험사례(관측) - 태풍
          if (object && object.properties !== null && layer.id.startsWith('typhoon')) {
            return {
              html: `
              <div>
                <div>태풍아이디: ${object.properties.태풍아이디}</div>
                <div>일시: ${object.properties.일시}</div>
                <div>기압: ${object.properties.기압}</div>
                <div>풍속: ${object.properties.풍속}</div>
                <div>강풍반경: ${object.properties.강풍반경}</div>
                <div>강도: ${object.properties.강도}</div>
              </div>`,
              style: {
                fontSize: '1em',
              },
            };
          }
          // TODO: 해역특성

          // 해양상태 - 최강 창·낙조류
          if (object !== undefined && layer.id === 'condition-tidal-currents-arrows') {
            return {
              html: `
              <div>
                <div>카테고리: ${object.cat_ts}</div>
                <div>유속: ${object.cur_spd} m/s</div>
                <div>유향: ${object.cur_dir}°</div>       
                <div>위도: ${object.latitude}</div>
                <div>경도: ${object.longitude}</div>
                <div>관측시작: ${moment(object.start_datetime).format('YYYY-MM-DD HH:mm:ss')}</div>
                <div>관측종료: ${moment(object.end_datetime).format('YYYY-MM-DD HH:mm:ss')}</div>
                <div>기준항: ${object.ref_tidal_station}</div>
                <div>신뢰도: ${object.usage}</div>
              </div>`,
              style: {
                fontSize: '1em',
              },
            };
          }
        }}
      >
        <Map
          ref={this.mapRef}
          mapStyle={`mapbox://styles/mapbox/${basemap.map_style}`}
          projection={'mercator'}
          mapboxAccessToken={TOKEN}
          onLoad={this._changeLanguage}
          antialias={true}
        />
      </DeckGL>
    );
  }
}

const mapStateToProps = (state) => ({
  // 위험사례(재현)
  scalar_variable: state.raster.scalar_variable,
  vector_variable: state.raster.vector_variable,
  sband: state.raster.sband_raster,
  mband: state.raster.mband_raster,
  mband_data: state.raster.mband_data_array,
  opacity: state.raster.opacity,
  grid_json_file: state.raster.grid_json_file,
  // 위험사례(관측) - 태풍
  typhoons_selected: state.danger.typhoons_selected,
  typhoons_display_setting: state.danger.typhoons_display_setting,
  // 해역특성 - 사고, 항로, 영역 스키마별 테이블
  checked_layers: state.characteristic.checked_layers,
  // 해양상태 - 최강 창·낙조류
  tidal_currents_selected: state.condition.tidal_currents_selected,
  tidal_currents_display_setting: state.condition.tidal_currents_display_setting,
  tidal_currents_filter_setting: state.condition.tidal_currents_filter_setting,
  // 디스플레이
  basemap: state.display.basemap,
  coastline: state.display.coastline,
});

export default connect(mapStateToProps)(HilsDemo);
