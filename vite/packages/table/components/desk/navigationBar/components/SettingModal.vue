<template>
    <xt-modal :modelValue="modelValue" :mask="false" :index="100" :header="true" :footer="false" :back="false" :full="true"
        @no="setQuick">
        <template #header-center>
            <HorizontalPanelVue :navList="navList" v-model:selectType="defaultType" :height="32"
                :itemStyle="{ 'border-radius': '6px !important' }" />
        </template>
        <div class="flex justify-center">
            <!-- 属性插槽 -->
            <slot v-if="defaultType.value === 'custom'" name="custom"></slot>
            <!-- 外观插槽 -->
            <slot v-else name="exterior"></slot>
        </div>

    </xt-modal>
</template>

<script setup lang='ts'>
import { ref, reactive, watch } from 'vue'
import HorizontalPanelVue from '../../../HorizontalPanel.vue';
const emit = defineEmits(['setQuick'])
const setQuick = () => {
    emit('setQuick')
}
const modelValue = ref(true)
const navList = ref([{ title: '属性', value: 'custom' }, { title: '外观', value: "exterior" }])
const defaultType = ref({ title: '属性', value: 'custom' })
</script>
<style lang='scss' scoped></style>