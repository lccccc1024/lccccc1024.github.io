import { DATA_STORE_DIR, DATA_STORE_FILE } from "./consts.js";
function getDataStoreFile(settings, isDev) {
  return new URL(DATA_STORE_FILE, isDev ? settings.dotAstroDir : settings.config.cacheDir);
}
function getDataStoreDir(settings, isDev) {
  return new URL(DATA_STORE_DIR, isDev ? settings.dotAstroDir : settings.config.cacheDir);
}
export {
  getDataStoreDir,
  getDataStoreFile
};
