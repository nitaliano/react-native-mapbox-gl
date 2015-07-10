## Options

| Option | Type | Opt/Required | Default | Note |
|---|---|---|---|---|
| `accessToken` | `string` | Required | NA |Mapbox access token. Sign up for a [Mapbox account here](https://www.mapbox.com/signup).
| `centerCoordinate` | `object` | Optional | `0,0`| Initial `latitude`/`longitude` the map will load at, defaults to `0,0`.
| `zoomLevel` | `double` | Optional | `0` | Initial zoom level the map will load at. 0 is the entire world, 18 is rooftop level. Defaults to 0.
| `rotateEnabled` | `bool`  |  Optional | `true`  | Whether the map can rotate |
| `scrollEnabled` | `bool`  |  Optional | `true`  | Whether the map can be scrolled |
| `zoomEnabled` | `bool`  |  Optional | `true`  | Whether the map zoom level can be changed |
|`showsUserLocation` | `bool` | Optional | `false` | Whether the user's location is shown on the map. Note - the map will not zoom to their location.|
| `styleURL` | `string` | Optional | Mapbox Streets |  A Mapbox GL style sheet. Defaults to `mapbox-streets`. More styles [can be viewed here](https://www.mapbox.com/mapbox-gl-styles).
| `annotations` | `array` | Optional | NA |  An array of annotation objects. See [annotation object](API.md#annotation-object)
| `direction`  | `double` | Optional | `0` | Heading of the map in degrees where 0 is north and 180 is south |
| `debugActive`  | `bool` | Optional | `false` | Turns on debug mode. |
| `style`  | flexbox `view` | Optional | NA | Styles the actual map view container |

## Events

| Event Name | Returns | Notes
|---|---|---|
| `onRegionChange` | `{latitude: 0, longitude: 0, zoom: 0}` | Fired when the map ends panning or zooming.
| `onRegionWillChange` | `{latitude: 0, longitude: 0, zoom: 0}` | Fired when the map begins panning or zooming.
| `onOpenAnnotation` | `{title: null, subtitle: null, latitude: 0, longitude: 0}` | Fired when focusing a an annotation.
| `onUpdateUserLocation` | `{latitude: 0, longitude: 0, headingAccuracy: 0, magneticHeading: 0, trueHeading: 0, isUpdating: false}` | Fired when the users location updates.
| `onRightAnnotationTapped` | `{title: null, subtitle: null, latitude: 0, longitude: 0}` | Fired when user taps `rightCalloutAccessory`


## Methods for Modifying the Map State

These methods require you to use `MapboxGLMap.Mixin` to access the methods. Each method also requires you to pass in a string as the first argument which is equal to the `ref` on the map view you wish to modify. See the [example](https://github.com/bsudekum/react-native-mapbox-gl/blob/master/example.js) on how this is implemented.

| Method Name | Arguments | Notes
|---|---|---|
| `setDirectionAnimated` | `mapViewRef`, `heading` | Rotates the map to a new heading
| `setZoomLevelAnimated` | `mapViewRef`, `zoomLevel` | Zooms the map to a new zoom level
| `setCenterCoordinateAnimated` | `mapViewRef`, `latitude`, `longitude` | Moves the map to a new coordinate. Note, the zoom level stay at the current zoom level
| `setCenterCoordinateZoomLevelAnimated` | `mapViewRef`, `latitude`, `longitude`, `zoomLevel` | Moves the map to a new coordinate and zoom level
| `addAnnotations` | `mapViewRef`, [annotation object](API.md#annotation-object) | Adds an annotation to the map without redrawing the map. Note, this will remove all previous annotations from the map.
| `selectAnnotationAnimated` | `mapViewRef`, `annotationPlaceInArray` | Open the callout of the selected annotation. This method works with the current annotations on the map. `annotationPlaceInArray` starts at 0 and refers to the first annotation.
| `removeAnnotation`  | `mapViewRef`, `annotationPlaceInArray` | Removes the selected annotation from the map. This method works with the current annotations on the map. `annotationPlaceInArray` starts at 0 and refers to the first annotation.

## GL Styles

You can change the `styleURL` to any valid GL stylesheet, here are a few:

* `asset://styles/dark-v7.json`
* `asset://styles/light-v7.json`
* `asset://styles/emerald-v7.json`
* `asset://styles/mapbox-streets-v7.json`

## Annotations object
```json
[{
  "coordinates": "Array of coordinates, lat lng",
  "title": "optional string",
  "subtitle": "optional string",
  "id": "optional string, unique identifier.",
  "rightCalloutAccessory": {
    "url": "Optional. Either remote image or specify via 'image!yourImage.png'",
    "height": "required if url specified",
    "width": "required if url specified",
  },
  "fillColor": "optional hex color value",
  "strokeColor": "optional hex color value",
  "strokeWidth": "optional number width of linestring annotation",
  "alpha": "optional number. Controls opacity of polygons and polylines.",
  "type": "Required: point, polyline, polygon"
}]
```
**For adding local images via `image!yourImage.png` see [adding static resources to your app using Images.xcassets  docs](https://facebook.github.io/react-native/docs/image.html#adding-static-resources-to-your-app-using-images-xcassets)**.

#### Annotation example
```json
annotations: [{
  "coordinates": [40.72052634, -73.94686958312988],
  "title": "This is a title",
  "subtitle": "this is a subtitle",
  "id": "foobar1234",
  "rightCalloutAccessory": {
    "url": "image!myIcon.jpg",
    "height": 30,
    "width": 30
  }
}, {
  "coordinates": [40.72052634, -73.95686958312988],
  "title": "This is another title",
  "subtitle": "this is a subtitle",
  "id": "010101",
  "rightCalloutAccessory": {
    "url": "http://png-3.findicons.com/files/icons/2799/flat_icons/256/gear.png",
    "height": 30,
    "width": 30
  }
}, {
  "coordinates": [40.82052634, -73.85686958312988],
  "title": "This is another title",
  "subtitle": "this is a subtitle"
}, {
  "coordinates": [[40.749857912194386, -73.96820068359375], [40.741924698522055,-73.9735221862793], [40.735681504432264,-73.97523880004883], [40.7315190495212,-73.97438049316406], [40.729177554196376,-73.97180557250975], [40.72345355209305,-73.97438049316406], [40.719290332250544,-73.97455215454102], [40.71369559554873,-73.97729873657227], [40.71200407096382,-73.97850036621094], [40.71031250340588,-73.98691177368163], [40.71031250340588,-73.99154663085938]],
  "type": "linestring",
  "strokeColor": "#ddd",
  "strokeWidth": 10,
  "alpha": 1,
  "id": "zap2222"
}, {
  "coordinates": [[40.726835976477936,-74.02158737182617],[40.721892375167045,-74.04321670532227], [40.71382571104455,-74.0397834777832], [40.71382571104455,-74.01369094848633], [40.72124187397379,-73.99892807006836], [40.742184818893335,-73.99892807006836], [40.726835976477936,-74.02158737182617]],
  "type": "polygon",
  "fillColor": "#999",
  "alpha": 0.5,
  "id": "neatID"
}];
```
