<template>
  <xt-modal v-model="folderVisible" :index="650" :title="'添加文件夹'">
    <div style="width: 500px" class="flex items-center justify-center flex-col">
      <xt-input
        v-model="folderName"
        style="width: 452px; height: 40px"
        class="xt-bg-t-2 xt-b"
        placeholder="文件夹名称"
        :maxlength="8"
      ></xt-input>
      <div class="mt-4 flex items-center justify-end w-full">
        <xt-button w="64" h="40" class="mr-3" @click="folderVisible = false">
          取消
        </xt-button>
        <xt-button w="64" h="40" type="theme" @click="addFolder($event)">
          确定
        </xt-button>
      </div>
    </div>
  </xt-modal>
</template>
         
<script setup>
import { ref, computed, getCurrentInstance, onMounted, toRefs } from "vue";
import { storeToRefs } from "pinia";
import { communityNavStore } from "../store/communityNavStore";
import { message } from "ant-design-vue";
import { nanoid } from "nanoid";

const { proxy } = getCurrentInstance();
const communityNav = communityNavStore();
const { appModalList } = storeToRefs(communityNav);

// 打开文件夹创建弹窗
const folderVisible = ref(false);
// 文件名称
const folderName = ref("");

const props = defineProps({
  updateFolder: {
    type: Object,
    default: () => {},
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
});
const { updateFolder, isEdit } = toRefs(props);

const addFolder = (evt) => {
  if (isEdit.value) {
    // 更新
    const updateList = appModalList.value.map((item, index) => {
      if (updateFolder.value?.index === index) {
        return { ...item, name: folderName.value };
      } else {
        return item;
      }
    });
    appModalList.value = updateList;
    folderVisible.value = false;
    folderName.value = '';
  } else {
    if (folderName.value !== "") {
      const data = {
        name: folderName.value,
        rename: null,
        time: new Date().getTime(),
        list: [],
        id: nanoid(8),
      };
      const index = appModalList.value.findIndex((item) => {
        return item.id === data.id;
      });
      if (index === -1) {
        appModalList.value.push(data);
      }
      folderVisible.value = false;
      folderName.value = "";
    } 
    else {
      message.warning("文件名称不能为空");
    }
  }
};

const openCreateFolder = () => {
  folderVisible.value = true;
  if (isEdit.value) {
    folderName.value = updateFolder.value?.item?.name;
  }
};

defineExpose({
  openCreateFolder,
});
</script>

<style lang="scss" scoped>
</style>
