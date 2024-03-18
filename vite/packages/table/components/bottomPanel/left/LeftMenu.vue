<template>
  <div style="min-width: 240px" class="h-full xt-main-bg">
    <div class="xt-scrollbar scroll-color font-16" style="height: 650px">
      <xt-scrollbar :y="true" class="h-full w-full p-3">
        <div v-for="(item, index) in list" class="pointer">
          <div
            class="flex left-menu-container flex-col w-full"
            @click="updateIndex(index)"
            :class="{ select: index === currentIndex }"
            v-if="index < 2"
          >
            <div class="flex items-center justify-between">
              <div class="flex">
                <xt-ify-icon
                  v-if="index === 0"
                  icon="fluent:star-16-regular"
                  size="20"
                  class="mr-3"
                />
                <xt-ify-icon
                  icon="fluent-emoji:file-folder"
                  v-else
                  size="20"
                  class="mr-3"
                />
                <div class="text-overflow" style="max-width: 130px">
                  {{ item?.name }}
                </div>
              </div>
              <div class="xt-text-2" v-if="index === 1">
                {{ allNum }}
              </div>
              <div class="xt-text-2" v-else>{{ getNum(item) }}</div>
            </div>
          </div>

          <xt-menu
            name="name"
            :menus="rightMenu"
            v-else
            @contextmenu="(currentDel = index), (currentItem = item)"
          >
            <div
              class="flex left-menu-container flex-col w-full"
              @click="updateIndex(index)"
              :class="{ select: index === currentIndex }"
            >
              <div class="flex items-center justify-between">
                <div class="flex">
                  <xt-ify-icon
                    v-if="index === 0"
                    icon="fluent:star-16-regular"
                    size="20"
                    class="mr-3"
                  />
                  <xt-ify-icon
                    icon="fluent-emoji:file-folder"
                    v-else
                    size="20"
                    class="mr-3"
                  />
                  <div class="text-overflow" style="max-width: 130px">
                    {{ item?.name }}
                  </div>
                </div>
                <div class="xt-text-2">{{ getNum(item) }}</div>
              </div>
            </div>
          </xt-menu>

          <div class="px-3" v-if="index == 0">
            <div class="divider"></div>
          </div>
        </div>
      </xt-scrollbar>
    </div>
    <div
      class="absolute bottom-3 flex justify-between px-3"
      style="width: 240px"
    >
      <slot name="leftMenuBottom"></slot>
    </div>
  </div>

  <CreateFolder
    ref="leftEditFolder"
    :updateFolder="{ item: currentItem, index: currentDel }"
    :isEdit="true"
  />
</template>

<script setup>
import { ref, computed, toRefs, getCurrentInstance, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { communityNavStore } from "../store/communityNavStore";

import CreateFolder from "../community/CreateFolder.vue";

const { proxy } = getCurrentInstance();
const emit = defineEmits(["change", "close"]);
const props = defineProps({
  // 列表
  list: {
    type: Array,
    default: () => [],
  },
  // 当前选中状态下标
  currentIndex: {
    type: Number,
  },
});
const { list, listMenu, currentIndex } = toRefs(props);
const communityNav = communityNavStore();
const { appModalList } = storeToRefs(communityNav);
const currentDel = ref(null);
const currentItem = ref(null);
const leftEditFolder = ref(null);

// 右键菜单列表
const rightMenu = ref([
  {
    newIcon: "fluent:compose-16-regular",
    name: "编辑文件夹",
    callBack: () => {
      leftEditFolder.value.openCreateFolder();
    },
  },
  {
    newIcon: "fluent:delete-16-regular",
    name: "删除文件夹",
    color: "var(--error)",
    callBack: () => {
      window.$ui.confirm(
        `确定要删除「${appModalList.value[currentDel.value].name}」文件夹吗`,
        "文件夹内的应用图标将一并删除,不可恢复",
        {
          noText: "取消",
          ok: () => {
            appModalList.value.splice(currentDel.value, 1);
          },
          type: "warning",
        }
      );
    },
  },
]);

// 获取数量
const getNum = (item) => {
  if(item.type !== undefined){
    return item?.list?.length;
  }
  else {
    const list = appModalList.value[1]?.list?.filter((filterItem)=>{ return filterItem.n_id === item.id });
    return list?.length;
  }
};
// 全部的数量
const allNum = computed(() => {
  return appModalList.value[1].list?.length;
});
// 修改状态
const updateIndex = (data) => {
  emit("change", data);
};

onMounted(() => {});
</script>

<style lang="scss" scoped>
.divider {
  width: 100%;
  height: 1px;
  background-color: var(--divider);
  margin-top: 8px;
  margin-bottom: 8px;
  cursor: pointer;
}
.select {
  background: rgba(80, 139, 254, 0.2);
}
.left-menu-container {
  width: 215px;
  position: relative;
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 8px;
}
</style>