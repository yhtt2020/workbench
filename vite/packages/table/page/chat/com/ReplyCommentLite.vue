<template>
    <div class="w-full xt-bg box">
        <div class="pt-4 pb-3 pl-4 pr-3 ">
            <div class="flex ">
                <a-avatar :src="replyCom.user.avatar" :size="24" class="mr-2 pointer"
                    @click.stop="showCard(uid, userInfo)"></a-avatar>
                <div class="flex items-center ml-2 text-center">
                    <span class="font-16 xt-text">
                        {{ replyCom.user.nickname }}
                    </span>
                    <div class="font-12 w-[32px] h-[20px] rounded-lg xt-theme-b xt-theme-text ml-2 mt-1"
                        v-if="store.communityPostDetail.user.uid === replyCom.user.uid">作者</div>
                </div>
            </div>
            <div class="mt-2 font-16 xt-text" style="user-select: text;text-align: left; " :innerHTML="content">
                <!-- {{ replyCom.content }} -->
            </div>
            <div class="flex w-full p-0 mt-3 -mb-1 whitespace-pre-wrap cover-wrapper" v-if="replyCom.image">
                <viewer :images="replyCom.image_pc" :options="options" class="items-center p-0 mb-0 ">
                    <a-row :gutter="[20, 20]" style="margin-right: 1em" wrap="'true">
                        <a-col class="flex flex-wrap mr-2 image-wrapper" v-for="(img, index) in replyCom.image_pc" :span="7"
                            style="">
                            <!-- {{ commentList.image }} -->
                            <img class="mb-2 mr-2 rounded-md image-item pointer cover-sm" :src="img"
                                :data-source="replyCom.image_artwork_master[index]"
                                style="position: relative object-fit: fill;">
                        </a-col>
                    </a-row>
                </viewer>
            </div>
            <div class="flex justify-between  mt-3  h-[20px] xt-text-2 font-14">
                <div class="flex items-center justify-center ">
                    <div class="flex items-center pointer" @click="clickLike" :class="{ 'xt-theme-text': isLike }">
                        <replyIcon icon="akar-icons:thumbs-up" style="font-size: 18px; " class="mr-1 "></replyIcon>
                        <div class="mr-4 text-center">{{ replyCom.support_count }} </div>
                    </div>
                    <div class="flex items-center pointer" @click="replyStatus">
                        <replyIcon icon="fluent:chat-16-regular" style="font-size: 20px;" class="mr-1 "></replyIcon>
                        <!-- <div>回复</div> -->
                    </div>
                    <div class="flex justify-center ml-1" v-if="useUserStore.userInfo.uid=== replyCom.user.uid">
                        <a-dropdown trigger="click">
                            <template #overlay overlayStyle="background-color: var(--primary-bg); padding-left:3px ;padding-right:3px;">
                                <a-menu @click="handleMenuClick" class="xt-bg">
                                    <a-menu-item key="1" class="xt-text">删除</a-menu-item>
                                </a-menu>
                            </template>
                            <button class="border-0 xt-bg w-[30px] h-[20px]">
                                <replyIcon class="text-xl text-center xt-text-2 pointer"
                                    icon="fluent:more-horizontal-16-filled" />

                            </button>

                        </a-dropdown>
                    </div>
                </div>
                <div>
                    <span class="local-city">{{ replyCom.user_home.region }}</span>
                    <span class="mr-1">{{ createTime[0] }}</span>
                    <span>{{ createTime[1] }}</span>
                </div>
            </div>
            <replyComments v-if="replyVisible" @changeStatus="getReplyFlag" @addComment="getReplyText"
                :userName="replyCom.user.nickname" />
        </div>
        <ReplyCommentLite v-for="item in replyCmmentList" :key="item" :replyCom="item" :replyVisible="replyVisible">
        </ReplyCommentLite>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, computed ,onMounted} from 'vue'
import { MessageOutlined, LikeOutlined } from '@ant-design/icons-vue'
import ReplyCommentLite from './ReplyCommentLite.vue';
import replyComments from './ReplyComments.vue';
import { appStore } from '../../../../table/store'
import emojiReplace from '../../../js/chat/emoji'
import { Icon as replyIcon } from '@iconify/vue'
import {message} from 'ant-design-vue'
import {useCommunityStore} from '../commun'
const store=useCommunityStore()
const useUserStore = appStore()
const options = reactive({
    url: 'data-source'
})
const isLike = computed(() => {
    return props.replyCom.is_support
})
const replyVisible = ref(false)
const replyCmmentList = computed(() => {
    return props.replyCom.comment
})
const props = defineProps({
    replyCom: {
        type: Object,
        default: () => []
    }
})
let uid = props.replyCom.user.uid
let userInfo = {
    uid: uid,
    nickname: props.replyCom.user.nickname,
    avatar: props.replyCom.user.avatar_128
}
const showCard = (uid, userInfo) => {
    useUserStore.showUserCard(uid, userInfo)
}
const createTime = computed(() => {
    let [date, time] = props.replyCom.time.split(' ')
    return [date, time]
})
const clickLike =async () => {
    // isLike.value = !isLike.value
    await store.getCommunityLike('reply',props.replyCom.user.uid)
    message.success(store.communitySupport.info)
}
const replyStatus = () => {
    replyVisible.value = !replyVisible.value
}
const getReplyFlag = (val) => {
    // console.log(val);
    replyVisible.value = val

}
const getReplyText = (val) => {
    // console.log(val);
    replyCmmentList.value = val.value

}
// 用于在动态和评论中使用的表情
// str.replace(/\[([^(\]|\[)]*)\]/g,(item,index) => {})
// https://sad.apps.vip/public/static/emoji/emojistatic/
const content = computed(() => {

    return emojiReplace(props.replyCom.content)
});
onMounted(()=>{
    useUserStore.getUserInfo()
})
</script>
<style lang='scss' scoped>
.box {
    border-radius: 8px 8px 0px 0px;
}

.font-16 {
    font-size: 16px;
    font-weight: 500;
}

.font-12 {
    font-size: 12px;
    font-weight: 400;
    text-align: center;
}

.font-14 {
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
}</style>
