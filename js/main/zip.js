const { loadAsync } =require('jszip');
const { join, dirname } =require('path');
const { promises } =require('fs');

module.exports=extractZip = async (zipBuf, destination) => {
  const zip = await loadAsync(zipBuf);
  const zipFileKeys = Object.keys(zip.files);

  return Promise.all(
    zipFileKeys.map((filename) => {
      const isFile = !zip.files[filename].dir;
      const fullPath = join(destination, filename);
      const directory = (isFile && dirname(fullPath)) || fullPath;
      const content = zip.files[filename].async('nodebuffer');

      return promises
        .mkdir(directory, { recursive: true })
        .then(async () => {
          return isFile ? await content : false;
        })
        .then(async (data) => {
          return data ? await promises.writeFile(fullPath, data) : true;
        });
    }),
  );
};
