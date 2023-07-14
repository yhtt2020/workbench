<template>
  <div class="flex flex-col h-full">
    <div
      class="flex-grow overflow-hidden h-full flex justify-between"
    >
      <XtTextarea
        placeholder="1"
        class="h-full w-full"
        style="width: 49%"
      ></XtTextarea>
      <div style="width: 49%">
        <!-- <XtTextarea placeholder="2" class="h-full w-full"></XtTextarea> -->
        <XtState
          class="xt-bg-2"
          state="null"
          :zoom="30"
          :text="{ null: '请在左侧输入框输入内容后点击「立即生成」按钮' }"
        ></XtState>
      </div>
    </div>
  </div>
</template>

<script>
import { mapWritableState } from "pinia";
import { aiStore } from "../../../../store/ai";
export default {
  computed: {
    ...mapWritableState(aiStore, ["isUseModel"]),
  },
  components: {
  },
};
</script>

<style lang="scss" scoped></style>
