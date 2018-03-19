const path = require('path');
const fs = require('fs');

function getFileContents(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

function removeLines(fileContents, matcher) {
  const lines = fileContents.split('\n');

  const linesToKeep = [];
  for (let line of lines) {
    if (!line.includes(matcher)) {
      linesToKeep.push(line);
    }
  }

  return linesToKeep.join('\n');
}

function applyPatch(filePath, contents) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, contents, (err) => (err ? reject(err) : resolve()));
  });
}

function addRepo(fileContents, repoToAdd) {
  const rnMavenConfig =
    'maven { url "$rootDir/../node_modules/react-native/android" }';
  const reactRepoStartIndex = fileContents.indexOf(rnMavenConfig);
  const startFile = fileContents.substring(
    0,
    reactRepoStartIndex + rnMavenConfig.length,
  );
  const endFile = fileContents.substring(startFile.length, fileContents.length);
  return `${startFile}${repoToAdd}${endFile}`;
}

function makeProjectGradlePatch() {
  const filePath = path.join('android', 'build.gradle');
  let fileContents = getFileContents(filePath);

  if (
    !fileContents.includes('google()') &&
    !fileContents.includes('https://maven.google.com')
  ) {
    fileContents = addRepo(
      fileContents,
      '\n\t\tmaven { url "https://maven.google.com" }',
    );
  }

  if (!fileContents.includes('https://jitpack.io')) {
    fileContents = addRepo(
      fileContents,
      '\n\t\tmaven { url "https://jitpack.io" }',
    );
  }

  return applyPatch(filePath, fileContents);
}

function makeNamespaceGradleFilePatch(filePath) {
  const fileContents = getFileContents(filePath);

  // already linked
  if (fileContents.includes(':mapbox-react-native-mapbox-gl')) {
    return applyPatch(
      filePath,
      removeLines(fileContents, ':@mapbox/react-native-mapbox-gl'),
    );
  }

  // not linked
  return applyPatch(
    filePath,
    fileContents.replace(
      new RegExp(':@mapbox/react-native-mapbox-gl', 'g'),
      ':mapbox-react-native-mapbox-gl',
    ),
  );
}

module.exports = function() {
  return Promise.all([
    makeProjectGradlePatch(),
    makeNamespaceGradleFilePatch(path.join('android', 'app', 'build.gradle')),
    makeNamespaceGradleFilePatch(path.join('android', 'settings.gradle')),
  ]).catch((err) => console.log(err)); // eslint-disable-line
};
