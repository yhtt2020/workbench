<template>
  <Widget :sizeList="sizeList" :options="options" :customIndex="customIndex" :menuList="formulaBar" ref="cardSlot">
    <div class="content" style="display: flex;flex-direction: column;justify-content: space-between;padding: 0;align-items: center" v-if="countdownDay.length <= 0">
    <a-empty :description="null" :image="simpleImage" />
    <a-button type="primary" style="background: #676767;border: none;width: 40%" @click="onSetup">立即添加</a-button>
    </div>
    <div class="content  mt-1 " style="height: calc(100% - 20px);overflow: hidden;" v-else>
    <div style="padding-top: 0.2em">


    <div
      class="event-list px-4 mb-3 s-item" style="background: var(--primary-bg);"
      v-for="(item) in countdownDay"
    >
      <div class="flex flex-row items-center">
        <div class="round-dot mr-4"></div>
      <div class="event-title">
        <span class="text-more w-28" style="color: var(--primary-text);font-size: 16px">{{ item.eventValue }}</span>
        <span class="event" style="color:var(--primary-text);font-size: 12px;"
        >{{ item.dateValue.year }}/{{ item.dateValue.month }}/{{
            item.dateValue.day
          }}</span
        >
      </div>
      </div>
      <span
      style="color:var(--primary-text);font-size: 18px;"><span v-if="item.type">还有</span>
        <span v-else>已过</span> {{
          differenceDay(item)
        }} 天</span
      >
    </div>    </div>
  </div>
  </Widget>
  <a-drawer :width="500" v-model:visible="settingVisible" placement="right" @close="()=>{this.goAddFlag = false}">
    <template #title>
      <div class="text-center">纪念日设置</div>
    </template>
      <div v-if="!goAddFlag">
        已设置的纪念日
        <div>
          <vue-custom-scrollbar
            :settings="outerSettings"
            style="position: relative; height: calc(100vh - 15em);margin-top: 10px"
            class="scroll"
          >
            <div
              class="event-list px-4 mb-3 s-item"
              style="background: rgba(42, 42, 42, 1);"
              v-for="(item,index) in countdownDay"
            >
              <a-dropdown :trigger="['contextmenu']" class="w-full">
                <div class="flex flex-row justify-between items-center">
              <div class="flex flex-row items-center">
                <div class="round-dot mr-4"></div>
                <div class="event-title">
                  <span class="text-more" style="color: rgba(255, 255, 255, 0.85);font-size: 16px;">{{ item.eventValue }}</span>
                  <span class="event" style="color: rgba(255, 255, 255, 0.4);font-size: 12px;"
                  >{{ item.dateValue.year }}/{{ item.dateValue.month }}/{{
                      item.dateValue.day
                    }}</span
                  >
                </div>
              </div>
              <span
                style="color: rgba(255, 255, 255, 0.85);font-size: 18px;"><span v-if="item.type">还有</span>
        <span v-else>已过</span> {{
                  differenceDay(item)
                }} 天</span
              ></div>
              <template #overlay>
                <a-menu @click="(e) => onContextMenuClick(e, index)">
                  <a-menu-item key="1">删除</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
            </div>
           </vue-custom-scrollbar
          >
        </div>
        <div class="flex flex-row items-center w-full justify-center mt-4">
          <div class="rounded-lg h-10 w-24 flex justify-center items-center mr-4 pointer" style="background: rgba(42, 42, 42, 1);" @click="closeDrawer">取消</div>
          <div class="rounded-lg h-10 w-24 flex justify-center items-center pointer" style="background: rgba(42, 42, 42, 1);" @click="goAddEvent">添加事件</div>
        </div>
      </div>
    <div v-else>
      <div>事件名称</div>
      <a-input class="rounded-lg  h-10 mt-4 " v-model:value="eventValue" placeholder="请输入"/>
      <div class="mt-4">日期</div>
      <a-date-picker v-model:value="dateValue" class="mt-4"/>
      <div class="flex flex-row items-center w-full justify-center mt-4">
        <div class="rounded-lg h-10 w-24 flex justify-center items-center mr-4 pointer" style="background: rgba(42, 42, 42, 1);" @click="()=>{this.goAddFlag = false}">取消</div>
        <div class="rounded-lg h-10 w-24 flex justify-center items-center pointer" style="background: rgba(42, 42, 42, 1);" @click="addEvent">确定添加</div>
      </div>
    </div>
  </a-drawer>

<!--  <a-drawer-->
<!--    :contentWrapperStyle="{ padding:10,marginLeft:'2.5%',-->
<!--    backgroundColor:'#1F1F1F',width: '95%',height:'11em',borderRadius:'5%'}"-->
<!--    :width="120"-->
<!--    :height="120"-->
<!--    class="drawer"-->
<!--    :closable="false"-->
<!--    placement="bottom"-->
<!--    :visible="visible"-->
<!--    @close="onClose"-->
<!--  >-->
<!--    <div style="display: flex;flex-direction: row;height: 100%"><div class="option" style="margin: 0" @click="onSetup"><Icon-->
<!--      style="-->
<!--        width: 3em;-->
<!--        height: 3em;-->
<!--        vertical-align: middle;-->
<!--      "-->
<!--      icon="shezhi1"-->
<!--    ></Icon>设置</div>-->
<!--      <div class="option" @click="removeCountdownDay"><Icon-->
<!--        style="-->
<!--        width: 3em;-->
<!--        height: 3em;-->
<!--        vertical-align: middle;-->
<!--      "-->
<!--        icon="guanbi2"-->
<!--      ></Icon>删除</div></div>-->

<!--  </a-drawer>-->
</template>

<script>
import {mapActions, mapWritableState} from "pinia";
import { cardStore } from "../../store/card";
import { transDate } from "../../../../src/util/dateTime";
import Widget from "../card/Widget.vue";
import {message} from "ant-design-vue";
import {timeStamp} from "../../util";
export default {
  name: "CountdownDay",
  props:{
    customIndex:{
      type:Number,
      default:0
    },
    customData:{
      type:Object,
      default:()=>{}
    }
  },
  components:{
    Widget
  },

  data() {
    return {
      outerSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true,
      },
      eventValue: "",
      sizeList:[{title:'1x1',height:1,width:1,name:'1x1'},{title:'1x2',height:2,width:1,name:'1x2'},],
      dateValue: null,
      options:{
        className:'card small',
        title:'纪念日',
        icon:'calendar-check',
        type:'countdownDay'
      },
      menuList:[{icon:'shezhi1',title:'设置',fn:()=>{this.settingVisible = true;this.$refs.cardSlot.visible = false}},],
      settingVisible:false,
      status: "pause",
      value: null,
      visible:false,
      goAddFlag:false
    };
  },
  computed: {
    ...mapWritableState(cardStore, ["appDate", "countdownDay"]),
  },
  mounted() {
      this.sortCountdown()
  },
  methods: {
    ...mapActions(cardStore, ["removeCountdownDay",'addCountdownDay','sortCountdown']),
    onPanelChange(value, mode) {},
    transDate,
    differenceDay(item){
      return  transDate(
        this.appDate.year + "-" +this.appDate.month + "-" + this.appDate.day,
        item.dateValue.year +
        "-" +
        item.dateValue.month +
        "-" +
        item.dateValue.day
      )
    },
    closeDrawer(){
      this.goAddFlag=false
      this.settingVisible = false;
    },
    onSetup(){
      this.$router.push({
        name: "addCardSetting",
        params: {
          name: 'countdownDay',
          cname: '纪念日',
        },
      });
    },

    onContextMenuClick(e, index) {
      this.removeCountdownDay(index);
    },
    goAddEvent(){
      this.goAddFlag = true
    },
    addEvent(){
        if (this.eventValue === "" || this.dateValue === null) {
            message.info("不可为空！");
         return
        }
        this.goAddFlag=false
        this.addCountdownDay({
          eventValue: this.eventValue,
          dateValue: timeStamp(this.dateValue.valueOf()),
          customIndex:this.customIndex
        });
      this.eventValue = ""
      this.dateValue = null
        message.info("添加成功！");
    }
  },
};
</script>

<style scoped lang="scss">
.content {
  position: relative;

  .title-icon {
    position: absolute;
    right: 1em;
    top: 1em;
  }
}
.event-list {
  width: 100%;
  display: flex;
  padding: 9px 16px 9px 12px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.4em;
  border-radius: 12px;
}
.event-title {
  display: flex;
  flex-direction: column;
  overflow: hidden; //文本超出隐藏
  text-overflow: ellipsis;
  text-align: left;

  .event {
    padding: 0;
    margin: 0;
    font-size: 0.8em;
    color: #6a6a6a;
  }
}

</style>
