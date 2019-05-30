# Deprecation notice

This repository is no longer actively maintained. 

Continued development of react-native-mapbox-gl may be found in the community driven repository at [https://github.com/react-native-mapbox-gl/maps](https://github.com/react-native-mapbox-gl/maps). This new repository uses the latest versions of the Mapbox SDKs for iOS and Android, and contains a long range of improvements over the current one. We recommend you review the [changelog](https://github.com/react-native-mapbox-gl/maps/blob/master/CHANGELOG.md) for the new repository and transition to it.

This repository will _only_ accept PRs containing bug fixes. Any new feature development will happen in the new repository.

# Mapbox Maps SDK for React Native

_An unofficial React Native component for building maps with the [Mapbox Maps SDK for iOS](https://www.mapbox.com/ios-sdk/) and [Mapbox Maps SDK for Android](https://www.mapbox.com/android-sdk/)_

[![npm version](https://badge.fury.io/js/%40mapbox%2Freact-native-mapbox-gl.svg)](https://badge.fury.io/js/%40mapbox%2Freact-native-mapbox-gl)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fmapbox%2Freact-native-mapbox-gl.svg?type=shield)](https://app.fossa.io/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fmapbox%2Freact-native-mapbox-gl?ref=badge_shield)

## What is Mapbox?

Mapbox is the location data platform for mobile and web applications. We provide [building blocks](https://www.mapbox.com/products/) to add location features like maps, search, and navigation into any experience you create. Use our simple and powerful APIs & SDKs and our open source libraries for interactivity and control.

## Sign up for Mapbox

Not a Mapbox user yet? [Sign up for an account here](https://www.mapbox.com/signup/). Once you’re signed in, all you need to start building is a Mapbox access token. Use this same short code with all of our interactive mapping libraries, Python and JavaScript SDKs, and directly against our REST APIs. You can create and manage your access tokens on your [Mapbox Account page](https://www.mapbox.com/account/).


## Installation
🛑 NB: The current release `6.1.4` is not up on NPM. You have to get the master version from github. 🛑

**Dependencies**

* [node](https://nodejs.org)
* [npm](https://www.npmjs.com/)
* [React Native](https://facebook.github.io/react-native/) recommended version 0.50 or greater

**Git**
```
git clone git@github.com:mapbox/react-native-mapbox-gl.git
cd react-native-mapbox-gl
```

**Yarn**
```
yarn add https://github.com/nitaliano/react-native-mapbox-gl#master
```

**Npm**
```
npm install https://github.com/nitaliano/react-native-mapbox-gl/tarball/master
```

## Installation Guides

* [Android](/android/install.md)
* [iOS](/ios/install.md)
* [Example](/example)

## Documentation

### Components
* [MapView](/docs/MapView.md)
* [Light](/docs/Light.md)
* [StyleSheet](/docs/StyleSheet.md)
* [PointAnnotation](/docs/PointAnnotation.md)
* [Callout](/docs/Callout.md)

### Sources
* [VectorSource](/docs/VectorSource.md)
* [ShapeSource](/docs/ShapeSource.md)
* [RasterSource](/docs/RasterSource.md)

### Layers
* [BackgroundLayer](/docs/BackgroundLayer.md)
* [CircleLayer](/docs/CircleLayer.md)
* [FillExtrusionLayer](/docs/FillExtrusionLayer.md)
* [FillLayer](/docs/FillLayer.md)
* [LineLayer](/docs/LineLayer.md)
* [RasterLayer](/docs/RasterLayer.md)
* [SymbolLayer](/docs/SymbolLayer.md)

### Offline
* [OfflineManager](/docs/OfflineManager.md)
* [SnapshotManager](/docs/snapshotManager.md)

## Expo Support
We have a feature request open with Expo if you want to see it get in show your support https://expo.canny.io/feature-requests/p/add-mapbox-gl-support

## Developer Group

Have a question or need some help? Join our [Gitter developer group](https://gitter.im/react-native-mapbox-gl/Lobby)!

## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fmapbox%2Freact-native-mapbox-gl.svg?type=large)](https://app.fossa.io/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fmapbox%2Freact-native-mapbox-gl?ref=badge_large)
