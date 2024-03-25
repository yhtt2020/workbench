<template>
 <a-drawer v-model:visible="leftVisible" placement="left" class="no-drag">
  <slot></slot>
 </a-drawer>
</template>

<script>
export default {
 name:'TopPanelLeftDrawer',
 data(){
  return{
   leftVisible:false,
  }
 },

 methods:{
  openLeftDrawer(){
   this.leftVisible = true
  }
 }
};
</script>

<style lang="scss" scoped>
</style>