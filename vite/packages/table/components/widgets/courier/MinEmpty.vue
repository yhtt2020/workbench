<template>
    <div class="flex flex-col items-center">
        <div class="p-4 mt-2 mb-2 rounded-lg xt-bg xt-text" style="font-size: 14px;">
            在桌面上时刻关注你的快递动态，支持批量添加快递单号，自定义修改快递名称和图标。
        </div>
        <xt-button :w="95" :h="40" style="background: #508BFE;" class="xt-text" @click="addCourier">添加快递</xt-button>
    </div>
    <AddCourierModal ref="addCourierRef" />
</template>

<script setup>
import { ref, reactive } from 'vue'

import AddCourierModal from "./courierModal/AddCourierModal.vue";
const addCourierRef = ref(null)

const addCourier = () =>{
  addCourierRef?.value.openCourierModel()
}
</script>
<style lang='scss' scoped></style>