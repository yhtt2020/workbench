<template>
  <div>
    <div class="flex flex-col items-center h-full" style="width: 60px">
      <xt-icon
        v-bind="modelValue[0]"
        w="40"
        size="18"
        @click="iconClick(0)"
        class="xt-b"
      ></xt-icon>
      <div class="my-3 xt-bm w-full"></div>
      <div class="xt-scrollbar h-full w-full"></div>
      <div>
        <div
          v-for="item in modelValue.slice(-1 * end)"
          v-bind="modelValue[0]"
          w="40"
          size="18"
          @click="iconClick(0)"
          class="xt-b"
        >
          {{ item }} , {{ end * -1 }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const end = 2;
const modelValue = [
  {
    icon: "message",
  },

  {
    icon: "message",
  },
  {
    icon: "message",
  },
  {
    icon: "message",
  },
];
const iconClick = (item) => {
  console.log("item :>> ", item);
};
</script>

<style lang="scss" scoped></style>
