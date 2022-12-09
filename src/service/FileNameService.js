import { removeEmptyValues } from "./ArrayService";

export const getShortFileNameFromFullPath = fileName => {
  return fileName.substring(fileName.lastIndexOf('/') + 1);
};

export const getShortFolderNameFromFullPath = folderPath => {
  let backUrl = null;

  if (folderPath) {
    const paths = removeEmptyValues(folderPath.split(/\//g));

    if (paths.length >= 1) {
      let path = paths[paths.length - 1];
      backUrl = `/${ path }/`;
    } else {
      backUrl = '/';
    }

  }
  return backUrl;
};