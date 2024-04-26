<template>
    <div>
        <xt-divider class="mx-auto" style="width: 90%" />
        <div class="w-full h-full text-sm text-center xt-text-2 items">工作台常用功能</div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'


// {
//       divider: true,
//       id: 10,
//     },
//     {
//       id: 11,
//       type: "systemApp",
//       newIcon: "fluent:lock-closed-16-regular",
//       name: "锁定屏幕",
//       event: "lock",
//       fn: () => {
//         this.newOpenApp(this.builtInFeatures[0]);
//       },
//     },
//     {
//       id: 15,
//       type: "systemApp",
//       newIcon: "fluent:settings-16-regular",
//       name: "基础设置",
//       event: "setting",
//       fn: () => {
//         this.newOpenApp(this.builtInFeatures[1]);
//       },
//     },
//     {
//       id: 20,
//       type: "systemApp",
//       newIcon: "fluent:full-screen-maximize-16-filled",
//       name: "全屏显示",
//       event: "fullscreen",
//       fn: () => {
//         this.newOpenApp(this.builtInFeatures[2]);
//       },
//     },
//     {
//       id: 25,
//       type: "systemApp",
//       newIcon: "fluent:slide-settings-24-regular",
//       name: "设备设置",
//       event: "status",
//       fn: () => {
//         this.newOpenApp(this.builtInFeatures[3]);
//       },
//     },
</script>
<style lang='scss' scoped>
.items {
  box-sizing: border-box;
  height: 40px;
  text-align: center;
  line-height: 40px;
}
</style>