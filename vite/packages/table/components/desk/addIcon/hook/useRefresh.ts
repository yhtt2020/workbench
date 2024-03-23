import { TabsAPI } from "./../../../../../../../packages/electron-chrome-extensions/src/browser/api/tabs";
import { favoStore } from "../../../../apps/favorites/store";
import { storeToRefs } from "pinia";
import { message } from "ant-design-vue";
import { ref } from "vue";

const resTmp = ref([]);

export const refresh = async () => {
  const favo = favoStore();
  const {
    isFavorites,
    allList,
    folderList,
    folderIndex,
    browserList,
    updateTime,
    folderIcons,
  } = storeToRefs(favo);
  let arrTmp: Array<string> = [];
  const keys = Object.keys(browserList.value);
  for (const browser of keys) {
    if (browserList.value[browser]) {
      arrTmp.push(browser);
    }
  }
  // await tsbApi.system.getBrowserBookmark(arrTmp.value, (data) => {
  //   console.log(data);
  // });
  await tsbApi.system.getBrowserBookmark(arrTmp, (data) => {
    console.log(data);
    updateTime.value = new Date().getTime();
    folderList.value = [];
    let res = [];
    if (data.result) {
      for (let browser in data.result) {
        resTmp.value = [];
        res.push(...flattenChildrenArray(data.bookmark, browser, 0));
        folderList.value.unshift({
          name: "最近添加",
          type: "recent",
          browser: browser,
          rename: null,
          time: new Date().getTime(),
        });
        folderList.value.unshift({
          name: "全部",
          type: "all",
          browser: browser,
          rename: null,
        });
      }
      folderList.value.unshift({
        name: "我的收藏",
        type: "favo",
        rename: null,
        unRead: false,
      });
      allList.value = mergeArraysByGuid(allList.value, res, folderList.value);
    }
  });
};

const mergeArraysByGuid = (arr1, arr2, folderList) => {
  const existingGuids = new Set(arr1.map((item) => item.guid));
  const newObjects = arr2.filter((item) => !existingGuids.has(item.guid));

  if (newObjects.length > 0) {
    newObjects.forEach((item) => {
      item.recent = true;
      item.unRead = true;
      folderList.forEach((folder) => {
        if (folder.guid == item.parent && item.parent) {
          folder.unRead = true;
        }
      });
    });
  }

  const content = newObjects.length
    ? `浏览器收藏夹数据刷新成功。本次更新${newObjects.length}条数据`
    : "浏览器收藏夹数据刷新成功。";
  message.success(content);
  const mergedArray = [...arr1, ...newObjects];
  return mergedArray;
};

const flattenChildrenArray = (obj, browser, level, parent?) => {
  let num = 0;
  const time = new Date().getTime();
  obj?.children?.forEach((item) => {
    if (item.type != "folder") {
      resTmp.value.push({
        ...item,
        browser,
        parent,
        icon: null,
        rename: null,
        favo: false,
        check: false,
        time: time,
      });
      num++;
    }
    if (item.children) {
      flattenChildrenArray(
        item,
        browser,
        level + 1,
        level === 0 ? item.guid : parent
      );
    }
  });
  if (level == 1) {
    folderList.value.push({
      ...obj,
      browser,
      num,
      rename: null,
      time: time,
      type: "folder",
      unRead: false,
    });
  }
  return resTmp.value;
};
