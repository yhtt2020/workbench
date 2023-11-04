<template>
    <div class="flex flex-col items-center">
        <div class="p-4 mt-2 mb-2 rounded-lg xt-bg xt-text" style="font-size: 14px;">
            在桌面上时刻关注你的快递动态，支持同步主流电商平台的订单列表，自定义修改快递名称和图标。
        </div>
        <div class="flex">
            <xt-button class="mr-2 commerce-large" @click="bandJD"
                style="width: 40px; height: 40px;background: #E12419;font-weight: 600;">JD</xt-button>
            <xt-button class="mr-2 commerce-large" @click="bandJD"
                style="width: 40px; height: 40px;background: #FA5000;font-weight: 600;">淘</xt-button>
            <xt-button :w="129" :h="40" style="background: #508BFE;" class="xt-text" @click="addCourier">
                <newIcon icon="fluent:add-16-filled" style="font-size: 20px;line-height: 40px;vertical-align: middle;" />
                自定义添加
            </xt-button>
        </div>

    </div>
    <AddCourierModal ref="addCourierRef" />
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Icon as newIcon } from '@iconify/vue'
import AddCourierModal from "./courierModal/AddCourierModal.vue";
import grab from './grab';
const addCourierRef = ref(null)

const addCourier = () => {
    addCourierRef?.value.openCourierModel()
}
</script>
<style lang='scss' scoped>
.commerce {
    &-large {
        width: 40px;
        height: 40px;
        line-height: 40px;
        font-size: 24px;
        margin-right: 8px;
        text-align: center;
        color: var(--primary-text);
        border-radius: 10px;
    }
}
</style>