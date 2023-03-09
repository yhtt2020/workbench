<template>
  <div>
    <div>
      <div style="overflow-x: visible">
        <div class="card-wrapper">
          <Dou></Dou>
          <Music></Music>
          <div
            style="
              display: inline-block;
              width: 21em;
              white-space: pre-wrap;
              vertical-align: text-top;
            "
          >
            <Timer></Timer>
            <Weather></Weather>
          </div>
          <!--
          <Calendar></Calendar> -->
          <Stock></Stock>
          <CustomTimer
            v-if="customComponents.includes('Calendar')"
          ></CustomTimer>
          <div
            style="
              display: inline-block;
              width: 21em;
              white-space: pre-wrap;
              vertical-align: text-top;
            "
            v-if="
              customComponents.includes('CountdownDay小') ||
              customComponents.includes('Clock')
            "
          >
            <SmallCountdownDay
              v-if="customComponents.includes('CountdownDay小')"
            ></SmallCountdownDay>
            <Clock v-if="customComponents.includes('Clock')"></Clock>
          </div>
          <CountdownDay
            v-if="customComponents.includes('CountdownDay大')"
          ></CountdownDay>

          <a-modal v-model:visible="visible" @ok="handleOk" @cancel="handleOk">
            <template #modalRender="{}">
              <div
                style="
                  height: 14.7em;
                  background: #2e2e2e;
                  padding: 1em;
                  text-align: center;
                  border-radius: 2em;
                  margin-top: 5em;
                "
                v-if="ClockEvent[0]"
              >
                <div style="font-size: 3em; margin-top: 0.5em">
                  {{ ClockEvent[0].DateValue.hours }}:{{
                    ClockEvent[0].DateValue.minutes
                  }}
                </div>
                <div
                  style="
                    font-size: 1.5em;
                    margin-top: 0.5em;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  "
                >
                  {{ ClockEvent[0].EventValue }}
                </div>
              </div>
            </template></a-modal
          >
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
import { mapWritableState, mapActions } from "pinia";
import { appStore } from "../store";
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
  data() {
    return { visible: false };
  },
  computed: {
    ...mapWritableState(appStore, [
      "customComponents",
      "ClockEvent",
      "appDate",
    ]),
  },
  mounted() {
    // console.log(localStorage.getItem("CountdownDay"));

    if (this.$route.params["name"]) {
      console.log(this.$route.params);
    }
    // if (
    //   this.appDate.minutes === this.ClockEvent[0].DateValue.minutes &&
    //   this.appDate.hours === this.ClockEvent[0].DateValue.hours
    // ) {
    //   this.visible = true;
    // }
  },
  watch: {
    "appDate.minutes": {
      handler(newVal, oldVal) {
        try {
          if (
            this.appDate.minutes === this.ClockEvent[0].DateValue.minutes &&
            this.appDate.hours === this.ClockEvent[0].DateValue.hours
          ) {
            this.visible = true;
          }
        } catch (err) {
          console.log(err);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    ...mapActions(appStore, ["removeClock"]),
    handleOk() {
      this.visible = false;
      this.removeClock(0);
      console.log(123);
    },
  },
};
</script>

<style scoped lang="scss">
.card-wrapper {
  width: auto;
  flex-wrap: nowrap;
  white-space: nowrap;
}

.card {
  width: 20em;
  display: inline-block;
  height: 30em;
  padding: 1em;
  margin-right: 1em;

  .title {
  }
}
</style>
