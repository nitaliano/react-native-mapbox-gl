# Android Installation

## Gradle Setup

### project:build.gradle

We need to add some `repositories` in order to get our dependencies.

* `jcenter()`
* `https://jitpack.io`
* `http://maven.google.com`

```
allprojects {
    repositories {
        jcenter()
        maven { url "$rootDir/../node_modules/react-native/android" }
        maven { url "https://jitpack.io" }
        maven { url "https://maven.google.com" }
    }
}
```

### app:build.gradle

Add project under `dependencies`

```
dependencies {
    implementation project(':mapbox-react-native-mapbox-gl')
}
```

Update Android SDK version if you did `react-native init`, we want to be on `28` or higher.
* `compileSdkVersion 28`
* `buildToolsVersion "28.0.3"`
* `targetSdkVersion 26`

You can also set the Support Library version or the okhttp version as well if you use other modules that depend on them:
* `supportLibVersion "28.0.0"`
* `okhttpVersion "3.12.1"`

### settings.gradle

Include project, so gradle knows where to find the project

```
include ':mapbox-react-native-mapbox-gl'
project(':mapbox-react-native-mapbox-gl').projectDir = new File(rootProject.projectDir, '../node_modules/@mapbox/react-native-mapbox-gl/android/rctmgl')
```

### MainApplication.java

We need to register our package

Add `import com.mapbox.rctmgl.RCTMGLPackage;` as an import statement and
`new RCTMGLPackage()` in `getPackages()`

Here is an example
```
package com.rngltest;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.mapbox.rctmgl.RCTMGLPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new RCTMGLPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
```
Checkout the [example application](../example/README.md) to see how it's configured for an example.

## Troubleshooting

### Project with path ':XXXX' could not be found.

Android will throw an error that it cannot find your project with a given path if:

  1. It cannot resolve the path to your `rctmgl` in your node_modules folder
  2. There is a mismatch between the project name in your root `settings.gradle` file and your app `build.gradle` file

Solutions:

  1. Make sure the path in your root `settings.gradle` file for `@react-native-mapbox-gl` matches the path to your node_modules folder. Usually the path for the linking the `:react-native-mapbox-mas` would be something like this: `new File(rootProject.projectDir, '../node_modules/@react-native-mapbox-gl/maps/android/rctmgl')`, but make sure in your project the path to the `@react-native-mapbox-gl` library in node_modules are correct.
  
  2. The project name specified in the `settings.gradle` file at the root of your project, usually something like `project(':react-native-mapbox-maps').projectDir`, should match the name of the dependencies object in your `build.gradle` file inside your app folder. In this example, it should be named `implementation project(':react-native-mapbox-maps')`
