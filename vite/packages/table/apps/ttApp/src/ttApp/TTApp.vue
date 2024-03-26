<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRegisterCard } from "../register";
import { useInstallTTApp, useSelect, useSelectAll } from "../hooks";
import Builder from "../builder";
import { useTTAppStore } from "../store";
import { storeToRefs } from "pinia";
const ttappStore: any = useTTAppStore();

const { ttappList }: any = storeToRefs(ttappStore);

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

const uninstallTTApp = async (id: string) => {
  ttappStore.uninstall(id);
};
const selectTTApp = async (id: string) => {
  const res = await ttappStore.select(id);
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
    <div class="xt-theme-b w-[542px] flex h-[184px]" style="">
      <div class="flex relative h-full w-[180px] ">
        <div class="xt-theme-b w-[180px] h-[126px]" style=""></div>
        <div class="flex absolute" style="bottom: 4px; left: 4px">
          <div class="" style="width: 20px; height: 20px"></div>
          <div class="">应用名称</div>
        </div>
      </div>
      <div class="px-4 py-3.5" style="">
        <div>123312</div>
        <div>describe</div>
      </div>
    </div>
    <div class="line">
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
