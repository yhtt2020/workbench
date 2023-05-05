<template>
  <a-badge status="success" color="#52c41a" :numberStyle="{width:'30px'}"></a-badge>
</template>

<script>
export default {
  name: 'OnlineTag'
}
</script>

<style scoped lang="scss">
:deep(.ant-badge-status-dot) {

  width: 10px !important;
  height: 10px;

}
</style>
