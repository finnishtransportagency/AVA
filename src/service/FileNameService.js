export const getShortFileNameFromFullPath = fileName => {
  return fileName.substring(fileName.lastIndexOf('/') + 1);
};
