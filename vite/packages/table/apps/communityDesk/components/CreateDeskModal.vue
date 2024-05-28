<!-- 社群桌面添加 -->
<template>
  <xt-modal
    v-if="deskVisible"
    v-model="deskVisible"
    title="创建社群桌面"
    @close="deskVisible = false"
  >
    <div style="width: 500px" class="flex flex-col">
      <template v-for="item in deskList">
        <div
          class="p-4 flex w-full rounded-xl flex-col xt-bg-2 mb-4 box-border"
          :class="{ 'select-active': deskType === item.type }"
          @click="selectDeskCreateType(item)"
        >
          <span class="xt-text xt-font font-16">
            {{ item.title }}
          </span>
          <span class="xt-text-2 xt-font font-14">
            {{ item.summary }}
          </span>
        </div>
      </template>

      <div class="w-full flex items-center justify-end">
        <xt-button
          w="64"
          h="40"
          :radius="8"
          @click="close"
          style="margin-right: 12px"
        >
          取消
        </xt-button>

        <xt-button
          w="64"
          h="40"
          type="theme"
          :radius="8"
          @click="selectSubmit"
        >
          选择
        </xt-button>
      </div>
    </div>
  </xt-modal>

  <ExistDesktop ref="existDeskRef" @prev="openCommunityDeskModal"/>
</template>

<script setup>
import { ref,nextTick,toRefs, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { appStore } from "../../../store";

import ExistDesktop from "./ExistDesktop .vue";


// 路由
const router = useRouter();

// 获取全局事件总线程
const { proxy } = getCurrentInstance();

// emit事件提交
const emit = defineEmits(['createDesk']);

const  app = appStore();
const { settings } = storeToRefs(app);

// 获取组件节点元素
const existDeskRef = ref(null);

// 创建社群桌面列表
const deskList = ref([
  {
    title: "创建新桌面",
    type: "create",
    summary: "创建一个新的桌面作为社群桌面,你可以在此桌面上自由编辑",
  },
  {
    title: "添加已有桌面",
    type: "add",
    summary: "选择你已经创建的桌面,将它导入到社群桌面",
  },
]);
const deskType = ref("create");

const deskVisible = ref(false);
const openCommunityDeskModal = () => {
  deskVisible.value = true;
};

// 选择桌面创建类型
const selectDeskCreateType = (item) => {
  deskType.value = item.type;
};

// 确认选择
const selectSubmit = () => {
  if(deskType.value === 'create'){
    proxy.$bus.emit('updateSetting');
    emit("createDesk");
  }
  else if(deskType.value === 'add'){
    nextTick(()=>{
      existDeskRef.value.openExistDeskModal();
    });
  }
  deskVisible.value = false;
};

// 取消
const close = () =>{
  deskVisible.value = false;
  settings.value.isCommunity = true;
  router.go(-1);
}

defineExpose({
  openCommunityDeskModal,
});
</script>

<style lang="scss" scoped>
.select-active {
  background: rgba(80, 139, 254, 0.2) !important;
  border: 2px solid rgba(80, 139, 254, 0.85);
}
</style>