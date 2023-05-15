<template>

  <div>
    <div class="m-3" style="width: 320px;margin: auto;text-align: center;margin-top:1em">
      <HorizontalPanel class="no-drag" @click.stop @changed="this.key=Date.now()" :navList="tabs"
                       v-model:selectType="currentTab"></HorizontalPanel>
    </div>

  </div>
  <div v-if="currentTab.name==='screen'">
    <div style="max-width:740px;margin: auto">
      <ScreenManage></ScreenManage>
    </div>

  </div>
  <div v-else>
    <div style="max-width: 1200px;margin: auto">
      <RunningApps/>
    </div>

  </div>

  <div class="p-5 text-base no-drag">


    <div class="w-96 justify-between flex flex-row absolute bottom-8 left-1/2 -translate-x-1/2">
      <div style="width: 56px;height: 56px" class="flex justify-center items-center" v-for="item in listData">
        <Icon :icon="item.icon" style="width: 32px;height: 32px;color:white;" class="pointer"
              @click.stop="clickListItem(item)"></Icon>
      </div>
    </div>
  </div>
</template>

<script>
import navigationData from '../../js/data/tableData'
import { appsStore } from '../../store/apps'
import { mapWritableState } from 'pinia'
import ScreenManage from './ScreenManage.vue'
import RunningApps from './RunningApps.vue'
import HorizontalPanel from '../HorizontalPanel.vue'

export default {
  name: 'ChangeApp',
  components: { HorizontalPanel, RunningApps, ScreenManage },
  data () {
    return {
      tabs: [
        {
          name: 'screen',
          title: '分屏'
        },
        {
          name: 'apps',
          title: '应用'
        }
      ],
      currentTab: {
        name:'screen',
        title:'分屏'
      },
    }
  },
  props: {
    tab:{
      type:String,
      default: 'screen'
    },
    full: {
      type: Boolean,
      default: false
    }
  },
  created () {
    navigationData.sendThis(this)
  },
  mounted () {
    if(this.tab==='screen'){
      this.currentTab= {
        name:'screen',
        title:'分屏'
      }
    }else{
      this.currentTab=
        {
          name:'apps',
          title:'应用'
        }
    }
  },
  computed: {
    ...mapWritableState(appsStore, ['runningApps', 'runningAppsInfo', 'runningTableApps']),
    listData () {
      return navigationData.systemAppList.slice(0, 5)
    }
  },
  methods: {}
}
</script>


