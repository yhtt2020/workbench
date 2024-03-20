<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRegisterCard } from "../register";
import { useInstallTTApp, useSelect, useSelectAll } from "../hooks";
import Builder from "../builder";
import { useTTAppStore } from "../store";
import { storeToRefs } from "pinia";
const ttappStore: any = useTTAppStore();

const { ttappList } = storeToRefs(ttappStore);

const test = ref(true);
const emits = defineEmits(["close"]);
const onClose = () => {
  emits("close");
  test.value = false;
};
onMounted(() => {
  ttappStore.init();
});

const registerCard = (id: string) => {
  useRegisterCard({
    id,
  });
};

const installTTApp = async () => {
  let res = await useInstallTTApp();
  ttappStore.selectAll();
  console.log("res :>> ", res);
};

const uninstallTTApp = async (id: string) => {
  ttappStore.uninstall(id);
};
const selectTTApp = async (id: string) => {
  const res = await useSelect(id);
  console.log("res :>> ", res);
};
const selectAllTTApp = async () => {
  const res = await useSelectAll();
  console.log("res :>> ", res);
};
</script>

<template>
  <xt-modal v-model="test" @close="onClose">
    <Builder />
    <div class="line">
      <xt-button @click="installTTApp()" :w="140" :h="40" type="theme"
        >安装TTApp</xt-button
      >
      <xt-button @click="selectAllTTApp()" :w="140" :h="40" type="theme"
        >查询所有TTApp</xt-button
      >
    </div>
    <div v-for="item in ttappList" :key="item.id">
      <div @click="registerCard(item.id)">
        {{ item }}
      </div>
      <xt-button @click="uninstallTTApp(item.id)" :w="140" :h="40" type="theme"
        >卸载TTApp</xt-button
      >
      <xt-button @click="selectTTApp(item.id)" :w="140" :h="40" type="theme"
        >查询TTApp</xt-button
      >
    </div>
  </xt-modal>
</template>
<style lang="scss" scoped></style>
