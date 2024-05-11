<template>
    <div 
        @click="clickItem(item)"
        class="flex flex-col items-center justify-center gap-2 item pointer"
        :style="{
            background: bg, 
            width: `${size}px`, 
            height: `${size}px`, 
            borderRadius: `${radius}px`
        } "
    >
        <xt-mix-icon 
            :icon="item.icon" 
            :size="iconSize" 
            :type="isIfy" 
            class="">
        </xt-mix-icon>
        <div class="px-1 text-sm xt-text-2 line-clamp-1"> {{ item.name }}</div>
    </div>
</template>

<script setup lang='ts'>
import { ref, computed } from 'vue'
import { checkIsIfyIcon } from '../../../../card/hooks/addCardToNav';

const emit = defineEmits(['clickItem'])

interface PropsType {
    item: object,
    size?: number,
    iconSize?: number,
    radius?: number,
    iconR?: number,
    iconBg?: string,
    bg?: string,
}

const props = withDefaults(defineProps<PropsType>(), {
    item: () => ({}),
    size: 100,
    iconSize: 52,
    radius: 8,
    iconR: 12,
});

// 判断是否是ify图标
const isIfy = computed(() => {
    return checkIsIfyIcon(props.item.icon).value ? 'ify' : 'select'
})

const clickItem = (item: any) => {
    console.log(item)
    emit('clickItem', item)
}


</script>
<style lang='scss' scoped>
.item{
    &:hover{
        background-color: var(--active-secondary-bg);
    }
}
</style>