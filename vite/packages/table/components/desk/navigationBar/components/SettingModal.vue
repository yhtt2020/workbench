<template>
    <xt-modal :modelValue="modelValue" :mask="false" :index="100" :header="true" :footer="false" :back="false"
        @no="setQuick">
        <template #header-center>
            <HorizontalPanelVue :navList="navList" v-model:selectType="defaultType" :height="32" />
        </template>
        <template #header-right>
            <xt-button :w="32" :h="32"><xt-new-icon icon="fluent:full-screen-maximize-16-regular" size="16"
                    class="xt-text-2" /></xt-button>
        </template>
        <slot v-if="defaultType.value==='custom'" name="custom"></slot>
        <slot v-else name="exterior"></slot>
    </xt-modal>
</template>

<script setup lang='ts'>
import { ref, reactive,watch } from 'vue'
import HorizontalPanelVue from '../../../HorizontalPanel.vue';
const emit = defineEmits(['setQuick'])
const setQuick = () => {
    emit('setQuick')
}
const modelValue = ref(true)
const navList = ref([{ title: '属性',value:'custom' }, { title: '外观',value:"exterior" }])
const defaultType = ref({ title: '属性',value:'custom' })
</script>
<style lang='scss' scoped></style>