<template>
    <div 
        ref="cardRef"
        class="absolute tt-card-container"
        style="z-index:500" 
        :style="{ left: `${position.x}px`, top: `${position.y}px`}">
        <component
            :desk="cardData.desks"
            :is="currentComponent"
            :custom-index="cardData.customIndex"
            :custom-data="cardData.customData"
            :custom-size="cardData.customSize"
        />
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import componentsMinis from '../../../../table/components/desk/components';

export default defineComponent({
    mixins: [componentsMinis]
});
</script>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { onClickOutside } from '@vueuse/core';

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
    }
})

const emit = defineEmits(['close'])

const close = (e) => {
    if(e.target.closest('.tt-card-container') == null) {
        emit('close')
    }
}

// onClickOutside(cardRef, close)
onMounted(() => {
    window.addEventListener('click', close)
})

onUnmounted(() => {
    window.removeEventListener('click', close)
})
</script>

<style lang='scss' scoped></style>
