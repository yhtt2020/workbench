<template>
    <div class="flex flex-wrap" :style="{ gap: gap + 'px' }">
        <SelectIcon
            v-for="(item, index) in list"
            :key="index"
            :item="item"
            :info="item.summary||info"
            @clickRightListItem="clickItem" />
    </div>
</template>

<script setup lang='ts'>
import { ref, toRefs ,onMounted } from 'vue'
import SelectIcon from './SelectIcon.vue'

const props = defineProps({
    // 数组
    list: Array,
    // 设置图标方块间的间隔
    gap: {
        type: String,
        default: '12'
    },
    info: String,   // 图标简介，如果不传默认为item中value
})

const { list, gap, info } = toRefs(props)

const emit = defineEmits(['clickItem'])

const clickItem = (item) => {
    emit('clickItem', item)
}

</script>
<style lang='scss' scoped></style>
