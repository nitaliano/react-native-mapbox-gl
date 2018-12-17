import React from 'react';
import MapboxGL from '@mapbox/react-native-mapbox-gl';

import BaseExamplePropTypes from './common/BaseExamplePropTypes';
import Page from './common/Page';

import sheet from '../styles/sheet';

const styles = MapboxGL.StyleSheet.create({
  line: {
    lineCap: "round",
    lineJoin: "round",
    lineOpacity: 0.6,
    lineColor: "rgb(53, 175, 109)",
    lineWidth: 2
  },
});

const TILEJSON_URL = "https://s3.amazonaws.com/tgaw/tilejson.json";

// This example ported to React Native:
// https://www.mapbox.com/mapbox-gl-js/example/third-party/
class ThirdPartyVectorTileSource extends React.PureComponent {
  static propTypes = {
    ...BaseExamplePropTypes,
  };

  render() {
    return (
      <Page {...this.props}>
        <MapboxGL.MapView
          zoomLevel={12}
          centerCoordinate={[-87.622088, 41.878781]}
          styleURL="mapbox://styles/mapbox/light-v9"
          style={sheet.matchParent}>
          <MapboxGL.VectorSource
            id="customTileSourceExample"
            url={TILEJSON_URL}>
            <MapboxGL.LineLayer
              id="customTileSourceLine"
              sourceLayerID="mapillary-sequences"
              style={styles.line}
            />
          </MapboxGL.VectorSource>
        </MapboxGL.MapView>
      </Page>
    );
  }
}

export default ThirdPartyVectorTileSource;
