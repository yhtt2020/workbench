import { message } from "ant-design-vue";
import { useInstallTTApp } from "../../../../../ttApp/src/hooks";
import { getAppImg } from "../../../../../ttApp/src/hooks/getAppImg";
import { useTTAppStore } from "../../../../../ttApp/src/store";
import { storeToRefs } from "pinia";
import {
  useFileConversionIcon,
  defaultData,
} from "../../../../../../ui/hooks/useDataConversion";
import { useAddCard } from "../../../../../../hooks";
export const installV2 = async (id?: string) => {
  const ttappStore = useTTAppStore();
  const { ttappData, ttappList }: any = storeToRefs(ttappStore);
  let res = await useInstallTTApp(id);

  let { data, code } = res;
  // 安装成功
  if (code === 200) {
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
      let iconData = {
        ...defaultData,
        id: currentData.id,
        value: currentData.id,
        name: currentData.name,
        icon: currentData._logo,
        type: "ttapp",
      };
      useAddCard({
        name: "myIcons",
        data: {
          iconList: [useFileConversionIcon(iconData)],
        },
        // id: ""
      });

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
    }
  }
  // 安装失败
  else {
    message.error(data);
  }
  console.log("data :>> ", data);
};

const process = () => {};
