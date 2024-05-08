import { message } from "ant-design-vue";
import { getAppImg } from "../../../../../ttApp/src/hooks/getAppImg";
import { useTTAppStore } from "../../../../../ttApp/src/store";
import { storeToRefs } from "pinia";

import { useMit } from "../../../../../../hooks";

import { addIcon, addNav } from "./add";
import { update } from "./update";

// 安装实现
export const installV2 = async (id?: string) => {
  // 获取文件
  let path = await tsbApi.dialog.showOpenDialog({
    title: "选择",
    message: "请选择文件",
    multiple: "true",
    properties: ["openFile", "multiSelections"],
    filters: [
      {
        name: "zip压缩包",
        extensions: ["zip"],
      },
    ],
  });

  if (!path[0]) return;

  // 上传文件
  const { data, code }: any = await new Promise((resolve) => {
    tsbApi.ttapp.installV2(
      {
        path: path[0],
        id,
      },
      (data) => {
        resolve(data);
      }
    );
  });

  // 安装成功
  if (code === 200) {
    console.log("200 :>> ", 200);
    installSuccess(data, id);
    // 安装失败
  } else {
    message.error(data);
  }
};
// 安装成功
const installSuccess = (data: any, id?: string) => {
  const ttappStore = useTTAppStore();
  const { ttappData, ttappList }: any = storeToRefs(ttappStore);

  const { modules, ...restData } = data; // 使用解构赋值取出modules和其他属性
  let currentData: any = {
    ...restData, // 剩余的属性（除了modules）
    ...modules, // 单独解构modules属性
  };
  const packageName = currentData.package;
  currentData.id = packageName;

  // ttappData.value[currentData.id] = {};
  // 判断数据存储是否存在
  if (!(packageName in ttappData.value)) {
    // 开辟一个数据存储对象
    ttappData.value[packageName] = {};
  }

  // 处理logo路径
  // currentData._logo = getAppImg(currentData.id, currentData.logo);
  currentData._logo = getAppImg(packageName, currentData.logo);

  // main模块
  if (currentData.main) {
    // 处理main路径
    let entry = currentData.main.entry;
    if (entry.charAt(0) == "/") {
      // currentData.main._entry = `ttapp://${data.id}/${currentData.main.entry}`;
      currentData.main._entry = `ttapp://${packageName}/${currentData.main.entry}`;
    } else {
      currentData.main._entry = entry;
    }
  }
  // card模块
  if (currentData.card) {
    let card = currentData.card;
    card.map((item) => {
      // item.parentId = data.id;
      item.parentId = packageName;
      // 处理card大小
      item.customSize = item.size;
      delete item.size;
      // 处理card路径
      let entry = item.entry;

      if (entry.charAt(0) == "/") {
        // item._entry = `ttapp://${currentData.id}/${item.entry}`;
        item._entry = `ttapp://${packageName}/${item.entry}`;
      } else {
        item._entry = entry;
      }
      // 处理card预览图路径
      // item._preview = getAppImg(currentData.id, item.preview);
      item._preview = getAppImg(packageName, item.preview);
      return item;
    });
  }

  /** 2024-05-05 新增 判断是否存在 */
  const isExist = ttappList.value.find((item) => item.id === packageName);

  if (isExist) {
    window.$ui.confirm("应用已存在", "是否覆盖应用？", {
      ok: () => {
        updateApp(currentData);
      },
    });
  } else {
    installApp(currentData);
  }
};

const installApp = (data: any) => {
  const ttappStore = useTTAppStore();
  const { ttappData, ttappList }: any = storeToRefs(ttappStore);
  addIcon(data);
  addNav(data);

  message.success("安装成功");
  ttappList.value.push(data);
};

const updateApp = (data: any) => {
  const ttappStore = useTTAppStore();
  const { ttappData, ttappList }: any = storeToRefs(ttappStore);

  message.success("更新成功");
  ttappList.value = ttappList.value.map((item) => {
    // if (item.id === currentData.id) {
    if (item.id === data.id) {
      return data;
    }
    return item;
  });
  // 更新导航栏
  // useMit.emit("updateTTApp", currentData.id);
  // update(currentData.id);

  useMit.emit("updateTTApp", data.package);
  update(data.package);
};
