<template>
  <div class="card  content small" v-if="countDowntime.hours" style="display: flex;flex-direction: column;justify-content: space-between;">
    <Icon
      style="width: 1.5em; height: 1.5em;cursor:pointer"
      icon="gengduo1"
      class="title-icon"
      @click="showDrawer"
    ></Icon>
    <div style="text-align: center; font-size: 1.5em">计时</div>
    <div style="color: #FBAE17;font-size: 4em;font-weight:bolder"> {{countDowntime.hours+":" +countDowntime.minutes+":"+countDowntime.seconds}}</div>
   <div style="display: flex;align-items: center;justify-content: space-between;padding: 0 6em;" >
     <Icon
       style="width: 3em; height: 3em;cursor:pointer;color: #FBAE17"
       icon="zanting"
       @click="closeCountDown" v-show="!countDownBtn"
     ></Icon>
     <Icon
       style="width: 3em; height: 3em;cursor:pointer;color: #FBAE17"
       icon="bofang"
       @click="startCountDown" v-show="countDownBtn"
     ></Icon>
     <Icon
       style="width: 2em; height: 2em;cursor:pointer"
       icon="guanbi1"
       @click="deleteCountDown"
     ></Icon>
   </div>
  </div>
  <div class="card content small" v-else-if="clockEvent.length <= 0">
      <Icon
        style="width: 1.5em; height: 1.5em;cursor:pointer"
        icon="gengduo1"
        class="title-icon"
        @click="showDrawer"
      ></Icon>
    <div style="text-align: center; margin-top: 1em">暂无闹钟</div>
    <a-empty :description="null" :image="simpleImage" />
    <a-button type="primary" style="background: #676767;border: none" @click="onSetup">立即添加</a-button>
  </div>
  <div class="card content small" v-else>
    <Icon
      style="width: 1.5em; height: 1.5em;cursor:pointer"
      icon="gengduo1"
      class="title-icon"
      @click="showDrawer"
    ></Icon>
    <div style="text-align: center; font-size: 1.5em">下一个闹钟</div>
    <div style="font-size: 3em; margin-top: 0.5em">
      {{ clockEvent[0].dateValue.hours }}:{{ clockEvent[0].dateValue.minutes }}
    </div>
    <div style="font-size: 1.5em; margin-top: 0.5em" class="text-more">
      {{ clockEvent[0].eventValue }}
    </div>
  </div>
  <a-drawer
    :contentWrapperStyle="{ padding:10,marginLeft:'2.5%',
    backgroundColor:'#1F1F1F',width: '95%',height:'11em',borderRadius:'5%'}"
    :width="120"
    :height="120"
    class="drawer"
    :closable="false"
    placement="bottom"
    :visible="visible"
    @close="onClose"
  >
    <div style="display: flex;flex-direction: row;height: 100%">
      <div class="option" style="margin: 0" @click="onCountDown(3)"><Icon
        class="icon"
        icon="shijian3dian"
      ></Icon>3分钟</div>
      <div class="option" @click="onCountDown(10)"><Icon
        class="icon"
        icon="shijian3dian"
      ></Icon>10分钟</div>
      <div class="option"  @click="onCountDown(30)"><Icon
        class="icon"
        icon="shijian3dian"
      ></Icon>30分钟</div>
      <div class="option"  @click="onCountDown(300)"><Icon
        class="icon"
        icon="shijian3dian"
      ></Icon>自定义</div>
      <div class="option" @click="onSetup"><Icon
        class="icon"
      icon="shezhi1"
    ></Icon>设置</div>
      <div class="option" @click="removeClock"><Icon
        class="icon"
        icon="guanbi2"
      ></Icon>删除
       </div>
    </div>
  </a-drawer>
    <a-modal v-model:visible="custom" title="" @ok="handleOk" :footer="null" style="font-size: 8px" :maskClosable="false">
      <div style="display: flex;flex-direction: column;align-items: center">
        <div style="color: white;">自定义倒计时</div>
        <a-space direction="vertical" style="margin: 14px">
          <a-time-picker v-model:value="value1" size="large" />
        </a-space>
        <a-button type="primary" @click="addCustom" style="margin: 14px">开始倒计时</a-button>
      </div>
    </a-modal>
</template>

<script>
import { Empty } from "ant-design-vue";
import { mapWritableState,mapActions } from "pinia";
import {countDownStore, tableStore} from "../../store";
import dayjs from 'dayjs';
export default {
  name: "Clock",
  props:{
    customIndex:{
      type:Number,
      default:0
    }
  },
  data() {
    return {
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      visible:false,
      value1:dayjs('00:00:00', 'HH:mm'),
      custom:false
    };
  },
  computed: {
    ...mapWritableState(tableStore, ["appDate", "clockEvent"]),
    ...mapWritableState(countDownStore, ["countDowndate","countDowntime","countDownBtn"]),
  },

  methods: {
    ...mapActions(tableStore, ["removeCustomComponents"]),
    ...mapActions(countDownStore,["setCountDown","stopCountDown","openCountDown","dCountDown"]),
    onContextMenuClick(e) {

    },
    showDrawer()  {
      this.visible = true;
    },
     onClose() {
     this.visible = false;
    },
    onSetup(){
      this.$router.push({
        name: "addCardSetting",
        params: {
          name: 'clock',
          cname: '闹钟',
        },
      });
    },
    removeClock(){
      this.removeCustomComponents(this.customIndex)
      this.dCountDown()
      this.visible = false;
    },
    onCountDown(value){
    switch (value){
      case 3:this.setCountDown({hours:0,minutes:3,seconds:0});break;
      case 10:this.setCountDown({hours:0,minutes:10,seconds:0});break;
      case 30:this.setCountDown({hours:0,minutes:30,seconds:0});break;
      case 300:this.custom=true;break;
    }
      this.visible = false;
      this.countDownBtn=false;
    },closeCountDown(){

      this.stopCountDown();

    },
    startCountDown(){

      this.openCountDown();

    },
    deleteCountDown(){
      this.dCountDown()
    },
    closeCustom(){
      this.custom=false;
    },
    addCustom(){
      this.setCountDown({hours:parseFloat(this.value1.$H),minutes:parseFloat(this.value1.$m),seconds:parseFloat(this.value1.$s)});
      this.custom=false;
    }
  },

};
</script>

<style scoped lang="scss">
.card{
  max-height:30em;
  border-radius: 8px;
  vertical-align: text-top;

  width: 20em;
  min-width: 20em;
  display: inline-block;
  height: 420px;
  padding: 10px 13px .5em 13px ;
  margin-right: 14px;
  position: relative;
  &.small{
    height: 203px;
    margin-bottom: 14px;
  }
}
.content {
  position: relative;
  text-align: center;

  .title-icon {
    position: absolute;
    right: 1em;
  }

}
.ant-dropdown-open {
  border-radius: 100%;
}
[ant-click-animating-without-extra-node='true']::after, .ant-click-animating-node{
 background:#676767 ;
  box-shadow: #676767;
  animation: none
}
.drawer{
  margin: 10em;
}
.option{
  background: #161616;
  width: 8em;
  height:100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10%;
  margin-left: 1.8em;
  cursor:pointer;
  .icon{
    width: 3em;
    height: 3em;
    vertical-align: middle;
  }
}
.custom{
  background: #6a6a6a;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4em 0;
  align-items: center;
  position: fixed;
  top: 20%;
  left: 35%;

  width: 30%;

  border-radius: 10%;
  z-index: 999;
}
</style>
