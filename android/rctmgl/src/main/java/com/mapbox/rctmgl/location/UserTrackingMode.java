package com.mapbox.rctmgl.location;

import com.mapbox.mapboxsdk.plugins.locationlayer.LocationLayerMode;

/**
 * Created by nickitaliano on 12/13/17.
 */

public class UserTrackingMode {
    public static final int NONE = 0;
    public static final int FOLLOW = 1;
    public static final int FollowWithCourse = 2;
    public static final int FollowWithHeading = 3;

    public static int getMapLayerMode(int mode, boolean isShowUserLocation, boolean isShowUserOrientation) {
        if (!isShowUserLocation) {
            return LocationLayerMode.NONE;
	} else if (mode == FollowWithHeading || isShowUserOrientation) {
            return LocationLayerMode.COMPASS;
        } else if (mode == NONE) {
            return LocationLayerMode.TRACKING;
        } else if (mode == FollowWithCourse) {
            return LocationLayerMode.NAVIGATION;
	} else {
            return LocationLayerMode.TRACKING;
        }
    }

    public static boolean isUserGesture(int reason) {
        return reason == 1 || reason == 2; // user gesture or animation
    }
}
