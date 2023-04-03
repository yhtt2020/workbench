<template>
  <HomeComponentSlot :options="options" :customIndex="customIndex">
    <div
    class="content"
    v-if="myCountdownDay.length <= 0"
  >
    <div style="text-align: center; ">暂无倒数日</div>
    <a-empty :description="null" :image="simpleImage" style="margin: 15px;" />
    <a-button type="primary" style="background: #676767;border: none" @click="onSetup">立即添加</a-button>
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
      >」还有
    </div>
    <div style="font-size: 3em; margin-top: 0.1em">
      {{
        transDate(
          appDate.year + "-" + appDate.month + "-" + appDate.day,
          myCountdownDay[0].dateValue.year +
          "-" +
          myCountdownDay[0].dateValue.month +
          "-" +
          myCountdownDay[0].dateValue.day
        )
      }}天
    </div>
    <div style="font-size: 1.5em; margin-top: 0.5em">
      {{ myCountdownDay[0].dateValue.year }}年{{
        myCountdownDay[0].dateValue.month
      }}月{{ myCountdownDay[0].dateValue.day }}日
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

<!--      <div class="option" @click="removeClock"><Icon-->
<!--        style="-->
<!--        width: 3em;-->
<!--        height: 3em;-->
<!--        vertical-align: middle;-->
<!--      "-->
<!--        icon="guanbi2"-->
<!--      ></Icon>删除</div>-->

<!--  </a-drawer>-->
</template>

<script>
import { Empty } from "ant-design-vue";
import {mapActions, mapWritableState} from "pinia";
import { tableStore } from "../../store";
import { transDate } from "../../../../src/util/dateTime";
import HomeComponentSlot from "./HomeComponentSlot.vue";
export default {
  name: "SmallCountdownDay",
  props:{
    customIndex:{
      type:Number,
      default:0
    }
  },
  components:{HomeComponentSlot},
  data() {
    return {
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      visible:false,
      myCountdownDay:{},
      options:{
        className:'card small',
        title:'',
        icon:'',
        type:'smallCountDownDay'
      },
    };
  },
  created() {
   this.myCountdownDay= this.countdownDay.filter(i => {
    return i.customIndex==this.customIndex})

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
          customIndex:this.customIndex
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


</style>
