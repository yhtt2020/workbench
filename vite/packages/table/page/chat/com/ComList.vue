<template >
    <!-- {{ props.cardData }} -->
    <div class="w-full card">
        <div class=" card-content">
            <!-- {{ Imageheight.width }} -->
            <div class="w-full card-top">
                <div class="top-left">
                    <a-avatar :size="32" :src="cardData.user.avatar" class="pointer" @click.stop="showCard(uid, userInfo)">
                        <template #icon>
                            <UserOutlined />
                        </template>
                    </a-avatar>
                    <div class="user-msg">
                        <div class="text-sm username" style="color: var(--primary-text);">
                            {{ cardData.user.nickname }}
                        </div>
                        <div class="text-xs self-msg xt-text-2">
                            <span class="date">{{ createTime[0] }}</span>
                            <span class="time">{{ createTime[1] }}</span>
                            <span class="ip">{{ cardData.user.ip_home.region }}</span>
                        </div>
                    </div>
                </div>

            </div>

            <div class="w-full">
                <div class="flex ">
                    <!-- 单个图片 -->
                    <template v-if="cardData.image.length === 1 && !cardData.data?.video">
                        <!-- <div > -->
                            <img :src="cardData.image_170_170[0].image" class="object-cover mr-2 overflow-hidden rounded-md cover-im" :class="{ 'hide-images-video': detailVisible }" style="flex-shrink: 0;text-align: "
                                 >
                        <!-- </div> -->

                    </template>
                    <video class="object-cover mr-2 rounded-md cover-im" v-if="cardData.data?.video"
                        :class="{ 'hide-images-video': detailVisible }">
                        <source :src="cardData.data?.video" type="video/mp4" />
                        <source :src="cardData.data?.video" type="video/webm" />
                    </video>
                    <!-- 正文内容 -->
                    <div class="flex flex-col justify-between" style="flex-shrink: 1;">
                        <div id="title" style="color: var(--primary-text);" v-if="cardData.title"
                            :class="{ 'omit-title': cardData.image.length === 1 || cardData.data?.video }" :innerHTML="title">
                            </div>
                        <div id="context" style="color:  var(--secondary-text); text-align: left;"
                            :class="{ 'omit': cardData.image.length === 1 || cardData.data?.video }" :innerHTML="content">
                            </div>
                    </div>
                </div>
                <template v-if="cardData.image.length > 1">
                    <div class="flex w-full p-0 mt-3 -mb-1 whitespace-pre-wrap cover-wrapper ">
                        <!-- <div> -->
                            <img :src="item.image" alt="" :key="index"  v-for="(item, index) in cardData.image_170_170" class="object-cover mr-2 overflow-hidden rounded-md cover-sm" >
                        <!-- </div> -->

                    </div>
                </template>


            </div>

            <div class="text-xs card-bottom" style="color:  var(--secondary-text);">
                <span class="view" style="cursor: pointer;">{{ cardData.view_count }} 浏览</span>
                <span class="like" style="cursor: pointer;">{{ cardData.support_count }} 点赞</span>
                <span class="comments" style="cursor: pointer;">{{ cardData.reply_count }} 评论</span>
            </div>

        </div>

    </div>
</template>

<script setup lang='ts'>
import {  computed,reactive } from 'vue'
import { UserOutlined } from '@ant-design/icons-vue'
import { appStore } from '../../../../table/store'
import emojiReplace from '../../../js/chat/emoji'
const useUserStore = appStore()


const props = defineProps({
    detailVisible: Boolean,
    cardData: {
        type: Object,
        default: () => []
    }
})
const postData=computed(()=>{
    return props.cardData
})
let uid = postData.value.user.uid
let userInfo = {
    uid: postData.value.user.uid,
    nickname: postData.value.user.nickname,
    avatar: postData.value.user.avatar_128
}
const showCard = (uid, userInfo) => {
    useUserStore.showUserCard(uid, userInfo)


}
const createTime = computed(() => {
    let [date, time] = props.cardData.create_time.split(' ')
    return [date, time]
})
// 用于在动态和评论中使用的表情
// str.replace(/\[([^(\]|\[)]*)\]/g,(item,index) => {})
// https://sad.apps.vip/public/static/emoji/emojistatic/
const content = computed(() => {
    let result = emojiReplace(props.cardData.summary)
    return result;
});
const title = computed(() => {
    let result = emojiReplace(props.cardData.title)
    return result;
});

</script>
<style lang='scss' scoped>
.card {
    .cover-wrapper {
        flex-wrap: wrap;
    }

    .cover-sm {
        margin-bottom: 10px;
        width: 100px;
        height: 100px;
        aspect-ratio: 1 / 1;
    }


    .cover-im {
        // margin-bottom: 10px;
        width: 150px;
        height: 100px;
    }

    display: flex;
    // 占满整个父元素
    flex-grow: 1;
    // width: 600px;
    // background: rgba(0, 0, 0, 0.30);
    border-radius: 12px;
    margin-bottom: 12px;

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
                    // font-size: 12px;
                    // color: rgba(255, 255, 255, 0.40);
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

            .top-right {
                background: #000000;
            }
        }

        .card-content {
            font-size: 16px;
            color: rgba(255, 255, 255, 0.85);
            text-align: justify;
            line-height: 22px;
            font-weight: 400;
        }

        .omit-title {
            white-space: pre-wrap;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            text-overflow: ellipsis;
            overflow: hidden;
        }

        .omit {
            white-space: pre-wrap;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            text-overflow: ellipsis;
            overflow: hidden;
        }

        .hide-images-video {
            display: none;
        }

        #title {
            font-size: 16px;
            // color: rgba(255, 255, 255, 0.85);
            text-align: left;
            line-height: 22px;
            font-weight: 500;
            white-space: normal;
            word-break: break-all;
        }

        #context {
            font-size: 14px;
            // color: rgba(255, 255, 255, 0.60);
            text-align: left;
            line-height: 22px;
            font-weight: 400;
            white-space: pre-wrap;
            word-wrap: break-word;
            word-break: break-all;
            // overflow: scroll;
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

}
</style>
