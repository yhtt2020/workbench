<template>
  <div class="main" style="text-align: center;padding-top: 3em">
    <BackBtn></BackBtn>
    <div class="btn">关机</div>
    <div class="btn">注销</div>
    <br/>
    <div class="btn">重启</div>
    <div class="btn">休眠</div>
  </div>

</template>

<script>
import BackBtn from '../components/comp/BackBtn.vue'

export default {
  name: 'Poweroff',
  components: { BackBtn }
}
</script>

<style scoped>
.btn{
  display: inline-block;
  border-radius: 100%;
  color: white;
  width: 3.2em;
  height: 3.2em;
  line-height: 3.2em;
  text-align: center;
  font-size: 3.5em;
  background: rgba(0, 0, 0, 0.24);
  margin:1em
}
</style>
