# iOS Installation

## Using CocoaPods

To install with CocoaPods, set up your `Podfile` following the [React Native CocoaPods instructions](https://facebook.github.io/react-native/docs/integration-with-existing-apps.html#configuring-cocoapods-dependencies), then add the following line to your target's pods:

```
pod 'react-native-mapbox-gl', :path => '../node_modules/@mapbox/react-native-mapbox-gl'
```

Then run `pod install` and rebuild your project.

## Manual Installation

### Add Native Mapbox SDK Framework

[Download a release of the Mapbox iOS SDK](https://github.com/mapbox/mapbox-gl-native/releases] (the target Mapbox-iOS-SDK version will be listed in `node_modules/@mapbox/react-native-mapbox-gl/react-native-mapbox-gl.podspec`, unzip it and copy `Mapbox.framework` into the `Frameworks` directory in your project.

Select your project in the `Project navigator`. Click `General` tab then add `Frameworks/Mapbox.framework` to `Embedded Binaries`. :collision: **Important, make sure you're adding it to General -> `Embedded Binaries` :collision:**

Click 'Add other' to open the file browser and select Mapbox.framework.

Select the 'Copy items if needed' checkbox.

![](https://cldup.com/s4U3JfS_-l.png)


### Add React Native Mapbox SDK Files
In Xcode's `Project navigator`, right click on the `Libraries` folder ➜ `Add Files to <...>`. Add `node_modules/@mapbox/react-native-mapbox-gl/ios/RCTMGL.xcodeproj`.
Then in Xcode navigate to `Build Phases` click on it and you should see `Link Binary with Libraries`, we need to add `libRCTMGL.a`.

### Add Run Script

In the `Build Phases` tab, click the plus sign and then `New Run Script Phase`.

![](https://cldup.com/jgt8p_dHjD.png)

Open the newly added `Run Script` and paste:

```bash
 "${BUILT_PRODUCTS_DIR}/${FRAMEWORKS_FOLDER_PATH}/Mapbox.framework/strip-frameworks.sh"
```

Checkout the [example application](/example/README.md) to see how it's configured for an example.
