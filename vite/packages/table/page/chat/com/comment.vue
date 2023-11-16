<template>
    <div class="w-full ">
        <reply @addComment="getReplyText"/>
        <div class="mb-4 text-smxt-text">
            评论 {{ props.reply }}
        </div>
        <MainReplyComment :commentList="item" v-for="(item, index) in moreComments" :key="index" :uid="props.uid"></MainReplyComment>
        <!-- <a-pagination v-model:current="current" :total="totalReply" simple @change="changePage" v-if="paginationVisible" class="xt-text-2"/> -->
        <xt-button class="check-more" @click="changePage" :w="120" :h="40" v-if="paginationVisible">查看更多评论</xt-button>
    </div>
</template>

<script setup lang='ts'>
import { ref, computed,onMounted } from 'vue'
import MainReplyComment from './MainReplyComment.vue'
import reply from './Reply.vue'
import {useCommunityStore} from '../commun'
const current = ref(1)
const list=ref([])
const changePage=async()=>{
    if(list.value.length==0){
      list.value=commentList.value.list  
    }
    console.log(list.value,'changePage-before')
    let tid=store.communityPostDetail.pay_set.tid?store.communityPostDetail.pay_set.tid:store.communityPostDetail.id
    current.value++
    await store.getCommunityPostReply(tid,current.value)
    list.value.push(commentList.value.list)
    list.value=list.value.flat(1)
    console.log(list.value,'changePage-after')
    console.log(moreComments.value,'moreComments')
    
}
const totalReply=computed(()=>{
    return props.reply
})
const paginationVisible=computed(()=>{
    // return commentList.value.totalCount>10?true:false
    if(commentList.value.totalCount>10 && list.value.length<=commentList.value.totalCount ){
        return true
    }else{
        return false
        
    }
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
const moreComments=computed(()=>{
    if(list.value.length>0){
        return list.value
    }else{
        return commentList.value.list
    }
})

</script>
<style lang='scss' scoped>
.check-more{
    margin: 10px auto;
    background-color: transparent;
    color: var(--active-bg) !important;
}
:deep(.ant-pagination){
    text-align: center;
}

:deep(.ant-pagination-simple .ant-pagination-next .ant-pagination-item-link){
    color: var(--secondary-text) !important;
}
</style>

