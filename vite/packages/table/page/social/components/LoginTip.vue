<template>
    <div 
        class="flex justify-between w-[524px] h-[104px] p-4 rounded-lg items-center mt-4" 
        style="
            border: 1px solid var(--active-bg);
            background-color: var(--active-secondary-bg);">
        <div>
            <div class="mb-2 text-base xt-text-1">登录工作台，提升等级解锁更多功能</div>
            <div class="mr-6 text-sm xt-text-2">完整的DIY功能，不限数量的快捷指令，支持动态壁纸，达到「10级」即可解锁所有等级权益。</div>
        </div>
        <xt-button
            :w="96"
            :h="40" 
            style="background-color: var(--active-bg);flex-shrink: 0;"
            @click="login">
            立即登录
        </xt-button>
        
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import { useLogin } from '../../../../table/permission/user/useLogin'
const login = () => {
    console.log('立即登录')
    useLogin()
}

</script>
<style lang='scss' scoped></style>