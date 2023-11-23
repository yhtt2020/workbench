<template>
    <div @click="addIcon"
        class="w-[188px] h-[188px] xt-bg-2 rounded-xl flex justify-center items-center flex-col relative mr-3 mb-3 pointer">
        <div class="w-[64px] h-[64px] rounded-xl xt-bg flex items-center justify-center">
            <div style="width: 32px; height: 32px;border-radius: 8px;" v-if="item.type === 'systemApp'"
                class="flex items-center justify-center rounded-lg ">
                <navIcon :icon="item.icon" class="test" style="width:28px;height:28px;fill:var(--primary-text);"></navIcon>
            </div>
            <div v-else style="width: 45px; height: 45px" class="flex items-center justify-center">
                <!--  -->
                <a-avatar :size="32" shape="square" :src="renderIcon(item.icon)"></a-avatar>

            </div>
            <!-- {{ index }} -->
        </div>
        <div class="pl-1 pr-1 mt-3 mb-2 text-base xt-text omit">{{ item.name }}</div>
        <div class="pl-1 pr-1 xt-text-2 omit" style="font-size: 14px;text-align: center;">{{ item.summary || props.recommendation.name }}</div>
        <div class="absolute top-3 right-3">
            <xt-button :w="24" :h="24" :style="{ background: isAdd ? '#52C41A' : 'var(--active-bg)' }" @click="addIcon">
                <div class="flex items-center justify-center" v-if="isAdd">
                    <xt-new-icon icon="fluent:checkmark-16-regular" class="xt-text " size="20"
                        style="padding:2px"></xt-new-icon>
                </div>
                <div v-else class="flex items-center justify-center"><xt-new-icon icon="fluent:add-16-regular" class="xt-text"
                        size="20" style="padding:2px;margin-left:2px;margin-top:2px"></xt-new-icon></div>
            </xt-button>
        </div>

    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, computed } from 'vue'
import { Icon as navIcon } from '@iconify/vue'
import { renderIcon } from '../../../../js/common/common'
const props = defineProps({
    item: {
        type: Object
    },
    recommendation: {
        type: String
    },
    index: Number
})
const isAdd = computed(() => {
    if (props.item.addNav && props.item.addNav == true) {
        return true
    } else {
        return false
    }
})
const emit = defineEmits(['addIcon'])
const addIcon = () => {
    console.log(props.index, props.item)
    emit('addIcon', props.item, props.index)
}
</script>
<style lang='scss' scoped></style>