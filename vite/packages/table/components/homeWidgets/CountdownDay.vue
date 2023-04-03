<template>
  <HomeComponentSlot :options="options" :customIndex="customIndex">
    <div class="content" style="display: flex;flex-direction: column;justify-content: space-between;padding: 8em 0;align-items: center" v-if="countdownDay.length <= 0">
    <a-empty :description="null" :image="simpleImage" />
    <a-button type="primary" style="background: #676767;border: none;width: 40%" @click="onSetup">立即添加</a-button>
    </div>
    <div class="content" v-else>
    <div style="border-bottom: 1px solid #777777">

    </div>
    <div
      class="event-list"
      v-for="item in countdownDay.slice(0, 6)"
      style="background-color: #3b3b3b"
    >
      <div class="event-title">
        <span class="text-more">{{ item.eventValue }}</span>
        <span class="event"
        >{{ item.dateValue.year }}年{{ item.dateValue.month }}月{{
            item.dateValue.day
          }}日</span
        >
      </div>
      <span
      >{{
          transDate(
            appDate.year + "-" + appDate.month + "-" + appDate.day,
            item.dateValue.year +
            "-" +
            item.dateValue.month +
            "-" +
            item.dateValue.day
          )
        }}天</span
      >
    </div>
  </div>
  </HomeComponentSlot>


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
import { tableStore } from "../../store";
import { transDate } from "../../../../src/util/dateTime";
import HomeComponentSlot from "./HomeComponentSlot.vue";
export default {
  name: "CountdownDay",
  props:{
    customIndex:{
      type:Number,
      default:0
    }
  },
  components:{
    HomeComponentSlot
  },
  data() {
    return {
      options:{
        className:'card',
        title:'倒数日',
        icon:'rili2',
        type:'countdownDay'
      },
      status: "pause",
      value: null,
      visible:false,
    };
  },
  computed: {
    ...mapWritableState(tableStore, ["appDate", "countdownDay"]),
  },
  methods: {
    ...mapActions(tableStore, ["removeCustomComponents"]),
    onPanelChange(value, mode) {},
    transDate,
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
          name: 'countdownDay',
          cname: '倒数日',
        },
      });
    },
    removeCountdownDay(){
      this.removeCustomComponents(this.customIndex)
      this.visible = false;
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
  padding: 0.2em 0.5em;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  margin-top: 0.7em;
}
.event-title {
  display: flex;
  flex-direction: column;
  overflow: hidden; //文本超出隐藏
  text-overflow: ellipsis;

  .event {
    padding: 0;
    margin: 0;
    font-size: 0.8em;
    color: #6a6a6a;
  }
}.option{
   background: #161616;
   width: 8em;
   height:100%;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   border-radius: 10%;
   margin-left: 1.8em;
   cursor:pointer
 }
</style>
