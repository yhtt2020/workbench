<template>
  <div class="flex items-center justify-center w-full flex-col h-full">
    <xt-ify-icon
      icon="fluent-emoji-flat:globe-with-meridians"
      size="56"
      class="mb-4"
    ></xt-ify-icon>
    <template v-if="isAdmin">
      <div class="px-4 py-3 rounded-md xt-bg-t-2 mb-4" style="max-width: 452px">
        为你的社群创建团队导航，你可以根据所使用的网站或应用数量，选
        择合适的团队导航应用规模；当前为「组件形式」，适合数量不多的
        情况使用；如果需要进行具体分类，推荐使用「应用模式」。
      </div>
      <div class="flex items-center justify-center w-full">
        <xt-button
          w="84"
          h="32"
          class="mr-3 xt-bg-t-2"
          style="border-radius: 8px"
          @click="enterAppMode"
        >
          应用模式
        </xt-button>
        <xt-button
          w="84"
          h="32"
          type="theme"
          style="border-radius: 8px"
          @click="addApp"
        >
          添加应用
        </xt-button>
      </div>
    </template>

    <template v-else>
      <div class="px-4 py-3 rounded-md xt-bg-t-2 mb-4" style="max-width: 452px">
        你的社群管理员暂未添加任何团队导航，请联系管理员。
      </div>
    </template>
  </div>

  <EditNewNavigation
    v-if="editVisible"
    @setQuick="editVisible = false"
    :isFolder="true"
    @addIcon="addFile"
  />
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, onUnmounted } from "vue";
import EditNewNavigation from "../../desk/addIcon/EditNewNavigation.vue";
import { storeToRefs } from "pinia";
import { communityNavStore } from "../store/communityNavStore";

const emit = defineEmits(["close"]);

const props = defineProps({
  isEmpty: {
    type: Boolean,
  },
});

const isAdmin = ref(true);
const editVisible = ref(false);

const { proxy } = getCurrentInstance();

const communityNav = communityNavStore();
const { teamNavList, settingType } = storeToRefs(communityNav);

/**事件**/
// 空状态下添加应用
const addApp = () => {
  editVisible.value = true;
};

const addFile = (data) => {
  proxy.$bus.emit("getApp", data);
};
// 开启应用模式
const enterAppMode = () => {
  window.$ui.confirm(
    "使用「应用模式」",
    "切换到「应用模式」，将为你保留当前已经添加的网站和应用。",
    {
      type: "warning",
      ok: () => {
        settingType.value = "app";
        proxy.$bus.emit("openAppVisible");
        emit('close');
      },
      noText: "取消",
    }
  ); 
};

onMounted(() => {
  proxy.$bus.on("closeNav", () => {
    editVisible.value = false;
  });
});
</script>

<style lang="scss" scoped>
</style>