const { resolve } =require('path');
const { remote, app } =require('electron');

module.exports= getPath = (...relativePaths) => {
  let path;

  if (remote) {
    path = remote.app.getPath('userData');
  } else if (app) {
    path = app.getPath('userData');
  } else {
    return null;
  }

  return resolve(path, ...relativePaths).replace(/\\/g, '/');
};
