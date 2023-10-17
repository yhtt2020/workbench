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
        <div>
            <div class="flex justify-between h-[40px]">
                <div class="xt-text font-16" style="line-height: 40px;">
                    {{ selectList[currentIndex].name }}
                </div>
                <div class="w-[83px] h-[40px] ">
                    <xt-button style="color: var(--primary-text); width: 83px;height: 40px;border-radius: 12px;"
                        @click="visibleModal">
                        <newIcon class="pr-1 text-xl xt-theme-text" style="vertical-align: sub;"
                            icon="akar-icons:circle-plus-fill" />发布
                    </xt-button>
                </div>
            </div>
            <div>
                <Commun />
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import { Icon as newIcon } from '@iconify/vue'
import Commun from '../chat/Commun.vue';
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
const currentIndex = ref(0)
const setCurrentIndex = (index, item) => {
    currentIndex.value = index
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
</style>