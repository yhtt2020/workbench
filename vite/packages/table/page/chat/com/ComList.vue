<template >
    <div class="w-full card">
        <div class="card-content">
            <div class="card-top">
                <div class="top-left">
                    <a-avatar :size="32" src="https://up.apps.vip/avatar/003.png">
                        <template #icon>
                            <UserOutlined />
                        </template>
                    </a-avatar>
                    <div class="user-msg">
                        <div class="text-sm username" style="color: var(--primary-text);">
                            我是皮克斯呀
                        </div>
                        <div class="text-xs self-msg xt-text-2">
                            <span class="date">08-09</span>
                            <span class="time">16:16</span>
                            <span class="ip">浙江</span>
                        </div>
                    </div>
                </div>

            </div>

            <div>
                <div class="flex items-center justify-center">
                    <!-- 单个图片 -->
                    <template v-if="cardData.data?.img?.length === 1 && !cardData.data?.video">
                        <img :src="cardData.data.img" class="object-cover mr-2 rounded-md cover-im "
                            :class="{ 'hide-images-video': detailVisible }" style="text-align: center;">
                    </template>
                    <video class="object-cover mr-2 rounded-md cover-im" v-if="cardData.data?.video"
                        :class="{ 'hide-images-video': detailVisible }">
                        <source :src="cardData.data?.video" type="video/mp4" />
                        <source :src="cardData.data?.video" type="video/webm" />
                    </video>
                    <!-- 正文内容 -->
                    <div>
                        <div id="title" style="color: var(--primary-text);"
                            :class="{ 'omit-title': cardData.data?.img?.length === 1 || cardData.data?.video }">{{
                                cardData.content.title }}</div>
                        <div id="context" style="color:  var(--secondary-text);"
                            :class="{ 'omit': cardData.data?.img?.length === 1 || cardData.data?.video }">
                            {{ cardData.content.context }}</div>
                    </div>
                </div>
                <template v-if="cardData.data?.img?.length > 1">
                    <div class="flex w-full p-0 mt-3 -mb-1 whitespace-pre-wrap cover-wrapper">
                        <img :src="item" alt="" v-for="(item, index) in cardData.data?.img"
                            class="object-cover mr-2 rounded-md cover-sm" :key="index">
                    </div>
                </template>


            </div>

            <div class="text-xs card-bottom" style="color:  var(--secondary-text);">
                <span class="view" style="cursor: pointer;">1626 浏览</span>
                <span class="like" style="cursor: pointer;">13 点赞</span>
                <span class="comments" style="cursor: pointer;">23 评论</span>
            </div>

        </div>

    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, computed, onMounted, onBeforeMount, nextTick } from 'vue'
import { UserOutlined } from '@ant-design/icons-vue'
const props = defineProps({
    detailVisible: Boolean,
    cardData: {
        type: Object,
        default: () => []
    }
})
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
                    font-family: PingFangSC-Regular;
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.85);
                    font-weight: 400;
                }

                .self-msg {
                    font-family: PingFangSC-Regular;
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
            font-family: PingFangSC-Regular;
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
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: rgba(255, 255, 255, 0.85);
            text-align: justify;
            line-height: 22px;
            font-weight: 500;
        }

        #context {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.60);
            text-align: justify;
            line-height: 22px;
            font-weight: 400;
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

}</style>
