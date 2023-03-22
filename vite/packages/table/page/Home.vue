<template>
  <vue-custom-scrollbar @contextmenu.stop="showMenu"  :settings="scrollbarSettings" style="position:relative;width:calc(100vw - 9em);  border-radius: 8px;height: calc(100vh - 12em)">
    <div style="white-space: nowrap;padding:  1em 0">
<!--      <div style="width: 43em;display: inline-block;" v-for="(grid,index) in customComponents">-->
<!--        <div>-->
<!--          <vuuri group-id="grid.id" :drag-enabled="true" v-model="grid.children" class="grid" ref="grid">-->
<!--          <template #item="{ item }">-->
<!--              <div style="display: inline-block" >-->
<!--                <Widget @contextmenu.stop="showMenu(item.id,{item,grid},'item')"   :item="item"-->
<!--                    :uniqueKey="String(item.id)"-->
<!--                    :showDelete="true"-->
<!--                    :resizable="true"-->
<!--            >-->
<!--            <component :is="item.name" :customIndex="item.id" ></component></Widget></div>-->
<!--          </template>-->
<!--          </vuuri></div></div>-->
      <vuuri group-id="grid.id" :drag-enabled="editing" v-model="customComponents" :key="key" class="grid" ref="grid">
        <template #item="{ item }">
        <component :is="item.name" :customIndex="item.id" ></component>
        </template>
      </vuuri>
      <AddMore style="z-index: 9999999999;"></AddMore></div>
  </vue-custom-scrollbar>

  <a-drawer
    :contentWrapperStyle="{ padding:10,marginLeft:'2.5%',
    backgroundColor:'#1F1F1F',width: '95%',height:'11em',borderRadius:'5%'}"
    :width="120"
    :height="120"
    class="drawer"
    :closable="false"
    placement="bottom"
    :visible="menuVisible"
    @close="onClose"
  >
    <a-row style="margin-top: 1em" :gutter="[20,20]">
      <a-col>
        <div @click="toggleEditing" class="btn">
          <Icon v-if="!this.editing" style="font-size: 3em" icon="bofang"></Icon>
          <Icon v-else style="font-size: 3em;color: orange" icon="tingzhi"></Icon>
          <div><span v-if="!this.editing">调整布局</span><span v-else style="color: orange">停止调整</span></div>
        </div>
      </a-col>
    </a-row>
  </a-drawer>
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
import {message} from "ant-design-vue";
export default {
  name: "Home",
  data(){
    return{
      menuVisible: false,
      editing:false,
      key: Date.now(),
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

  },
  methods: {
    showMenu () {
      this.menuVisible = true
    },
    onClose() {
      this.menuVisible = false;
    },
    toggleEditing () {
      this.editing = !this.editing
      if (this.editing) {
        message.info('您可以直接拖拽图标调整位置，支持跨组调整')
      } else {
        message.info('已关闭拖拽调整')
      }
      this.menuVisible = false
      this.key = Date.now()
    },
    },
};
</script>
<style scoped lang="scss">
.grid {
  position: relative;
  display: inline-block;
  width: 43em;
  height: 45em;
  border-radius: 4px;
  vertical-align: top;
  left: 0px;
  right: 0;
  @media screen and (max-width: 1100px) {
    height: 44em;
  }
}

</style>
