<template>
  <!-- <div class="side-panel common-panel s-bg " style=" z-index: 999;
  width: 6em;max-height: 446px;overflow: hidden;" ref="sideContent"> -->

    <div class="box common-panel s-bg  "
         style="display: flex;flex-direction: row;justify-items: center;justify-content: center;
          background: var(--primary-bg); z-index: 99;width: 80px;max-height: 100%;
          overflow-x: hidden;
          padding-top: 0;padding-bottom: 0;position:relative;" ref="sideContent"
         @contextmenu.stop="showMenu">
      <div style="width: 67px;overflow-x: hidden">
        <div style="width: 80px;overflow-y:auto;max-height: 100%;display: flex;flex-direction: column;overflow-x: hidden;align-items: flex-start">
          <div v-for="item in sideNavigationList" :key="item.name" @click="clickNavigation(item)">
            <div class="flex felx-col justify-center items-center item-nav" :class="{ 'active-back': current(item) }">
              <div class="icon-color" v-if="item.type === 'systemApp'">
                <Icon class="icon-color" :icon="item.icon" style="width:2.5em;height:2.5em;color:rgba(255, 255, 255, 0.4);"
                      :class="{ 'active-color': current(item) }"></Icon>
              </div>
              <a-avatar v-else :size="37" shape="square" :src="item.icon"></a-avatar>
            </div>
          </div>
        </div>
      </div>

    </div>


  <a-drawer :contentWrapperStyle="{ backgroundColor: '#212121', height: '216px' }" class="drawer" :closable="true"
    placement="bottom" :visible="menuVisible" @close="onClose">
    <a-row>
      <a-col>
        <div @click="editNavigation" class="btn relative">
          <Icon style="font-size: 3em" icon="tianjia1"></Icon>
          <div><span>编辑导航</span></div>
          <GradeSmallTip powerType="bottomNavigation" @closeDrawer="closeDrawer"></GradeSmallTip>
        </div>
        <div @click="clickNavigation(item)" class="btn" v-for="item in builtInFeatures" :key="item.name">
          <Icon style="font-size: 3em" :icon="item.icon"></Icon>
          <div><span>{{ item.name }}</span></div>
        </div>
      </a-col>
    </a-row>
  </a-drawer>

  <transition name="fade">
    <div class="home-blur fixed inset-0" style="z-index: 999" v-if="quick">
      <EditNavigation @setQuick="setQuick"></EditNavigation>
    </div>
  </transition>
</template>

<script>
import { mapWritableState } from 'pinia';
import EditNavigation from './bottomPanel/EditNavigation.vue';
import { navStore } from "../store/nav";
import { cardStore } from '../store/card';
export default {
  name: 'SidePanel',
  components: {
    EditNavigation
  },
  data() {
    return {
      menuVisible: false,
      quick: false
    }
  },
  props: {
    sideNavigationList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapWritableState(navStore, ['builtInFeatures']),
    ...mapWritableState(cardStore, ['routeParams']),
  },
  mounted() {
  // this.scrollNav('sideContent', 'scrollTop')
  },
  methods: {
    current(item) {
      // console.log(item)
      // console.log("route123",this.$route)
      console.log(item,'item===')
      if (item.data?.name) {
        return this.$route.params.name === item.data.name
      } else if (item.event) {
        console.log(this.$route)
        return this.$route.name === item.event
      } else {
        return false
      }
    },
    clickNavigation(item) {
      // console.log("item",item)
      switch (item.type) {
        case 'systemApp':
          if (item.event === 'fullscreen') {
            if (this.full) {
              this.full = false
              tsbApi.window.setFullScreen(false)
            } else {
              this.full = true
              tsbApi.window.setFullScreen(true)
            }
          } else if (item.event === '/status') {
            if (this.$route.path === '/status') {
              this.$router.go(-1)
            } else {
              this.$router.push({ path: '/status' })
            }
          } else if (item.data) {
            this.$router.push({
              name: 'app',
              params: item.data
            })
          } else {
            this.$router.push({ name: item.event })
          }
          break
        case 'coolApp':
          this.$router.push({
            name: 'app',
            params: item.data
          })
          break
        case 'localApp':
          require('electron').shell.openPath(item.path)
          break
        case 'lightApp':
          ipc.send('executeAppByPackage', { package: item.package })
          break
        default:
          require('electron').shell.openPath(item.path)
      }
    },
    // scrollNav(refVal, scrollDirection) {
    //   // let content = this.$refs[refVal]
    //   // content.addEventListener('wheel', (event) => {
    //   //   event.preventDefault();
    //   //   // console.log(event)
    //   //   content[scrollDirection] += event.deltaY
    //   // });
    // },
    closeDrawer() {
      this.menuVisible = false
    },
    editNavigation() {
      this.quick = true
      this.menuVisible = false
    },
    showMenu() {
      this.routeParams.url && ipc.send('hideTableApp', { app: JSON.parse(JSON.stringify(this.routeParams)) })
      this.menuVisible = true
    },
    setQuick() {
      this.quick = false
    },
    onClose() {
      this.routeParams.url && this.$router.push({ name: 'app', params: this.routeParams })
      this.menuVisible = false
    }
  }
}
</script>

<style scoped lang="scss">
.box {
  :deep(.icon) {
    fill: var(--secondary-text);
  }
}


.item:hover {
  background: var(--active-bg) !important;

  :deep(.icon) {
    fill: var(--primary-text) !important
  }
}

.active-back {
  :deep(.icon) {
    fill: var(--primary-text) !important
  }
}

.item {
  margin: 8px;
}

.item-nav {
  width: 68px;
  height: 68px;
  margin: 16px auto;
  cursor: pointer;
  border-radius: 6px;
}

.item-nav:hover {
  background: var(--active-secondary-bg);
}

.icon-color:hover {
  color: rgba(255, 255, 255, 0.8) !important;
}

.active-back {
  background: var(--active-bg) !important;
  color: var(--primary-text) !important;
  fill: var(--primary-text) !important;
}

.active-color {
  color: rgba(255, 255, 255, 0.8) !important;
}

.btn {
  text-align: center;
  margin-right: 24px;
  background: #2A2A2A;
  border-radius: 12px;
  width: 100px;
  height: 100px;
  padding-top: 16px;
  line-height: 30px;
}

@media screen and (max-height: 510px) {
  .side-panel {
    zoom: 0.82;
    margin-top: 3.5em;
  }
}

@media screen and (min-height: 511px) and (max-height: 550px) {
  .side-panel {
    zoom: 0.9;
  }
}

@media screen and (min-height: 551px) and (max-height: 610px) {
  .side-panel {
    zoom: 0.9;
  }
}
</style>
