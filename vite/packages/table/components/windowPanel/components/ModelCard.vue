<template>
    <xt-modal 
        v-if="modelVisible" 
        v-model="modelVisible" 
        :header="false"
        boxClass="p-0"
        :maskIndex="999"
        @close="emit('update:modelVisible', false)"
        @no="emit('update:modelVisible', false)">
        <component
            :desk="desk"
            :is="currentComponent"
            :custom-index="data.customIndex"
            :custom-data="data.customData"
            :custom-size="data.customSize"
            :openWay="'nav'"
            @delete="deleteCard"
        />
    </xt-modal>
</template>
<script>
import { defineComponent, computed } from 'vue';
import componentsMinis from '../../../../table/components/desk/components';

export default defineComponent({
    mixins: [componentsMinis]
});
</script>
<script setup>
import { ref, toRefs, onMounted} from 'vue'
import { cardStore } from '../../../store/card';
import { storeToRefs } from 'pinia';

const useCard = cardStore()
const { desks } = storeToRefs(useCard)

const emit = defineEmits(['update:modelVisible','delete'])

const props = defineProps({
    // 卡片数据
    cardData: {
        type: Object,
        default: () => ({})
    },
    // 弹窗是否可见
    modelVisible: {
        type: Boolean,
        default: false
    }
})

const { cardData, modelVisible } = toRefs(props)

// 桌面数据 -- 卡片所在桌面
const desk = computed(() => {
    return cardData.value.cardData.desk || desks.value[0]
})

// 当前卡片组件 --- 组件名
const currentComponent = computed(() => {
    return cardData.value.value || cardData.value.open.value
})

// 卡片的详细数据 -- 卡片索引，卡片数据，卡片尺寸
const data = computed(() => {
    return cardData.value.cardData
})

// 删除卡片
const deleteCard = () => {
    modelVisible.value = false
    emit('update:modelVisible', false)
    emit('delete', cardData.value)
}

// onMounted(() => {
//     console.log('cardData', cardData.value,data.value)
// })
</script>
<style lang='scss' scoped></style>