<!--群管理,群主转让弹窗页 -->
<template>
  <xt-modal v-if="transferVisible" v-model="transferVisible" title="群主转让">
   <UserSelect :currentLeftList="currentGroupMember" :isRadio="false" class="mt-2" @forward="getAminList"/>
  </xt-modal>
</template>

<script setup>
import { message } from "ant-design-vue";
import { nextTick, ref, toRefs } from "vue";

import UserSelect from "../../../components/user/UserSelect.vue";

const chat = window.$chat?.chat;
const emit = defineEmits(["close"]);

const props  = defineProps({
  groupID: {
    type: String,
    required: true,
  },
});
const { groupID } = toRefs(props);
const currentGroupMember = ref([]);

const transferVisible = ref(false);
const openTransfer = () => {
  transferVisible.value = true;
  nextTick(async() => {
    // 获取群成员列表
    const options = {
      groupID: groupID.value,
    };
    const res = await window.$chat?.chat.getGroupMemberList(options);
    if(res.code === 0){
     const { memberList } = res.data;
     currentGroupMember.value = memberList;
    }
  });
};

// 获取用户数据选择后
const getAminList = async(list) =>{
 const userID = list.userID;
 const res = await chat.changeGroupOwner({
   groupID: groupID.value,
   newOwnerID: userID,
 });
 if(res.code === 0){
   transferVisible.value = false;
   message.success("群主转让成功");
   emit("close");
 }
}

defineExpose({
  openTransfer,
});
</script>

<style lang="scss" scoped>

</style>
