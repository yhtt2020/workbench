<template>
    <div class="flex flex-col items-center justify-center w-full h-full pointer rounded-xl" >
        <!-- <div class="flex w-full"> -->
            <div>
                <newIcon icon="fluent-emoji:package" style="font-size: 56px;" />
            </div>
            <div class="mt-4 mb-3 text-sm xt-text">
                暂无物流轨迹
            </div>
            <div class=" p-4 xt-bg rounded-xl xt-text w-[400px]">
                请检查相关订单编号，手机号（如有）是否填写正确；如果确定无误，请等待物流更新。
            </div>
        <!-- </div> -->

    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import {Icon as newIcon} from '@iconify/vue'

</script>
<style lang='scss' scoped></style>