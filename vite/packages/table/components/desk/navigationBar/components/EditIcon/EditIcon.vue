<template>
    <!-- <div class="w-[500px]"> -->
    <xt-modal :modelValue="modelValue" :mask="false" :index="100" :header="true" :footer="false" :back="false"
        @no="setQuick">
        <template #header-center>
            <HorizontalPanelVue :navList="navList" v-model:selectType="defaultType" :height="32" />
        </template>
        <template #header-right>
            <xt-button :w="32" :h="32"><xt-new-icon icon="fluent:full-screen-maximize-16-regular" size="16"
                    class="xt-text-2" /></xt-button>
        </template>
        <div>
            <!-- <Custom /> -->
            <CustomBg />
            <!-- <CoolApp /> -->
            <!-- <Common /> -->
        </div>

    </xt-modal>
    <!-- </div> -->
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import HorizontalPanelVue from '../../../../HorizontalPanel.vue';
import Custom from './Children/Custom.vue';
import CustomBg from './Children/CustomBg.vue';
import Common from './Children/Common.vue';
import CoolApp from './Children/CoolApp.vue';
const emit = defineEmits(['setQuick'])
const setQuick = () => {
    emit('setQuick')
}
const modelValue = ref(true)
const navList = ref([{ title: '属性' }, { title: '外观' }])
const defaultType = ref({ title: '属性' })


</script>
<style lang='scss' scoped></style>