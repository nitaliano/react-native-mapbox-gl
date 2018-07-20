package com.mapbox.rctmgl.components.styles.sources;

import android.content.Context;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.util.Log;
import android.view.View;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.mapbox.rctmgl.components.AbstractEventEmitter;
import com.mapbox.rctmgl.components.annotation.RCTMGLCallout;
import com.mapbox.rctmgl.components.mapview.RCTMGLMapView;
import com.mapbox.rctmgl.components.styles.layers.RCTLayer;
import com.mapbox.rctmgl.events.constants.EventKeys;
import com.mapbox.rctmgl.utils.ResourceUtils;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import android.os.AsyncTask;
import java.net.URLConnection;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.HashMap;

/**
 * Created by nickitaliano on 9/19/17.
 */
public class RCTMGLShapeSourceManager extends AbstractEventEmitter<RCTMGLShapeSource> {
    public static final String LOG_TAG = RCTMGLShapeSourceManager.class.getSimpleName();
    public static final String REACT_CLASS = RCTMGLShapeSource.class.getSimpleName();

    private ReactApplicationContext mContext;

    public RCTMGLShapeSourceManager(ReactApplicationContext context) {
        super(context);
        mContext = context;
        loadBuildings(context);
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected RCTMGLShapeSource createViewInstance(ThemedReactContext reactContext) {
        return new RCTMGLShapeSource(reactContext, this);
    }

    @Override
    public View getChildAt(RCTMGLShapeSource source, int childPosition) {
        return source.getLayerAt(childPosition);
    }

    @Override
    public int getChildCount(RCTMGLShapeSource source) {
        return source.getLayerCount();
    }

    @Override
    public void addView(RCTMGLShapeSource source, View childView, int childPosition) {
        source.addLayer(childView, getChildCount(source));
    }

    @Override
    public void removeViewAt(RCTMGLShapeSource source, int childPosition) {
        source.removeLayer(childPosition);
    }

    @ReactProp(name = "id")
    public void setId(RCTMGLShapeSource source, String id) {
        source.setID(id);
    }

    @ReactProp(name = "url")
    public void setURL(RCTMGLShapeSource source, String urlStr) {
        try {
            source.setURL(new URL(urlStr));
        } catch (MalformedURLException e) {
            Log.w(LOG_TAG, e.getLocalizedMessage());
        }
    }

    @ReactProp(name = "shape")
    public void setGeometry(RCTMGLShapeSource source, String geoJSONStr) {
        source.setShape(geoJSONStr);
    }

    @ReactProp(name = "cluster")
    public void setCluster(RCTMGLShapeSource source, int cluster) {
        source.setCluster(cluster == 1);
    }

    @ReactProp(name = "clusterRadius")
    public void setClusterRadius(RCTMGLShapeSource source, int radius) {
        source.setClusterRadius(radius);
    }

    @ReactProp(name = "clusterMaxZoomLevel")
    public void setClusterMaxZoomLevel(RCTMGLShapeSource source, int clusterMaxZoom) {
        source.setClusterMaxZoom(clusterMaxZoom);
    }

    @ReactProp(name = "maxZoomLevel")
    public void setMaxZoomLevel(RCTMGLShapeSource source, int maxZoom) {
        source.setMaxZoom(maxZoom);
    }

    @ReactProp(name = "buffer")
    public void setBuffer(RCTMGLShapeSource source, int buffer) {
        source.setBuffer(buffer);
    }

    @ReactProp(name = "tolerance")
    public void setTolerance(RCTMGLShapeSource source, double tolerance) {
        source.setTolerance(tolerance);
    }

    @ReactProp(name = "images")
    public void setImages(RCTMGLShapeSource source, ReadableMap map) {
        List<Map.Entry<String, String>> images = new ArrayList<>();

        ReadableMapKeySetIterator iterator = map.keySetIterator();
        while (iterator.hasNextKey()) {
            String imageName = iterator.nextKey();
            images.add(new AbstractMap.SimpleEntry<String, String>(imageName, map.getString(imageName)));
        }

        source.setImages(images);
    }

    @ReactProp(name = "nativeImages")
    public void setNativeImages(RCTMGLShapeSource source, ReadableArray arr) {
        List<Map.Entry<String, BitmapDrawable>> resources = new ArrayList<>();

        for (int i = 0; i < arr.size(); i++) {
            String resourceName = arr.getString(i);
            BitmapDrawable drawable = (BitmapDrawable) ResourceUtils.getDrawableByName(mContext, resourceName);

            if (drawable != null) {
                resources.add(new AbstractMap.SimpleEntry<String, BitmapDrawable>(resourceName, drawable));
            }
        }

        source.setNativeImages(resources);
    }

    @ReactProp(name = "hasPressListener")
    public void setHasPressListener(RCTMGLShapeSource source, boolean hasPressListener) {
        source.setHasPressListener(hasPressListener);
    }

    @ReactProp(name = "hitbox")
    public void setHitbox(RCTMGLShapeSource source, ReadableMap map) {
        source.setHitbox(map);
    }

    @Override
    public Map<String, String> customEvents() {
        return MapBuilder.<String, String>builder()
                .put(EventKeys.SHAPE_SOURCE_LAYER_CLICK, "onMapboxShapeSourcePress")
                .build();
    }
    
    @ReactProp(name = "csvUrl")
    public void setCsvUrl(RCTMGLShapeSource source, String urlStr) {
        //TODO: people say this is bad, but how bad it really is?
        class DownloadFilesTask extends AsyncTask<String, Integer, Long> {
            public RCTMGLShapeSource source;
            @Override
            protected Long doInBackground(String... urls) {
                String geoJSONStr = getCustomGeojson(urls[0]);
                setGeometry(source, geoJSONStr);
                return null;
            }
        }
        //Doesn't work without this....
        setGeometry(source, "{\"type\":\"FeatureCollection\",\"features\":[]}");
        DownloadFilesTask task = new DownloadFilesTask();
        task.source = source;
        task.execute(urlStr);
    }

    class Coordinate {

        public double lat, lng;

        public Coordinate(double lat, double lng) {
            this.lat = lat;
            this.lng = lng;
        }
    }

    public String getCustomGeojson(String url) {
        StringBuilder geojson = new StringBuilder();
        geojson.append("{\"type\":\"FeatureCollection\",\"features\":[");
        String data = getUrlContents(url);

        String values[] = data.split(",");
        for (int i = 0; i < values.length - 2; i += 2) {
            int buildingId = Integer.parseInt(values[i]);
            int count = Integer.parseInt(values[i + 1]);
            Coordinate coordinate = buildingsMap.get(buildingId);

            String f1 = "{\"type\":\"Feature\"";
            String f2 = ", \"geometry\":{\"type\":\"Point\",\"coordinates\":[" + coordinate.lng + "," + coordinate.lat + "]}}";

            String fWithApartmentsCount = f1 + ",\"properties\": {\"apartmentsCount\": " + values[i + 1] + "}" + f2;
            String fWithoutApartmentsCount = f1.concat(f2);

            for (int j = 0; j < count; j++) {
                if ((i + j) > 0) {
                    geojson.append(",");
                }
                geojson.append(j == 0 ? fWithApartmentsCount : fWithoutApartmentsCount);
            }
        }
        geojson.append("]}");

        return geojson.toString();
    }

    private static String getUrlContents(String theUrl) {
        StringBuilder content = new StringBuilder();

        // many of these calls can throw exceptions, so i've just
        // wrapped them all in one try/catch statement.
        try {
            // create a url object
            URL url = new URL(theUrl);

            // create a urlconnection object
            URLConnection urlConnection = url.openConnection();

            // wrap the urlconnection in a bufferedreader
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));

            String line;

            // read from the urlconnection via the bufferedreader
            while ((line = bufferedReader.readLine()) != null) {
                content.append(line + "\n");
            }
            bufferedReader.close();
        } catch (Exception e) {
            return e.toString();
        }
        return content.toString();
    }

    private HashMap<Integer, Coordinate> buildingsMap;
    
    private void loadBuildings(Context context) {
        buildingsMap = new HashMap<Integer, Coordinate>();
        String dataStr = getBuildingsCsvContents(context);
        String data[] = dataStr.split(",");

        for (int i = 0; i < data.length; i += 3) {
            buildingsMap.put(Integer.parseInt(data[i]), new Coordinate(Double.parseDouble(data[i + 1]), Double.parseDouble(data[i + 2])));
        }
    }

    public static String getBuildingsCsvContents(Context context) {
        String fileName = "buildings.csv";
        StringBuilder returnString = new StringBuilder();
        InputStream fIn = null;
        InputStreamReader isr = null;
        BufferedReader input = null;
        try {
            fIn = context.getResources().getAssets()
                    .open(fileName, Context.MODE_WORLD_READABLE);
            isr = new InputStreamReader(fIn);
            input = new BufferedReader(isr);
            String line = "";
            while ((line = input.readLine()) != null) {
                returnString.append(line);
            }
        } catch (Exception e) {
            e.getMessage();
        } finally {
            try {
                if (isr != null) {
                    isr.close();
                }
                if (fIn != null) {
                    fIn.close();
                }
                if (input != null) {
                    input.close();
                }
            } catch (Exception e2) {
                e2.getMessage();
            }
        }
        return returnString.toString();
    }
}
