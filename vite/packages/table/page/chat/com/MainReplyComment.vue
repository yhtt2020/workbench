<template>
    <div class="w-full mb-3 box">
        <div class="mb-3">
            <div class="flex ">
                <a-avatar src="https://up.apps.vip/avatar/003.png" :size="24" class="mr-2"></a-avatar>
                <div class="flex items-center ml-2 text-center">
                    <span class="font-16 xt-text">
                        我是皮克斯呀
                    </span>
                    <div class="font-12 w-[32px] h-[20px] rounded-lg xt-theme-b xt-theme-text ml-2 mt-1">作者</div>
                </div>
            </div>
            <div class="mt-2 ml-8 font-16 xt-text" style="user-select: text;">
                {{ commentList }}
            </div>
            <div class="flex justify-between  mt-3  h-[20px] xt-text-2 font-14 ml-8">
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
                <div class="">
                    <span class="local-city">浙江</span>
                    <span class="mr-1">8-20</span>
                    <span>8:20</span>
                </div>
               
            </div>
            <reply :replyVisible="replyVisible" v-if="replyVisible" @changeStatus="getReplyFlag" @addComment="getReplyText"/>
        </div>
        <div class="ml-8 ">
            <ReplyComment :replyVisible="replyVisible" v-for="(item,index) in replyCmmentList" :key="index" :replyCom="item"/>
            <!-- <replyEmoji/> -->
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import { MessageOutlined, LikeOutlined } from '@ant-design/icons-vue'
import ReplyComment from './ReplyComment.vue';
import replyEmoji from './replyEmoji.vue';
import reply from './reply.vue';
const isLike = ref(false)
const replyVisible=ref(false)
const replyCmmentList=ref([])
const clickLike = () => {
    isLike.value=!isLike.value
}
const replyStatus=()=>{
    replyVisible.value=!replyVisible.value
}
const props=defineProps({
    commentList:Array
})
const getReplyFlag=(val)=>{
    // console.log(val);
    replyVisible.value=val
    
}
const getReplyText=(val)=>{
    // console.log(val);
    replyCmmentList.value.unshift(val)
    
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
}
</style>