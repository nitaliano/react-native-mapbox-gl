'use strict';

var React = require('react-native');
var { NativeModules, requireNativeComponent } = React;

var MapMixins = {
  _findHandle(mapRef) {
    return React.findNodeHandle(this.refs[mapRef]);
  },
  setDirectionAnimated(mapRef, heading) {
    NativeModules.MapboxGLManager.setDirectionAnimated(this._findHandle(mapRef), heading);
  },
  setZoomLevelAnimated(mapRef, zoomLevel) {
    NativeModules.MapboxGLManager.setZoomLevelAnimated(this._findHandle(mapRef), zoomLevel);
  },
  setCenterCoordinateAnimated(mapRef, latitude, longitude) {
    NativeModules.MapboxGLManager.setCenterCoordinateAnimated(this._findHandle(mapRef), latitude, longitude);
  },
  setCenterCoordinateZoomLevelAnimated(mapRef, latitude, longitude, zoomLevel) {
    NativeModules.MapboxGLManager.setCenterCoordinateZoomLevelAnimated(this._findHandle(mapRef), latitude, longitude, zoomLevel);
  },
  addAnnotations(mapRef, annotations) {
    NativeModules.MapboxGLManager.addAnnotations(this._findHandle(mapRef), annotations);
  },
  selectAnnotationAnimated(mapRef, annotationInArray) {
    NativeModules.MapboxGLManager.selectAnnotationAnimated(this._findHandle(mapRef), annotationInArray);
  },
  removeAnnotation(mapRef, annotationInArray) {
    NativeModules.MapboxGLManager.removeAnnotation(this._findHandle(mapRef), annotationInArray);
  },
  setShowsUserLocation(mapRef, value) {
    NativeModules.MapboxGLManager.setShowsUserLocation(this._findHandle(mapRef), value);
  },
  setUserTrackingMode(mapRef, value) {
    NativeModules.MapboxGLManager.setUserTrackingMode(this._findHandle(mapRef), value);
  }
};

var MapView = React.createClass({
  statics: {
    Mixin: MapMixins
  },
  _onRegionChange(event: Event) {
    if (this.props.onRegionChange) this.props.onRegionChange(event.nativeEvent.src);
  },
  _onRegionWillChange(event: Event) {
    if (this.props.onRegionWillChange) this.props.onRegionWillChange(event.nativeEvent.src);
  },
  _onOpenAnnotation(event: Event) {
    if (this.props.onOpenAnnotation) this.props.onOpenAnnotation(event.nativeEvent.src);
  },
  _onRightAnnotationTapped(event: Event) {
    if (this.props.onRightAnnotationTapped) this.props.onRightAnnotationTapped(event.nativeEvent.src);
  },
  _onUpdateUserLocation(event: Event) {
    if (this.props.onUpdateUserLocation) this.props.onUpdateUserLocation(event.nativeEvent.src);
  },
  propTypes: {
    showsUserLocation: React.PropTypes.bool,
    updateLocationInBackground: React.PropTypes.bool,
    rotateEnabled: React.PropTypes.bool,
    scrollEnabled: React.PropTypes.bool,
    zoomEnabled: React.PropTypes.bool,
    accessToken: React.PropTypes.string.isRequired,
    zoomLevel: React.PropTypes.number,
    direction: React.PropTypes.number,
    styleURL: React.PropTypes.string,
    clipsToBounds: React.PropTypes.bool,
    debugActive: React.PropTypes.bool,
    centerCoordinate: React.PropTypes.shape({
      latitude: React.PropTypes.number.isRequired,
      longitude: React.PropTypes.number.isRequired
    }),
    annotations: React.PropTypes.arrayOf(React.PropTypes.shape({
      title: React.PropTypes.string,
      subtitle: React.PropTypes.string,
      id: React.PropTypes.string,
      coordinates: React.PropTypes.arrayOf(),
      fillColor: React.PropTypes.sting,
      strokeColor: React.PropTypes.sting,
      strokeWidth: React.PropTypes.number,
      alpha: React.PropTypes.number,
      type: React.PropTypes.string,
      rightCalloutAccessory: React.PropTypes.object({
        height: React.PropTypes.number,
        width: React.PropTypes.number,
        url: React.PropTypes.string
      }),
      annotationImage: React.PropTypes.object({
        height: React.PropTypes.number,
        width: React.PropTypes.number,
        url: React.PropTypes.string
      })
    })),
    onRegionChange: React.PropTypes.func,
    onRegionWillChange: React.PropTypes.func,
    onOpenAnnotation: React.PropTypes.func,
    onUpdateUserLocation: React.PropTypes.func,
    onRightAnnotationTapped: React.PropTypes.func
  },
  getDefaultProps() {
    return {
      styleURL: 'asset://styles/mapbox-streets-v7.json',
      scrollEnabled: true,
      zoomEnabled: true
    };
  },

  render: function() {
    return (<MapboxGLView
      {...this.props}
      onRegionChange={this._onRegionChange}
      onRegionWillChange={this._onRegionWillChange}
      onOpenAnnotation={this._onOpenAnnotation}
      onRightAnnotationTapped={this._onRightAnnotationTapped}
      onUpdateUserLocation={this._onUpdateUserLocation} />);
  }
});

var MapboxGLView = requireNativeComponent('RCTMapboxGL', MapView);

module.exports = MapView;
