<template>
  <div class="top-title drag">
    <div class="left-title pointer no-drag" @click="onBack">
    <Icon icon="xiangzuo"></Icon>
    <span>返回</span>
    </div>
    <a-input v-model:value="selectContent" class="no-drag" placeholder="搜索" @change="select" style="height: 100%;border-radius: 10px;width:400px;background: #363738">
      <template #prefix>
        <Icon icon="sousuo"></Icon>
      </template>
    </a-input>
  </div>
  <vue-custom-scrollbar key="scrollbar" id="addScroll"  :settings="scrollbarSettings"
                        style="position:relative;  border-radius: 8px;height: calc(100vh - 8em)">
  <CardPreview :cardType="item"   v-for="item in filterList"></CardPreview>
  </vue-custom-scrollbar>
</template>

<script>
import { mapActions } from "pinia";
import { tableStore } from "../../../store";
import CardPreview from "./CardPreview.vue";
export default {
  name: "AddCard",
  components:{CardPreview},
  data() {
    return {
      cardList: [
        { name: "customTimer", cname: "日历", icon: "rili3",detail:"追踪当月日期，查看临近节日" ,images:['customTimer']},
        { name: "countdownDay", cname: "倒数日", icon: "rili2",detail:"设置你的纪念日、考试日等等" ,images:['countdownDay','smallCountdownDay']},
        { name: "clock", cname: "闹钟", icon: "naozhong",detail:"设置你的闹钟",images:['clock'] },
        { name: "supervisory", cname: "性能", icon: "xingneng",detail:'监控系统状态，查看游戏帧数',images:['CPULineChart','CPUFourCard','SmallCPUCard','SmallGPUCard']},
        { name: "music", cname: "网易云", icon: "naozhong",detail:"快捷播放，我的喜欢，我的歌单",images:['music'] },
        { name: "timer", cname: "番茄钟", icon: "naozhong",detail:"快速开启番茄钟时刻，记录每天专注成果",images:['timer'] },
        { name: "weather", cname: "天气", icon: "naozhong",detail:"查看某地当前的天气状况和预报",images:['weather'] },

      ],
      cardType:{},
      show:false,
      scrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true,
        currentItemId: -1,
        timer: null
      },
      selectContent:null,
      filterList:[
        { name: "customTimer", cname: "日历", icon: "rili3",detail:"追踪当月日期，查看临近节日" ,images:['customTimer']},
        { name: "countdownDay", cname: "倒数日", icon: "rili2",detail:"设置你的纪念日、考试日等等" ,images:['countdownDay','smallCountdownDay']},
        { name: "clock", cname: "闹钟", icon: "naozhong",detail:"设置你的闹钟",images:['clock'] },
        { name: "supervisory", cname: "性能", icon: "xingneng",detail:'监控系统状态，查看游戏帧数',images:['CPULineChart','CPUFourCard','SmallCPUCard','SmallGPUCard']},
        { name: "music", cname: "网易云", icon: "naozhong",detail:"快捷播放，我的喜欢，我的歌单",images:['music'] },
        { name: "timer", cname: "番茄钟", icon: "naozhong",detail:"快速开启番茄钟时刻，记录每天专注成果",images:['timer'] },
        { name: "weather", cname: "天气", icon: "naozhong",detail:"查看某地当前的天气状况和预报",images:['weather'] },

      ]
    };
  },

  mounted() {},

  methods: {
    ...mapActions(tableStore, ["addCustomComponents"]),
    addAssembly(item) {
      switch (item.name) {
        case "customTimer":
          this.cardType=this.cardList[0];
          break;
        case "countdownDay":
          this.cardType=this.cardList[1];
          break;
        case "clock":
          this.cardType=this.cardList[2];
          break;
        case "supervisory":
          this.cardType=this.cardList[3];
          break;
      }
      this.show=true;
    },
    onBack(){

      this.$emit('setCustom',false)
    },
    select(){
      console.log(this.selectContent)
    this.filterList = this.cardList.filter(i =>{
      return i.cname.includes(this.selectContent)
    })
    }
  },
};
</script>

<style lang="scss" scoped>
:deep(.lg .ant-modal-body) {
  font-size: 0em;
}
#addScroll{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
    margin-top: 10px;
    margin-left: -20px;

}
.top-title{
  display: flex;
  align-items: center;
  margin-top: 20px;
  margin-left: 20px;
  height: 40px;
  width: calc(50vw + 200px);
  justify-content: space-between;
  .left-title{
    width: 80px;
    border-radius: 5px;
    background:#363738;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    height: 100%;
  }
}
.content {
  display: flex;
  flex-direction: row;
}
.item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.input-box {
  height: 2em;
  border-radius: 100px;
  border: 1px solid #c4c4c4;
}
</style>
