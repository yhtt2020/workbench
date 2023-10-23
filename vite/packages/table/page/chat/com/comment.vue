<template>
    <div class="w-full ">
        <reply @addComment="getReplyText"/>
        <div class="mb-4 font-14 xt-text">
            评论 {{ props.reply }}
        </div>
        <MainReplyComment :commentList="item" v-for="(item, index) in commentList.list" :key="index" :uid="props.uid"></MainReplyComment>
        <a-pagination v-model:current="current" :total="totalReply" simple @change="changePage" v-if="paginationVisible" class="xt-text-2"/>
    </div>
</template>

<script setup lang='ts'>
import { ref, computed } from 'vue'
import MainReplyComment from './MainReplyComment.vue'
import reply from './Reply.vue'
import {useCommunityStore} from '../commun'
const current = ref(1)
const changePage=(val)=>{
    current.value=val
    store.getCommunityPostReply(store.communityPostDetail.pay_set.tid?store.communityPostDetail.pay_set.tid:store.communityPostDetail.id,val)
}
const totalReply=computed(()=>{
    return props.reply
})
const paginationVisible=computed(()=>{
    return totalReply.value>0?true:false
})
const store=useCommunityStore()
const props=defineProps({
    tid:Number,
    reply:Number,
    uid:Number
})
const value = ref('')
// 评论内容列表
const commentList = computed(()=>{
    return store.communityReply
})

const getReplyText=(val)=>{
    // console.log(val);
    commentList.value=val.value
    // console.log('com',commentList);
    // console.log('comstore',store.communityReply);

}

</script>
<style lang='scss' scoped>
.font-14 {
    font-size: 14px;
    font-weight: 400;
}

.btn {
    border: none;
}

:deep(.ant-input) {
    &::placeholder {
        color: var(--secondary-text) !important;
        font-size: 16px;
        font-weight: 400;
        // margin-left: 3px;
    }
}
:deep(.ant-pagination){
    text-align: center;
}

:deep(.ant-pagination-simple .ant-pagination-next .ant-pagination-item-link){
    color: var(--secondary-text) !important;
}
.input-btm {
    :deep(.ant-button) {
        color: var(--secondary-text) !important;
        text-align: center;
    }
}
</style>
