import React from 'react-native';
const {
  NativeModules,
  requireNativeComponent,
  PropTypes,
  processColor,
} = React;

import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';

const MapboxGLManager = NativeModules.MapboxGLManager;

const RCTMapboxGL = requireNativeComponent('RCTMapboxGL', MapView);

// needs for check a target of tap
// because we don't fire tap event when we tapped on annotation
let annotationWasSelected = false;
const tapCheckTimeout = 500;

export default class MapView extends React.Component {
  _proccessAnnotations(annotations) {
    annotations.slice().forEach((annotation) => {
      if (annotation.image &&
          annotation.image.source &&
          typeof annotation.image.source === 'number') {

        annotation.image.source = resolveAssetSource(annotation.image.source);
      }

      if (annotation.rightCalloutAccessoryImage &&
          annotation.rightCalloutAccessoryImage.source &&
          typeof annotation.rightCalloutAccessoryImage.source === 'number') {

        annotation.rightCalloutAccessoryImage.source = resolveAssetSource(annotation.rightCalloutAccessoryImage.source);
      }

      if (annotation.fillColor) {
        annotation.fillColor = processColor(annotation.fillColor);
      }

      if (annotation.strokeColor) {
        annotation.strokeColor = processColor(annotation.strokeColor);
      }
    })

    return annotations;
  }

  _onRightAccessoryCalloutTapped(e) {
    this.props.onRightAccessoryCalloutTapped && this.props.onRightAccessoryCalloutTapped(e.nativeEvent.annotationId);
  }

  _onAnnotationSelected(e) {
    annotationWasSelected = true;

    const annotationId = e.nativeEvent.annotationId;

    if (annotationId === 'userLocation') {
      setTimeout(() => {
        annotationWasSelected = false;
      }, tapCheckTimeout + 50);
    }

    this.props.onAnnotationSelected && this.props.onAnnotationSelected(annotationId);
  }

  _onAnnotationDeselected(e) {
    const annotationId = e.nativeEvent.annotationId;

    if (annotationId !== 'userLocation') {
      annotationWasSelected = false;
    }

    this.props.onAnnotationDeselected && this.props.onAnnotationDeselected(annotationId);
  }

  _onUpdateUserLocation(e) {
    this.props.onUpdateUserLocation && this.props.onUpdateUserLocation(e.nativeEvent.userLocation);
  }

  _onLocateUserFailed(e) {
    this.props.onLocateUserFailed && this.props.onLocateUserFailed(e.nativeEvent.error);
  }

  _onRegionChanged(e) {
    this.props.onRegionChanged && this.props.onRegionChanged(e.nativeEvent.region);
  }

  _onTap(e) {
    const coordinate = e.nativeEvent.coordinate;
    setTimeout(() => {
      if (!annotationWasSelected) {
        this.props.onTap && this.props.onTap(coordinate);
      }
    }, tapCheckTimeout)
  }

  render() {
    if (this.props.annotations.length) {
      this.props.annotations = this._proccessAnnotations(this.props.annotations);
    }

    return (
      <RCTMapboxGL
        {...this.props}
        onRightAccessoryCalloutTapped={this._onRightAccessoryCalloutTapped.bind(this)}
        onAnnotationSelected={this._onAnnotationSelected.bind(this)}
        onAnnotationDeselected={this._onAnnotationDeselected.bind(this)}
        onUpdateUserLocation={this._onUpdateUserLocation.bind(this)}
        onLocateUserFailed={this._onLocateUserFailed.bind(this)}
        onRegionChanged={this._onRegionChanged.bind(this)}
        onTap={this._onTap.bind(this)}
        />
    )
  }

  setZoomLevel(zoomLevel = 0, animated = true) {
    MapboxGLManager
      .setZoomLevel(React.findNodeHandle(this), zoomLevel, animated);
  }

  setDirection(heading = 0, animated = true) {
    MapboxGLManager
      .setDirection(React.findNodeHandle(this), heading, animated);
  }

  setCenterCoordinate(centerCoordinate = {
                                          latitude: 0,
                                          longitude: 0
                                        },
                                        animated = true
                                      )
  {
    MapboxGLManager
      .setCenterCoordinate(React.findNodeHandle(this), centerCoordinate, animated);
  }

  setCenterCoordinateAndZoomLevel(centerCoordinate = {
                                          latitude: 0,
                                          longitude: 0
                                        },
                                        zoomLevel = 0,
                                        animated = true,
                                      )
  {
    MapboxGLManager
      .setCenterCoordinateAndZoomLevel(React.findNodeHandle(this), centerCoordinate, zoomLevel, animated);
  }

  setVisibleCoordinateBounds(sw = {
                                latitude: 0,
                                longitude: 0,
                              },
                              ne = {
                                latitude: 0,
                                longitude: 0,
                              },
                              edgePadding: {
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                              },
                              animated = true,
                            )
  {
    MapboxGLManager
      .setVisibleCoordinateBounds(React.findNodeHandle(this), sw, ne, edgePadding, animated);
  }

  addAnnotations(annotations = []) {
    if (annotations.length) {
      annotations = this._proccessAnnotations(annotations);

      MapboxGLManager
        .addAnnotations(React.findNodeHandle(this), annotations);
    }
  }

  showAnnotations(annotationIds = [], animated = true) {
    if (annotationIds.length > 0) {
      MapboxGLManager
        .showAnnotations(React.findNodeHandle(this), annotationIds, animated);
    }
  }

  selectAnnotation(id, animated = true) {
    if (id) {
      MapboxGLManager
        .selectAnnotation(React.findNodeHandle(this), id, animated);
    }
  }

  deselectAnnotation(id, animated = true) {
    if (id) {
      MapboxGLManager
        .deselectAnnotation(React.findNodeHandle(this), id, animated);
    }
  }

  removeAnnotations(annotationIds = []) {
    if (annotationIds.length > 0) {
      MapboxGLManager
        .removeAnnotations(React.findNodeHandle(this), annotationIds);
    }
  }

  setCamera(camera = {
    altitude: 0,
    centerCoordinate: {
      latitude: 0,
      longitude: 0,
    },
    heading: 0,
    pitch: 0,
  }, animated = true) {
    MapboxGLManager
      .setCamera(React.findNodeHandle(this), camera, animated);
  }

  resetNorth() {
    MapboxGLManager
      .resetNorth(React.findNodeHandle(this));
  }

  resetPosition() {
    MapboxGLManager
      .resetPosition(React.findNodeHandle(this));
  }
}

MapView.propTypes = {
  accessToken: (props, propName, componentName) => {
    const prop = props[propName];

    if (!prop || prop === 'your-mapbox.com-access-token') {
      return new Error('No access token specified. Go to mapbox.com to signup and get an access token.')
    }
  },

  styleURL: PropTypes.string,
  clipsToBounds: PropTypes.bool,
  debugActive: PropTypes.bool,
  rotateEnabled: PropTypes.bool,
  scrollEnabled: PropTypes.bool,
  zoomEnabled: PropTypes.bool,
  pitchEnabled: PropTypes.bool,
  centerCoordinate: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired
  }),
  direction: PropTypes.number,
  zoomLevel: PropTypes.number,
  attributionButtonIsHidden: PropTypes.bool,
  showsUserLocation: PropTypes.bool,
  userTrackingMode: PropTypes.oneOf([
    'none',
    'follow',
    'followHeading',
    'followCourse',
  ]),
  annotations: PropTypes.arrayOf(
    PropTypes.oneOfType([
      // point
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        coordinate: PropTypes.shape({
          latitude: PropTypes.number.isRequired,
          longitude: PropTypes.number.isRequired,
        }).isRequired,
        type: PropTypes.oneOf([
          'point',
        ]).isRequired,
        title: PropTypes.string,
        subtitle: PropTypes.string,
        rightCalloutAccessoryImage: PropTypes.shape({
          source: PropTypes.oneOfType([
            PropTypes.shape({
              uri: PropTypes.string.isRequired,
            }),
            // Opaque type returned by require('./image.jpg')
            PropTypes.number,
          ]).isRequired,
          width: PropTypes.number,
          height: PropTypes.number,
        }),
        image: PropTypes.shape({
          source: PropTypes.oneOfType([
            PropTypes.shape({
              uri: PropTypes.string.isRequired,
            }),
            // Opaque type returned by require('./image.jpg')
            PropTypes.number,
          ]).isRequired,
          width: PropTypes.number,
          height: PropTypes.number,
        })
      }),
      // polyline or polygon
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        coordinates: PropTypes.arrayOf().isRequired,
        type: PropTypes.oneOf([
          'polyline',
          'polygon',
        ]).isRequired,
        fillAlpha: PropTypes.number,
        fillColor: PropTypes.string,
        strokeAlpha: PropTypes.number,
        strokeColor: PropTypes.string,
        strokeWidth: PropTypes.number,
      })
    ]),
  ),
  onRightAccessoryCalloutTapped: PropTypes.func,
  onAnnotationSelected: PropTypes.func,
  onUpdateUserLocation: PropTypes.func,
  onLocateUserFailed: PropTypes.func,
  onRegionChange: PropTypes.func,
  onTap: PropTypes.func,
};

MapView.defaultProps = {
  styleURL: MapboxGLManager.styles.streets,
  clipsToBounds: true,
  debugActive: false,
  rotateEnabled: true,
  scrollEnabled: true,
  zoomEnabled: true,
  pitchEnabled: true,
  centerCoordinate: {
    latitude: 0,
    longitude: 0,
  },
  direction: 0,
  zoomLevel: 0,
  attributionButtonIsHidden: true,
  showsUserLocation: false,
  userTrackingMode: 'none',
  annotations: [],
}

MapView.styles = MapboxGLManager.styles;
