<template>
  <xt-modal
    v-model="deskAppVisible"
    custom
    boxClass="rounded-xl"
    :maskIndex="850"
    :index="860" 
  >
    <div style="width: 1000px;">测试</div>
  </xt-modal>
</template>

<script setup>
import { ref, getCurrentInstance, computed } from "vue";
import { storeToRefs } from "pinia";

const deskAppVisible = ref(false);

const openDeskApp = () => {
 deskAppVisible.value = true;
};

defineExpose({
 openDeskApp,
})
</script>

<style lang="scss" scoped>
</style>