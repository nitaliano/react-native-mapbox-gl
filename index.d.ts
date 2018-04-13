// Types for react-native-mapbox-gl v5.2.1

import {Component} from 'react';
import {
    ViewProperties,
    NativeModules,
    EmitterSubscription
} from 'react-native';

interface MapStyles {
    streets: string;
    dark: string;
    light: string;
    satellite: string;
    hybrid: string;
    emerald: string;
}

declare enum UserTrackingMode {
    none = 0,
    follow = 1,
    followWithCourse = 2,
    followWithHeading = 3,
}

declare enum UserLocationVerticalAlignment {
    center = 0,
    top = 1,
    bottom = 2,
}

// https://github.com/mapbox/react-native-mapbox-gl/blob/master/docs/MapView.md#props
interface MapViewProps extends ViewProperties {

    /** Animates changes between pitch and bearing */
    animated?: boolean

    /** Initial center coordinate on map [lng, lat] */
    centerCoordinate?: number[]

    /** Shows the users location on the map */
    showUserLocation?: boolean

    /** The mode used to track the user location on the map */
    userTrackingMode?: number; // TODO enum

    /** The vertical alignment of the user location within in map. This is only enabled while tracking the users location. */
    userLocationVerticalAlignment?: number

    /** The distance from the edges of the map view’s frame to the edges of the map view’s logical viewport. */
    contentInset?: number | string []

    /** Initial heading on map */
    heading?: number

    /** Initial pitch on map */
    pitch?: number

    /** Style URL for map */
    styleURL: string

    /** Initial zoom level of map */
    zoomLevel?: number

    /** Min zoom level of map */
    minZoomLevel?: number

    /** Max zoom level of map */
    maxZoomLevel?: number

    /** Automatically change the language of the map labels to the system’s preferred language,
this is not something that can be toggled on/off */
    localizeLabels?: boolean

    /** Enable/Disable zoom on the map */
    zoomEnabled?: boolean

    /** Enable/Disable scroll on the map */
    scrollEnabled?: boolean

    /** Enable/Disable pitch on map */
    pitchEnabled?: boolean

    /** Enable/Disable rotation on map */
    rotateEnabled?: boolean

    /** The Mapbox terms of service, which governs the use of Mapbox-hosted vector tiles and styles,
requires these copyright notices to accompany any map that features Mapbox-designed styles, OpenStreetMap data, or other Mapbox data such as satellite or terrain data.
If that applies to this map view, do not hide this view or remove any notices from it.

You are additionally required to provide users with the option to disable anonymous usage and location sharing (telemetry).
If this view is hidden, you must implement this setting elsewhere in your app. See our website for Android and iOS for implementation details.

Enable/Disable attribution on map. For iOS you need to add MGLMapboxMetricsEnabledSettingShownInApp=YES
to your Info.plist */
    attributionEnabled?: boolean

    /** Enable/Disable the logo on the map. */
    logoEnabled?: boolean

    /** Enable/Disable the compass from appearing on the map */
    compassEnabled?: boolean

    /** [Android only] Enable/Disable use of GLSurfaceView insted of TextureView. */
    surfaceView?: boolean

    /** Map press listener, gets called when a user presses the map */
    onPress?: () => void

    /** Map long press listener, gets called when a user long presses the map */
    onLongPress?: () => void

    /** This event is triggered whenever the currently displayed map region is about to change. */
    onRegionWillChange?: () => void

    /** This event is triggered whenever the currently displayed map region is changing. */
    onRegionIsChanging?: () => void

    /** This event is triggered whenever the currently displayed map region finished changing */
    onRegionDidChange?: () => void

    /** This event is triggered whenever the location engine receives a location update */
    onUserLocationUpdate?: () => void

    /** This event is triggered when the map is about to start loading a new map style. */
    onWillStartLoadingMap?: () => void

    /** This is triggered when the map has successfully loaded a new map style. */
    onDidFinishLoadingMap?: () => void

    /** This event is triggered when the map has failed to load a new map style. */
    onDidFailLoadingMap?: () => void

    /** This event is triggered when the map will start rendering a frame. */
    onWillStartRenderingFrame?: () => void

    /** This event is triggered when the map finished rendering a frame. */
    onDidFinishRenderingFrame?: () => void

    /** This event is triggered when the map fully finished rendering a frame. */
    onDidFinishRenderingFrameFully?: () => void

    /** This event is triggered when the map will start rendering the map. */
    onWillStartRenderingMap?: () => void

    /** This event is triggered when the map finished rendering the map. */
    onDidFinishRenderingMap?: () => void

    /** This event is triggered when the map fully finished rendering the map. */
    onDidFinishRenderingMapFully?: () => void

    /** This event is triggered when a style has finished loading. */
    onDidFinishLoadingStyle?: () => void

    /** This event is triggered when the users tracking mode is changed. */
    onUserTrackingModeChange?: () => void

}

interface Annotations {
    /**
     * For type polyline and polygon must be an array of arrays. For type point, array as [latitude longitude]
     */
    coordinates: number [] | [number []];
    type: 'point' | 'polyline' | 'polygon';

    /**
     * Unique identifier used for adding or selecting an annotation.
     */
    id: string;

    /**
     * Title string. Appears when marker pressed
     */
    title?: string;
    subtitle?: string;

    /**
     * Only for type=polygon. Controls the opacity of the polygon
     */
    fillAlpha?: number;

    /**
     * Only for type=polygon. CSS color (#rrggbb). Controls the fill color of the polygon
     */
    fillColor?: string;

    /**
     * Only for type=polygon or type=polyline. Controls the opacity of the line
     */
    strokeAlpha?: number;

    /**
     * Only for type=polygon or type=polyline. CSS color (#rrggbb). Controls line color.
     */
    strokeColor?: string;

    /**
     * Only for type=polygon or type=polyline. Controls line width.
     */
    strokeWidth?: number;

    /**
     * Marker image for type=point
     */
    annotationImage?: {
        height: number,
        width: number,
        url: string
    };
    /**
     * iOS only. Clickable image that appears when type=point marker pressed
     */
    rightCalloutAccessory?: {
        height: number,
        width: number,
        url: string
    };
}

interface CameraPosition {
    latitude?: number;
    longitude?: number;

    /**
     * Can't be specified at the same time with altitude
     */
    zoomLevel?: number;
    direction?: number;

    /**
     * On iOS, pitch can't be specified at the same time as zoomLevel. altitude must be used instead.
     */
    pitch?: number;

    /**
     * Not available on android, use zoomLevel instead.
     */
    altitude?: number;
}

interface Annotations {
    /**
     * For type polyline and polygon must be an array of arrays. For type point, array as [latitude longitude]
     */
    coordinates: number [] | [number []];
    type: 'point' | 'polyline' | 'polygon';

    /**
     * Unique identifier used for adding or selecting an annotation.
     */
    id: string;

    /**
     * Title string. Appears when marker pressed
     */
    title?: string;
    subtitle?: string;

    /**
     * Only for type=polygon. Controls the opacity of the polygon
     */
    fillAlpha?: number;

    /**
     * Only for type=polygon. CSS color (#rrggbb). Controls the fill color of the polygon
     */
    fillColor?: string;

    /**
     * Only for type=polygon or type=polyline. Controls the opacity of the line
     */
    strokeAlpha?: number;

    /**
     * Only for type=polygon or type=polyline. CSS color (#rrggbb). Controls line color.
     */
    strokeColor?: string;

    /**
     * Only for type=polygon or type=polyline. Controls line width.
     */
    strokeWidth?: number;

    /**
     * Marker image for type=point
     */
    annotationImage?: {
        height: number,
        width: number,
        url: string
    };
    /**
     * iOS only. Clickable image that appears when type=point marker pressed
     */
    rightCalloutAccessory?: {
        height: number,
        width: number,
        url: string
    };
}

interface CameraPosition {
    latitude?: number;
    longitude?: number;

    /**
     * Can't be specified at the same time with altitude
     */
    zoomLevel?: number;
    direction?: number;

    /**
     * On iOS, pitch can't be specified at the same time as zoomLevel. altitude must be used instead.
     */
    pitch?: number;

    /**
     * Not available on android, use zoomLevel instead.
     */
    altitude?: number;
}

interface OfflinePackOptions {
    name: string;
    type: string;

    /**
     * You can put any information in here that may be useful to you
     */
    metadata?: any;

    /**
     * The corners of the bounded rectangle region being saved offline
     * [latitudeSW, longitudeSW, latitudeNE, longitudeNE]
     */
    bounds: number [];

    minZoomLevel: number;
    maxZoomLevel: number;
    styleURL: MapStyles; //Valid styleURL
}

interface Progress {
    /**
     * The name this pack was registered with
     */
    name: string,

    /**
     * The value that was previously passed as metadata
     */
    metadata: any,

    /**
     * The number of bytes downloaded for this pack
     */
    countOfBytesCompleted: number,

    /**
     * The number of tiles that have been downloaded for this pack
     */
    countOfResourcesCompleted: number,

    /**
     * The estimated minimum number of total tiles in this pack
     */
    countOfResourcesExpected: number,

    /**
     * The estimated maximum number of total tiles in this pack
     */
    maximumResourcesExpected: number

}

declare namespace Mapbox {
    class MapView extends Component<MapViewProps> {
        /**
         * Viewport setters
         */
        setDirection(direction: number, animated?: boolean, callback?: () => void): Promise<void>;

        setZoomLevel(zoomLevel: number, animated?: boolean, callback?: () => void): Promise<void>;

        setPitch(pitch: number, animated?: boolean, callback?: () => void): Promise<void>;

        setCenterCoordinate(latitude: number, longitude: number, animated?: boolean, callback?: () => void): Promise<void>;

        setCenterCoordinateZoomLevel(latitude: number, longitude: number,
                                     zoomLevel: number, animated?: boolean, callback?: () => void): Promise<void>;

        setCenterCoordinateZoomLevelPitch(latitude: number, longitude: number,
                                          zoomLevel: number, pitch: number, animated?: boolean, callback?: () => void): Promise<void>;

        easeTo(options: CameraPosition, animated?: boolean, callback?: () => void): Promise<void>;

        /**
         * Adjusts the center location and the zoomLevel of the map so that the rectangle determined by latitudeSW,
         * longitudeSW, latitudeNE, longitudeNE fits inside the viewport.
         * You can optionally pass a minimum padding (in screen points) that will be visible around the given coordinate bounds.
         * The transition is animated unless you pass animated as false
         */
        setVisibleCoordinateBounds(latitudeSW: boolean, longitudeSW: boolean, latitudeNE: boolean,
                                   longitudeNE: boolean, paddingTop?: boolean, paddingRight?: boolean,
                                   paddingBottom?: boolean, paddingLeft?: boolean, animated?: boolean): void;

        /**
         * Getters
         */
        getCenterCoordinateZoomLevel(callback: () => void): void;

        getDirection(callback: () => void): void;

        getBounds(callback: () => void): void;

        getPitch(callback: () => void): void;

        /**
         * Others
         */
        selectAnnotation(annotationId: string, animated?: boolean): void;

        deselectAnnotation(): void;
    }
    class Annotation extends Component {}

    const mapStyles: MapStyles;
    const userTrackingMode: UserTrackingMode;
    const userLocationVerticalAlignment: UserLocationVerticalAlignment;
    const unknownResourceCount: number;

    function getMetricsEnabled(): boolean;
    function setMetricsEnabled(enabled: boolean): void;
    function setAccessToken(token: string): Promise<void>;
    function setConnected(connected: boolean): void;

    /**
     * Offline Methods.
     * Before using offline packs, you must call Mapbox.initializeOfflinePacks().
     */
    function initializeOfflinePacks(): Promise<void>;
    function addOfflinePack(options: OfflinePackOptions, callback: () => void): Promise<void>;
    function getOfflinePacks(callback: (packs: Progress []) => void): Promise<Progress []>;
    function removeOfflinePack(callback: () => void): Promise<void>;
    function addOfflinePackProgressListener(handler: (progress: Progress) => void): EmitterSubscription;
    function addOfflineMaxAllowedTilesListener(handler: () => void): EmitterSubscription;
    function addOfflineErrorListener(handler: () => void): EmitterSubscription;
    function setOfflinePackProgressThrottleInterval(milis: number): void;
}

export default Mapbox;