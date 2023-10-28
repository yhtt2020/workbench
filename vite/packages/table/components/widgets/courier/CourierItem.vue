<template>
    <div class="flex w-full mt-3 mb-5 pointer">
        <div class="mr-4">
            <div class="w-[56px] h-[56px] rounded-xl xt-bg-2 flex justify-center items-center pointer">
                <newIcon icon="fluent-emoji:package" style="font-size: 32px;text-align: center;"></newIcon>
            </div>
        </div>
        <div class="w-full">
            <div class="flex justify-between">
                <div style="font-size: 16px;" class="xt-text">{{ props.courier.name }}</div>
                <div class="flex xt-text-2" style="font-size: 14px;text-align: center;">
                    <div class="flex items-center pl-1 pr-1 mr-2 rounded-md xt-bg-2">
                        {{ props.courier.company }}
                    </div>
                    <div class="flex items-center pl-1 pr-1 rounded-md" :style="{ 'background': stateColor }">
                        {{ props.courier.status }}
                    </div>
                </div>
            </div>
            <div class="mt-2 xt-text-2" style="font-size: 14px;">
                {{ props.courier.time }}
            </div>
            <div class="mt-2 xt-text omit" style="font-size: 14px;">
                {{ props.courier.road }}
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive,computed } from 'vue'
import { Icon as newIcon } from '@iconify/vue';
const props = defineProps({ courier: Object })
const stateColor = computed(() => {
    switch (props.courier.state) {
        case 0:
            return '';
        case 1:
            return '#43CADE';
        case 2:
            return '#508BFE';
        case 3:
            return '#FA7B14';
        case 4:
            return '#52C41A';
        default:
            return '';
    }
})
</script>
<style lang='scss' scoped>
.omit{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>