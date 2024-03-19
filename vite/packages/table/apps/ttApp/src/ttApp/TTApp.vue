<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRegisterCard } from "../register/card";
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

const registerCard = (id: string) => {
  useRegisterCard({
    id,
  });
};

const installTTApp = async (id: string) => {
  let path = await tsbApi.dialog.showOpenDialog({
    title: "选择",
    message: "请选择文件",
    multiple: "true",
    properties: ["openFile", "multiSelections"],
  });

  let res = tsbApi.ttapp.install(path[0], (data) => {
    console.log("data :>> ", data);
  });
  console.log("installTTApp res :>> ", res);
};
const uninstallTTApp = (id: string) => {
  tsbApi.ttapp.uninstall("SjjL", (data) => {
    console.log("data :>> ", data);
  });
};
const selectTTApp = (id: string) => {
  tsbApi.ttapp.select("SjjL", (data) => {
    console.log("data :>> ", data);
  });
};
const selectAllTTApp = (id: string) => {
  tsbApi.ttapp.selectAll((data) => {
    console.log("data :>> ", data);
  });
};
</script>

<template>
  <xt-modal v-model="test" @close="onClose">
    <div class="line"></div>
    <div
      v-for="item in ttappList"
      :key="item.id"
      @click="registerCard(item.id)"
    >
      {{ item }}

      <xt-button @click="installTTApp(item.id)" :w="140" :h="40" type="theme"
        >安装TTApp</xt-button
      >
      <xt-button @click="uninstallTTApp(item.id)" :w="140" :h="40" type="theme"
        >卸载TTApp</xt-button
      >
      <xt-button @click="selectTTApp(item.id)" :w="140" :h="40" type="theme"
        >查询TTApp</xt-button
      >
      <xt-button @click="selectAllTTApp(item.id)" :w="140" :h="40" type="theme"
        >查询所有TTApp</xt-button
      >
    </div>
  </xt-modal>
</template>
<style lang="scss" scoped></style>
./register/card
