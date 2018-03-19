const xcode = require('xcode');
const path = require('path');
const fs = require('fs');

const RNMGL_IOS_PATH = path.join(
  '..',
  'node_modules',
  '@mapbox',
  'react-native-mapbox-gl',
  'ios',
);
const STRIP_FRMWRK_BUILD_SCRIPT =
  '"${BUILT_PRODUCTS_DIR}/${FRAMEWORKS_FOLDER_PATH}/Mapbox.framework/strip-frameworks.sh"';

const PROJECT_PATH = path.join(
  'ios',
  getTargetName() + '.xcodeproj',
  'project.pbxproj',
);
const xcodeProject = xcode.project(PROJECT_PATH);

function addMapboxFramework() {
  // check to see if embed framework build phase exists, if not create it
  // https://github.com/alunny/node-xcode/issues/78#issuecomment-293348653
  const existsEmbedFrameworks = xcodeProject.buildPhaseObject(
    'PBXCopyFilesBuildPhase',
    'Embed Frameworks',
  );
  if (!existsEmbedFrameworks) {
    console.log('"Embed Frameworks" Build Phase (Embedded Binaries) does not exist, creating it.'); // eslint-disable-line
    xcodeProject.addBuildPhase(
      [],
      'PBXCopyFilesBuildPhase',
      'Embed Frameworks',
      null,
      'frameworks',
    );
  }

  // embed framework, and add framework searchpaths
  const frameworkPath = path.join(RNMGL_IOS_PATH, 'Mapbox.framework');

  xcodeProject.addFramework(frameworkPath, {
    target: getTargetUUID(),
    embed: true,
    sign: true,
    link: true,
    customFramework: true,
  });

  // add framework strip-frameworks script to build phases
  xcodeProject.addBuildPhase(
    [],
    'PBXShellScriptBuildPhase',
    'Execute Mapbox Strip Framework Script',
    getTargetUUID(),
    { shellPath: '/bin/sh', shellScript: STRIP_FRMWRK_BUILD_SCRIPT },
  );
}

function writeProjectFile() {
  fs.writeFileSync(PROJECT_PATH, xcodeProject.writeSync());
}

function getTargetName() {
  const fileList = fs.readdirSync(path.join('.', 'ios'));

  for (let file of fileList) {
    if (file.includes('.xcodeproj')) {
      return file.split('.')[0];
    }
  }

  throw new Error('No target found');
}

function getTargetUUID() {
  const targetName = getTargetName();
  const nativeTargets = xcodeProject.pbxNativeTargetSection();

  const targetUUIDs = Object.keys(nativeTargets);
  for (let targetUUID of targetUUIDs) {
    const target = nativeTargets[targetUUID];

    if (!target.name.includes('_comment') && target.name === targetName) {
      return targetUUID;
    }
  }

  throw new Error('No target uuid found');
}

module.exports = function() {
  return new Promise((resolve, reject) => {
    if (process.platform !== 'darwin') {
      // skipping ios linking
      console.log('Skipping iOS linking, must be on OS X to link'); // eslint-disable-line
      return resolve();
    }

    try {
      xcodeProject.parseSync();
    } catch (err) {
      console.log(err); // eslint-disable-line
      return reject(err);
    }

    addMapboxFramework();
    writeProjectFile();
    return resolve();
  });
};
