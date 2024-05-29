<template>
  <div class="w-full p-4 flex rounded-lg setting-card mb-4">
     <xt-ify-icon icon="fluent:info-12-filled" class="setting-icon mr-3" />
     <div class="flex flex-col flex-1">
        <span class="xt-font font-16 xt-text mb-2">当前组件数据将会存储在团队桌面中</span>
        <span class="xt-font xt-text-2 font-14">
         当前组件处于团队桌面中，相关设置会存储与桌面数据中，同时团队成员桌面会延用设置（成员无法访问和修改设置）；
         此处设置不会影响你的个人桌面。
        </span>
     </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.setting-card{
 background: var(--active-secondary-bg);
}
.setting-icon{
 color: var(--active-bg);
}
</style>