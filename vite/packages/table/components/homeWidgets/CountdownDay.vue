<template>
  <HomeComponentSlot :options="options" :customIndex="customIndex">
    <div class="content" style="display: flex;flex-direction: column;justify-content: space-between;padding: 0;align-items: center" v-if="countdownDay.length <= 0">
    <a-empty :description="null" :image="simpleImage" />
    <a-button type="primary" style="background: #676767;border: none;width: 40%" @click="onSetup">立即添加</a-button>
    </div>
    <div class="content  mt-2" v-else>
    <div style="padding-top: 0.2em">


    <div
      class="event-list px-4 mb-3 s-item"
      v-for="(item) in countdownDay.slice(0, 2)"
    >
      <div class="flex flex-row items-center">
        <div class="round-dot mr-4"></div>
      <div class="event-title">
        <span class="text-more" style="color: rgba(255, 255, 255, 0.85);font-size: 16px">{{ item.eventValue }}</span>
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
          transDate(
            appDate.year + "-" + appDate.month + "-" + appDate.day,
            item.dateValue.year +
            "-" +
            item.dateValue.month +
            "-" +
            item.dateValue.day
          )
        }} 天</span
      >
    </div>    </div>
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
import { cardStore } from "../../store/card";
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
        className:'card small',
        title:'倒数日',
        icon:'calendar-check',
        type:'countdownDay'
      },
      status: "pause",
      value: null,
      visible:false,
    };
  },
  computed: {
    ...mapWritableState(cardStore, ["appDate", "countdownDay"]),
  },
  methods: {
    ...mapActions(cardStore, ["removeCustomComponents"]),
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
