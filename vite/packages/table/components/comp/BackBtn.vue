<template>
  <div class="back-btn" @click="click">
    <Icon icon="xiangzuo"  style="font-size: 2em"></Icon>
  </div>
</template>

<script>
export default {
  name: 'BackBtn',
  props:['onClick'],
  emits:['click'],
  mounted () {

  },methods:{
    click(){
      if(!this.onClick){
        this.$router.go(-1)
        this.$emit('click')
      }else{
        this.$emit('click')
        this.onClick()
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
