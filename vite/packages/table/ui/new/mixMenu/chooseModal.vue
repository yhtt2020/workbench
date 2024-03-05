<template>
    <div style="width: 800px;height: 587px;z-index: 9999999;"
        class="fixed xt-modal top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg">
        <div class="flex items-center justify-center w-full h-16 font-16 xt-text">选择菜单模式</div>
        <div class="w-full flex px-6 justify-between" style="height: 451px;">
            <div v-for="(item, index) in menuList" class="span-list xt-bg-2 text-center pointer" :class="rightModel == item.value?'active':''" @click="changeValue(item.value)">
                <div class="font-18 xt-text" style="font-weight: 600;margin-top: 28px;">{{ item.title }}</div>
                <div class="font-16 xt-text-2 mt-2 mb-6">{{ item.content }}</div>
                <a-avatar style="border-radius: 10px;" shape="square" :src="item.img" :size="320"></a-avatar>
            </div>
        </div>
        <div class="mt-4 pr-4 flex justify-end">
            <xt-button style="width: 64px;height:40px;" class="xt-active-btn" @click="close">确定</xt-button>
        </div>
    </div>
</template>
    
<script setup>

import { useWidgetStore } from '../../../components/card/store'
import { toRefs, ref } from "vue";
import { storeToRefs } from "pinia";
const widgetStore = useWidgetStore();
const { rightModel } = storeToRefs(widgetStore);
const { chooseVisible } = storeToRefs(widgetStore);

// name: 'ChooseModal',
const menuList = ref([
                {
                    title: '右键下拉式菜单',
                    content: '使用传统的鼠标右键菜单。',
                    img: '/img/flow.png',
                    value: 'follow',
                },
                {
                    title: '长按触控式菜单',
                    content: '更适合触控的大图标菜单。',
                    img: '/img/drawer.png',
                    value: 'default',
                },
            ]);

function changeValue(value) {
    rightModel.value = value
}

function close() {
    chooseVisible.value = false
}

</script>
  
<style scoped lang="scss">
.span-list {
    width: 368px;
    height: 451px;
    border-radius: 10px;
    border: 1px solid transparent;
}

.active {
    background: rgba(80, 139, 254, 0.20) !important;
    border: 1px solid rgba(80, 139, 254, 1);
    border-radius: 10px;
}
</style>
  