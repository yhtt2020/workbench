<template>
<SupervisorySlot :options="options">
  <div class="top-content">
    <div><span>64℃</span><span>CPU温度</span></div>
    <div><span>1200R</span><span>风扇转速</span></div>
    <div><span>41%</span><span>磁盘占用</span></div>
  </div>
  <div style="width: 95%;height: 1px;background: #ACACAC;transform: scaleY(0.2);margin: 0 auto"></div>
  <div class="title">
    <Icon icon="neicun" class="icon"></Icon><span>内存</span>
    <span>50%</span>
   </div>
  <div class="list">
    <div>
      <Icon icon="yingyongzhongxin" class="icon"></Icon>
      <span>Photoshop</span>
      <span>23GB</span>
    </div>
    <div>
      <Icon icon="yingyongzhongxin" class="icon"></Icon>
      <span>Photoshop</span>
      <span>23GB</span>
    </div>
    <div>
      <Icon icon="yingyongzhongxin" class="icon"></Icon>
      <span>Photoshop</span>
      <span>23GB</span>
    </div>
    <div>
      <Icon icon="yingyongzhongxin" class="icon"></Icon>
      <span>Photoshop</span>
      <span>23GB</span>
    </div>
    <div>
      <Icon icon="yingyongzhongxin" class="icon"></Icon>
      <span>Photoshop</span>
      <span>23GB</span>
    </div>
  </div>
</SupervisorySlot>
</template>

<script>
import SupervisorySlot from "./SupervisorySlot.vue";
export default {
  name: "InternalList",
  data(){
    return {
      options:{
        className:'card',
        title:'性能',
        icon:'xingneng'
      },
    }
  },

  components:{
    SupervisorySlot
  }
}
</script>

<style lang="scss" scoped>
.top-content{
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  >div{
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    width: 6em;
    height: 6em;
    padding: .5em 0;

    span:first-child{
      font-weight: 600;
      font-size: 1.5em;
    }
    span:last-child{
      color: #ACACAC;
    }
  }
}
.title{
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 1em;
    margin-top: .5em;
  span{
    margin-left: .5em;
  }
  span:last-child{
    color: #FAAD14;
    font-weight: 700;
  }
}
.list{
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 70%;
  >div{
    height: 3em;
    background: #2B2B2B;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 1em;
    span:nth-child(2){
      margin-right: 6em;
    }
    span:nth-child(3){
      font-weight: 700;
    }
  }
}
.icon{
  height: 2em;
  width: 2em;
}
</style>
