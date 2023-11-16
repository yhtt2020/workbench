<template>
  <div></div>
</template>

<script>
export default {

  data(){
    return{
      settingsScroller: {
       useBothWheelAxes: true,
       swipeEasing: true,
       suppressScrollY: false,
       suppressScrollX: true,
       wheelPropagation: true
      },
      searchKeyWord:'',
      
    }
  }

};
</script>

<style lang="scss" scoped>
.select-bg {
  background: var(--active-secondary-bg) !important;
  border: 1px solid var(--active-bg) !important;
}
:deep(.ant-input) {
  font-size: 1.15em;
  &::placeholder {
    color: var(--secondary-text) !important;
  }
  color: var(--secondary-text) !important;
}
</style>