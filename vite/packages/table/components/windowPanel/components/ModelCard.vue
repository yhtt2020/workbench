<template>
    <xt-modal 
        v-if="modelVisible" 
        v-model="modelVisible" 
        :header="false"
        boxClass="p-0"
        @close="emit('update:modelVisible', false)"
        @no="emit('update:modelVisible', false)">
        <component
            :desk="desk"
            :is="currentComponent"
            :custom-index="cardData.customIndex"
            :custom-data="cardData.customData"
            :custom-size="cardData.customSize"
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
import { ref, toRefs, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['update:modelVisible'])

const props = defineProps({
    // 卡片数据
    cardData: {
        type: Object,
        default: () => ({})
    },
    // 当前卡片组件
    currentComponent: {
        type: String,
        default: ''
    },
    // 
    modelVisible: {
        type: Boolean,
        default: false
    }
})

const { cardData, currentComponent, modelVisible } = toRefs(props)

// 桌面数据
const desk = computed(() => {
    return props.cardData.desk || desks.value[0]
})

onMounted(() => {
    console.log(modelVisible.value,cardData.value,'<<<<<<<<<<')
})

onUnmounted(() => {
    console.log('i am lose')
})
</script>
<style lang='scss' scoped></style>