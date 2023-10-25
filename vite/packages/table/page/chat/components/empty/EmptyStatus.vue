<template>
 <a-empty :image="simpleImage" :description="text"  />
</template>

<script>
export default {
  props:['text'],
  data(){
   return{
    simpleImage:'/img/state/null.png'
   }
  }
}
</script>

<style lang="scss" scoped>

</style>