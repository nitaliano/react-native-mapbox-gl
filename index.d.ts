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

interface MapViewPropTypes extends ViewProperties {
    initialZoomLevel?: number;
    initialDirection?: number;
    initialCenterCoordinate: {
        latitude: number;
        longitude: number;
    };
    clipsToBounds?: boolean;
    debugActive?: boolean;
    rotateEnabled?: boolean;
    scrollEnabled?: boolean;
    zoomEnabled?: boolean;
    minimumZoomLevel?: number;
    maximumZoomLevel?: number;
    pitchEnabled?: boolean;
    annotationsPopUpEnabled?: boolean;
    showsUserLocation?: boolean;
    styleURL: string;
    userTrackingMode?: number;
    attributionButtonIsHidden?: boolean;
    logoIsHidden?: boolean;
    compassIsHidden?: boolean;
    userLocationVerticalAlignment?: number;
    contentInset?: number | string [];
    annotations?: Annotations [];
    annotationsAreImmutable?: boolean;
    onRegionDidChange?: () => void;
    onRegionWillChange?: () => void;
    onOpenAnnotation?: () => void;
    onCloseAnnotation?: () => void;
    onUpdateUserLocation?: () => void;
    onRightAnnotationTapped?: () => void;
    onFinishLoadingMap?: () => void;
    onStartLoadingMap?: () => void;
    onLocateUserFailed?: () => void;
    onLongPress?: () => void;
    onTap?: () => void;
    onChangeUserTrackingMode?: () => void;
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
    class MapView extends Component<MapViewPropTypes> {
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