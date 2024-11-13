<script setup lang="ts">

import detailModal from "./int/DetailModal.vue";
import MinDetailModal from "./int/MinDetailModal.vue";
import PublishModal from "./int/PublishModal.vue";
import {computed, ref} from "vue";
import {yuanCommunityStore} from "../../store/yuanCommunity";
import {defineEmits} from "vue";
import {useCommunityStore} from "../../apps/chat/store/commun";
import {message} from "ant-design-vue";

const showPublishModal = ref(false)
const showDetailModal = ref(false)
const toggleDetail = ref(true)
const forumList = computed(() => {
  return yuanCommunityStore().myForumList
});
const cardData = ref({})
const defaultForum = ref({})
const emits = defineEmits(['refresh','publishOk'])
// 发文后刷新页面
const refresh = async (value) => {
  // this.isLoading = true;
  // this.defaultForum = value;
  // await this.getCommunityPost(value);
  // this.showForumPost = this.communityPost;
  // this.isLoading = false;
  emits('refresh', {})
}
// 关闭详情弹窗
const closeDetail = (value) => {
  // this.communityPostDetail = [];
  // this.communityReply = [];
  showDetailModal.value = value;
}

const showPublish=()=>{
  showPublishModal.value=true
}

const showThreadDetail=async (tid) => {
  cardData.value= await useCommunityStore().getCommunityPostDetail(tid)
  if(cardData.value==='该内容已被删除或不存在'){
    message.error('帖子已被删除或不存在')
    return
  }
  console.log(cardData.value,'返回的数据')

  showDetailModal.value=true

}
const publishOk=(data)=>{
  console.log('网上传2',data)
  emits('publishOk',data)
}


defineExpose({
  showPublish,showThreadDetail
});

</script>

<template>
  <teleport to="body" :disabled="false">
    <PublishModal
      v-if="showPublishModal"
      :visible="showPublishModal"
      @close="showPublishModal = false"
      @publishOk="publishOk"
      @refreshDefaultForum="refresh"
      :section="forumList"
      :defaultSection="defaultForum"
    >
    </PublishModal>
    <div v-if="showDetailModal">
      <detailModal
        v-if="toggleDetail"
        :cardData="cardData"
        :showDetailModal="showDetailModal"
        @closeDetail="closeDetail"
      />
      <MinDetailModal
        v-else
        :cardData="cardData"
        :showDetailModal="showDetailModal"
        @closeDetail="closeDetail"
      />
    </div>
  </teleport>
</template>

<style scoped lang="scss">

</style>
