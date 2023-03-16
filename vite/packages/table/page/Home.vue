<template>
  <vue-custom-scrollbar  @contextmenu.stop="showMenu(-1,undefined,'wrapper')" :settings="scrollbarSettings"
                         style="position:relative;width:calc(100vw - 9em);  border-radius: 8px;height: calc(100vh - 12em)">
    <div style="width: auto;white-space: nowrap">
          <AddMore></AddMore>
          <vuuri :drag-enabled="true" v-model="customComponents" class="grid">
          <template #item="{ item }">
            <Widget style=""
                    :showDelete="true"
                    :resizable="true"
            ><component :is="item.name" :customIndex="index" style="" ></component></Widget>
          </template>
        </vuuri></div>
  </vue-custom-scrollbar>
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
import Widget from "../components/muuri/Widget.vue";
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
    vuuri,
    Widget
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
  width:auto;
  border: 5px solid transparent;
  border-radius: 4px;
  vertical-align: top;
  margin: 1em;
}
</style>
