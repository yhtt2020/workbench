<!-- <template>
    <div class="w-full ">
        <reply @addComment="getReplyText"/>
        <div class="mb-4 text-sm xt-text">
            评论 {{ props.reply }}
        </div>
        <MainReplyComment :commentList="item" v-for="(item, index) in commentsList" :key="index" :uid="props.uid"></MainReplyComment>
        <xt-button class="check-more" @click="loadingMoreComments" v-if="loadingMoreVisible">查看更多评论</xt-button>
    </div>
</template>

<script setup lang='ts'>
import { ref, computed,onMounted,watch,onUnmounted,onBeforeUpdate } from 'vue'
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
    current.value++
    await store.getCommunityPostReply(tid.value,current.value)
    commentsList.value.push(commentList.value)
    commentsList.value=commentsList.value.flat(1)
    console.log(commentsList.value,'loadingMoreComments')
    
    
}
// 评论内容列表
const commentList = computed(()=>{
    return store.communityReply.list
})
// 不包含楼中楼评论的评论总数
const totalComment=computed(()=>{
    return store.communityReply.totalCount
})
const tid=computed(()=>{
    return store.communityPostDetail.pay_set.tid?store.communityPostDetail.pay_set.tid:store.communityPostDetail.id
})
onMounted(async()=>{
    // console.log(props.tid,tid.value,'onMounted')
    // await store.getCommunityPostReply(props.tid,1)
    commentsList.value.push(commentList.value)
    commentsList.value=commentsList.value.flat(1)
})
const getReplyText=(val)=>{
    commentList.value=val.value
}
onUnmounted(()=>{
    console.log(commentsList.value,'onUnmounted')
    commentsList.value=[]
})
const loadingMoreVisible=computed(()=>{
    if((totalComment.value && commentsList.value.length>= totalComment.value.length) || commentList.value.length<10){
        return false
    }else{
        return true
    }
})
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
</style> -->


<!-- 之前版本 -->
<template>
    <div class="w-full ">
        <reply @addComment="getReplyText"/>
        <div class="mb-4 text-smxt-text">
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
    let tid=store.communityPostDetail.pay_set.tid?store.communityPostDetail.pay_set.tid:store.communityPostDetail.id
    current.value=val
    store.getCommunityPostReply(tid,val)
}
const totalReply=computed(()=>{
    return props.reply
})
const paginationVisible=computed(()=>{
    return totalReply.value>10?true:false
})
const store=useCommunityStore()
const props=defineProps({
    tid:Number,
    reply:Number,
    uid:Number
})
// 评论内容列表
const commentList = computed(()=>{
    return store.communityReply
})

const getReplyText=(val)=>{
    commentList.value=val.value
}

</script>
<style lang='scss' scoped>
:deep(.ant-pagination){
    text-align: center;
}

:deep(.ant-pagination-simple .ant-pagination-next .ant-pagination-item-link){
    color: var(--secondary-text) !important;
}
</style>

