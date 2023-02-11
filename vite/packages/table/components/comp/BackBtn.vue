<template>
  <div class="back-btn">
    <Icon icon="#icon-xiangzuo" @click="click" style="font-size: 4em"></Icon>
  </div>
</template>

<script>
export default {
  name: 'BackBtn',
  props:['onClick'],
  mounted () {

  },methods:{
    click(){
      if(!this.onClick){
        this.$router.go(-1)
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
  position: fixed;
  left: 2em;
  top: 2em;


  &:hover {
    background: rgba(0, 0, 0, 0.2);
    color: white;
  }
}
</style>
