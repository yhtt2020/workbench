<template>
  <xt-tab
    class="p-1 xt-bg-t-2"
    style="height: 40px"
    v-bind="option"
    name="name"
    v-model="currentTab"
  />
  <div class="pb-3"></div>
</template>

<script setup lang="ts">
import { ref ,watch} from "vue";
export interface tabProps {
  option?: any;
  tab?: any;
}
const props = withDefaults(defineProps<tabProps>(), {});

const currentTab = ref(props.tab);
const emits = defineEmits(["update:tab"]);

watch(currentTab, () => {
  emits("update:tab", currentTab.value);
});
</script>

<style lang="scss" scoped></style>
