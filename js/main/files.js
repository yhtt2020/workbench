const  { getPath } =require('./paths');
const { mkdirSync, existsSync, writeFileSync, stat } =require('fs');

const DIRECTORIES = [ 'extensions', 'storage'];

const FILES = {
  'window-data.json': {},
};

const checkFiles = () => {
  for (const dir of DIRECTORIES) {
    const path = getPath(dir);
    if (!existsSync(path)) {
      mkdirSync(path);
    }
  }

  Object.keys(FILES).forEach((key) => {
    const defaultContent = FILES ;
    const path = getPath(key);

    if (!existsSync(path)) {
      writeFileSync(path, JSON.stringify(defaultContent));
    }
  });
};

const pathExists = (path) => {
  return new Promise((resolve) => {
    stat(path, (error) => {
      resolve(!error);
    });
  });
};
module.exports={
  checkFiles,pathExists
}
