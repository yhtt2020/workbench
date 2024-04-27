import { message } from "ant-design-vue";
import { getAppImg } from "../../../../../ttApp/src/hooks/getAppImg";
import { useTTAppStore } from "../../../../../ttApp/src/store";
import { storeToRefs } from "pinia";

import { useMit } from "../../../../../../hooks";

import { addIcon, addNav } from "./add";
import { update, updateNav } from "./update";

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

  // 开辟一个数据存储对象
  ttappData.value[currentData.id] = {};
  // 处理logo路径
  currentData._logo = getAppImg(currentData.id, currentData.logo);

  // main模块
  if (currentData.main) {
    // 处理main路径
    let entry = currentData.main.entry;
    if (entry.charAt(0) == "/") {
      currentData.main._entry = `ttapp://${data.id}/${currentData.main.entry}`;
    } else {
      currentData.main._entry = entry;
    }
  }
  // card模块
  if (currentData.card) {
    let card = currentData.card;
    card.map((item) => {
      item.parentId = data.id;
      // 处理card大小
      item.customSize = item.size;
      delete item.size;
      // 处理card路径
      let entry = item.entry;

      if (entry.charAt(0) == "/") {
        item._entry = `ttapp://${currentData.id}/${item.entry}`;
      } else {
        item._entry = entry;
      }
      // 处理card预览图路径
      item._preview = getAppImg(currentData.id, item.preview);
      return item;
    });
  }

  // 没ID为安装
  if (!id) {
    addIcon(currentData);
    addNav(currentData);

    message.success("安装成功");
    ttappList.value.push(currentData);
  } else {
    message.success("更新成功");
    ttappList.value = ttappList.value.map((item) => {
      if (item.id === currentData.id) {
        return currentData;
      }
      return item;
    });
    // 更新导航栏
    setTimeout(() => {
      updateNav(currentData.id);
      update(currentData.id);
      useMit.emit("updateTTApp", currentData.id);
    }, 0);
  }
};

