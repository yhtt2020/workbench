<template>
<SupervisorySlot :options="options">
  <div class="top-content">
    <div><span>70%</span>
      <span>
      <Icon icon="CPU" class="icon"></Icon>CPU</span></div>

    <div style="margin-left: 13px"><span>99%</span>
      <span>
      <Icon icon="CPU" class="icon"></Icon>GPU</span></div>

    <div><span>50%</span>
      <span>
      <Icon icon="neicun" class="icon"></Icon>内存</span></div>

    <div style="margin-left: 13px"><span>166</span>
      <span>
      <Icon icon="youxishoubing" class="icon"></Icon>FPS</span></div>
    <div>
      <div>
        <Icon icon="xiazai" class="icon" style="color: #5CBBFF;"></Icon>
        <span>下载</span>
        <span>12.7MB/S</span></div>

     <div> <Icon icon="shangchuan" class="icon" style="color: #52C41A;"></Icon>
       <span>上传</span>
       <span>34.1KB/S</span>
     </div>
   </div>
  </div>
</SupervisorySlot>
</template>

<script>
import SupervisorySlot from "./SupervisorySlot.vue";
export default {
  name: "CPUFourCard",
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
  flex-wrap: wrap;
  height: 95%;
  width: 100%;
  align-items: center;

  div{
    width: calc((100% - 13px) / 2);
    margin-top: 13px;
    height: 120.5px;
    background: #2B2B2B;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 5%;
    >span{
      display: flex;
      align-items: center;
    }
    >span:first-child{
      font-size: 2.5em;
      font-weight: 700;
    }
  }
  >div:last-child{
    height: 6em;
    width: 18em;
    border-radius: 5%;
    >div{
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      align-items: center;
      width: 100%;
      margin: 0;

      >span:nth-child(2){
        margin-right: 8em;
      }
    }
  }.icon{
     width: 1.5em;
     height: 1.5em;
  margin-right: .5em;
   }
}

</style>
