<template >
    <!-- {{ isShow.isShow }} -->
    <div class="w-full card " style="height:auto">
        <!-- {{ isShow.isShow }} -->

        <div class="w-full card-content">
            <div class="flex justify-between mb-2 -mt-3">
                <span class="xt-text-2 font-16">详情</span>
                <div class="flex items-center">
                    <a-tooltip title="更多操作" placement="bottom">
                    <Icon class="text-xl xt-text pointer active-icon" icon="fluent:more-horizontal-16-filled" /></a-tooltip>
                    <a-tooltip title="刷新" placement="bottom">
                    <Icon class="ml-3 text-xl xt-text pointer active-icon" icon="akar-icons:arrow-clockwise" @click="refreshDetail" /></a-tooltip>
                    <a-tooltip title="前往元社区" placement="bottom">
                    <Icon class="ml-3 text-xl xt-text pointer active-icon" icon="majesticons:open" @click="goYuan" /></a-tooltip>
                    <a-tooltip title="关闭" placement="bottom">
                    <Icon class="ml-3 text-xl xt-text pointer active-icon" icon="akar-icons:cross" @click="closeDetail" /></a-tooltip>
                </div>
            </div>
            <div v-if="refreshDetailFlag">
                <div class="card-top">
                    <div class="top-left">
                        <a-avatar :src="cardData.user.avatar" :size="32" class="pointer"
                            @click.stop="showCard(uid, userInfo)">
                            <template #icon>
                                <UserOutlined />
                            </template>
                        </a-avatar>
                        <div class="user-msg">
                            <div class="username" style="color: var(--primary-text);">
                                {{ cardData.user.nickname }}
                            </div>
                            <div class="self-msg " style="color:  var(--secondary-text);">
                                <span class="date">{{ createTime[0] }}</span>
                                <span class="time">{{ createTime[1] }}</span>
                                <span class="ip">{{ props.cardData.user.ip_home?.region }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="top-right">
                        <!-- 当展示文章详情时,需要一个返回按钮去返回上一级 -->
                        <!-- <slot name="top-right"></slot> -->
                    </div>

                </div>

                <div>
                    <div>
                        <div class="flex flex-col items-center " v-if="cardData.data?.video">
                            <video class="object-cover mb-2 rounded-md cover-lm">
                                <source :src="cardData.data.video" type="video/mp4" />
                                <source :src="cardData.data.video" type="video/webm" />
                            </video>
                        </div>
                        <!-- 正文元素 -->
                        <div class="mb-2">
                            <div>
                                <div id="title" style="color: var(--primary-text); " v-if="cardData.title"
                                    :innerHTML="title"></div>
                                <div id="context" style="color:  var(--secondary-text); word-break: pre-wrap;"
                                    :innerHTML="content"></div>
                            </div>

                        </div>
                        <template v-if="cardData.image_170_170">
                            <!-- <ul class="flex flex-wrap items-center p-0 mb-0 ">
                                <img :src="item.image" v-for="(item, index) in cardData.image_170_170" @click="showImage"
                                    class="mb-2 rounded-md cover-lm " :key="index" style="object-fit: fill;">
                            </ul> -->
                            <!-- :options="options" -->
                            <viewer :images="cardData.image_170_170" :options="options" class="items-center p-0 mb-0 ">
                                <a-row :gutter="[20, 20]" style="margin-right: 1em" wrap="'true">
                                    <a-col class="flex flex-wrap mr-2 image-wrapper"
                                        v-for="(img, index) in cardData.image_170_170" :span="11" style="">
                                        <img class="mb-2 mr-2 rounded-md image-item pointer cover-lm" :src="img.image"
                                            :data-source="cardData.image[index].image" @contextmenu.stop="showMenu(img)"
                                            style="position: relative object-fit: fill;">
                                    </a-col>
                                </a-row>
                            </viewer>
                        </template>

                    </div>

                </div>
                <div class="text-xs card-bottom" style="color:  var(--secondary-text);">
                    <span class="view" style="cursor: pointer;">{{ cardData.view_count }} 浏览</span>
                    <span class="like" style="cursor: pointer;">{{ cardData.support_count }} 点赞</span>
                    <span class="comments" style="cursor: pointer;">{{ cardData.reply_count }} 评论</span>
                </div>
                <!-- 分隔线 -->
                <a-divider class="w-full h-[2px] mt-4 xt-bg-2" />
                <div class="flex mt-4 mb-4 ">
                    <!-- {{ store.communityCollect.info }} -->
                    <div class="flex items-center " style="cursor: pointer;" @click="clickLike">
                        <button class="mr-3 reply w-[57px] h-[32px]  pl-5 "
                            :class="{ 'xt-bg': !isLike, 'xt-active-bg': isLike }"
                            style="position: relative;border: none;cursor: pointer;">{{ cardData.support_count }}</button>
                        <img src="../../../../../public/icons/like.png" alt="" class="w-[20px] h-[20px] "
                            style="position: absolute;left:34px;">
                    </div>
                    <div class="flex items-center" style="cursor: pointer;" @click="clickCollect">
                        <button class="reply w-[57px] h-[32px]  pl-5"
                            :class="{ 'xt-bg': !isCollect, 'xt-active-bg': isCollect }"
                            style="position: relative;border: none;cursor: pointer;">{{ cardData.collect_count }}</button>
                        <img src="../../../../../public/icons/collect.png" alt="" class="w-[20px] h-[20px]"
                            style="position: absolute;left:102px;">
                    </div>

                </div>
                <Comment :tid="tid" :reply="cardData.reply_count" :uid="cardData.user.uid" />
            </div>
            <a-spin v-else tip="Loading..." size="large"
                style="margin-top: 45%; display: flex; flex-direction: column; justify-content: center; align-items: center"></a-spin>

        </div>

    </div>
</template>

<script setup lang='ts'>
import { ref, computed, reactive } from 'vue'
import { UserOutlined } from '@ant-design/icons-vue'
import Comment from './Comment.vue';
import { useCommunityStore } from '../commun'
import { appStore } from '../../../../table/store'
import { Icon } from '@iconify/vue';
import browser from '../../../js/common/browser';
import emojiReplace from '../../../js/chat/emoji'
import { message } from "ant-design-vue";
const useUserStore = appStore()
const store = useCommunityStore();
let uid = store.communityPostDetail.user?.uid
let userInfo = {
    uid: uid,
    nickname: props.cardData.user?.nickname,
    avatar: props.cardData.user?.avatar_128
}
// 弹出用户个人卡片
const showCard = (uid, userInfo) => {
    useUserStore.showUserCard(uid, userInfo)
}
const goYuan = () => {
    browser.openInUserSelect(`https://s.apps.vip/post/${props.cardData.pay_set.tid}`)
}
const detailVisible = ref(true)
const emit = defineEmits(['closeDetail'])
const closeDetail = () => {
    detailVisible.value = false
    emit('closeDetail', detailVisible.value)
}

// 点赞
const isLike = computed(() => {
    return store.communityPostDetail.is_support
})
// 
const clickLike =async () => {
    // isLike.value = !isLike.value
    let tid = store.communityPostDetail.pay_set.tid ? store.communityPostDetail.pay_set.tid : store.communityPostDetail.id
    // let thread = thread
    await store.getCommunityLike("thread" ,tid)
    message.success(store.communitySupport.info)
    refresh()
}
const isCollect = computed(() => {
    return store.communityPostDetail.is_collect
})
// 收藏
const clickCollect = async () => {
    let tid = store.communityPostDetail.pay_set.tid ? store.communityPostDetail.pay_set.tid : store.communityPostDetail.id
    // isCollect.value = !isCollect.value
    if (store.communityPostDetail.is_collect == 0) {
        await store.getCommunityCollect(tid)
        message.success(store.communityCollect.info)
        refresh()
    } else {
        await store.getCommunityCancelCollect(tid)
        message.success(store.communityCancelCollect.info)
        refresh()
    }

}
const props = defineProps({
    isShow: Boolean,
    cardData: {
        type: Object,
        default: () => []
    }
})
const createTime = computed(() => {
    let [date, time] = props.cardData.create_time.split(' ')
    return [date, time]
})
// const tid=store.communityPostDetail.pay_set.tid 
let tid = store.communityPostDetail.pay_set.tid ? store.communityPostDetail.pay_set.tid : store.communityPostDetail.id
const refreshDetailFlag = ref(true)
const refreshDetail = async () => {
    let Detailtid=props.cardData.pay_set.tid?props.cardData.pay_set.tid:props.cardData.id
    refreshDetailFlag.value = false
    await store.getCommunityPostDetail(Detailtid)
    refreshDetailFlag.value = true
}
const refresh = async () => {
    let detailTid=props.cardData.pay_set.tid?props.cardData.pay_set.tid:props.cardData.id
    // refreshDetailFlag.value = false
    await store.getCommunityPostDetail(detailTid)
    // refreshDetailFlag.value = true
    await store.getCommunityPostReply(detailTid)
}
// 用于在动态和评论中使用的表情
// str.replace(/\[([^(\]|\[)]*)\]/g,(item,index) => {})
// https://sad.apps.vip/public/static/emoji/emojistatic/
const content = computed(() => {
    return emojiReplace(props.cardData.content);
});
const title = computed(() => {
    return emojiReplace(props.cardData.title);
});

const showMenu = (img) => {
    console.log(img);
}
const options = reactive({
    url: 'data-source',
})
// 控制图片画廊的显示
const vieewerVisible = ref(false)
const showImage = () => {
    vieewerVisible.value = !vieewerVisible.value
}
</script>
<style lang='scss' scoped>
.card {
    display: flex;
    // 占满整个父元素
    flex-grow: 1;
    // width: 600px;


    .card-content {
        margin: 12px;

        .card-top {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            justify-content: space-between;

            .top-left {
                display: flex;
                align-items: center;
            }

            .user-msg {
                margin-left: 8px;

                .user-name {
                    font-family: PingFangSC-Regular;
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.85);
                    font-weight: 400;
                }

                .self-msg {
                    font-family: PingFangSC-Regular;
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.40);
                    font-weight: 400;

                    .date {
                        margin-right: 3px;
                    }

                    .time::after {
                        content: '·';
                        margin-left: 5px;
                        margin-right: 5px;
                    }
                }
            }


        }

        .card-content {
            font-family: PingFangSC-Regular;
            font-size: 16px;
            // color: rgba(255, 255, 255, 0.85);
            // text-align: justify;
            line-height: 22px;
            font-weight: 400;
        }

        .cover-lm {
            width: 150px;
            height: 100px;
            text-align: center;
            // object-fit: cover;
            margin-right: 8px;
            margin-bottom: 8px;
        }
    }

    .reply {
        border-radius: 8px;
    }

    #title {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.85);
        text-align: justify;
        line-height: 22px;
        font-weight: 400;
        white-space: pre-wrap;
        word-wrap: break-word;
    }

    #context {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        // color: rgba(255, 255, 255, 0.60); 
        text-align: justify;
        line-height: 22px;
        font-weight: 400;
        white-space: pre-wrap;
        word-wrap: break-word;
        word-break: break-all;

        &>p img {
            width: 100%;
        }
    }

    .card-bottom {
        margin-top: 12px;

        .view::after {
            content: '·';
            margin-left: 5px;
            margin-right: 5px;

        }

        .like::after {
            content: '·';
            margin-left: 5px;
            margin-right: 5px;
        }
    }

}
.active-icon{
    background:transparent;
    &:hover{
        background: var(--secondary-bg);
    }
}
</style>