<template>
    <xt-modal :modelValue="modelValue" :mask="false" :index="100" :header="true" :footer="false" :back="false" :full="true"
        @no="setQuick">
        <template #header-center>
            <!-- <HorizontalPanelVue :navList="navList" v-model:selectType="defaultType" :height="32"
                :itemStyle="{ 'border-radius': '6px !important' }" /> -->
                <xt-tab
                    v-model="currentTab"
                    :list="navList"
                    style="width: 168px"
                    class="p-1 xt-bg-t-2"
                    :boxStyle="{ 'border-radius': '10px' }"
                    :itemStyle="{ 'border-radius': '6px' }"
                />
        </template>
        <div class="flex justify-center">
            <!-- 属性插槽 -->
            <slot v-if="currentTab === 'custom'" name="custom"></slot>
            <!-- 外观插槽 -->
            <slot v-else name="exterior"></slot>
        </div>

    </xt-modal>
</template>

<script setup lang='ts'>
import { ref, reactive, watch } from 'vue'
const emit = defineEmits(['setQuick'])
const setQuick = () => {
    emit('setQuick')
}
const modelValue = ref(true)
const navList = ref([{ name: '属性', value: 'custom' }, { name: '外观', value: "exterior" }])
const currentTab = ref('custom')
</script>
<style lang='scss' scoped></style>