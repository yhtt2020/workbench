/**
 * ttapp.js
 */
const { readFile } = require("../useFile.js");
const ERROR_CODE = require("./constant.js");
const checkMainFest = async (id) => {
  let manifestPath = ["apps_test", id, "manifest.json"];
  let res = await readFile(manifestPath);

  // 1、检测manifest.json文件是否存在
  if (res.code !== 200) {
    return {
      status: 1,
      code: 21,
      data: "manifest.json文件不存在",
      info: ERROR_CODE[21],
      id: id,
    };
  }

  // 2、检测manifest.json是否为json
  res = JSON.parse(res.data);
  if (typeof res !== "object") {
    return {
      status: 1,
      code: 22,
      data: ERROR_CODE[22],
      id,
    };
  }
  // 3、数据检查
  // 基础数据
  let baseCheck = ["name", "description", "modules"];
  let baseRes = weakCheck(baseCheck, res);
  if (baseRes.code !== 200) {
    return baseRes;
  }
  let baseList = [
    {
      path: res?.logo,
      info: "logo",
    },
  ];
  let baseStrongRes = await strongCheck(baseList);
  if (baseStrongRes.code !== 200) {
    return baseStrongRes;
  }
  const modules = res?.modules;

  // 主应用数据检查
  if (!modules?.main) {
    return {
      status: 1,
      code: 24,
      data: "缺少主应用数据",
      info: ERROR_CODE[24],
    };
  }
  const main = modules?.main;
  let strong = [
    {
      value: main?.entry,
      info: "主应用入口",
    },
  ];
  let obj = {
    strong,
    data: main,
  };
  let mainRes = await check(obj);
  if (mainRes.code !== 200) {
    return mainRes;
  }
  // 卡片数据检查
  if (modules?.card) {
    const card = mzodules?.card;
    let weak = ["size"];

    let strong = [
      {
        value: card?.entry,
        info: "card入口",
      },
      {
        value: card?.preview,
        info: "预览图",
      },
    ];
    let ojb = {
      weak,
      strong,
      data: card,
    };
    let res = check(ojb);
    if (res.code !== 200) {
      return res;
    }
  }

  // 5、返回数据
  return {
    status: 0,
    code: 200,
    data: res,
    info: "成功",
  };
};
/** 实现检查 */
const check = async (options) => {
  const { weak, data, strong } = options;

  if (weak) {
    let weakRes = weakCheck(weak, data);
    if (weakRes.code !== 200) {
      return weakRes;
    }
  }

  if (strong) {
    let strongRes = strongCheck(strong);
    if (strongRes.code !== 200) {
      return strongRes;
    }
  }

  return {
    status: 0,
    code: 200,
    data: "成功",
    info: "成功",
  };
};
/** 强检查 */
const strongCheck = async (array) => {
  for (data of array) {
    let currentRes = data?.value && (await checkFile(data?.value));
    if (!currentRes) {
      checkRes.push(data?.info);
    }
  }
  if (checkRes.length > 0) {
    return {
      status: 1,
      code: 24,
      data: checkRes.join(" , ") + " 不存在",
      info: ERROR_CODE[24],
    };
  }

  return {
    status: 0,
    code: 200,
    data: "成功",
    info: "成功",
  };
};

/** 弱检查 */
const weakCheck = async (checkArray, data) => {
  let res = [];
  // 遍历检查数组
  checkArray.forEach((key) => {
    // 如果数据不存在与指定的数据源中
    if (data[key] == undefined) {
      res.push(key);
    }
  });
  if (res.length > 0) {
    return {
      status: 1,
      code: 23,
      data: "manifest.json文件缺少 " + res.join(" , ") + " 数据",
      info: "manifest.json文件缺少 " + res.join(" , ") + " 数据",
    };
  } else {
    return {
      status: 0,
      code: 200,
      data: "成功",
      info: "成功",
    };
  }
};

module.exports = checkMainFest;
