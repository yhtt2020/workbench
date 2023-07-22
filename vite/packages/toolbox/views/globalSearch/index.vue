<template>
  <div style="width: 100%; height: 60px" class="xt-bg-2 flex items-center">
    <template v-if="useTool">
      <XtIcon
        class="ml-4"
        @click="go"
        icon="xiangzuo"
        type="theme"
        w="32"
        h="32"
        style="border-radius: 50%"
      ></XtIcon>
      <div class="xt-active-bg-2 xt-base-btn px-2 mx-4" style="height: 44px">
        <img
          :src="'/packages/toolbox/assets/images/' + useTool.img + '.png'"
          style="width: 32px; height: 32px"
          class="mr-2"
          alt=""
        />
        <div class="w-full flex flex-row">{{ useTool.name }}</div>
      </div>
    </template>
    <XtInput class="no-darg"></XtInput>
  </div>
</template>

<script>
import { mapWritableState } from "pinia";
import { useMainStore } from "../../store/main";
export default {
  computed: {
    ...mapWritableState(useMainStore, ["useTool"]),
  },
  methods: {
    go() {
      this.$router.push("/");
      this.useTool = "";
    },
  },
};
</script>

<style lang="scss" scoped></style>
