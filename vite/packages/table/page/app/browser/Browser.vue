<template>
<router-view></router-view>
</template>

<script>

</script>

<style scoped lang="scss">
.app-btn {
  display: inline-block;
  cursor: pointer;

  &:hover .btn-wrapper {
    color: #1e1e1e;
    background: #969696;
  }
}

.btn-wrapper {
  font-size: 1.2em;
  border-radius: 0.5em;
  padding: 0.4em 0.8em;
  margin: 0.3em 0.4em;
}

.scale {
  display: inline-block;
  width: 3em;
  font-weight: bold;
}
</style>
