<template>
  <div>
    <div>
      <div style="overflow-x: visible">
        <div class="card-wrapper">
          <!--          <Dou></Dou>-->
          <Music></Music>
          <div
            style="
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              width: 21em;
              white-space: pre-wrap;
              vertical-align: text-top;
              height: 30em;
            "
          >
            <Timer></Timer>
            <Weather></Weather>
          </div>

          <div v-for="(item,index) in customComponents">
            <component :is="item" :customIndex="index"></component>
          </div>
<!--          <vuuri  :drag-enabled="false"  ref="grid"  class="grid"  item-key="id"-->
<!--                 :get-item-width="getIconSize" :get-item-height="getIconSize"-->
<!--                 v-model="customComponents"  >-->
<!--            <template #item="{ item }">-->
<!--            <component :is="item" :customIndex="index"></component>-->
<!--            </template>-->
<!--          </vuuri>-->
          <AddMore></AddMore>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Weather from "../components/homeWidgets/Weather.vue";
import Calendar from "../components/homeWidgets/Calendar.vue";
import Timer from "../components/homeWidgets/Timer.vue";
import Music from "../components/homeWidgets/Music.vue";
import Stock from "../components/homeWidgets/Stock.vue";
import AddMore from "../components/homeWidgets/AddMore.vue";
import Dou from "../components/homeWidgets/Dou.vue";
import CustomTimer from "../components/homeWidgets/CustomTimer.vue";
import SmallCountdownDay from "../components/homeWidgets/SmallCountdownDay.vue";
import Clock from "../components/homeWidgets/Clock.vue";
import CountdownDay from "../components/homeWidgets/CountdownDay.vue";
import { mapWritableState } from "pinia";
import { tableStore } from "../store";
import vuuri from '../components/vuuri/Vuuri.vue'
export default {
  name: "Home",
  components: {
    Dou,
    AddMore,
    Stock,
    Music,
    Calendar,
    Weather,
    Timer,
    CustomTimer,
    SmallCountdownDay,
    Clock,
    CountdownDay,
    vuuri
  },

  computed: {
    ...mapWritableState(tableStore, ["customComponents", "clockEvent"]),
  },
  mounted() {
    // console.log(localStorage.getItem("CountdownDay"));
    // if (
    //   this.appDate.minutes === this.ClockEvent[0].DateValue.minutes &&
    //   this.appDate.hours === this.ClockEvent[0].DateValue.hours
    // ) {
    //   this.visible = true;
    // }
  },
  methods: {
    getIconSize(){
      let width=80
      switch(this.settings.iconSize){
        case 'small':
          width=40
          break
        case 'middle':
          width=80
          break
        case 'large':
          width=160
          break
        default:
          width=80
      }
      return width +'px'
    },},
  watch:{
    "customComponents": {
      handler(newVal, oldVal) {
        try {
          this.$refs.grid.update()
        }catch (e) {

        }

      },
      deep: true,
      immediate: true,
    },
  }
};
</script>

<style scoped lang="scss">
.grid {
  position: relative;
  width: 18em;
  display: inline-block;
  background: rgba(204, 204, 204, 0.3);
  border: 5px solid transparent;
  border-radius: 4px;
  vertical-align: top;
  margin: 1em;
}

</style>
