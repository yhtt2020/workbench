<template>
  <div class="card  gradient gradient--14  content small" v-if="countDowntime.hours" style="display: flex;flex-direction: column;justify-content: space-between;background: var(--primary-bg);">
    <div class="right-title" @click.stop="showDrawer" @contextmenu.stop="showDrawer">
      <Icon icon="gengduo1" class="title-icon" style="cursor:pointer"></Icon>
    </div>
    <div style="text-align: center; font-size: 1.5em;color: var(--primary-text);">计时</div>
    <div style="color: #FBAE17;font-size: 4em;font-weight:bolder"> {{countDowntime.hours+":" +countDowntime.minutes+":"+countDowntime.seconds}}</div>
   <div style="display: flex;align-items: center;justify-content: space-between;padding: 0 6em;" >
     <Icon
       style="width: 3em; height: 3em;cursor:pointer;color: var(--primary-text);"
       icon="zanting"
       @click="closeCountDown" v-show="!countDownBtn"
     ></Icon>
     <Icon
       style="width: 3em; height: 3em;cursor:pointer;color: #FBAE17"
       icon="bofang"
       @click="startCountDown" v-show="countDownBtn"
     ></Icon>
     <Icon
       style="width: 2em; height: 2em;cursor:pointer;color: var(--primary-text);"
       icon="guanbi1"
       @click="deleteCountDown"
     ></Icon>
   </div>
  </div>
  <div class="card  gradient gradient--14 content small" v-else-if="clockEvent.length <= 0" style="color:var(--primary-text);background: var(--primary-bg);">
    <div class="right-title" @click.stop="showDrawer" @contextmenu.stop="showDrawer">
      <Icon icon="gengduo1" class="title-icon" style="cursor:pointer"></Icon>
    </div>
    <div style="text-align: center; margin-top: 1em">暂无闹钟</div>
    <a-empty :description="null" :image="simpleImage" />
    <a-button type="primary" style="background: var(--primary-bg);border: none;color:var(--primary-text)" @click="onSetup">立即添加</a-button>
  </div>
  <div class="card  gradient gradient--14 content small" v-else style="color:var(--primary-text);background: var(--primary-bg);">
    <div class="right-title" @click.stop="showDrawer" @contextmenu.stop="showDrawer">
      <Icon icon="gengduo1" class="title-icon" style="cursor:pointer"></Icon>
    </div>
    <div style="text-align: center; font-size: 1.5em">下一个闹钟</div>
    <div style="font-size: 3em; margin-top: 0.5em">
      {{ clockEvent[0].dateValue.hours }}:{{ clockEvent[0].dateValue.minutes }}
    </div>
    <div style="font-size: 1.5em; margin-top: 0.5em" class="text-more">
      {{ clockEvent[0].eventValue }}
    </div>
  </div>
  <a-drawer
    :contentWrapperStyle="{  backgroundColor:'#1F1F1F',height:'11em'}"
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
    <a-modal v-model:visible="custom" title="" @ok="()=>{}" :footer="null" style="font-size: 8px;color: var(--primary-text);" :maskClosable="false">
      <div style="display: flex;flex-direction: column;align-items: center;">
        <div style="">自定义倒计时</div>
        <a-space direction="vertical" style="margin: 14px"  :popupStyle="{zIndex:9999999999999}">
          <a-time-picker v-model:value="value1" size="large" :popupStyle="{zIndex:9999999999999}"/>
        </a-space>
        <a-button type="primary" @click="addCustom" style="margin: 14px">开始倒计时</a-button>
      </div>
    </a-modal>
</template>

<script>
import { Empty } from "ant-design-vue";
import { mapWritableState,mapActions } from "pinia";
import {countDownStore} from "../../store/countDown";
import {cardStore} from "../../store/card"
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
    ...mapWritableState(cardStore, ["appDate", "clockEvent"]),
    ...mapWritableState(countDownStore, ["countDowndate","countDowntime","countDownBtn"]),
  },

  methods: {
    ...mapActions(cardStore, ["removeCustomComponents"]),
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
.content {
  position: relative;
  text-align: center;

  .title-icon {
    position: absolute;
    right: 1em;
    color: #818181;
      width: 24px;
      height: 24px;

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
