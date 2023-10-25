<template>
  <Widget :options="options" :customIndex="customIndex" :desk="desk">
    <div
    class="content"
    v-if="myCountdownDay.length <= 0"
  >
    <div style="text-align: center; ">暂无纪念日</div>
    <a-empty :description="null" :image="simpleImage" style="margin: 15px;" />
      <div class="item-content">
        <xt-button size="mini" :w="100" :h="40"   @click="onSetup">立即添加</xt-button>
      </div>

  </div>
    <div class="content"  v-else>
    <div
      style="
        text-align: center;
        display: flex;
        font-size: 1.2em;
        max-width: 80%;
        margin: 0 auto;
      "
    >
      距离「
      <span class="text-more"  style="flex: 1">{{
          myCountdownDay[0].eventValue
        }}</span
      >」<span v-if="myCountdownDay[0].type">还有</span>
      <span v-else>已过</span>
    </div>
    <div style="font-size: 3em; margin-top: 0.1em">
      {{
        differenceDay
      }}天
    </div>
    <div style="font-size: 1.5em; margin-top: 0.5em">
      {{ myCountdownDay[0].dateValue.year }}年{{
        myCountdownDay[0].dateValue.month
      }}月{{ myCountdownDay[0].dateValue.day }}日
    </div>
  </div>
  </Widget>
  <a-drawer :width="500" v-model:visible="settingVisible" placement="right">
    <template #title>
      <div class="text-center"> 纪念日设置</div>
    </template>
    <div>
      <div>事件名称</div>
      <a-input class="rounded-lg  h-10 mt-4 xt-text" v-model:value="eventValue" placeholder="请输入"/>
      <div class="mt-4">日期</div>
      <a-date-picker v-model:value="dateValue" class="mt-4"/>
      <div class="flex flex-row items-center w-full justify-center mt-4">
        <div class="rounded-lg h-10 w-24 flex justify-center items-center mr-4 pointer" style="background:var(--primary-bg) ;color: var(--primary-text);"  @click="closeSettingVisible">取消</div>
        <div class="rounded-lg h-10 w-24 flex justify-center items-center pointer" style="background:var(--primary-bg) ;color: var(--primary-text);" @click="addEvent">确定添加</div>
      </div>
    </div>
  </a-drawer>
</template>

<script>
import {Empty, message} from "ant-design-vue";
import {mapActions, mapWritableState} from "pinia";
import { cardStore } from "../../store/card";
import { transDate } from "../../../../src/util/dateTime";
import Widget from "../card/Widget.vue";
import {timeStamp} from "../../util";
import { timerStore } from '../../store/timer'
import XtButton from '../../ui/libs/Button/index.vue'
export default {
  name: "SmallCountdownDay",
  props:{
    customIndex:{
      type:Number,
      default:0
    },
    desk:{
      type:Object
    }
  },
  components:{ XtButton, Widget},
  data() {
    return {
      simpleImage: '/public/img/test/load-ail.png',
      visible:false,
      myCountdownDay:[],
      options:{
        className:'card small',
        title:'',
        icon:'',
        type:'smallCountDownDay'
      },
      eventValue: "",
      dateValue: null,
      settingVisible:false
    };
  },
  created() {
   this.selectMy()
  },
  computed: {
    ...mapWritableState(cardStore, [ "countdownDay"]),
    ...mapWritableState(timerStore,['appDate']),
    differenceDay(){
      return  transDate(
        this.appDate.year + "-" +this.appDate.month + "-" + this.appDate.day,
        this.myCountdownDay[0].dateValue.year +
        "-" +
        this.myCountdownDay[0].dateValue.month +
        "-" +
        this.myCountdownDay[0].dateValue.day
      )
    },
  },
  methods: { transDate,
    ...mapActions(cardStore, ["removeCountdownDay",'addCountdownDay','sortCountdown']),
    onSetup(){
    this.settingVisible = true
    },
    selectMy(){
      this.myCountdownDay= this.countdownDay.filter(i => {
        return i.customIndex==this.customIndex})
    },
    closeSettingVisible(){
    this.settingVisible  = false
    },
    addEvent(){
      if (this.eventValue === "" || this.dateValue === null) {
        message.info("不可为空！");
        return
      }
      this.addCountdownDay({
        eventValue: this.eventValue,
        dateValue: timeStamp(this.dateValue.valueOf()),
        customIndex:this.customIndex
      });
      this.eventValue = ""
      this.dateValue = null
      message.info("添加成功！");
      this.selectMy()
      this.settingVisible  = false
    }
    },

  mounted() {
      this.sortCountdown()
  },
};
</script>

<style scoped lang="scss">

:deep(.ant-empty-image){
  height: 60px;
}
</style>
