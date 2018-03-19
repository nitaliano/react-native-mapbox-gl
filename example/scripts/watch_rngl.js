const path = require('path');
const fs = require('fs-extra');

const RNGL_DIR = path.join('..');
const RNGL_EXAMPLE_DIR = path.join(
  'node_modules',
  '@mapbox',
  'react-native-mapbox-gl',
);

function copyFile(source, dest) {
  return new Promise((resolve, reject) => {
    fs.copy(source, dest, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

async function main() {
  try {
    console.log('Copying javascript'); // eslint-disable-line
    await copyFile(
      path.join(RNGL_EXAMPLE_DIR, 'javascript'),
      path.join(RNGL_DIR, 'javascript'),
    );

    console.log('Copying java'); // eslint-disable-line
    await copyFile(
      path.join(RNGL_EXAMPLE_DIR, 'android', 'rctmgl', 'src'),
      path.join(RNGL_DIR, 'android', 'rctmgl', 'src'),
    );

    console.log('Copying gradle file'); // eslint-disable-line
    await copyFile(
      path.join(RNGL_EXAMPLE_DIR, 'android', 'rctmgl', 'build.gradle'),
      path.join(RNGL_DIR, 'android', 'rctmgl', 'build.gradle'),
    );

    console.log('Copying objc'); // eslint-disable-line
    await copyFile(
      path.join(RNGL_EXAMPLE_DIR, 'ios', 'RCTMGL'),
      path.join(RNGL_DIR, 'ios', 'RCTMGL'),
    );

    console.log('Copying xcode project'); // eslint-disable-line
    await copyFile(
      path.join(RNGL_EXAMPLE_DIR, 'ios', 'RCTMGL.xcodeproj'),
      path.join(RNGL_DIR, 'ios', 'RCTMGL.xcodeproj'),
    );

    console.log('Copying script files'); // eslint-disable-line
    await copyFile(
      path.join(RNGL_EXAMPLE_DIR, 'scripts'),
      path.join(RNGL_DIR, 'scripts'),
    );
  } catch (e) {
    console.log(e); // eslint-disable-line
  }
}

main();
