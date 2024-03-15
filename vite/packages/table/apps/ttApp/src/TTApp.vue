ttappList
<script setup lang="ts">
import { ref, onMounted } from "vue";
const test = ref(true);
const emits = defineEmits(["close"]);
const onClose = () => {
  emits("close");
  test.value = false;
};

const ttappList = ref<Object[]>([]);

onMounted(() => {
  tsbApi.ttapp.selectAll((data) => {
    console.log("data :>> ", data);
    ttappList.value = data.data;
  });
});
</script>

<template>
  <xt-modal v-model="test" @close="onClose">
    {{ ttappList }}
    <div></div>
  </xt-modal>
</template>
<style lang="scss" scoped></style>
