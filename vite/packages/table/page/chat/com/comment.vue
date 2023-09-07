<template>
    <div class="">
        <div class="flex mt-4 mb-4">
            <!-- :icon="h(SearchOutlined)" -->
            <a-button class="mr-3 rounded-lg w-[57px] h-[32px]">{{ like }}</a-button>
            <a-button class="border-none rounded-lg w-[57px] h-[32px]">{{collection}}</a-button>
        </div>
        <a-avatar src="https://up.apps.vip/avatar/003.png" :size="32"></a-avatar>

    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
const like = ref(12)
const collection = ref(22)
</script>
<style lang='scss' scoped></style>