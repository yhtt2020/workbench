<template>
    <xt-modal v-model="custom" title="" :isFooter="false" zIndex="9" :isHeader="false" :boxIndex="100" :maskIndex="99"
        :esc="true" @close="closeDetail">
        <div class=" maxDetail"
            :style="{ width: isFullScreen ? `${windoWidth}px` : '1000px', height: isFullScreen ? `${windowHeight}px` : '700px' }">
            <div class="w-full pl-4 pr-4 card-content">
                <div class="flex justify-between mb-2 ">
                    <span class="xt-text-2 font-16">详情</span>
                    <div class="flex items-center">
                        <a-tooltip title="前往元社区" placement="bottom">
                            <xt-button :w="22" :h="22" style="background: transparent;">
                                <div class="flex items-center juscify-center">
                                    <Icon class=" xt-text pointer active-icon" icon="fluent:chat-16-regular" />
                                </div>

                            </xt-button>
                        </a-tooltip>
                        <a-tooltip title="全屏" placement="bottom">
                            <xt-button :w="22" :h="22" style="background: transparent;" @click="fullScreen" class="ml-3">
                                <div class="flex items-center juscify-center">
                                    <Icon class=" xt-text pointer active-icon" icon="fluent:full-screen-maximize-16-filled"
                                        v-if="!isFullScreen" />
                                    <Icon class=" xt-text pointer active-icon" icon="fluent:full-screen-minimize-16-filled"
                                        v-else />
                                </div>

                            </xt-button>

                        </a-tooltip>
                        <a-tooltip title="刷新" placement="bottom">
                            <xt-button :w="22" :h="22" style="background: transparent;" @click="refresh" class="ml-3">
                                <div class="flex items-center juscify-center">
                                    <Icon class=" xt-text pointer active-icon" icon="akar-icons:arrow-clockwise" />
                                </div>

                            </xt-button>

                        </a-tooltip>
                        <a-tooltip title="外部打开" placement="bottom">
                            <xt-button :w="22" :h="22" style="background: transparent;" @click="goYuan" class="ml-3">
                                <div class="flex items-center juscify-center">
                                    <Icon class=" xt-text pointer active-icon" icon="majesticons:open" />
                                </div>

                            </xt-button>

                        </a-tooltip>
                        <a-divider class="w-[3px]  " type="vertical" style="color: var(--divider);" />
                        <a-tooltip title="关闭" placement="bottom">
                            <xt-button :w="22" :h="22" style="background: transparent;" @click="closeDetail">
                                <div class="flex items-center juscify-center">
                                    <Icon class=" xt-text pointer active-icon" icon="akar-icons:cross" />
                                </div>

                            </xt-button>

                        </a-tooltip>
                    </div>
                </div>
            </div>
            <div class="flex w-full h-[650px]  pl-4 pr-4" style="border-radius: 12px;">
                <vue-custom-scrollbar ref="threadListRef" class="w-1/2 thread-list" :settings="settingsScroller"
                    style="height: 100%;overflow: hidden;flex-shrink: 0;border-right: 1px solid var(--divider); margin-right: -8px; ">
                    <div class="pr-2 mt-4 " style="flex-shrink: 0; ">
                        <div class="card-top">
                            <div class="flex items-center">
                                <a-avatar :src="cardData.user.avatar" :size="32" class="pointer"
                                    @click.stop="showCard(uid, userInfo)">
                                    <template #icon>
                                        <UserOutlined />
                                    </template>
                                </a-avatar>
                                <div class="ml-3 user-msg">
                                    <div class="username" style="color: var(--primary-text);font-size: 14px;">
                                        {{ cardData.user.nickname }}
                                    </div>
                                    <div class="self-msg " style="color:  var(--secondary-text);font-size: 12px;">
                                        <span class="mr-1 date">{{ createTime[0] }}</span>
                                        <span class="mr-1 time">{{ createTime[1] }}</span>
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
                                <div class="mt-4 mb-2">
                                    <div>
                                        <div class="title" style="color: var(--primary-text);font-size: 16px; "
                                            v-if="cardData.title" :innerHTML="title"></div>
                                        <div class="context"
                                            style="color:  var(--secondary-text); word-break: pre-wrap;font-size: 14px;"
                                            :innerHTML="content"></div>
                                    </div>

                                </div>
                                <template v-if="cardData.image_170_170">
                                    <viewer :images="cardData.image_170_170" :options="options"
                                        class="items-center p-0 mb-0 ">
                                        <a-row :gutter="[20, 20]" style="margin-right: 1em" wrap="'true">
                                            <a-col class="flex flex-wrap mr-2 image-wrapper"
                                                v-for="(img, index) in cardData.image_170_170" :span="11" style="">
                                                <img class="mb-2 mr-2 rounded-md image-item pointer cover-lm"
                                                    :src="img.image" :data-source="cardData.image[index].image"
                                                    @contextmenu.stop="showMenu(img)"
                                                    style="position: relative object-fit: fill;">
                                            </a-col>
                                        </a-row>
                                    </viewer>
                                </template>

                            </div>

                        </div>
                        <div class="mt-4 text-xs card-bottom" style="color:  var(--secondary-text);">
                            <span class=" view">{{ cardData.view_count }}浏览</span>
                            <span class=" view">{{ cardData.support_count }}点赞</span>
                            <span class="comments" style="cursor: pointer;">{{ cardData.reply_count }} 评论</span>
                        </div>

                    </div>
                </vue-custom-scrollbar>
                <!-- 分隔线 -->
                <a-divider class="w-[5px] h-full detele-line" type="vertical" />
                <vue-custom-scrollbar ref="threadListRef" class="w-1/2 pr-4 thread-list" :settings="settingsScroller"
                    style="height: 100%;overflow: hidden;flex-shrink: 0; ">
                    <div class="mt-4">
                        <div class="flex mb-4">
                            <!-- {{ store.communityCollect.info }} -->
                            <xt-button class="pl-5 mr-3 reply xt-text" @click="clickLike"
                                :class="{ 'xt-bg': !isLike, 'xt-active-bg': isLike }" style="width: 57px;height: 32px;">
                                <div class="flex items-center justify-center">
                                    <img src="../../../../../public/icons/like.png"  class="w-[20px] h-[20px] mr-1">
                                    {{ cardData.support_count }}
                                </div>

                            </xt-button>
                            <xt-button class="pl-5 reply xt-text" @click="clickCollect"
                                :class="{ 'xt-bg': !isCollect, 'xt-active-bg': isCollect }" style="width: 57px;height: 32px;">
                                <div class="flex items-center justify-center">
                                    <img src="../../../../../public/icons/collect.png" class="w-[20px] h-[20px] mr-1">
                                    {{ cardData.collect_count }}
                                </div>
                            </xt-button>
                        </div>
                        <Comment :tid="tid" :reply="cardData.reply_count" :uid="cardData.user.uid" />
                    </div>
                </vue-custom-scrollbar>

            </div>
        </div>


    </xt-modal>
</template>

<script setup lang='ts'>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { UserOutlined } from '@ant-design/icons-vue'
import Comment from '../../../page/chat/com/Comment.vue';
import { useCommunityStore } from '../../../page/chat/commun'
import { appStore } from '../../../../table/store'
import { Icon } from '@iconify/vue';
import browser from '../../../js/common/browser';
import emojiReplace from '../../../js/chat/emoji'
import { message } from "ant-design-vue";
import Detail from '../../../page/chat/com/Detail.vue';
const useUserStore = appStore()
const store = useCommunityStore();
let uid = store.communityPostDetail.user?.uid
let userInfo = {
    uid: uid,
    nickname: props.cardData.user?.nickname,
    avatar: props.cardData.user?.avatar_128
}
let windowHeight = ref()
let windoWidth = ref()
onMounted(() => {
    windoWidth.value = window.innerWidth
    windowHeight.value = window.innerHeight
    // console.log(props.cardData)
    refresh()
})
const custom = computed(() => {
    return props.showDetailModal
})
// 弹出用户个人卡片
const showCard = (uid, userInfo) => {
    useUserStore.showUserCard(uid, userInfo)
}
const goYuan = () => {
    browser.openInUserSelect(`https://s.apps.vip/post/${props.cardData.pay_set.tid}`)
}
const emit = defineEmits(['closeDetail'])
const closeDetail = () => {
    emit('closeDetail', false)
}
const settingsScroller = reactive({
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true,
});
// 点赞
const isLike = computed(() => {
    return store.communityPostDetail.is_support
})
//
let tid = store.communityPostDetail?.pay_set?.tid ? store.communityPostDetail?.pay_set?.tid : store.communityPostDetail?.id
const clickLike = async () => {
    await store.getCommunityLike("thread", tid)
    message.success(store.communitySupport.info)
    refresh()
}
const isCollect = computed(() => {
    return store.communityPostDetail.is_collect
})
// 收藏
const clickCollect = async () => {
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
    showDetailModal: Boolean,
    cardData: {
        type: Object,
        default: () => []
    }
})
const createTime = computed(() => {
    let [date, time] = props.cardData.create_time.split(' ')
    return [date, time]
})
const refresh = async () => {
    let detailTid = props.cardData.pay_set.tid ? props.cardData.pay_set.tid : props.cardData.id
    await store.getCommunityPostDetail(detailTid)
    await store.getCommunityPostReply(detailTid)
}
const content = computed(() => {
    return emojiReplace(props.cardData.pc_summary);
});
const title = computed(() => {
    return emojiReplace(props.cardData.title);
});

const showMenu = (img) => {
    console.log(img);
}
const isFullScreen = ref(false)
const fullScreen = () => {
    isFullScreen.value = !isFullScreen.value
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
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.85);
                    font-weight: 400;
                }

                .self-msg {
                    font-size: 12px;
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

    .title {
        font-size: 16px;
        text-align: justify;
        line-height: 22px;
        font-weight: 400;
        white-space: pre-wrap;
        word-wrap: break-word;
    }

    .context {
        font-size: 14px;
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


    }

}

.active-icon {
    background: transparent;
    font-size: 20px;

    &:hover {
        background: var(--secondary-bg);
    }
}

.view {
    cursor: pointer;

    &::after {
        content: '·';
        margin-left: 5px;
        margin-right: 5px;
    }
}</style>
