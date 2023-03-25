<template>
  <div
    style="display: flex; align-items: center;flex-direction: row;justify-content: center;height: calc( 100vh - 11em)">
    <vue-custom-scrollbar key="scrollbar" id="scrollerBar" @contextmenu.stop="showMenu" :settings="scrollbarSettings"
                          style="position:relative;  border-radius: 8px;">
      <div style="white-space: nowrap;">
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
        <vuuri group-id="grid.id" :drag-enabled="editing" v-model="customComponents" :key="key"
               class="grid home-widgets" ref="grid">
          <template #item="{ item }">
            <component :is="item.name" :customIndex="item.id" :style="{pointerEvents:(editing?'none':'')}"
                       :editing="editing"></component>
          </template>
        </vuuri>
      </div>
    </vue-custom-scrollbar>
  </div>


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
      <a-col>
        <div @click="addCard" class="btn">
          <Icon style="font-size: 3em" icon="tianjia1"></Icon>
          <div><span>添加卡片</span></div>
        </div>
      </a-col>
    </a-row>
  </a-drawer>
</template>
<script>
import Weather from '../components/homeWidgets/Weather.vue'
import Calendar from '../components/homeWidgets/Calendar.vue'
import Timer from '../components/homeWidgets/Timer.vue'
import Music from '../components/homeWidgets/Music.vue'
import Stock from '../components/homeWidgets/Stock.vue'
import AddMore from '../components/homeWidgets/AddMore.vue'
import Dou from '../components/homeWidgets/Dou.vue'
import CustomTimer from '../components/homeWidgets/CustomTimer.vue'
import SmallCountdownDay from '../components/homeWidgets/SmallCountdownDay.vue'
import Clock from '../components/homeWidgets/Clock.vue'
import CountdownDay from '../components/homeWidgets/CountdownDay.vue'
import { mapActions, mapWritableState } from 'pinia'
import { tableStore } from '../store'
import vuuri from '../components/vuuriHome/Vuuri.vue'
import Widget from '../components/muuri/Widget.vue'
import { message } from 'ant-design-vue'
import CPULineChart from '../components/homeWidgets/supervisory/CPULineChart.vue'
import CPUFourCard from '../components/homeWidgets/supervisory/CPUFourCard.vue'
import InternalList from '../components/homeWidgets/supervisory/InternalList.vue'
import SmallCPUCard from '../components/homeWidgets/supervisory/SmallCPUCard.vue'
import SmallGPUCard from '../components/homeWidgets/supervisory/SmallGPUCard.vue'

const readAida64 = window.readAida64
export default {
  name: 'Home',
  data () {
    return {
      menuVisible: false,
      editing: false,
      key: Date.now(),
      scrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: true,
        suppressScrollX: false,
        wheelPropagation: true,
        currentItemId: -1,
        timer: null
      },
      scrollbar: Date.now()
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
    Widget,
    CPULineChart,
    CPUFourCard,
    InternalList,
    SmallCPUCard,
    SmallGPUCard
  },
  computed: {
    ...mapWritableState(tableStore, ['customComponents', 'clockEvent']),
    ...mapWritableState(tableStore, ['aidaData']),
  },
  mounted () {
    window.onresize = () => {
      this.scrollbar = Date.now()
    }
    //this.customComponents=[{name:'Music',id:2},{name:'Weather',id:3},{name:'Timer',id:4}]//重置
    if (this.customComponents.length > 0) {
      if (typeof this.customComponents[0] === 'string') {
        this.customComponents = [{ name: 'Music', id: 2 }, { name: 'Weather', id: 3 }, { name: 'Timer', id: 4 }]
      }
    }
  },
  created () {
    this.timer = setInterval(() => {
      readAida64().then(res => {
        Object.keys(res).map(i => {
          if (i === 'TCPUDIO') res.TCPUPKG = res[i]
          if (i === 'TGPUDIO') res.TGPU1DIO = res[i]
        })
        this.setAidaData(res)
        // console.log(res)
        //this.data=JSON.stringify(res, null, '\t')
      }).catch(err => {
        clearInterval(this.timer)
      })
    }, 1000)
  },
  unmounted () {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    ...mapActions(tableStore, ['setAidaData']),
    addCard () {
      this.$router.push({ name: 'addCard' })
    },
    showMenu () {
      this.menuVisible = true
    },
    onClose () {
      this.menuVisible = false
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
}
</script>
<style scoped lang="scss">
.grid {
  position: relative;
  display: inline-block;
  width: 43em;
  border-radius: 4px;
  vertical-align: top;
  left: 0;
  right: 0;
}

.btn {
  text-align: center;
}

@media screen and (min-height: 1020px) and (max-height: 1600px) {
  #scrollerBar {
    height: 880px;
    .grid {
      height: 880px;
    }
  }
}
@media screen and (max-height: 1021px) {
  #scrollerBar {
    height: 438px;

    .grid {
      height: 438px;
    }
  }
}

</style>
<style lang="scss">
.home-widgets {
  .muuri-item {
    width: 280px;
  }

  .muuri-item {
    margin: 6px;
  }

  .card {
    border: 0;
    height: 420px;

    &.small {
      height: 204px;
    }
  }
}
</style>
<style lang="scss">
@media screen and (max-height: 510px) {
  #scrollerBar {
    zoom: 0.718;
    width: calc(100vw + 40em);
  }
}
@media screen and (min-height: 511px) and (max-height: 550px) {
  #scrollerBar {
    zoom: 0.78;
    width: calc(100vw +  24em);
  }
}

@media screen and (min-height: 551px) and (max-height: 610px) {
  #scrollerBar {
    zoom: 0.88;
    width: calc(100vw + 8em);
  }
}

@media screen and (min-height: 610px) and (max-height: 710px) {
  #scrollerBar {
    zoom: 1;
    width: calc(100vw - 9em);
  }
}
@media screen and (min-height: 711px) and (max-height: 810px) {
  #scrollerBar {
    zoom: 1.2;
    width: calc(100vw - 9em);
  }
}

@media screen and (min-height: 811px) and (max-height: 910px) {
  #scrollerBar {
    zoom: 1.4;
    width: calc(100vw - 9em);
  }
}
@media screen and (min-height: 911px) and (max-height: 1020px) {
  #scrollerBar {
    zoom: 1.7;
    width: calc(100vw - 9em);
  }
}
@media screen and (min-height: 1021px) and (max-height: 1220px) {
  #scrollerBar {
    zoom: 1;
    width: calc(100vw - 9em);
  }
}
@media screen and (min-height: 1221px) and (max-height: 1320px) {
  #scrollerBar {
    zoom: 1.1;
    width: calc(100vw - 9em);
  }
}
@media screen and (min-height: 1321px) and (max-height: 2880px) {
  #scrollerBar {
    zoom: 1.4;
    width: calc(100vw - 9em);
  }
}
</style>
