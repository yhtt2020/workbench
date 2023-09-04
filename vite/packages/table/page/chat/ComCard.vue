<template >
    <!-- {{ isShow.isShow }} -->
    <div class="w-full card" >
        <!-- {{ isShow.isShow }} -->
        <div class="card-content">
            <div class="card-top">
                <div class="top-left">
                    <a-avatar :size="32">
                        <template #icon>
                            <UserOutlined />
                        </template>
                    </a-avatar>
                    <div class="user-msg">
                        <div class="username">
                            我是皮克斯呀
                        </div>
                        <div class="self-msg ">
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
                <div class="flex items-center justify-center">
                    <img :src="options.topImg" alt="" class="w-1/4 h-full" v-if="options.topImg">
                    <!-- <div class="w-1/3 h-full bg-image"></div> -->
                    <!-- 插入正文元素 -->
                    <slot name="content"></slot>
                </div>

                <img :src="options.btmImg" alt="" v-if="options.btmImg" class="w-1/5 mt-6 mb-6 h-1/3">
            </div>

            <div class="card-bottom " v-if="!isShow">
                <span class="view"  style="cursor: pointer;">1626 浏览</span>
                <span class="like" style="cursor: pointer;">13 点赞</span>
                <span class="comments" style="cursor: pointer;">23 评论</span>
            </div>

        </div>

    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import { UserOutlined } from '@ant-design/icons-vue'
const props = defineProps({
    isShow: Boolean,
    options: {
        type: Object,
        default: () => ({
        })
    },
    cardData: {
        type: Object,
        default: () => []
    }
})
// const {topImg,btmImg}=props.options
// const {title,context}=props.cardData.content
</script>
<style lang='scss' scoped>
.card {
    display: flex;
    // 占满整个父元素
    flex-grow: 1;
    // width: 600px;
    background: rgba(0, 0, 0, 0.30);
    border-radius: 12px;
    margin-bottom: 12px;

    .card-content {
        margin: 16px;

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