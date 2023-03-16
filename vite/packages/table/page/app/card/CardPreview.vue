<template>
  <div class="mask">
    <a-card style="width: 60%" class="card-content">
      <a-button type="primary" style="background: transparent;border: none;position: absolute;top: 1%;right: 3%;font-size: 2em" @click="onBack">x</a-button>
      <div>{{cardType.cname}}</div>
      <div>{{cardType.detail}}</div>
      <div class="card" style="height: auto;margin:0">
        <img v-if="cardType.name==='countdownDay'" src="../../../static/countdownDay.png" style="width: 100%;height: 100%" alt="">
        <img v-if="cardType.name==='customTimer'" src="../../../static/customTimer.png" style="width: 100%;height: 100%" alt="">
        <img v-if="cardType.name==='clock'" src="../../../static/clock.png" style="width: 100%;height: 100%" alt="">
        <img v-if="cardType.name==='smallCountdownDay'" src="../../../static/smallCountdownDay.png" style="width: 100%;height: 100%" alt="">
      </div>
      <a-button type="primary" style="background: #2266D1;border: none" class="btn" @click="addCard()">添加</a-button>
    </a-card>
  </div>

</template>

<script>
import {mapActions} from "pinia";
import {tableStore} from "../../../store";
import { message } from "ant-design-vue";
export default {
  name: "CardPreview",
  props:{
    cardType:{
      type:Object,
      default:()=>{}
    }
  },
  mounted() {

  },
  methods:{
    ...mapActions(tableStore, ["addCustomComponents"]),
    onBack(){
      this.$emit("onBack")
        this.show=true;
      },
    addCard(){
      switch (this.cardType.name) {
        case "customTimer":
          this.addCustomComponents({name:this.cardType.name});
          this.$router.push({
            name: "home",
            params: {
              name: this.cardType.name,
              cname: this.cardType.cname,
            },
          });
          message.info("添加成功！");
          break;
        case "countdownDay":
          this.addCustomComponents({name:this.cardType.name});
          this.$router.push({
            name: "addCardSetting",
            params: {
              name: this.cardType.name,
              cname: this.cardType.cname,
            },
          });
          break;
        case "smallCountdownDay":
          this.addCustomComponents({name:this.cardType.name});
          this.$router.push({
            name: "addCardSetting",
            params: {
              name: this.cardType.name,
              cname: "倒数日",
            },
          });
          break;
        case "clock":
          this.addCustomComponents({name:this.cardType.name});
          this.$router.push({
            name: "addCardSetting",
            params: {
              name: this.cardType.name,
              cname: this.cardType.cname,
            },
          });
          break;
      }
    }
    }

}
</script>

<style lang="scss" scoped>
.mask{
  background-color: rgba(0,0,0,0.7);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

.card-content {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-60%);
  display: flex;
  justify-content: center;
  text-align: center;
  perspective:1200px;
  .btn{
    position: absolute;
    bottom: 1em;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    width: 10%;
    line-height: 10%;

  }
}
}
:deep(.ant-picker-date-panel) {
  background: #363739;
}
:deep(.ant-picker-calendar-date-value) {
  border-radius: 100%;

  &:hover {
    background: red;
    border-radius: 100%;
  }
}
:deep(.ant-picker-cell-selected) {
  background: #363739;
}
:deep(
    .ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner
  ) {
  background: red;
  border-radius: 100%;
}
:deep(.ant-picker-cell .ant-picker-cell-inner) {
  border-radius: 100%;
}
.title {
  background: #363739;
}

:deep(
    .ant-picker-cell-in-view.ant-picker-cell-today
      .ant-picker-cell-inner::before
  ) {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  border: 1px solid red;
  border-radius: 100%;
  content: "";
}
 .cartoon{

   animation-name: example;
   animation-duration: 4s;
   animation-iteration-count: infinite;
}
@keyframes example {
  0% {transform:scale(0.8) rotate3d(1,1,0,0deg) }
  25% {transform:scale(0.8) rotate3d(1,1,0,20deg) }
  50% {transform:scale(0.8) rotate3d(1,1,0,0deg)}
  75% {transform:scale(0.8) rotate3d(-1,-1,0,20deg) }
  100% {transform:scale(0.8) rotate3d(1,1,0,0deg) }
}
</style>
