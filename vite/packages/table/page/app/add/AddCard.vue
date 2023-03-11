<template>
  <div class="title" style="height: 6em; width: 12em">
    <Icon
      style="
        width: 5em;
        height: 5em;
        margin-right: 10px;
        vertical-align: middle;
      "
      icon="shezhi1"
    ></Icon>
    <span>添加小卡片</span>
  </div>
  <div class="content">
    <div
      class="card item"
      style="
        height: 12em;
        width: 12em;
        margin-bottom: 1em;
        padding: 1em;
        margin: 1em;cursor:pointer
      "
      v-for="item in cardList"
      :key="item.name"
      @click="addAssembly(item)"
    >
      <Icon
        style="
          width: 5em;
          height: 5em;

          vertical-align: middle;
        "
        :icon="item.icon"
      ></Icon>
      {{ item.cname }}
    </div>
  </div>
<!--  <CardDetail :cardType="cardType" v-if="show" @onBack="onBack"></CardDetail>-->
</template>

<script>
import { mapActions } from "pinia";
import { tableStore } from "../../../store";
import CardDetail from "./CardDetail.vue";
export default {
  name: "AddCard",
  components:{CardDetail},
  data() {
    return {
      cardList: [
        { name: "calendar", cname: "日历", icon: "rili3",detail:"追踪当月日期，查看临近节日" },
        { name: "countdownDay", cname: "倒数日", icon: "rili2",detail:"设置你的纪念日、考试日等等" },
        { name: "clock", cname: "闹钟", icon: "naozhong",detail:"设置你的闹钟" },
      ],
      cardType:{},
      show:false
    };
  },

  mounted() {},

  methods: {
    ...mapActions(tableStore, ["addCustomComponents"]),
    addAssembly(item) {
      switch (item.name) {
        case "calendar":
          this.cardType=this.cardList[0];
          this.addCustomComponents(item.name);
          this.$router.push({
            name: "home",
            params: {
              name: item.name,
              cname: item.cname,
            },
          });
          break;
        case "countdownDay":
          this.cardType=this.cardList[1];
          this.$router.push({
            name: "addCardSetting",
            params: {
              name: item.name,
              cname: item.cname,
            },
          });
          break;
        case "clock":
          this.cardType=this.cardList[2];
          this.$router.push({
            name: "addCardSetting",
            params: {
              name: item.name,
              cname: item.cname,
            },
          });
          break;
      }
      this.show=true;
    },
    onBack(){
      this.show=false;
    }
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 20px;
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
</style>
