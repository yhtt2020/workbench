const checkMainFest = require("./check.js");

const { writeFile } = require("../useFile.js");
const renew = async (id) => {

  console.log('拿到id了  renew:>> ', );
  // 检测manifest.json文件
  const checkManifestRes = await checkMainFest(id);
  if (checkManifestRes.code !== 200) {
    return {
      id,
      ...checkManifestRes,
    };
  }

  //
  const folderName = ["apps", id, "manifest.json"];
  let writeRes = await writeFile(folderName, data);

  return writeRes;
};
module.exports = {
  renew,
};
