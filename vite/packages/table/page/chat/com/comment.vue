<template>
    <div class="w-full">
        
        <reply @addComment="getReplyText"/>
        <div class="mb-4 font-14 xt-text">
            评论 {{ props.reply }}
            <!-- {{ commentList }} -->
        </div>
        <MainReplyComment :commentList="item" v-for="(item, index) in commentList.list" :key="index"></MainReplyComment>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, h, computed ,onMounted} from 'vue'
import MainReplyComment from './MainReplyComment.vue'
import reply from './reply.vue'
import {useCommunityStore} from '../community'
const store=useCommunityStore()
const props=defineProps({
    tid:Number,
    reply:Number
})
const value = ref('')
// 评论内容列表
const commentList = computed(()=>{
    return store.communityReply
})

const getReplyText=(val)=>{
    // console.log(val);
    commentList.value=val.value
    console.log('com',commentList);
    console.log('comstore',store.communityReply);
    
}
onMounted(()=>{
    store.getCommunityPostReply(props.tid)
})
</script>
<style lang='scss' scoped>
.font-14 {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    font-weight: 400;
}

.btn {
    border: none;
}

:deep(.ant-input) {
    &::placeholder {
        color: var(--secondary-text) !important;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        font-weight: 400;
        // margin-left: 3px;
    }
}



.input-btm {
    :deep(.ant-button) {
        color: var(--secondary-text) !important;
        text-align: center;
    }
}
</style>