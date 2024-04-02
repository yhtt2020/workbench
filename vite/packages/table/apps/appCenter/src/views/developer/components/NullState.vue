<script setup lang="ts">
import Install from "./Install.vue";
</script>

<template>
  <div class="w-full h-full flex justify-center items-center flex-col">
    <div class="text-sm mb-4 flex flex-col  items-center" style="width: 456px">
      <xt-ify-icon icon="fluent-emoji:alembic" size="56" class=" mb-4"/>
      天天工作台提供了供开发者使用调试的开放平台，你可以导入自己开发的应用，在此处进行调试运行，后续我们将开放应用市场功能，届时所有工作台用户都可以使用你的应用，
    </div>
    <Install />
  </div>
</template>
<style lang="scss" scoped></style>
