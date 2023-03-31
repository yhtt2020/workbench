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
.back-btn {
  padding: 0.8em;
  background: rgba(0, 0, 0, 0.3);
  display: inline-block;
  border-radius: 0.5em;
  position: absolute;
  left: 2em;
  top: 2em;
  z-index: 999;
  cursor: pointer;
  &:hover {
    background: rgba(0, 0, 0, 0.2);
    color: white;
  }
}
</style>
