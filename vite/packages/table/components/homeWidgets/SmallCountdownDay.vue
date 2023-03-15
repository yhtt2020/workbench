<template>
  <div
    class="card content half"
    style="height: 14em; margin-bottom: 1em"
    v-if="countdownDay.length <= 0"
  >
    <Icon
      style="width: 1.5em; height: 1.5em;cursor:pointer;position: absolute;right: 0.5em"
      icon="gengduo1"
      class="title-icon"
      @click="showDrawer"
    ></Icon>
    <div style="text-align: center; margin-top: 1em">暂无倒数日</div>
    <a-empty :description="null" :image="simpleImage" />
    <a-button type="primary" style="background: #676767;border: none" @click="onSetup">立即添加</a-button>
  </div>
  <div class="card content half" style=" margin-bottom: 1em" v-else>
    <Icon
      style="width: 1.5em; height: 1.5em;cursor:pointer;position: absolute;right: 0.5em"
      icon="gengduo1"
      class="title-icon"
      @click="showDrawer"
    ></Icon>
    <div
      style="
        text-align: center;
        margin-top: 0.7em;
        display: flex;
        font-size: 1.5em;
      "
    >
      距离「
      <span class="text-more" style="flex: 1; width: 0">{{
        countdownDay[0].eventValue
      }}</span
      >」还有
    </div>
    <div style="font-size: 3em; margin-top: 0.1em">
      {{
        transDate(
          appDate.year + "-" + appDate.month + "-" + appDate.day,
          countdownDay[0].dateValue.year +
            "-" +
            countdownDay[0].dateValue.month +
            "-" +
            countdownDay[0].dateValue.day
        )
      }}天
    </div>
    <div style="font-size: 1.5em; margin-top: 0.5em">
      {{ countdownDay[0].dateValue.year }}年{{
        countdownDay[0].dateValue.month
      }}月{{ countdownDay[0].dateValue.day }}日
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
    <div style="display: flex;flex-direction: row;height: 100%"><div class="option" style="margin: 0" @click="onSetup"><Icon
      style="
        width: 3em;
        height: 3em;
        vertical-align: middle;
      "
      icon="shezhi1"
    ></Icon>设置</div>
      <div class="option" @click="removeClock"><Icon
        style="
        width: 3em;
        height: 3em;
        vertical-align: middle;
      "
        icon="guanbi2"
      ></Icon>删除</div></div>

  </a-drawer>
</template>

<script>
import { Empty } from "ant-design-vue";
import {mapActions, mapWritableState} from "pinia";
import { tableStore } from "../../store";
import { transDate } from "../../../../src/util/dateTime";
export default {
  name: "SmallCountdownDay",
  props:{
    customIndex:{
      type:Number,
      default:0
    }
  },
  data() {
    return {
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      visible:false
    };
  },
  computed: {
    ...mapWritableState(tableStore, ["appDate", "countdownDay"]),
  },
  methods: { transDate,
    ...mapActions(tableStore, ["removeCustomComponents"]),
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
          name: 'smallCountdownDay',
          cname: '倒数日',
        },
      });
    },
    removeClock(){
      this.removeCustomComponents(this.customIndex)
      this.visible = false;
    },

    },

  mounted() {

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
  }
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
  cursor:pointer
}
</style>
