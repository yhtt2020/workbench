<template >
    <!-- {{ isShow.isShow }} -->
    <div class="w-full card" style="height:auto">
        <!-- {{ isShow.isShow }} -->
        <div class="card-content">
            <div class="card-top">
                <div class="top-left">
                    <a-avatar src="https://up.apps.vip/avatar/003.png" :size="32">
                        <template #icon>
                            <UserOutlined />
                        </template>
                    </a-avatar>
                    <div class="user-msg">
                        <div class="username" style="color: var(--primary-text);">
                            我是皮克斯呀
                        </div>
                        <div class="self-msg " style="color:  var(--secondary-text);">
                            <span class="date">08-09</span>
                            <span class="time">16:16</span>
                            <span class="ip">浙江</span>
                        </div>
                    </div>
                </div>
                <div class="top-right">
                    <!-- 当展示文章详情时,需要一个返回按钮去返回上一级 -->
                    <slot name="top-right"></slot>
                </div>

            </div>

            <div>
                <div>
                    <div class="flex flex-col items-center ">
                        <video class="object-cover mb-2 rounded-md cover-lm" v-if="cardData.data?.video">
                            <source :src="cardData.data.video" type="video/mp4" />
                            <source :src="cardData.data.video" type="video/webm" />
                        </video>
                    </div>
                    <template v-if="cardData.data?.img">
                        <ul class="flex flex-col items-center p-0 mb-0">
                            <img :src="item" v-for="(item,index) in cardData.data?.img" class="mb-2 rounded-md cover-lm" :key="index">
                        </ul>
                    </template>
                    <!-- 正文元素 -->
                    <div class="mt-1">
                        <div>
                            <span id="title" style="color: var(--primary-text); " >{{
                                cardData.content.title
                            }}</span>
                            <br>
                            <span id="context" style="color:  var(--secondary-text);">{{
                                cardData.content.context
                            }}</span>
                        </div>

                    </div>
                </div>

            </div>
            <div class="text-xs card-bottom" style="color:  var(--secondary-text);">
                <span class="view" style="cursor: pointer;">1626 浏览</span>
                <span class="like" style="cursor: pointer;">13 点赞</span>
                <span class="comments" style="cursor: pointer;">23 评论</span>
            </div>
            <!-- 分隔线 -->
            <!-- <div class="w-full h-[2px] mt-4 xt-bg-2"></div> -->
            <a-divider   class="w-full h-[2px] mt-4 xt-bg-2" />
            <Comment />
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import { UserOutlined } from '@ant-design/icons-vue'
import Comment from './comment.vue';

const props = defineProps({
    isShow: Boolean,
    cardData: {
        type: Object,
        default: () => []
    }
})
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
            width: 330px;
            height: 200px;
            text-align: center;
            object-fit: cover;

        }
    }

    #title {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.85);
        text-align: justify;
        line-height: 22px;
        font-weight: 400;
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
</style>