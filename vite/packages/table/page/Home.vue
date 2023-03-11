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

          <Calendar></Calendar>
          <!--          <Stock></Stock>-->
          <!--         <AddMore></AddMore>-->
          <Stock></Stock>
          <CustomTimer
            v-if="customComponents.includes('calendar')"
          ></CustomTimer>
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
            v-if="
              customComponents.includes('countdownDay小') ||
              customComponents.includes('clock')
            "
          >
            <SmallCountdownDay
              style="height: 50%"
              v-if="customComponents.includes('countdownDay小')"
            ></SmallCountdownDay>
            <Clock
              v-if="customComponents.includes('clock')"
              style="height: 50%"
            ></Clock>
          </div>
          <CountdownDay
            v-if="customComponents.includes('countdownDay大')"
          ></CountdownDay>

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

  methods: {},
};
</script>

<style scoped lang="scss">


</style>
