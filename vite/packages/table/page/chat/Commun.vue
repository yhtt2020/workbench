<template>
    <div class="container">
        <div class="top-bar">
            <div class="left shrink">
                <a class="text-base ant-dropdown-link" @click.prevent style="color: var(--primary-text);">
                    最近更新
                    <DownOutlined class="text-base" />
                </a>
            </div>
            <div class="right shrink">
                <a-button type="primary" :icon="h(PlusCircleOutlined)" style="color: var(--primary-text);">发布</a-button>
            </div>
        </div>
        <!-- <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;"> -->
            <div class="flex justify-center h-full" >
                <!-- 左侧卡片区域 -->
                <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;">
                <div class="flex justify-center content" :style="{ width: isShow ? '40%' : '60%' }">
                    <!-- 循环渲染多个 ComCard -->
                    <ComCard v-for="(card, index) in comCards" :key="index" :cardData="card"
                        @click="toggleCardSelection(index)"
                        :style="{ backgroundColor: isSelectIndex == index ? 'rgba(80,139,254,0.20)' : 'rgba(0,0,0,0.30)', flex: 1 }">
                        <template #content>
                            <!-- 添加数据的文本内容-标题和内容分开 -->
                            <div>
                                <div id="title" style="color: var(--primary-text);">{{ card.content.title }}</div>
                                <div id="context" style="color:  var(--secondary-text);" :class="[{'omit':card.options?.img.length===1}]">{{ card.content.context }}</div>
                            </div>
                            <!-- 自定义添加内容 -->
                            <!-- <slot></slot> -->
                        </template>
                    </ComCard>
                </div>
                </vue-custom-scrollbar>
                <!-- 右侧详情区域 -->
                <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;">
                <div class="h-full ml-3 detail" v-if="isShow" :style="{ width: isShow ? '55%' : '40%' }">
                    <DetailCard :cardData="comCards[currentIndex]">
                        <template #top-right>
                            <CloseCircleOutlined @click="close(currentIndex)" class="text-xl"
                                style="color: var(--primary-text);background: var(--mask-bg);" />
                        </template>
                        <template #content>
                            <div>
                                <div>
                                    <span id="title" style="color: var(--primary-text);">{{
                                        comCards[currentIndex].content.title }}</span>
                                    <br>
                                    <span id="context" style="color:  var(--secondary-text);">{{
                                        comCards[currentIndex].content.context }}</span>
                                </div>
                            </div>
                        </template>
                    </DetailCard>
                </div>
            </vue-custom-scrollbar>
            </div>
        <!-- </vue-custom-scrollbar> -->
    </div>
</template>
  
<script setup lang="ts">
import { ref, reactive, nextTick, h, computed, watch } from 'vue';
import { DownOutlined, PlusCircleOutlined, CloseCircleOutlined } from '@ant-design/icons-vue';
import ComCard from './card/ComCard.vue';
import DetailCard from './card/DetailCard.vue';
let isSelectIndex = -1
const settingsScroller = reactive({
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true,
});

// 定义 ComCard 的数据数组，每个元素都包含内容和点击状态
const comCards = ref([
    {
        content: {
            title: '6.3.3版本测试体验版，欢迎大家下载体验。主要对聊天功能进行了加强。如何加入团队？开启聊天功能，设置-》快捷开关-》启用聊天搜索加入群聊，给大家一个体验群ID：@TGS#2QXE7QDNI',
            context: ''
        },
    },
    {
        content: {
            title: '各位工作台的小伙伴们大家好。由于近期我们的服务器受到一些来自印度？海外的不明IP攻击。主要是攻击了我们产品站www.apps.vip。',
            context: ''
        },
        options: {
            img: ['../../../public/img/unlock.svg','../../../public/img/unlock.svg'],
            viedo: ''
        }
    },
    {
        content: {
            title: '8月9日，近期开发内容日志：桌面市场、超级工具箱、待办.经历了连续的几天的服务器震荡。',
            context: '目前我们已经基本稳定了服务器的表现。接下来应该会更加稳定。阿皮有话说：由…'
        },
        options: {
            img: ['../../../public/img/unlock.svg'],
        }
    },
]);

// 控制显示状态和选中状态的变量
const isShow = ref(false);
let currentIndex = 0
// 切换选中状态的函数
const toggleCardSelection = (index) => {
    // 切换显示状态
    isShow.value = true;
    // 切换选中状态
    isSelectIndex = index;
    // 保存当前选中卡片的索引
    currentIndex = index
};

// 关闭详情的函数
const close = (index) => {
    if (isShow.value) {
        isShow.value = false;
        isSelectIndex = -1
    }
}
</script>
<style lang='scss' scoped>
.container {
    width: 100%;
    height: 100%;

    .top-bar {
        width: 100%;
        height: 40px;
        margin-top: 12px;
        margin-bottom: 12px;
        margin-left: 12px;
        // margin-right: 12px;
        display: flex;
        justify-content: space-between;

        .left {
            width: 115px;
            height: 40px;
            background: rgba(0, 0, 0, 0.30);
            border-radius: 10px;
            text-align: center;
            line-height: 40px;

            .ant-dropdown-link {
                font-family: PingFangSC-Regular;
                // font-size: 16px;
                color: rgba(255, 255, 255, 0.60);
                font-weight: 400;
                // color: red;
            }
        }

        .right {
            width: 83px;
            height: 40px;
            margin-right: 24px;

            :deep(.ant-btn) {
                width: 100%;
                height: 100%;
                background: rgba(80, 139, 254, 0.20);
                border-radius: 10px;
            }
        }
    }



    .content {
        // max-width: 40%;
        // height: 550px;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        

        // overflow: scroll;
        .card-content {
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: rgba(255, 255, 255, 0.85);
            text-align: justify;
            line-height: 22px;
            font-weight: 400;
        }

        .se-content {
            display: flex;

            .left {
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 6px;
                margin-right: 12px;
            }

            .right {
                .title {
                    font-family: PingFangSC-Medium;
                    font-size: 16px;
                    color: rgba(255, 255, 255, 0.85);
                    text-align: justify;
                    line-height: 22px;
                    font-weight: 500;
                    white-space: pre-wrap;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }

                .context {
                    margin-top: 8px;
                    font-family: PingFangSC-Regular;
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.60);
                    text-align: justify;
                    line-height: 22px;
                    font-weight: 400;

                }
            }
        }
    }

    .select {
        background-color: rgba(80, 139, 254, 0.20);
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

    .omit {
        white-space: pre-wrap;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .scroll{
        &::-webkit-scrollbar {
            display: none;
        }
    }
}
</style>