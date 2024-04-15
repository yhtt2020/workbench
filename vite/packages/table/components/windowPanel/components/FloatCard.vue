<template>
    <div 
        ref="cardRef"
        class="absolute tt-card-container"
        style="z-index:500" 
        :style="{ left: `${position.x}px`, top: `${position.y}px`}">
        <component
            :desk="desk"
            :is="currentComponent"
            :custom-index="cardData.customIndex"
            :custom-data="cardData.customData"
            :custom-size="cardData.customSize"
            :openWay="'nav'"
            @delete="deleteCard"
        />
    </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
import componentsMinis from '../../../../table/components/desk/components';

export default defineComponent({
    mixins: [componentsMinis]
});
</script>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { cardStore } from '../../../store/card';
import { storeToRefs } from 'pinia';

const useCard = cardStore()
const { desks } = storeToRefs(useCard)

const cardRef = ref(null)

const props = defineProps({
    cardData: {
        type: Object,
        default: () => ({})
    },
    currentComponent: {
        type: String,
        default: ''
    },
    position: {
        type: Object,
        default: () => ({
            x: 0,
            y: 0
        })
    },
    navId:{
        type: String,
        default: 'foot'
    }
})

const emit = defineEmits(['close','delete'])

const close = (e) => {
    if(e.target.closest('.tt-card-container') == null) {
        emit('close')
    }
}

const desk = computed(() => {
    return props.cardData.desk || desks.value[0]
})

const deleteCard = (val) => {
    // console.log(val,'<<<<',navObj.value[props.navId])
    // const list = navObj.value[props.navId].list.filter((item) => {
    //     return item.type === 'card'
    // })
    // const target = list.find(item => {
    //     return item.cardData.customIndex === val
    // })
    // console.log(target)
    // deleteIcon(target,props.navId)
    emit('delete')
}

// onClickOutside(cardRef, close)
onMounted(() => {
    window.addEventListener('click', close)
    // console.log(props.cardData,'<<<<<<<<<<<<<<<<')
})

onUnmounted(() => {
    window.removeEventListener('click', close)
})
</script>

<style lang='scss' scoped></style>
