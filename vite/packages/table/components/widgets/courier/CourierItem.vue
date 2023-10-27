<template>
    <div class="w-full mb-5 flex mt-3 pointer">
        <div class="mr-4">
            <div class="w-[56px] h-[56px] rounded-xl xt-bg-2 flex justify-center items-center pointer">
                <newIcon icon="fluent-emoji:package" style="font-size: 32px;text-align: center;"></newIcon>
            </div>
        </div>
        <div class="w-full">
            <div class="flex justify-between">
                <div style="font-size: 16px;" class="xt-text">{{ props.courier.name }}</div>
                <div class="flex xt-text-2" style="font-size: 14px;text-align: center;">
                    <div class="xt-bg-2 mr-2 pl-1 pr-1 rounded-md">
                        {{ props.courier.company }}
                    </div>
                    <div class="pl-1 pr-1 rounded-md" style="background: #43CADE;">
                        {{ props.courier.status }}
                    </div>
                </div>
            </div>
            <div class="xt-text-2 mt-2" style="font-size: 14px;">
                {{ props.courier.time }}
            </div>
            <div class="xt-text mt-2" style="font-size: 14px;">
                {{ props.courier.road }}
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import { Icon as newIcon } from '@iconify/vue';
const props = defineProps({ courier: Object })
</script>
<style lang='scss' scoped></style>