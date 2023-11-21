<template>
    <div class="w-full ">
        <reply @addComment="getReplyText"/>
        <div class="mb-4 text-smxt-text">
            评论 {{ props.reply }}
        </div>
        <a-spin v-if="isLoading" style="margin: 30% 50%;"/>
        <template v-else>
            <!-- <DataStatu v-if="emptyState" imgDisplay="/img/test/load-ail.png" :btnToggle="false" textPrompt="暂无评论,快来抢占沙发吧"></DataStatu>
            <div v-else> -->
                <MainReplyComment :commentList="item" v-for="(item, index) in moreComments" :key="index" :uid="props.uid"></MainReplyComment>
            <!-- </div> -->
           
        </template>
        
        <!-- <a-pagination v-model:current="current" :total="totalReply" simple @change="changePage" v-if="paginationVisible" class="xt-text-2"/> -->
        <xt-button class="check-more" @click="changePage" :w="120" :h="40" v-if="paginationVisible">查看更多评论</xt-button>
    </div>
</template>

<script setup lang='ts'>
import { ref, computed,onMounted,watch } from 'vue'
import MainReplyComment from './MainReplyComment.vue'
import reply from './Reply.vue'
import {useCommunityStore} from '../commun'
import DataStatu from "../../../components/widgets/DataStatu.vue"
const current = ref(1)
const list=ref([])
const isLoading=ref(false)
const changePage=async()=>{
    if(list.value.length==0){
      list.value=commentList.value.list  
    }
    let tid=store.communityPostDetail.pay_set.tid?store.communityPostDetail.pay_set.tid:store.communityPostDetail.id
    current.value++
    await store.getCommunityPostReply(tid,current.value)
    list.value.push(commentList.value.list)
    list.value=list.value.flat(1)
    
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
const emptyState=computed(()=>{
    let comList=commentList.value.list || []
    if(list.value.length>0 || comList.length>0){
        return false
    }else{
        return true
        
    }
})
onMounted(() => {
    isLoading.value=true
})
watch(()=>commentList.value.list,()=>{
    isLoading.value=false
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

