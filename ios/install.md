# iOS Installation

## Using CocoaPods

To install with CocoaPods, add the following to your `Podfile`:

```
  # Flexbox Layout Manager Used By React Native
  pod 'yoga', :path => '../node_modules/react-native/ReactCommon/yoga/Yoga.podspec'

  # React Native
  pod 'React', path: '../node_modules/react-native', subspecs: [
    # Comment out any unneeded subspecs to reduce bundle size.
    'Core',
    'DevSupport',
    'RCTActionSheet',
    'RCTAnimation',
    'RCTBlob',
    'RCTCameraRoll',
    'RCTGeolocation',
    'RCTImage',
    'RCTNetwork',
    'RCTPushNotification',
    'RCTSettings',
    'RCTTest',
    'RCTText',
    'RCTVibration',
    'RCTWebSocket',
    'RCTLinkingIOS'
  ]

  # Mapbox
  pod 'react-native-mapbox-gl', :path => '../node_modules/@mapbox/react-native-mapbox-gl'
```

Then run `pod install` and rebuild your project.

## Manual Installation

### Add Native Mapbox SDK Framework

Select your project in the `Project navigator`. Click `General` tab then add `node_modules/@mapbox/react-native-mapbox-gl/ios/Mapbox.framework` to `Embedded Binaries`. :collision: **Important, make sure you're adding it to general -> `Embedded Binaries` :collision:**

Click 'Add other' to open the file browser and select Mapbox.framework.

Select the 'Copy items if needed' checkbox.

![](https://cldup.com/s4U3JfS_-l.png)


### Add React Native Mapbox SDK Files
In Xcode's `Project navigator`, right click on the `Libraries` folder ➜ `Add Files to <...>`. Add `node_modules/@mapbox/react-native-mapbox-gl/ios/RCTMGL.xcodeproj`.
Then in Xcode navigate to `Build Phases` click on it and you should see `Link Binary with Libraries`, we need to add `libRCTMGL.a`.

### Add Framework Header Search Paths
In the `Build Settings` of your application target search for `FRAMEWORK_SEARCH_PATHS`. Add `$(PROJECT_DIR)/../node_modules/@mapbox/react-native-mapbox-gl/ios` non-recursive to your `Framework Search Paths`.

**Important** If there is a select input under `Debug` line, choose `Any iOS SDK`.

### Add Run Script

In the `Build Phases` tab, click the plus sign and then `New Run Script Phase`.

![](https://cldup.com/jgt8p_dHjD.png)

Open the newly added `Run Script` and paste:

```bash
 "${BUILT_PRODUCTS_DIR}/${FRAMEWORKS_FOLDER_PATH}/Mapbox.framework/strip-frameworks.sh"
```

Checkout the [example application](/example/README.md) to see how it's configured for an example.

## Troubleshooting

### Mapbox.framework is not in my node_modules

Fetching the Mapbox.framework may have failed. There are two solutions that may work. 
  1. You can try re-installing this package. With NPM:  `npm install https://github.com/nitaliano/react-native-mapbox-gl/tarball/master`. With Yarn: `yarn add https://github.com/nitaliano/react-native-mapbox-gl#master`
  2. Install the iOS SDK directly from Mapbox
    a. Visit https://www.mapbox.com/install/ios/
    b. Click download to download the Mapbox iOS SDK
    c. Unzip the folder and find the Mapbox.framework at the root of the folder
    d. Move the Mapbox.framework folder to your `@react-native-mapbox-gl` folder inside your node_modules. Full path will be something like: `node_modules/@react-native-mapbox-gl/maps/ios/`
    e. Once this has been done, you can continue following the manual installation steps
