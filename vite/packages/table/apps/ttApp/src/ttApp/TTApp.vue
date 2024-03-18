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

const registerCard = (id) => {
  useRegisterCard({
    id,
  });
};
</script>

<template>
  <xt-modal v-model="test" @close="onClose">
    <div
      v-for="item in ttappList"
      :key="item.id"
      @click="registerCard(item.id)"
    >
      {{ item }}
    </div>
  </xt-modal>
</template>
<style lang="scss" scoped></style>
./register/card
