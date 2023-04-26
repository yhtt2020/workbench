<template>
<div class="fixed inset-0 home-blur" style="z-index: 999999999999999999999999999999999999" @click="closeModal">
  <div class="s-bg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl" >
    <slot></slot>
  </div>
</div>
</template>

<script>
export default {
  name: "Modal",
  props:[ 'visibility'],
  methods:{
    closeModal(){
      this.$emit('update:visibility',false)
    }
  }
}
</script>

<style scoped>

</style>
