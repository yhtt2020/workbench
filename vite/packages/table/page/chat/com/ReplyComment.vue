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
            <div class="mt-2 font-16 xt-text" style="user-select: text; text-align: left;" :innerHTML="content">
                <!-- {{ replyCom.content }} -->
            </div>
            <div class="flex w-full p-0 mt-3 -mb-1 whitespace-pre-wrap cover-wrapper" v-if="replyCom.image">
                <!-- <img :src="item" alt="" v-for="(item, index) in replyCom.image_pc"
                    class="object-cover mr-2 rounded-md cover-sm" :key="index"> -->
                <viewer :images="replyCom.image_pc" :options="options" class="items-center p-0 mb-0 ">
                    <a-row :gutter="[20, 20]" style="margin-right: 1em" wrap="'true">
                        <a-col class="flex flex-wrap mr-2 image-wrapper" v-for="(img, index) in replyCom.image_pc"
                            :span="7" style="">
                            <!-- {{ commentList.image }} -->
                            <img class="mb-2 mr-2 rounded-md image-item pointer cover-sm" :src="img"
                                :data-source="replyCom.image_artwork_master[index]" style="position: relative object-fit: fill;">
                        </a-col>
                    </a-row>
                </viewer>
            </div>
            <div class="flex justify-between  mt-3  h-[20px] xt-text-2 font-14">
                <div class="flex items-center justify-center ">
                    <div class="flex" @click="clickLike" :class="{ 'xt-theme-text': isLike }">
                        <LikeOutlined style="font-size: 16px; margin-top: 2px" class="mr-1 " />
                        <div class="mr-4 text-center">{{ replyCom.support_count }} </div>
                    </div>
                    <div class="flex" @click="replyStatus">
                        <MessageOutlined style="font-size: 16px;margin-top: 2px" class="mr-1 " />
                        <!-- <div>回复</div> -->
                    </div>
                    <div class="flex justify-center ml-1" v-if="store.communityPostDetail.user.uid=== replyCom.user.uid">
                        <a-dropdown trigger="click">
                            <template #overlay>
                                <a-menu @click="handleMenuClick">
                                    <a-menu-item key="1">删除</a-menu-item>
                                </a-menu>
                            </template>
                            <button class="border-0 xt-bg w-[20px] h-[20px]">
                                <Icon class="text-xl text-center xt-text-2 pointer"
                                    icon="fluent:more-horizontal-16-filled" />

                            </button>

                        </a-dropdown>
                    </div>
                </div>
                <div>
                    <span class="local-city">{{ replyCom.user_home?.region }}</span>
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
import { ref, reactive, computed } from 'vue'
import { MessageOutlined, LikeOutlined } from '@ant-design/icons-vue'
import ReplyCommentLite from './ReplyCommentLite.vue';
import replyComments from './replyComments.vue';
import { appStore } from '../../../../table/store'
import emojiReplace from '../../../js/chat/emoji'
import {Icon} from '@iconify/vue'
import {useCommunityStore} from '../commun'
const store=useCommunityStore()
const useUserStore = appStore()
const options=reactive({
    url:'data-source'
})
const isLike = ref(false)
const replyVisible = ref(false)
const replyCmmentList = computed(() => {
    return props.replyCom.comment
})
// const userName=ref('我是皮克斯呀')
const props = defineProps({
    replyCom: {
        type: Object,
        default: () => []
    },
    uid: Number
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
const clickLike = () => {
    isLike.value = !isLike.value
}
const replyStatus = () => {
    replyVisible.value = !replyVisible.value
}
const getReplyFlag = (val) => {
    // console.log(val);
    replyVisible.value = val

}
const createTime = computed(() => {
    let [date, time] = props.replyCom.time.split(' ')
    return [date, time]
})
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
}</style>