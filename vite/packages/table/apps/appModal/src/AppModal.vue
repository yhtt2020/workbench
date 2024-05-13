<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, provide } from "vue";
import { storeToRefs } from "pinia";
import { useAppModalStore } from "./store";
import { getComponent } from "./hook/getComponent";
const appModalStore = useAppModalStore();
const { visible } = storeToRefs(appModalStore);

// 状态注册
provide("modalStatus", true);
const name = "AI";
const appList = ref([
  {
    name: "ai",
    icon: "/logo/ai.svg",
    iconType: "select",
    visible: false,
  },
  {
    name: "note",
    visible: false,
  },
]);

const addAppModal = (options) => {
  const { name, icon, iconType = "select", visible = true } = options;
  console.log("iconType :>> ", iconType);
  // appList.value.push({
  //   ...options,
  //   visible: true,
  // });
};
addAppModal({});
</script>

<template>
  <template v-for="item in appList">
    <xt-modal
      v-if="item?.visible"
      v-model="item.visible"
      index="1200"
      handle=".xt-modal-header"
      min
      max
      esc
      boxClass=""
      headerClass="p-2 xt-modal"
      :mask="false"
    >
      <template #header-left>
        <div class="flex justify-center items-center">
          <xt-mix-icon icon="/logo/ai.svg" type="select" />
          <div>333</div>
        </div>
      </template>
      <!-- <div>AppModal</div> -->
      <router-view :name="item.name"></router-view>

      <!-- <div style="overflow: hidden; height: 762px">
      <component :is="getComponent(name)" />
    </div> -->
    </xt-modal>
  </template>
</template>
<style lang="scss" scoped></style>
