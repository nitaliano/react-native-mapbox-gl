# iOS API Docs

## Options

| Option | Type | Opt/Required | Default | Note |
|---|---|---|---|---|
| `accessToken` | `string` | Required | NA |Mapbox access token. Sign up for a [Mapbox account here](https://www.mapbox.com/signup).|
| `styleURL` | `string` | Required | Mapbox Streets |  A Mapbox style. Defaults to `streets`.|
| `centerCoordinate` | `object` | Optional | `0,0`| Initial `latitude`/`longitude` the map will load at, defaults to `0,0`.
| `zoomLevel` | `double` | Optional | `0` | Initial zoom level the map will load at. 0 is the entire world, 18 is rooftop level. Defaults to 0.
| `rotateEnabled` | `bool`  |  Optional | `true`  | Whether the map can rotate |
| `scrollEnabled` | `bool`  |  Optional | `true`  | Whether the map can be scrolled |
| `zoomEnabled` | `bool`  |  Optional | `true`  | Whether the map zoom level can be changed |
| `pitchEnabled`| `bool`  |  Optional | `true`  | Whether the map camera’s pitch information is used.
|`showsUserLocation` | `bool` | Optional | `false` | Whether the user's location is shown on the map. Note - the map will not zoom to their location.|
| `annotations` | `array` | Optional | NA |  An array of annotation objects. See [annotation detail](https://github.com/bsudekum/react-native-mapbox-gl/blob/master/ios/API.md#annotations)
| `direction`  | `double` | Optional | `0` | Heading of the map in degrees where 0 is north and 180 is south |
| `debugActive`  | `bool` | Optional | `false` | Turns on debug mode. |
| `style`  | `flexbox` `view` | Optional | NA | Styles the actual map view container |
| `userTrackingMode` | `string` | Optional | `none` | Valid values are `none`, `follow`, `followWithCourse`, `followWithHeading` |
| `attributionButtonIsHidden`| `bool` | Optional | `false` | The button shown in the lower-right of the map which when pressed displays the map attribution information.

## Events

| Event Name | Returns | Notes
|---|---|---|
| `onTap` | `{latitude, longitude}` | Fired when the user tapped anywhere (__except point annotations__).
| `onRegionChanged` | `{centerCoordinate: {latidude, longitude}, zoomLevel}` | Fired when the map ends panning or zooming.
| `onAnnotationSelected` | `annotationId` | Fired when an annotation was opened(focused). __Note__: if user taps on current location annotation then annotatonId passed as __string__ `userLocation`
| `onAnnotationDeselected` | `annotationId` | Fired when an annotation was closed(blured). __Note__: if current location annotation was deselected then annotatonId passed as __string__ `userLocation`
| `onUpdateUserLocation` | `{latitude, longitude, headingAccuracy, magneticHeading, trueHeading, isUpdating}` | Fired when the users location updated.
| `onLocateUserFailed` | `{code, message}` | Fired when an attempt to locate the user’s position failed
| `onRightAccessoryCalloutTapped` | `annotationId` | Fired when user tapped on `rightCalloutAccessory`


## Methods for Modifying the Map State

#####Animated param is type of _bool_ and `true` by default.

| Method Name | Arguments | Notes
|---|---|---|
| `setDirection` | `heading`, `animated` | Rotates the map to a new heading
| `setZoomLevel` | `zoomLevel`, `animated` | Zooms the map to a new zoom level
| `setCenterCoordinate` | `{latitude, longitude}`, `animated` | Moves the map to a new coordinate. Note, the zoom level stay at the current zoom level
| `setCenterCoordinateAndZoomLevel` | `{latitude, longitude}`, `zoomLevel`, `animated` | Moves the map to a new coordinate and zoom level
| `setVisibleCoordinateBounds` | `(SW){latitude, longitude}`, `(NE){latitude, longitude}`, `(padding){top, left, bottom, right}`, `animated` | Changes the receiver’s viewport to fit the given coordinate bounds and optionally some additional padding on each side.
| `addAnnotations` | `annotations`(array of annotation objects, see [#annotations](https://github.com/bsudekum/react-native-mapbox-gl/blob/master/API.md#annotations)), `animated` | Adds annotations to the map without redrawing the map.
| `showAnnotations`| `annotationIds`(array), `animated` | Sets the visible region so that the map displays the specified annotations.
| `selectAnnotation` | `annotationId` | Open the callout of the selected annotation.
| `deselectAnnotation` | `annotationId` | Close the callout of the selected annotation.
| `removeAnnotations`  | `annotationIds`(array) | Removes the selected annotations from the map.
| `setCamera` | `{altitude, centerCoordinate:{latidude, longitude}, heading, pitch}`, `animated` | Moves the viewpoint to a different location with respect to the map with an optional transition animation.
| `resetNorth` | -- | Resets the map rotation to a northern heading.
| `resetPosition` | -- | Resets the map to the minimum zoom level, a center coordinate of (0, 0), and a northern heading.

## Styles

This ships with 6 styles included:

* `streets`
* `emerald`
* `dark`
* `light`
* `satellite`
* `hybrid`

styles stored in `ComponentName.styles`:

```js
import Mapbox from 'react-native-mapbox-gl';
```

Then you can access each style by:

```jsx
styleURL={Mapbox.styles.emerald}
```

## Custom styles

You can also create a custom style in [Mapbox Studio](https://www.mapbox.com/studio/) and add it your map. Simply grab the style url. It should look something like:

```
mapbox://styles/bobbysud/cigtw1pzy0000aam2346f7ex0
```

## Annotations

####For manipulating annotations used `id(string)` property which is required!!!

```
pointAnnotation: {
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
}

shapeAnnotation: {
	id: PropTypes.string.isRequired,
    coordinates: PropTypes.arrayOf().isRequired, // array of arrays
    type: PropTypes.oneOf([
    	'polyline',
        'polygon',
    ]).isRequired,
    fillAlpha: PropTypes.number,
    fillColor: PropTypes.string,
    strokeAlpha: PropTypes.number,
    strokeColor: PropTypes.string,
    strokeWidth: PropTypes.number,
}
```

#####Adding images is the same as in [RN images docs](https://facebook.github.io/react-native/docs/image.html#adding-static-resources-to-your-app-using-images-xcassets).
- `require('./path/to/image.png')`
- `source: {uri: 'http://my_awesome_image.com/download'}`
