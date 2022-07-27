import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

const ASSET_DIRECTORY_NAME: string = 'www';

/**
 * Retrieves the path (in the installed app's mobile package) for the static assets to be served, returning a promise with the path.
 *
 * @return {Promise}          The path retrieval promise
 */

const getAssets = () => {
  return new Promise<string>((resolve, reject) => {
    if (Platform.OS === 'android') {
      copyAndroidAssets()
        .then(() => {
          resolve(RNFS.DocumentDirectoryPath + '/' + ASSET_DIRECTORY_NAME);
        })
        .catch((error) => reject(error));
    } else {
      resolve(RNFS.MainBundlePath + '/' + ASSET_DIRECTORY_NAME);
    }
  });
};

/**
 * Android does not have a MainBundle directory, so it requires asset files to be copied to a different path.
 */

const copyAndroidAssets = async () => {
  await RNFS.mkdir(RNFS.DocumentDirectoryPath + '/' + ASSET_DIRECTORY_NAME);
  const files: Array<string> = [
    ASSET_DIRECTORY_NAME + '/index.html',
    ASSET_DIRECTORY_NAME + '/index.css',
    ASSET_DIRECTORY_NAME + '/mobile-widget-styler.js',
    ASSET_DIRECTORY_NAME + '/long-press-event.js',
    ASSET_DIRECTORY_NAME + '/StyleBuilder.js',
    ASSET_DIRECTORY_NAME + '/utils.js',
    ASSET_DIRECTORY_NAME + '/bridge.js',
    ASSET_DIRECTORY_NAME + '/constants.js',
    ASSET_DIRECTORY_NAME + '/amazon-connect-chat-interface.js',
  ];
  for (let index: number = 0; index < files.length; index++) {
    let file: string = files[index] || '';
    await RNFS.copyFileAssets(file, RNFS.DocumentDirectoryPath + '/' + file);
  }
};

export default getAssets;
