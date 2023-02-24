<template>
  <div class="card" >
    <div class="title"><Icon icon="douban" style="height: 1.3em;width: 1.3em;margin-right: 0.1em"></Icon> 豆瓣FM</div>
    <div style="text-align: center;padding:3em;position:relative;">
      <div class="play-wrapper">
        <Icon icon="bofang" class="play-btn"></Icon>
      </div>
      <a-avatar :size="100" src=""></a-avatar>
    </div>
    <a-row :gutter="10">
      <a-col :span="12">
        <div class="sub-card">
          我喜欢<br>
          <Icon icon="xin" style="width: 3em;height:3em;margin-top: 1em"></Icon>
        </div>
      </a-col>
      <a-col :span="12">
        <div class="sub-card">
          歌单<br>
          <Icon icon="zicaidan" style="width: 3em;height:3em;margin-top: 1em"></Icon>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'Dou',
  data(){
    return{
      status:'pause',
    }
  },
  methods:{
  }
}
</script>

<style scoped lang="scss">
.play-btn{
  width: 5em;height:5em;margin-top: -0.8em;margin-left: 0.3em
}
.play-wrapper{
  &:hover{
    .play-btn{
      color: #e3e3e3;
    }
    background: rgb(0 0 0 / 50%);
   }

  cursor: pointer;
  position: absolute;
  inset: 0;
  z-index: 9;
  padding-top: 2em;
  background: rgb(0 0 0 / 62%);
  border-radius: 100em;
  width: 100px;
  height: 100px;
  top: 3em;
  left: 76px;
  text-align: center;
}
</style>
