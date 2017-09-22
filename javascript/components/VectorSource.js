import React from 'react';
import PropTypes from 'prop-types';
import { NativeModules, requireNativeComponent } from 'react-native';

const MapboxGL = NativeModules.MGLModule;

export const NATIVE_MODULE_NAME = 'RCTMGLVectorSource';

const RCTMGLVectorSource = requireNativeComponent(NATIVE_MODULE_NAME, VectorSource);

/**
 * VectorSource is a map content source that supplies tiled vector data in Mapbox Vector Tile format to be shown on the map.
 * The location of and metadata about the tiles are defined either by an option dictionary or by an external file that conforms to the TileJSON specification.
 */
class VectorSource extends React.Component {
  static propTypes = {
    /**
     * A string that uniquely identifies the source.
     */
    id: PropTypes.string,

    /**
     * A URL to a TileJSON configuration file describing the source’s contents and other metadata.
     */
    url: PropTypes.string,
  };

  static defaultProps = {
    id: MapboxGL.StyleSource.DefaultSourceID,
  };

  render () {
    const props = {
      id: this.props.id,
      url: this.props.url,
    };
    return (
      <RCTMGLVectorSource {...props}>
        {this.props.children}
      </RCTMGLVectorSource>
    );
  }
}

export default VectorSource;
