<template>
  <div class="flex p-4 flex-col w-full h-full">
    <div class="flex items-center justify-between" style="margin-bottom: 22px">
      <div class="flex items-center">
        <xt-ify-icon
          icon="fluent:settings-16-regular"
          size="20"
          class="mr-2"
        ></xt-ify-icon>
        <span class="xt-font xt-text font-14">设置</span>
      </div>
      <xt-button w="32" h="32" @click="closeSetting">
        <div class="flex items-center justify-center">
          <xt-ify-icon icon="fluent:dismiss-16-regular" size="16"></xt-ify-icon>
        </div>
      </xt-button>
    </div>
    <div class="flex items-center justify-center w-full">
      <div style="width: 452px" class="flex flex-col p-4 xt-bg-2 rounded-xl">
        <span class="w-full xt-font xt-text font-16">模式选择</span>
        <span class="mt-2.5 mb-3 xt-font xt-text-2 font-14"
          >应用模式适合需要进行分类时使用，组件模式适合数量较少时使用。</span
        >
        <xt-option-tab
          :list="selectList"
          :boxClass="'p-1 xt-bg-2'"
          :boxStyle="{ 'border-radius': '10px' }"
          style="height: 40px"
          :itemStyle="{ 'border-radius': '6px' }"
          circle="true"
          v-model="settingType"
        ></xt-option-tab>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, getCurrentInstance } from "vue";
import { storeToRefs } from "pinia";
import { communityNavStore } from "../store/communityNavStore";

const emit = defineEmits(["close"]);

const communityNav = communityNavStore();
const { settingType } = storeToRefs(communityNav);
const { proxy } = getCurrentInstance();

const selectList = ref([
  {
    name: "应用模式",
    value: "app",
  },
  {
    name: "组件模式",
    value: "component",
  },
]);

// 关闭设置
const closeSetting = () => {
  emit("close");
};

watch(()=>settingType.value,(newVal)=>{
  if(newVal === 'component'){
    window.$ui.confirm('使用「组件模式」','切换到组件模式后，所有网站和应用都会合并到一个分组中。',{
      ok:()=>{
        settingType.value = "component";
        proxy.$bus.emit("closeModal");
      },
      noText:'取消',
      okText:'确定'
    })
  }
})
</script>

<style lang="scss" scoped>
</style>