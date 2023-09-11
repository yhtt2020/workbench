<template>
    <div class="w-full xt-bg box">
        <div class="pt-4 pb-3 pl-4 pr-3 ">
            <div class="flex ">
                <a-avatar src="https://up.apps.vip/avatar/003.png" :size="24" class="mr-2"></a-avatar>
                <div class="flex items-center ml-2 text-center">
                    <span class="font-16 xt-text">
                        {{ userName }}
                    </span>
                    <div class="font-12 w-[32px] h-[20px] rounded-lg xt-theme-b xt-theme-text ml-2 mt-1">作者</div>
                </div>
            </div>
            <div class="mt-2 font-16 xt-text" style="user-select: text;">
                {{ replyCom }}
            </div>
            <div class="flex justify-between  mt-3  h-[20px] xt-text-2 font-14">
                <div class="flex items-center justify-center ">
                    <div class="flex" @click="clickLike" :class="{'xt-theme-text':isLike}">
                        <LikeOutlined style="font-size: 16px;" class="mt-1 mr-1" />
                        <div class="mr-4 text-center" >12 点赞</div>
                    </div>
                    <div class="flex" @click="replyStatus">
                        <MessageOutlined style="font-size: 16px;" class="mt-1 mr-1" />
                        <div>回复</div>
                    </div>
                </div>
                <div>
                    <span class="local-city">浙江</span>
                    <span class="mr-1">8-20</span>
                    <span>8:20</span>
                </div>
            </div>
            <replyComments  v-if="replyVisible" @changeStatus="getReplyFlag" @addComment="getReplyText" :userName="userName"/>
        </div>
        <ReplyCommentLite v-for="item in replyCmmentList" :key="item" :replyCom="item" :replyVisible="replyVisible"></ReplyCommentLite>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import { MessageOutlined, LikeOutlined } from '@ant-design/icons-vue'
import ReplyCommentLite from './ReplyCommentLite.vue';
import replyComments from './replyComments.vue';
const isLike=ref(false)
const replyVisible=ref(false)
const replyCmmentList=ref([])
const userName=ref('我是皮克斯呀')
const props=defineProps({
    replyCom:String
})
const clickLike = () => {
    isLike.value=!isLike.value
}
const replyStatus=()=>{
    replyVisible.value=!replyVisible.value
}
const getReplyFlag=(val)=>{
    // console.log(val);
    replyVisible.value=val
    
}
const getReplyText=(val)=>{
    // console.log(val);
    replyCmmentList.value=val.value
    
}
</script>
<style lang='scss' scoped>
.box {
    border-radius: 8px 8px 0px 0px;
}

.font-16 {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    font-weight: 500;
}

.font-12 {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    font-weight: 400;
    text-align: center;
}

.font-14 {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    font-weight: 400;
}

.local-city {
    &::after {
        content: '·';
        margin: 0 4px;
    }
}</style>