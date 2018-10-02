package com.mapbox.rctmgl.components.styles.sources;

import android.content.Context;
import android.util.Log;

import com.mapbox.geojson.Feature;
import com.mapbox.mapboxsdk.geometry.LatLngQuad;
import com.mapbox.mapboxsdk.style.sources.ImageSource;

import java.net.MalformedURLException;
import java.net.URL;

/**
 * Created by nickitaliano on 11/29/17.
 */

public class RCTMGLImageSource extends RCTSource<ImageSource> {
    public static final String LOG_TAG = RCTMGLImageSource.class.getSimpleName();

    private URL mURL;
    private LatLngQuad mCoordQuad;

    public RCTMGLImageSource(Context context) {
        super(context);
    }

    @Override
    public ImageSource makeSource() {
        return new ImageSource(mID, mCoordQuad, mURL);
    }

    @Override
    public void onPress(Feature feature) {
        // ignore, we cannot query raster layers
    }

    public void setURL(String url) {
        try {
            mURL = new URL(url);

            if (mSource != null) {
                mSource.setUrl(mURL);
            }
        } catch (MalformedURLException e) {
            Log.w(LOG_TAG, e.getLocalizedMessage());
        }
    }

    public void setCoordinates(LatLngQuad coordQuad) {
        mCoordQuad = coordQuad;
    }
}
