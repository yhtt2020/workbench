<template>
  <template v-if="list.length !== 0">
    <div class="grid-container">
      <div
        v-for="(item, index) in list"
        class="grid-item xt-bg-2 rounded-xl pointer flex items-center justify-center relative"
        @click="openApp(item)"
      >
        <xt-menu
          name="name"
          :menus="menuList"
          @contextmenu="(currentItem = item), (currentIndex = index)"
        >
          <div
            class="flex items-center flex-col justify-center"
            @click="openApp(item)"
          >
            <div
              style="width: 64px; height: 64px"
              class="rounded-md"
              :style="item.isBg ? { background: `${item.bg}` } : {}"
            >
              <img
                :src="item.icon"
                style="width: 64px; height: 64px"
                class="object-cover rounded-xl mb-3"
                alt=""
              />
            </div>
            <span
              class="font-16 xt-font xt-text truncate"
              style="max-width: 100px"
              >{{ item.name }}</span
            >
            <span class="xt-text-2 text-center xt-font font-14">
              {{ getFileTypeName(item) }}
            </span>
          </div>
          <div class="absolute top-2 right-2" v-if="isHide(item)">
            <xt-button
              h="32"
              w="32"
              class="xt-bg-t-2"
              style="border-radius: 8px"
              @click="removeFolder(item)"
            >
              <div class="flex items-center justify-center">
                <xt-ify-icon
                  icon="fluent:star-16-filled"
                  size="20"
                  style="color: var(--warning)"
                ></xt-ify-icon>
              </div>
            </xt-button>
          </div>
        </xt-menu>
      </div>
    </div>
  </template>

  <template v-else>
    <AddFolderEmpty />
  </template>

  <EditIcon ref="editRef" v-model="currentEditData" />
</template>

<script setup>
import { computed, getCurrentInstance, ref, toRefs } from "vue";
import { storeToRefs } from "pinia";
import { communityNavStore } from "../store/communityNavStore";
import { startApp } from "../../../ui/hooks/useStartApp";
import { favoStore } from "../../../apps/favorites/store";
import browser from "../../../js/common/browser";
import { useRouter, useRoute } from "vue-router";
import { message } from "ant-design-vue";
import { fileTypeClass } from "../hooks/getFileType";

import AddFolderEmpty from "../empty/AppFolderEmpty.vue";
import EditIcon from "../setting/EditIcon.vue";

const communityNav = communityNavStore();
const { appModalList } = storeToRefs(communityNav);
const favo = favoStore();
const { browserType } = storeToRefs(favo);

const router = useRouter();
const { proxy } = getCurrentInstance();

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
  listType: {
    type: String,
  },
});
const { list, listType } = toRefs(props);

// 当前子项数据
const currentItem = ref(null);
const currentIndex = ref(null);
const editRef = ref(null);
const currentEditData = ref("");

// 右键菜单操作
const detailMenus = ref([
  {
    newIcon: "fluent:open-16-regular",
    name: "打开",
    callBack: () => {
      openApp(currentItem.value);
    },
  },
  {
    newIcon: "fluent:star-16-regular",
    name: "添加到收藏",
    callBack: () => {
      addFolder(currentItem.value);
    },
  },
  {
    newIcon: "fluent:desktop-16-regular",
    name: "添加到桌面",
  },
  {
    name: "添加到导航栏",
    newIcon: "fluent:tablet-16-regular",
    children: [
      {
        newIcon: "fluent:panel-left-contract-16-regular",
        name: "左侧导航",
      },
      {
        newIcon: "fluent:panel-right-contract-16-regular",
        name: "右侧导航",
      },
      {
        newIcon: "fluent:tablet-16-regular",
        name: "底部导航",
      },
    ],
  },
  {
    newIcon: "fluent:compose-16-regular",
    name: "编辑",
    callBack: () => {
      editItem(currentItem.value);
    },
  },
  {
    newIcon: "fluent:delete-16-regular",
    name: "删除",
    color: "var(--error)",
    callBack: () => {
      removeItem(currentItem.value);
      // window.$ui.confirm('','',{
      //   ok:()=>{

      //   }
      // });
    },
  },
]);
const likeMenu = ref([
  {
    newIcon: "fluent:open-16-regular",
    name: "打开",
    callBack: () => {
      openApp(currentItem.value, "like");
    },
  },
  {
    newIcon: "fluent:star-16-filled",
    name: "取消收藏",
    callBack: () => {
      removeFolder(currentItem.value);
      // removeFolder(currentIndex.value,'like');
    },
  },
  {
    newIcon: "fluent:desktop-16-regular",
    name: "添加到桌面",
  },
  {
    newIcon: "fluent:tablet-16-regular",
    name: "添加到导航栏",
    children: [
      {
        name: "左侧导航",
      },
      {
        name: "右侧导航",
      },
      {
        name: "底部导航",
      },
    ],
  },
]);

const menuList = computed(() => {
  if (listType.value === "like") {
    return likeMenu.value;
  } else {
    return detailMenus.value;
  }
});

// 添加收藏
const addFolder = (data) => {
  const updateList = appModalList.value[1]?.list.map((item, index) => {
    const currentIndex = appModalList.value[1]?.list.indexOf(data);
    if (currentIndex === index) {
      return { ...item, favo: true };
    } else {
      return item;
    }
  });
  appModalList.value[1].list = updateList;
};
// 打开应用模式中应用
const openApp = (data) => {
  const type = data.type;
  // 默认通过浏览器方式打开
  if (type === "default") {
    if (browserType.value === "system") {
      browser.openInUserSelect(data.value);
    } else if (browserType.value == "thisky") {
      browser.openInInner(data.value);
    } else if (browserType.value == "work") {
      browser.openInTable(data.value);
    }
  } else if (type === "coolApp" || type === "lightApp") {
    router.push({ name: "app", params: { ...data } });
  } else {
    startApp(data.type, data.value);
  }
};
// 删除数据
const removeItem = (data) => {
  const index = appModalList.value[1]?.list?.indexOf(data);
  appModalList.value[1]?.list?.splice(index, 1);
  message.success("应用移除成功");
};
// 取消收藏
const removeFolder = (data) => {
  const updateList = appModalList.value[1]?.list.map((item, index) => {
    const removeIndex = appModalList.value[1]?.list.indexOf(data);
    if (removeIndex === index) {
      return { ...item, favo: false };
    } else {
      return item;
    }
  });
  appModalList.value[1].list = updateList;
};
// 是否收藏
const isHide = (data) => {
  if (listType.value !== "like") {
    return data.favo;
  } else {
    return false;
  }
};
// 编辑
const editItem = (data) => {
  currentEditData.value = data;
  editRef.value.openEditIcon();
};

// 获取文件类型
const getFileTypeName = (data) => {
  return fileTypeClass.fileType(data);
};
</script>

<style lang="scss" scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(5, 133px);
  grid-gap: 16px;
}
.grid-item {
  width: 133px;
  height: auto;
  padding: 17px 0;
}
</style>
