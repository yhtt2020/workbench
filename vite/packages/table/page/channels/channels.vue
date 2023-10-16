<template>
    <div class="w-full">
        <xt-left-menu  :list="leftMenu" last="2" end="1" class="w-full">
            
        </xt-left-menu>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, computed } from 'vue'
const leftMenu=ref([
    {
        icon: 'message',
        newIcon: 'fluent:star-12-regular',
        tab: 'session',
        // route: {
        //     name: 'chatMain',
        //     params: { no: '', info: JSON.stringify('') }
        // },
    },
    {
        icon: 'message',
        newIcon: 'eva:compass-outline',
        tab: 'circle',
    },
    {
        full:true
    }
])
</script>
<style lang='scss' scoped></style>