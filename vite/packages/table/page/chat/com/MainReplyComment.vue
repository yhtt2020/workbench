<template>
    <!-- {{ commentList.image[0] }} -->
    <div class="w-full mb-3 box">
        <div class="mb-3">
            <div class="flex ">
                <a-avatar :src="props.commentList.user.avatar" :size="24" class="mr-2 pointer"
                    @click.stop="showCard(uid, userInfo)"></a-avatar>
                <div class="flex items-center ml-2 text-center">
                    <span class="font-16 xt-text">
                        {{ props.commentList.user.nickname }}
                        <!-- {{ content }} -->
                    </span>
                    <div class="font-12 w-[32px] h-[20px] rounded-lg xt-theme-b xt-theme-text ml-2 mt-1"
                        v-if="props.uid === commentList.user.uid">作者</div>
                </div>
            </div>
            <div class="mt-2 ml-8 font-16 xt-text content-image" style="user-select: text;text-align: left;"
                :innerHTML="content"></div>
            <div class="flex w-full p-0 mt-3 ml-8 -mb-1 whitespace-pre-wrap cover-wrapper" v-if="commentList.image">
                <!-- <img :src="item" alt="" v-for="(item, index) in commentList.image"
                    class="object-cover mr-2 rounded-md cover-sm" :key="index"> -->
                <viewer :images="commentList.image_pc" :options="options" class="items-center p-0 mb-0 ">
                    <a-row :gutter="[20, 20]" style="margin-right: 1em" wrap="'true">
                        <a-col class="flex flex-wrap mr-2 image-wrapper" v-for="(img, index) in commentList.image_pc"
                            :span="7" style="">
                            <!-- {{ commentList.image }} -->
                            <img class="mb-2 mr-2 rounded-md image-item pointer cover-sm" :src="img"
                                :data-source="commentList.image_artwork_master[index]"
                                style="position: relative object-fit: fill;">
                        </a-col>
                    </a-row>
                </viewer>
            </div>
            <div class="flex justify-between  mt-3  h-[20px] xt-text-2 font-14 ml-8">
                <div class="flex items-center justify-center ">
                    <div class="flex items-center" @click="clickLike" :class="{ 'xt-theme-text': isLike }">
                        <!-- <LikeOutlined style="font-size: 16px;" class="mt-1 mr-1" />-->
                        <replyIcon icon="akar-icons:thumbs-up" style="font-size: 16px; " class="mr-1 "></replyIcon>
                        <div class="mr-4 text-center font-14 xt-text-2">{{ supportCount }} 点赞</div>
                    </div>
                    <div class="flex items-center" @click="replyStatus">
                        <!-- <MessageOutlined style="font-size: 16px;" class="mr-1 " /> -->
                        <replyIcon icon="fluent:chat-16-regular" style="font-size: 18px;" class="mr-1 "></replyIcon>
                        <div class="font-14 xt-text-2">回复</div>
                    </div>
                    <!-- v-if="props.uid === commentList.user.uid" -->
                    <div class="flex justify-center ml-1" v-if="useUserStore.userInfo.uid === commentList.user.uid">
                        <a-dropdown trigger="click" overlayStyle="background-color: var(--primary-bg); padding-left:3px ;padding-right:3px;">
                            <template #overlay >
                                <a-menu @click="handleMenuClick" class="xt-bg">
                                    <a-menu-item key="1" class="xt-text">删除</a-menu-item>
                                </a-menu>
                            </template>
                            <button class="border-0 xt-bg w-[30px] h-[20px] rounded-md">
                                <replyIcon class="text-xl text-center xt-text-2 pointer"
                                    icon="fluent:more-horizontal-16-filled" />

                            </button>

                        </a-dropdown>
                    </div>
                </div>
                <div class="">
                    <span class="local-city font-14 xt-text-2">{{ commentList.user.ip_home.region }}</span>
                    <span class="mr-1 font-14 xt-text-2">{{ createTime[0] }}</span>
                    <span class="font-14 xt-text-2">{{ createTime[1] }}</span>
                </div>

            </div>
            <replyComments v-if="replyVisible" @changeStatus="getReplyFlag" @addComment="getReplyText"
                :userName="props.commentList.user.nickname" :replyCom="props.commentList"/>
        </div>
        <div class="ml-8 ">
            <ReplyComment :replyVisible="replyVisible" v-for="(item, index) in replyCmmentList" :key="index"
                :uid="props.uid" :replyCom="item" />
            <!-- <replyEmoji/> -->
        </div>

    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, computed,onMounted} from 'vue'
import { MessageOutlined, LikeOutlined } from '@ant-design/icons-vue'
import ReplyComment from './ReplyComment.vue';
import replyComments from './ReplyComments.vue'
import { appStore } from '../../../../table/store'
import emojiReplace from '../../../js/chat/emoji'
import { Icon } from '@iconify/vue'
import { message } from "ant-design-vue";
import {useCommunityStore} from '../commun'
import { Icon as replyIcon } from '@iconify/vue';
const store = useCommunityStore()
const useUserStore = appStore()
// 接收评论列表
const props = defineProps({
    commentList: {
        type: Object,
        default: () => []
    },
    uid: Number
})
const isLike = computed(() => {
    return props.commentList.is_support
})
const replyVisible = ref(false)
const replyCmmentList = computed(() => {
    return props.commentList.comment
})
// 用于在动态和评论中使用的表情
// str.replace(/\[([^(\]|\[)]*)\]/g,(item,index) => {})
// https://sad.apps.vip/public/static/emoji/emojistatic/
const content = computed(() => {
    let result = emojiReplace(props.commentList.content)
    return result;
});

// 点赞
const clickLike =async () => {
    await store.getCommunityLike('reply',props.commentList.user.uid)
    message.success(store.communitySupport.info)
}
// 点赞数
const supportCount=ref(props.commentList.support_count)
// 回复评论框状态改变
const replyStatus = () => {
    replyVisible.value = !replyVisible.value
}

let uid = props.commentList.user.uid
let userInfo = {
    uid: uid,
    nickname: props.commentList.user.nickname,
    avatar: props.commentList.user.avatar_128
}
const showCard = (uid, userInfo) => {
    useUserStore.showUserCard(uid, userInfo)

}
// 接收回复框的状态
const getReplyFlag = (val) => {
    // console.log(val);
    replyVisible.value = val
}
// 接收回复框的内容
const getReplyText = (val) => {
    // console.log(val);
    replyCmmentList.value = val.value
}
const createTime = computed(() => {
    let [date, time] = props.commentList.time.split(' ')
    return [date, time]
})
onMounted(()=>{
    useUserStore.getUserInfo()
    
})
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

.cover-wrapper {
    flex-wrap: wrap;
}


.cover-sm {
    margin-bottom: 10px;
    width: 56px;
    height: 56px;
    aspect-ratio: 1 / 1;
}

.local-city {
    &::after {
        content: '·';
        margin: 0 4px;
    }
}
</style>