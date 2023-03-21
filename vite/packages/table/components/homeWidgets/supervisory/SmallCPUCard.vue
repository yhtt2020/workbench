<template>
  <SupervisorySlot :options="options">
    <div class="content">
      <div><a-progress type="circle" stroke-linecap="square" stroke-color="#FF9C00" :percent="75" strokeWidth="8">
        <template #format="percent">
            <div style="color:#E0E0E0;font-weight: 700">75%</div>
            <div style="color:#ACACAC;font-size: .5em;margin-top: 1em">负载</div>
        </template>
      </a-progress>
      </div>
      <div>
        <div class="cpu" style="margin-top: .5em">
        <div class="cpu-number">
          <span>温度</span>
          <span style="font-weight:700">43℃</span></div>
      </div>
        <a-progress :showInfo="false" status="active" :percent="43" :stroke-color="{
        '0%': '#60BFFF',
        '100%': '#348FFF',
      }"/>

        <div class="cpu" style="margin-top: .5em">
          <div class="cpu-number">
            <span>内存</span>
            <span style="font-weight:700">40%</span></div>
        </div>
        <a-progress :showInfo="false" status="active" :percent="40" :stroke-color="{
        '0%': '#60BFFF',
        '100%': '#348FFF',
      }"/>

        <div>CPU</div>
        <a-progress :showInfo="false" status="active" :percent="40" :stroke-color="{
        '0%': '#60BFFF',
        '100%': '#348FFF',
      }"/>

      </div>
    </div>
  </SupervisorySlot>
</template>

<script>
import SupervisorySlot from "./SupervisorySlot.vue";
export default {
  name: "SmallCPUCard",
  data(){
    return {
      options:{
        className:'card small',
        title:'i9-13900KS',
        icon:'xingneng'
      },
    }
  },

  components:{
    SupervisorySlot
  }
}
</script>

<style lang="scss" scoped>
.content{
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  div:first-child{
    flex: 1;
  }
  div:last-child{
    flex: 1;
  }
}
.cpu{
  display: flex;
  .cpu-number{
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

  }
}
</style>
