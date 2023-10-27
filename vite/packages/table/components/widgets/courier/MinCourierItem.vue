<template>
    <div>
        <div class="mt-2">
            <div class="flex ">
                <div class="w-[56px] h-[56px] rounded-xl xt-bg-2 flex justify-center items-center pointer">
                    <newIcon icon="fluent-emoji:package" style="font-size: 32px;text-align: center;"></newIcon>
                </div>
                <div class="ml-2 flex flex-col justify-between h-[56px]" >
                    <div class="text-base xt-text pointer">
                        {{ courier[0].name }}
                    </div>
                    <div class="flex xt-text-2 h-[24px]" style="font-size: 14px;text-align: center;">
                        <div class="flex items-center pl-1 pr-1 mr-2 rounded-md xt-bg-2">
                            {{ courier[0].company }}
                        </div>
                        <div class="pl-1 pr-1 rounded-md h-[24px] flex items-center" style="background: #43CADE;">
                            {{ courier[0].status }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-full h-[84px] xt-bg rounded-xl p-3 pt-2 mt-2 pointer" style="text-align: left;">
                <div class="xt-text-2 ">
                    {{ courier[0].time }}
                </div>
                <div class="mt-1 xt-text">
                    {{ courier[0].road }}
                </div>
            </div>
        </div>

    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import { Icon as newIcon } from '@iconify/vue'
import { courier } from './mock'

</script>
<style lang='scss' scoped></style>