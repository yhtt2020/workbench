<script setup lang="ts"></script>

<template>
  <xt-option-box>
    <div class="flex text-sm mb-[15px] justify-between items-center">
      <div>允许应用获取地理位置信息</div>
      <a-switch />
    </div>
  </xt-option-box>
  <xt-option-box>
    <div class="flex text-sm mb-4 justify-between">
      <div>允许应用读取和写入「备忘录应用」数据</div>
      <a-switch />
    </div>
    <hr />
    <div class="flex text-sm mb-4 justify-between">
      <div>允许应用读取和写入「待办应用」数据</div>
      <a-switch />
    </div>
    <hr />
    <div class="flex text-sm mb-4 justify-between">
      <div>允许应用读取和写入「快捷指令」数据</div>
      <a-switch />
    </div>
  </xt-option-box>
</template>
<style lang="scss" scoped></style>
