<template>
    <div class="flex justify-center">
        <div class="" style="margin-top: 54px;">
            <div class="flex flex-col   w-[108px] h-[268px] justify-center items-center xt-bg rounded-lg ">
                <div v-for="(item, index) in selectList" :key="index"
                    class="w-[96px] h-[32px]  mt-1 mb-2 text-center leading-8 font-16"
                    :class="[{ action: currentIndex == index }]" style="cursor: pointer;"
                    @click="setCurrentIndex(index, item)">{{
                        item.name
                    }}</div>
            </div>
        </div>
        <div style="width: 70%;" class="pl-3 pr-3">
            <div class="flex justify-between h-[40px] mb-3">
                <div class="xt-text font-16" style="line-height: 40px;">
                    {{ selectList[currentIndex].name }}
                </div>
                <div class="w-[83px] h-[40px] ">
                    <xt-button
                        style="color: var(--primary-text); width: 83px;height: 40px;border-radius: 12px;background: rgba(80, 139, 254, 0.20);"
                        @click="visibleModal">
                        <newIcon class="pr-1 text-xl xt-theme-text" style="vertical-align: sub;"
                            icon="akar-icons:circle-plus-fill" />发布
                    </xt-button>
                </div>
            </div>
            <div >
                <vue-custom-scrollbar ref="threadListRef" :key="currentPage" class="w-full thread-list"
                    :settings="settingsScroller" style="height: calc(100vh - 8em);overflow: hidden;flex-shrink: 0;width: 100%;">
                    <div class="flex flex-col justify-center content">
                        <!-- {{ checkMenuList.value[currentIndex.value].order }} -->
                        <!-- 循环渲染多个 ComCard -->
                        <a-empty v-if="comCards.list?.length === 0" description="暂无内容" image="/img/test/load-ail.png"
                            style="margin-top: 30%;"></a-empty>
                        <template v-else>
                            <ComList v-for="(card, index) in comCards.list" :key="index" :cardData="card"
                                @click="showDetail(index)" class="xt-bg"
                                :style="{ backgroundColor: selectedIndex === index ? 'var(--active-secondary-bg) !important' : 'var(--primary-bg) !important', flex: 1 }">
                            </ComList>
                            <!-- <ComList v-for="(card, index) in comCards.list" :key="index" :cardData="card"
                                @click="showDetail(index)" class="xt-bg"
                                :style="{ backgroundColor: selectedIndex === index ? 'var(--active-secondary-bg) !important' : 'var(--primary-bg) !important', flex: 1 }">
                            </ComList>
                            <ComList v-for="(card, index) in comCards.list" :key="index" :cardData="card"
                                @click="showDetail(index)" class="xt-bg"
                                :style="{ backgroundColor: selectedIndex === index ? 'var(--active-secondary-bg) !important' : 'var(--primary-bg) !important', flex: 1 }">
                            </ComList>
                            <ComList v-for="(card, index) in comCards.list" :key="index" :cardData="card"
                                @click="showDetail(index)" class="xt-bg"
                                :style="{ backgroundColor: selectedIndex === index ? 'var(--active-secondary-bg) !important' : 'var(--primary-bg) !important', flex: 1 }">
                            </ComList>
                            <ComList v-for="(card, index) in comCards.list" :key="index" :cardData="card"
                                @click="showDetail(index)" class="xt-bg"
                                :style="{ backgroundColor: selectedIndex === index ? 'var(--active-secondary-bg) !important' : 'var(--primary-bg) !important', flex: 1 }">
                            </ComList>
                            <ComList v-for="(card, index) in comCards.list" :key="index" :cardData="card"
                                @click="showDetail(index)" class="xt-bg"
                                :style="{ backgroundColor: selectedIndex === index ? 'var(--active-secondary-bg) !important' : 'var(--primary-bg) !important', flex: 1 }">
                            </ComList>
                            <ComList v-for="(card, index) in comCards.list" :key="index" :cardData="card"
                                @click="showDetail(index)" class="xt-bg"
                                :style="{ backgroundColor: selectedIndex === index ? 'var(--active-secondary-bg) !important' : 'var(--primary-bg) !important', flex: 1 }">
                            </ComList>
                            <ComList v-for="(card, index) in comCards.list" :key="index" :cardData="card"
                                @click="showDetail(index)" class="xt-bg"
                                :style="{ backgroundColor: selectedIndex === index ? 'var(--active-secondary-bg) !important' : 'var(--primary-bg) !important', flex: 1 }">
                            </ComList>
                            <ComList v-for="(card, index) in comCards.list" :key="index" :cardData="card"
                                @click="showDetail(index)" class="xt-bg"
                                :style="{ backgroundColor: selectedIndex === index ? 'var(--active-secondary-bg) !important' : 'var(--primary-bg) !important', flex: 1 }">
                            </ComList>
                            <ComList v-for="(card, index) in comCards.list" :key="index" :cardData="card"
                                @click="showDetail(index)" class="xt-bg"
                                :style="{ backgroundColor: selectedIndex === index ? 'var(--active-secondary-bg) !important' : 'var(--primary-bg) !important', flex: 1 }">
                            </ComList> -->
                        </template>
                    </div>
                    <div class="flex justify-center">
                        <a-pagination v-model:current="currentPage" :total="50" show-less-items class="pagination" />
                    </div>
                </vue-custom-scrollbar>
            </div>

        </div>
        <PublishModal v-if="publishVisible" @handle-ok="publishVisible = false" />
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import { Icon as newIcon } from '@iconify/vue'
import Commun from '../chat/Commun.vue';
import ComList from '../chat/com/ComList.vue';
import PublishModal from '../chat/com/PublishModal.vue';
const selectList = ref([
    {
        name: '推荐',
        type: 'interduce'
    },
    {
        name: '全站',
        type: 'all'
    },
    {
        name: '最新发布',
        type: 'last'
    },
    {
        name: '关注',
        type: 'focus'
    },
    {
        name: '圈子',
        type: 'circle'
    },
    {
        name: '视频',
        type: 'video'
    }
])
const publishVisible = ref(false)
const currentPage = ref(1)
const currentIndex = ref(0)
const setCurrentIndex = (index, item) => {
    currentIndex.value = index
}
const settingsScroller = reactive({
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true,
});
const selectedIndex = ref(-1)
const comCards = ref({
    list: [
        {
            user: {
                nickname: '摆烂ing',
                avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
                ip_home: {
                    region: '未知'
                },


            },
            create_time: '2022-12-12 12:12:12',
            summary: '经历了连续的几天的服务器震荡。目前我们已经基本稳定了服务器的表现。接下来应该会更加稳定。阿皮有话说：由…',
            title: '经历了连续的几天的服务器震荡。',
            view_count: '100',
            support_count: '100',
            reply_count: '100',
            image: [],
            image_170_170: []
        },
        {
            user: {
                nickname: '摆烂ing',
                avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
                ip_home: {
                    region: '未知'
                },


            },
            create_time: '2022-12-12 12:12:12',
            summary: '经历了连续的几天的服务器震荡。目前我们已经基本稳定了服务器的表现。接下来应该会更加稳定。阿皮有话说：由…',
            title: '经历了连续的几天的服务器震荡。',
            view_count: '100',
            support_count: '100',
            reply_count: '100',
            image: [],
            image_170_170: []
        },
        {
            user: {
                nickname: '摆烂ing',
                avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
                ip_home: {
                    region: '未知'
                },


            },
            create_time: '2022-12-12 12:12:12',
            summary: '经历了连续的几天的服务器震荡。目前我们已经基本稳定了服务器的表现。接下来应该会更加稳定。阿皮有话说：由…',
            title: '经历了连续的几天的服务器震荡。',
            view_count: '100',
            support_count: '100',
            reply_count: '100',
            image: [],
            image_170_170: []
        },
        {
            user: {
                nickname: '摆烂ing',
                avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
                ip_home: {
                    region: '未知'
                },


            },
            create_time: '2022-12-12 12:12:12',
            summary: '经历了连续的几天的服务器震荡。目前我们已经基本稳定了服务器的表现。接下来应该会更加稳定。阿皮有话说：由…',
            title: '经历了连续的几天的服务器震荡。',
            view_count: '100',
            support_count: '100',
            reply_count: '100',
            image: [],
            image_170_170: []
        },
    ]
})
const visibleModal = () => {
    console.log(publishVisible.value);

    publishVisible.value = true
}
</script>
<style lang='scss' scoped>
.font-16 {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    font-weight: 500;
}

.action {
    background: var(--active-bg);
    border-radius: 8px;
    cursor: pointer;
    width: 96px;
    height: 32px;
    border-left: 0px;
    padding: 0px;
    margin-right: 0px;
    text-align: center;
    color: var(--active-text);
    border: none;
}

:deep(.ant-pagination-item) {
    background: var(--primary-bg);
    border-radius: 8px;
    border: none;
    width: 40px;
    height: 40px;

    & a {
        display: block;
        height: 40px;
        text-align: center;
        margin-top: 4px;
    }
}

:deep(.ant-pagination-prev) {
    background: var(--primary-bg);
    border-radius: 8px;
    border: none;
    width: 40px;
    height: 40px;
    line-height: 40px !important;
}

:deep(.ant-pagination-next) {
    background: var(--primary-bg);
    border-radius: 8px;
    border: none;
    width: 40px;
    height: 40px;
}
</style>