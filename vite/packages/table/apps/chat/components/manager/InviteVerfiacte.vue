<template>
  <xt-modal v-if="inviteVisible" v-model="inviteVisible" title="邀请方式" :index="1650" :maskIndex="1640">
   <div style="width: 500px;" class="mt-4">
    <xt-option-tab  :list="inviteTab" v-model="invite" circle style="height: 40px;" />
   </div>
  </xt-modal>
</template>

<script setup>
import {ref,watch,toRefs, nextTick} from "vue";
import TUIChatEngine from "@tencentcloud/chat-uikit-engine";

const emit = defineEmits(['update']);

const props = defineProps({
  currentInvite:{
    type:String,
    required: true,
  }
});
const {currentInvite} = toRefs(props);
const inviteTab  = ref([
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
const invite = ref('');
const inviteVisible = ref(false);
// 开启邀请方式修改
const openInviteModal = () =>{
  inviteVisible.value  = true;
  nextTick(()=>{
    invite.value = currentInvite.value;
  })
};

// 监听更新
watch(()=>invite.value,(newVal)=>{
  emit('update',newVal);
})

defineExpose({
  inviteVisible,
  openInviteModal,
})
</script>

<style lang="scss" scoped>
</style>