import { storeToRefs } from "pinia";
import { TUIStore } from "@tencentcloud/chat-uikit-engine";
import { favoStore as useFavoStore } from "../../../../../apps/favorites/store";
import { useAppCenterStore } from "../../../../../apps/appCenter/src/store";
import { noteStore as useNoteStore } from "../../../../../apps/note/store";
import { taskStore as useTaskStore } from "../../../../../page/app/todo/stores/task";
import { clipboardStore as useClipboardStore } from "../../../../../apps/clipboard/store";

// 获取群聊数据
export const getGroupData = (word) => {
  const list = TUIStore?.storeMap?.group?.store?.groupList;
  if (!list) return false;
  let arr = [];
  list.forEach((item) => {
    if (item.name.includes(word)) {
      arr.push({
        ...item,
        icon: item.avatar,
      });
    }
  });
  if (!arr.length) {
    return false;
  }
  return {
    name: "社群",
    data: arr,
  };
};

// 获取收藏数据
export const getLikeData = (word) => {
  // 收藏数据
  const favoStore = useFavoStore();
  const { allList } = storeToRefs(favoStore);
  let arr = [];
  allList.value.forEach((item) => {
    let name = item.rename ? item.rename : item.name;
    if (name.includes(word) || item.url.includes(word)) {
      item.name = name;
      arr.push(item);
    }
  });
  if (!arr.length) {
    return false;
  }

  return {
    name: "收藏",
    data: arr,
  };
};

// 获取应用数据
export const getAppData = (word) => {
  // 应用数据
  const appCenterStore = useAppCenterStore();
  const { myApps } = storeToRefs(appCenterStore);
  let arr = [];
  myApps.value.forEach((item) => {
    if (item.name.includes(word)) {
      arr.push(item);
    }
  });
  if (!arr.length) {
    return false;
  }
  return {
    name: "应用",
    data: arr,
  };
};

// 获取便签数据
export const getNoteData = async (word) => {
  // 笔记数据
  const noteStore = useNoteStore();
  await noteStore.getNotes();
  const { noteList } = storeToRefs(noteStore);
  let arr = await noteStore.searchNote(word);
  if (!noteList.value.length) {
    return false;
  }
  arr = arr.map((item) => {
    return {
      ...item,
      name: item.customData.title,
      icon: "/img/appLogo/note.png",
    };
  });
  return {
    name: "备忘录",
    data: arr,
  };
};

// 获取待办数据
export const getTodoData = (word) => {
  // 待办数据
  const taskStore = useTaskStore();
  const { tasks } = storeToRefs(taskStore);
  let arr = [];
  tasks.value.forEach((item) => {
    if (item.title.includes(word) || item.description.includes(word)) {
      arr.push({
        item,
        name: item.title,
        icon: "/img/appLogo/todo.png",
      });
    }
  });
  if (arr.length > 0) {
    return {
      name: "待办",
      data: arr,
    };
  }
  return false;
};

export const getClipboardData = async (words) => {
  // 剪切板数据
  const clipboardStore = useClipboardStore();
  let arr = await clipboardStore.wordsSearch(words);
  console.log("arr1 :>> ", arr);
  if (!arr.docs.length) return;
  arr = arr.docs.map((item) => {
    return {
      ...item,
      name: item.content,
      icon:'/img/appLogo/clipboard.png'
    };
  });
  console.log('arr2 :>> ', arr);
  return {
    name: "剪切板",
    data: arr,
  };
};
