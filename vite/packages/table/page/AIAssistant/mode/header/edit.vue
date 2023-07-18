<template>
  <div class="flex flex-col">
    <XtInput
      v-model:data="search"
      style="width: 400px; height: 48px"
      class="my-4"
      placeholder="请输入名称"
    ></XtInput>
    <XtTextarea
      style="height: 160px"
      placeholder="请输入描述"
      v-model:data="text"
    ></XtTextarea>
  </div>
  <div class="flex justify-center mt-3">
    <div class="xt-btn mr-3"  style="width: 120px; height: 48px">取消</div>
    <div class="xt-active-btn" style="width: 120px; height: 48px">
      创建并使用
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      text: "",
    };
  },
};
</script>

<style lang="scss" scoped></style>
