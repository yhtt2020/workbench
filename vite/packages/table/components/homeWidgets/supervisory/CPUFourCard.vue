<template>
<HomeComponentSlot :options="options">
  <div class="top-content">
    <div><span>{{CPUGPUData.SCPUUTI.value}}%</span>
      <span>
      <Icon icon="cpu" class="icon" ></Icon>CPU</span>
    </div>

    <div>
      <span>{{CPUGPUData.SGPU1UTI.value}}%</span>
      <span>
      <Icon icon="xianka" class="icon"></Icon>GPU</span></div>

    <div>
      <span>{{CPUGPUData.SMEMUTI.value}}%</span>
      <span>
      <Icon icon="neicun" class="icon"></Icon>内存</span></div>

    <div style="position: relative">
      <span>{{CPUGPUData.SRTSSFPS.value}}</span>
      <a-tooltip v-if="CPUGPUData.SRTSSFPS.value==0" :arrowPointAtCenter="true">
      <template #title>需要游戏运行在前台且打开RTSS方可读取到</template>
      <Icon v-zoom icon="tishi-xianxing" style="height: 24px;width: 24px;position: absolute;top: 12px;right: 12px;color: orange;margin: 0"></Icon>
    </a-tooltip>
      <span>
      <Icon icon="game" class="icon"></Icon>
        <span>FPS
      </span>
       </span>
    </div>
    <div class="buttom" style="border-radius: 5px">
      <div>
        <div> <Icon icon="xiazai" class="icon" style="color: #5CBBFF;"></Icon>
          <span>下载</span></div>

        <span>{{lastDown}}</span>
      </div>

     <div>
       <div><Icon icon="shangchuan" class="icon" style="color: #52C41A;"></Icon>
         <span>上传</span></div>

       <span>{{lastUp}}</span>
     </div>
   </div>
  </div>
</HomeComponentSlot>
</template>

<script>
import {mapWritableState} from "pinia";
import {cardStore} from "../../../store/card";
import {filterObjKeys, netWorkDownUp} from "../../../util";
import HomeComponentSlot from "../HomeComponentSlot.vue";
export default {
  name: "CPUFourCard",
  data(){
    return {
      options:{
        className:'card',
        title:'性能',
        icon:'gaoxingneng',
        type:'CPUFourCard'
      },
      CPUGPUData:{
        SCPUUTI:{value:0},
        SGPU1UTI:{value:0},
        SMEMUTI:{value:0},
        SRTSSFPS:{value:0},
      },
      down:0,
      up:0
  }
  },
  // directives: {
  //   zoom: {
  //     created: (element) =>{
      //  element.getBoundingClientRectBak = element.getBoundingClientRect;
        // element.getBoundingClientRect = function () {
        //   const rect = element.getBoundingClientRectBak()
        //    var zoom = window.getComputedStyle(document.getElementById('scrollerBar')).zoom
        //   console.log(zoom)
        //   var scrollTop = document.getElementById('scrollerBar').getBoundingClientRect().top;
        //
        //   var scrollLeft = document.getElementById('scrollerBar').getBoundingClientRect().left;
        //   console.log(scrollLeft)
        //   var offsetScrollTop = scrollTop - (scrollTop / zoom);
        //   var offsetScrollLeft = scrollLeft - (scrollLeft / zoom);
        //   return new DOMRect(rect.x - offsetScrollLeft,rect.y - offsetScrollTop)
        // }
      //}
    //}
 // },
  components:{
    HomeComponentSlot
  },
  computed:{
    ...mapWritableState(cardStore, ["aidaData"]),
    lastDown(){
      return this.down < 1000 ? this.down +'KB/S' : this.down<1024000?(this.down/1024).toFixed(2) + 'MB/S':(this.down/1024/1024).toFixed(2) + 'GB/S'
    },
    lastUp(){
      return this.up < 1000 ? this.up +'KB/S' : this.up<1024000?(this.up/1024).toFixed(2) + 'MB/S':(this.up/1024/1024).toFixed(2) + 'GB/S'
    }
  },
  watch: {
    "aidaData": {
      handler(newVal, oldVal) {
        filterObjKeys(this.CPUGPUData,this.aidaData)
        const {down,up} =  netWorkDownUp(this.aidaData)
        this.down = down
        this.up = up
      },
      deep: true,
    },
  },
}
</script>

<style lang="scss" scoped>

.top-content{
  display: flex;
  flex-wrap: wrap;
  height: 95%;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  margin-top: 0px;

  >div{
    width: 120px;
    margin-top: 12px;
    height: 120px;
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
    height: 90px;
    width: 100%;



  }
  .icon{
       width: 20px;
       height:20px;
  margin-right: .5em;
   }
}
.buttom{
    display: flex;
    flex-direction: column;
  >div{
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content:space-between;
    align-items: center;
    height: 100%;
    padding: 0 10px;
    line-height: 100%;
    vertical-align: bottom;
    >div{
      display: flex;
      align-items: center;
    }
    >:nth-child(2){
      font-weight: 700;
    }

  }
}
</style>
