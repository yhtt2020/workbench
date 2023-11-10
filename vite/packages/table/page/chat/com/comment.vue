<template>
    <div class="w-full ">
        <reply @addComment="getReplyText"/>
        <div class="mb-4 text-sm xt-text">
            评论 {{ props.reply }}
        </div>
        <MainReplyComment :commentList="item" v-for="(item, index) in commentList" :key="index" :uid="props.uid"></MainReplyComment>
        <xt-button class="check-more" @click="loadingMoreComments" v-if="props.reply > commentList.length">查看更多评论</xt-button>
    </div>
</template>

<script setup lang='ts'>
import { ref, computed,onMounted,watch,onUnmounted } from 'vue'
import MainReplyComment from './MainReplyComment.vue'
import reply from './Reply.vue'
import {useCommunityStore} from '../commun'
import _ from 'lodash_es'
const store=useCommunityStore()
const props=defineProps({
    tid:Number,
    reply:Number,
    uid:Number
})
const commentsList=ref([])
const current = ref(1)
const loadingMoreComments=async()=>{
    // let val=1
    let tid=store.communityPostDetail.pay_set.tid?store.communityPostDetail.pay_set.tid:store.communityPostDetail.id
    current.value++
    await store.getCommunityPostReply(tid,current.value)
    commentsList.value.push(commentList.value)
    console.log(commentsList.value,'loadingMoreComments')
    
    
}
// 评论内容列表
const commentList = computed(()=>{
    return store.communityReply.list
})
onMounted(()=>{
    commentsList.value.push(commentList.value)
    console.log(commentsList.value,'onmounted')
})
const getReplyText=(val)=>{
    commentList.value=val.value
}
// watch(commentList,(val)=>{
//     console.log(val,'watch--val')
//     commentsList.value.push(val)
//     console.log(commentsList.value,'watch')
// })
onUnmounted(()=>{
    console.log(commentsList.value,'onUnmounted')
    commentsList.value=[]
})
// const loadingMoreComment=computed(()=>{
//     if(commentList.value.list && commentList.value.list.length>10){
//         return true
//     }else{
//         return false
//     }
// })
</script>
<style lang='scss' scoped>
.check-more{
    margin: 10px auto;
    background-color: transparent;
    color: var(--active-bg) !important;
}

:deep(.ant-input) {
    &::placeholder {
        color: var(--secondary-text) !important;
        font-size: 16px;
        font-weight: 400;
        // margin-left: 3px;
    }
}
// :deep(.ant-pagination){
//     text-align: center;
// }

// :deep(.ant-pagination-simple .ant-pagination-next .ant-pagination-item-link){
//     color: var(--secondary-text) !important;
// }
</style>
