<template>
    <div class="flex flex-wrap" :style="{ gap: gap + 'px' }">
        <SelectIcon 
            v-for="(item, index) in list" 
            :key="index" 
            :item="item" 
            :info="info"
            @clickRightListItem="clickItem" />
    </div>
</template>

<script setup lang='ts'>
import { ref, toRefs ,onMounted } from 'vue'
import SelectIcon from './SelectIcon.vue'

const props = defineProps({
    list: Array,
    gap: {
        type: String,
        default: '12'
    },
    info: String,
})

const { list, gap, info } = toRefs(props)

const emit = defineEmits(['clickItem'])

const clickItem = (item) => {
    emit('clickItem', item)
}

</script>
<style lang='scss' scoped></style>