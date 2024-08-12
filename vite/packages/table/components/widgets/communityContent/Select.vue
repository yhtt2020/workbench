<template>
    <a-select
        :zIndex="( 9999999 + 10 )"
        v-model:value="currentMultiple"
        mode="multiple"
        show-search
        style="width: 100%; padding: 0 !important"
        class="rounded-xl"
        :options="list"
        :filter-option="filterOption"
        @change="handleChange"
        :dropdownStyle="{zIndex: 9999999 + 10}">
    </a-select>
</template>
<script lang="ts" setup>
import { ref, watch,onMounted } from 'vue';
const filterOption =(input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}
const handleChange = (value: string[]) => {
    console.log(`selected ${value}`);
}
interface multipleProps {
    multiple: any;
    list: any;
}
const props = withDefaults(defineProps<multipleProps>(), {});

const currentMultiple = ref(props.multiple);
const list = ref(props.list)
const emits = defineEmits(["update:multiple", "cb"]);

watch(currentMultiple, () => {
    emits("update:multiple", currentMultiple.value);
    emits("cb", currentMultiple.value);
});
onMounted(()=>{
    list.value = list.value.map((item)=>{
        return {
            value:item.value,
            label:item.name,
        }
    })
})
</script>
<style scoped>
:deep(.ant-select-selection-item) {
    background: var(--secondary-bg) !important;
    background: none;
    width: 96px;
    height: 28px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-radius: 8px !important;
}

/* anticon-close */
:deep(.anticon) {
    font-size: 16px;
    color: var(--secondary-text);
}

:deep(.ant-select-selector) {
    padding-bottom: 0 !important;
    background: var(--secondary-transp-bg) !important;
    border-radius: 8px !important;
    min-height: 40px;
}
</style>
