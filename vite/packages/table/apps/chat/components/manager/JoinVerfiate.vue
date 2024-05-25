<template>
  <xt-modal v-if="joinVisible" v-model="joinVisible" title="加群方式" :index="1650" :maskIndex="1640">
    <div style="width: 500px;" class="mt-4">
      <xt-option-tab  :list="joinTab" v-model="join" circle style="height: 40px;" />
    </div>
  </xt-modal>
</template>

<script setup>
import { nextTick, onMounted, ref, toRefs,watch } from "vue";
import TUIChatEngine from "@tencentcloud/chat-uikit-engine";

const emit = defineEmits(['update']);

const props = defineProps({
  currentJoin:{
    type:String,
    required: true,
  }
})
const {currentJoin} = toRefs(props);

const joinTab  = ref([
  {
    value:TUIChatEngine.TYPES.JOIN_OPTIONS_FREE_ACCESS,
    name:'自由加入',
  },
  {
    value:TUIChatEngine.TYPES.JOIN_OPTIONS_NEED_PERMISSION,
    name:'需要验证',
  },
  {
    value:TUIChatEngine.TYPES.JOIN_OPTIONS_DISABLE_APPLY,
    name:'禁止加入'
  },
])
const join = ref('');
const hasDefaultValue = ref(true); // 用于标记是否有默认值

// 开启加群方式设置弹窗
const joinVisible = ref(false);
const openJoinModal = () => {
  joinVisible.value = true;
  nextTick(()=>{
    join.value = currentJoin.value;
  })
};

// 监听当前加入方式修改状态
watch(()=>join.value,(newVal)=>{
  if(hasDefaultValue.value){
    hasDefaultValue.value = false;
  }
  else {
    emit('update',newVal);
  }
})

defineExpose({
 openJoinModal,
 joinVisible,
})

</script>

<style lang="scss" scoped>
</style>