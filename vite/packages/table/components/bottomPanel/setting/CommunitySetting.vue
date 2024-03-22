<template>
  <xt-modal v-model="communitySetVisible" title="团队导航设置" :maskIndex="900">
    <div class="flex flex-col px-2" style="width: 500px">
      <div class="w-full xt-bg-2 flex flex-col rounded-xl p-4 ">
        <span class="xt-font xt-text font-16">团队空间容量</span>
        <span class="xt-font xt-text-2 font-14 mt-1.5 mb-1"
          >你可以上传单个大小不超过10MB文件到团队空间中。</span
        >
        <a-progress :percent="10" :show-info="false" />
        <span class="xt-font xt-text-2 font-14 mt-1">
          已用:200MB，剩余:300MB
        </span>
      </div>
      <div class="w-full xt-bg-2 flex flex-col rounded-xl p-4 my-4">
        <span class="w-full xt-font xt-text font-16">模式选择</span>
        <span class="mt-2.5 mb-3 xt-font xt-text-2 font-14">
          应用模式适合需要进行分类时使用，组件模式适合数量较少时使用。
        </span>
        <xt-option-tab
          :list="selectList"
          :boxClass="'p-1 xt-bg-2'"
          :boxStyle="{ 'border-radius': '10px' }"
          style="height: 40px"
          :itemStyle="{ 'border-radius': '6px' }"
          circle="true"
          v-model="settingType"
        />
      </div>
      <div class="w-full xt-bg-2 flex justify-between  rounded-xl p-4 ">
        <span>打开图标后自动关闭团队导航窗口</span>
        <a-switch v-model:checked="settingEnable"></a-switch>
      </div>
    </div>
  </xt-modal>
</template>

<script setup>
import { ref, getCurrentInstance,watch,onMounted } from "vue";
import { storeToRefs } from "pinia";
import { communityNavStore } from "../store/communityNavStore";

const { proxy } = getCurrentInstance();

const communityNav = communityNavStore();
const { settingType,settingEnable } = storeToRefs(communityNav);

const communitySetVisible = ref(false);
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


// 开启设置弹窗
const openAppSetting = () => {
  communitySetVisible.value = true;
};


watch(()=>settingType.value,(newVal)=>{
  if(newVal === 'component'){
    window.$ui.confirm('使用「组件模式」','切换到组件模式后，所有网站和应用都会合并到一个分组中。',{
      ok:()=>{
        settingType.value = "component";
        proxy.$bus.emit("closeModal");
        communitySetVisible.value = false; 
      },
      noText:'取消',
      okText:'确定'
    })
  }
  else{
    window.$ui.confirm(
      "使用「应用模式」",
      "切换到「应用模式」，将为你保留当前已经添加的网站和应用。",
      {
        type: "warning",
        ok: () => {
          proxy.$bus.emit("openAppVisible");
          settingType.value = "app";
          communitySetVisible.value = false; 
        },
        noText: "取消",
      }
    );
  }    
});

onMounted(() => {
  proxy.$bus.on("openAppSetting", () => {
    communitySetVisible.value = true;
  });
});

defineExpose({
  openAppSetting,
});
</script>

<style lang="scss" scoped>
</style>