/**
 * ttapp.js
 */
let currentId;
const { readFile, existsFolder } = require("../useFile.js");
const ERROR_CODE = require("./constant.js");
const checkMainFest = async (id) => {
  currentId = id;
  let manifestPath = ["apps_test", id, "manifest.json"];
  let res = await readFile(manifestPath);

  // 1、检测manifest.json文件是否存在
  console.log("1、检测manifest.json文件是否存在 :>> ");
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
  console.log("2、检测manifest.json是否为json :>> ");
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
  console.log("3、数据检查 :>> ");
  // 基础数据
  console.log("基础数据 :>> ");
  let baseWeak = ["name", "description", "modules"];
  let baseStrong = [
    {
      value: res?.logo,
      info: "logo",
    },
  ];
  let base = {
    weak: baseWeak,
    strong: baseStrong,
    data: res,
  };
  let baseRes = await check(base);
  if (baseRes.code !== 200) {
    return baseRes;
  }
  const modules = res?.modules;
  // 主应用数据
  console.log("主应用数据 :>> ");
  if (!modules?.main) {
    return {
      status: 1,
      code: 24,
      data: "缺少主应用数据",
      info: ERROR_CODE[24],
    };
  }
  const main = modules?.main;
  let weak = ["width", "height"];
  let strong = [];
  let entry = main?.entry;
  if (!entry || entry.charAt(0) == "/") {
    strong.push({
      value: main?.entry,
      info: "主应用入口",
    });
  }
  console.log("main strong :>> ", strong);

  let obj = {
    weak,
    strong,
    data: main,
  };
  let mainRes = await check(obj);
  if (mainRes.code !== 200) {
    return mainRes;
  }
  // 卡片数据
  console.log("卡片数据 :>> ");
  let cardRes = await checkCard(modules?.card);
  if (cardRes.code !== 200) {
    return cardRes;
  }

  // 5、返回数据
  console.log("没走到结尾是吧栓q :>> ");
  return {
    status: 0,
    code: 200,
    data: res,
    info: "成功",
  };
};
/**
 * 负责检查card配置
 */
const checkCard = async (card) => {
  // 数据不存在直接判定为正
  if (!card) {
    return {
      code: 200,
    };
  }
  // 如果数据不是对象则转为数组
  if (typeof card !== "object") {
    card = [card];
  }
  // 遍历card
  for (const item of card) {
    let weak = ["size"];

    let strong = [
      {
        value: item?.preview,
        info: "预览图",
      },
    ];

    let entry = item?.entry;
    if (!entry || entry.charAt(0) == "/") {
      strong.push({
        value: item?.entry,
        info: "card入口",
      });
    }

    let ojb = {
      weak,
      strong,
      data: item,
    };
    let res = await check(ojb);
    if (res.code !== 200) {
      return res;
    }
  }

  return {
    code: 200,
  };
};

/** 实现检查 */
const check = async (options) => {
  const { weak, data, strong } = options;

  if (weak) {
    let weakRes = await weakCheck(weak, data);
    if (weakRes.code !== 200) {
      return weakRes;
    }
  }

  if (strong) {
    let strongRes = await strongCheck(strong);
    console.log("strongRes :>> ", strongRes);
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

// 自定义校验文件是否存在
const checkFile = async (filePath) => {
  const folderType = "apps_test";
  const folderName = [folderType, currentId, filePath];
  let res = await existsFolder(folderName);
  return res;
};
/** 强检查 */
const strongCheck = async (array) => {
  console.log("拿到的 强检查array :>> ", array);
  let checkRes = [];
  for (data of array) {
    let currentRes = data?.value && (await checkFile(data?.value));

    if (!currentRes) {
      checkRes.push(data?.info);
      break;
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
