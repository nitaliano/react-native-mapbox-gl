'use strict';

var React = require('react');
var ReactNative = require('react-native');
var { NativeModules, requireNativeComponent, findNodeHandle } = ReactNative;

var { MapboxGLManager } = NativeModules;

var MapMixins = {
  addPackForRegion(mapRef, options) {
    MapboxGLManager.addPackForRegion(findNodeHandle(this.refs[mapRef]), options);
  },
  getPacks(mapRef, callback) {
    MapboxGLManager.getPacks(findNodeHandle(this.refs[mapRef]), callback);
  },
  removePack(mapRef, packName, callback) {
    MapboxGLManager.removePack(findNodeHandle(this.refs[mapRef]), packName, callback);
  },
  setDirectionAnimated(mapRef, heading) {
    MapboxGLManager.setDirectionAnimated(findNodeHandle(this.refs[mapRef]), heading);
  },
  setZoomLevelAnimated(mapRef, zoomLevel) {
    MapboxGLManager.setZoomLevelAnimated(findNodeHandle(this.refs[mapRef]), zoomLevel);
  },
  setCenterCoordinateAnimated(mapRef, latitude, longitude) {
    MapboxGLManager.setCenterCoordinateAnimated(findNodeHandle(this.refs[mapRef]), latitude, longitude);
  },
  setCenterCoordinateZoomLevelAnimated(mapRef, latitude, longitude, zoomLevel) {
    MapboxGLManager.setCenterCoordinateZoomLevelAnimated(findNodeHandle(this.refs[mapRef]), latitude, longitude, zoomLevel);
  },
  setCameraAnimated(mapRef, latitude, longitude, fromDistance, pitch, heading, duration) {
    MapboxGLManager.setCameraAnimated(findNodeHandle(this.refs[mapRef]), latitude, longitude, fromDistance, pitch, heading, duration);
  },
  addAnnotations(mapRef, annotations) {
    MapboxGLManager.addAnnotations(findNodeHandle(this.refs[mapRef]), annotations);
  },
  updateAnnotation(mapRef, annotation) {
    MapboxGLManager.updateAnnotation(findNodeHandle(this.refs[mapRef]), annotation);
  },
  selectAnnotationAnimated(mapRef, selectedIdentifier) {
    MapboxGLManager.selectAnnotationAnimated(findNodeHandle(this.refs[mapRef]), selectedIdentifier);
  },
  removeAnnotation(mapRef, selectedIdentifier) {
    MapboxGLManager.removeAnnotation(findNodeHandle(this.refs[mapRef]), selectedIdentifier);
  },
  removeAllAnnotations(mapRef) {
    MapboxGLManager.removeAllAnnotations(findNodeHandle(this.refs[mapRef]));
  },
  setVisibleCoordinateBoundsAnimated(mapRef, latitudeSW, longitudeSW, latitudeNE, longitudeNE, paddingTop, paddingRight, paddingBottom, paddingLeft) {
    MapboxGLManager.setVisibleCoordinateBoundsAnimated(findNodeHandle(this.refs[mapRef]), latitudeSW, longitudeSW, latitudeNE, longitudeNE, paddingTop, paddingRight, paddingBottom, paddingLeft);
  },
  setUserTrackingMode(mapRef, userTrackingMode) {
    MapboxGLManager.setUserTrackingMode(findNodeHandle(this.refs[mapRef]), userTrackingMode);
  },
  getCenterCoordinateZoomLevel(mapRef, callback) {
    MapboxGLManager.getCenterCoordinateZoomLevel(findNodeHandle(this.refs[mapRef]), callback);
  },
  getDirection(mapRef, callback) {
    MapboxGLManager.getDirection(findNodeHandle(this.refs[mapRef]), callback);
  },
  getBounds(mapRef, callback) {
    MapboxGLManager.getBounds(findNodeHandle(this.refs[mapRef]), callback);
  },
  mapStyles: MapboxGLManager.mapStyles,
  userTrackingMode: MapboxGLManager.userTrackingMode,
  userLocationVerticalAlignment: MapboxGLManager.userLocationVerticalAlignment,
  unknownResourceCount: MapboxGLManager.unknownResourceCount
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
  _onLongPress(event: Event) {
    if (this.props.onLongPress) this.props.onLongPress(event.nativeEvent.src);
  },
  _onTap(event: Event) {
    if (this.props.onTap) this.props.onTap(event.nativeEvent.src);
  },
  _onFinishLoadingMap(event: Event) {
    if (this.props.onFinishLoadingMap) this.props.onFinishLoadingMap(event.nativeEvent.src);
  },
  _onStartLoadingMap(event: Event) {
    if (this.props.onStartLoadingMap) this.props.onStartLoadingMap(event.nativeEvent.src);
  },
  _onLocateUserFailed(event: Event) {
    if (this.props.onLocateUserFailed) this.props.onLocateUserFailed(event.nativeEvent.src);
  },
  _onOfflineProgressDidChange(event: Event) {
    if (this.props.onOfflineProgressDidChange) this.props.onOfflineProgressDidChange(event.nativeEvent.src);
  },
  _onOfflineMaxAllowedMapboxTiles(event: Event) {
    if (this.props.onOfflineMaxAllowedMapboxTiles) this.props.onOfflineMaxAllowedMapboxTiles(event.nativeEvent.src);
  },
  _onOfflineDidRecieveError(event: Event) {
    if (this.props.onOfflineDidRecieveError) this.props.onOfflineDidRecieveError(event.nativeEvent.src);
  },
  propTypes: {
    showsUserLocation: React.PropTypes.bool,
    rotateEnabled: React.PropTypes.bool,
    scrollEnabled: React.PropTypes.bool,
    zoomEnabled: React.PropTypes.bool,
    accessToken: React.PropTypes.string.isRequired,
    zoomLevel: React.PropTypes.number,
    direction: React.PropTypes.number,
    styleURL: React.PropTypes.string,
    clipsToBounds: React.PropTypes.bool,
    debugActive: React.PropTypes.bool,
    userTrackingMode: React.PropTypes.number,
    attributionButton: React.PropTypes.bool,
    centerCoordinate: React.PropTypes.shape({
      latitude: React.PropTypes.number.isRequired,
      longitude: React.PropTypes.number.isRequired
    }),
    annotations: React.PropTypes.arrayOf(React.PropTypes.shape({
      coordinates: React.PropTypes.array.isRequired,
      title: React.PropTypes.string,
      subtitle: React.PropTypes.string,
      fillAlpha: React.PropTypes.number,
      fillColor: React.PropTypes.string,
      strokeAlpha: React.PropTypes.number,
      strokeColor: React.PropTypes.string,
      strokeWidth: React.PropTypes.number,
      id: React.PropTypes.string,
      type: React.PropTypes.string.isRequired,
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
    attributionButtonIsHidden: React.PropTypes.bool,
    logoIsHidden: React.PropTypes.bool,
    compassIsHidden: React.PropTypes.bool,
    onRegionChange: React.PropTypes.func,
    onRegionWillChange: React.PropTypes.func,
    onOpenAnnotation: React.PropTypes.func,
    onUpdateUserLocation: React.PropTypes.func,
    onRightAnnotationTapped: React.PropTypes.func,
    onFinishLoadingMap: React.PropTypes.func,
    onStartLoadingMap: React.PropTypes.func,
    onLocateUserFailed: React.PropTypes.func,
    onLongPress: React.PropTypes.func,
    onTap: React.PropTypes.func,
    contentInset: React.PropTypes.array,
    userLocationVerticalAlignment: React.PropTypes.number,
    onOfflineProgressDidChange: React.PropTypes.func,
    onOfflineMaxAllowedMapboxTiles: React.PropTypes.func,
    onOfflineDidRecieveError: React.PropTypes.func
  },
  getDefaultProps() {
    return {
      centerCoordinate: {
        latitude: 0,
        longitude: 0
      },
      debugActive: false,
      direction: 0,
      rotateEnabled: true,
      scrollEnabled: true,
      showsUserLocation: false,
      styleURL: this.Mixin.mapStyles.streets,
      zoomEnabled: true,
      zoomLevel: 0,
      attributionButtonIsHidden: false,
      logoIsHidden: false,
      compassIsHidden: false
    };
  },
  render() {
    return (
      <MapboxGLView
        {...this.props}
        onRegionChange={this._onRegionChange}
        onRegionWillChange={this._onRegionWillChange}
        onOpenAnnotation={this._onOpenAnnotation}
        onRightAnnotationTapped={this._onRightAnnotationTapped}
        onUpdateUserLocation={this._onUpdateUserLocation}
        onLongPress={this._onLongPress}
        onTap={this._onTap}
        onFinishLoadingMap={this._onFinishLoadingMap}
        onStartLoadingMap={this._onStartLoadingMap}
        onLocateUserFailed={this._onLocateUserFailed}
        onOfflineProgressDidChange={this._onOfflineProgressDidChange}
        onOfflineMaxAllowedMapboxTiles={this._onOfflineMaxAllowedMapboxTiles}
        onOfflineDidRecieveError={this._onOfflineDidRecieveError} />
    );
  }
});

var MapboxGLView = requireNativeComponent('RCTMapboxGL', MapView);

module.exports = MapView;
