<template>
  <vue-custom-scrollbar   :settings="scrollbarSettings" style="position:relative;width:calc(100vw - 9em);  border-radius: 8px;height: calc(100vh - 12em)">
    <div style="white-space: nowrap;">
      <div style="width: 25em;display: inline-block" v-for="(grid,index) in customComponents">
        <div>
          <vuuri group-id="grid.id" :drag-enabled="true" v-model="grid.children" class="grid" ref="grid">
          <template #item="{ item }">
              <div style="display: inline-block" >
                <Widget @contextmenu.stop="showMenu(item.id,{item,grid},'item')"   :item="item"
                    :uniqueKey="String(item.id)"
                    :showDelete="true"
                    :resizable="true"
            >
            <component :is="item.name" :customIndex="item.id" ></component></Widget></div>
          </template>
          </vuuri></div></div><AddMore style="z-index: 9999999999;"></AddMore></div>
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
import vuuri from '../components/vuuriHome/Vuuri.vue'
import Widget from "../components/muuri/Widget.vue";
export default {
  name: "Home",
  date(){
    return{
      scrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: true,
        suppressScrollX: false,
        wheelPropagation: true,
        currentItemId:-1
      },
    }
  },
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
    showMenu (id,data,type='grid') {
       if(type==='item'){
        this.currentItemId = id
      }
    }
    },

  watch:{
    "customComponents": {
      handler(newVal, oldVal) {
        try {

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
  display: inline-block;
  width: 60em;
  background: rgba(204, 204, 204, 0.3);
  border: 5px solid red;

  border-radius: 4px;
  vertical-align: top;
  margin: 1em;
  left: 0px;
  right: 0;
}
</style>
