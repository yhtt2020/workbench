<!-- 社群设置中成员申请页面 -->
<template>
  <template v-for="elItem in 40">
    <div class="px-4 py-2 flex w-full justify-between rounded-xl member-item">
      <div class="flex items-center">
        <div class="flex w-8 h-8 mr-4 items-center justify-center">
          <a-avatar
            shape="circle"
            :size="32"
            src="https://up.apps.vip/avatar/013.png"
          />
        </div>
        <div class="flex flex-col">
          <span class="xt-font font-16 font-400 xt-text">Edith Turner</span>
          <span class="xt-font font-14 font-400 xt-text-2">Team小队成员</span>
        </div>
      </div>

      <div class="flex items-center">
        <xt-button w="64" h="40" class="mr-3" @click="handleRejectApply">拒绝</xt-button>
        <xt-button w="64" h="40" style="background: var(--active-secondary-bg) !important;" @click="handleAcceptApply">
          <span class="xt-theme-text">同意</span>
        </xt-button>
      </div>
    </div>
  </template>
</template>

<script setup>
/**拒绝申请**/
const handleRejectApply = () => {};
/**同意申请**/
const handleAcceptApply = () => {};
</script>

<style lang="scss" scoped>
</style>