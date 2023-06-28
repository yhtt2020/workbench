<template>
  <div class="flex flex-row justify-between items-center">
    <div class="xt-text ">
      <span class="mr-2">运行中的应用</span> <span class="mr-5">{{runningApps.length + runningTableApps.length}}</span>
      <a-button class="mr-3" :type="type==='all'?'primary':'default'" @click.stop="setType('all')">全部</a-button>
      <a-button class="mr-3" :type="type==='qing'?'primary':'default'" @click.stop="setType('qing')"  style="background: var(--primary-bg);color: var(--primary-text);">轻应用</a-button> <a-button :type="type==='table'?'primary':'default'" @click.stop="setType('table')"  style="background: var(--primary-bg);color: var(--primary-text);">工作台应用</a-button></div>
    <div @click.stop="closeAll()" class="h-10 w-28 bg-gray-800 rounded-lg flex justify-evenly items-center pointer" style="background: var(--primary-bg);color: var(--primary-text);">
      <Icon icon="minus-circle-fill "  ></Icon>全部关闭</div>
  </div>
  <vue-custom-scrollbar  :settings="settings"
                         style="position:relative;height:250px;  border-radius: 8px;">
    <div class="mt-2 " style="white-space: nowrap">
      <a-empty v-if="!runningApps.length && !runningTableApps.length" class="mt-10 mb-10" description="暂无运行中的应用">

      </a-empty>
      <div v-if="['all','table'].indexOf(this.type)>-1" @click="openApp(item)" v-for="item in runningTableApps" class="w-1/3 open-app pointer mb-10 mt-5">
        <div class="flex flex-row items-center w-1/2">
          
          <div class="h-8 w-8 rounded-lg flex justify-evenly items-center mr-2">
            <a-avatar :src="item.icon"  class="pointer"></a-avatar></div>
          {{item.name}}
        </div>
      </div>
      <div v-if="['all','qing'].indexOf(this.type)>-1" @click="openApp(item)" v-for="item in runningAppsInfo" class="w-1/3 open-app pointer mb-10 mt-5">
        <div class="flex flex-row items-center w-1/2 xt-text">
          <div class="h-8 w-8 rounded-lg flex justify-evenly items-center mr-2">
            <a-avatar :src="item.logo"  class="pointer"></a-avatar></div>
          {{item.name}}
        </div>
        <a-avatar  :src="'file://'+item.capture" shape="square" alt="" class="w-2/3 h-full object-contain mt-3  " ></a-avatar>
      </div>
    </div>
  </vue-custom-scrollbar>
  <div>
    <div class="xt-text mt-8 ">最近使用</div>
    <vue-custom-scrollbar :settings="settings"
                          style="position:relative;height:150px;  border-radius: 8px;">
      <div class="" style="position: relative;white-space: nowrap">
        <div class="mt-6 last-app app-small pointer" @click="openApp(item)" v-for="item in recently">
          <div class="rounded-lg p-3 flex flex-row ">
            <div>
              <div class="h-10 w-10 rounded-lg flex justify-evenly items-center mr-2">
                <a-avatar :src="item.logo"  class="pointer"></a-avatar></div>
            </div>
            <div class="flex flex-col">
              <div class="xt-text">{{item.name}}</div>
              <div class="xt-text-3">{{item.appType||'轻应用'}}</div>
            </div>
          </div>
        </div>
      </div>
    </vue-custom-scrollbar>
  </div>
</template>

<script>
import { mapWritableState } from 'pinia'
import { appsStore } from '../../store/apps'
import navigationData from '../../js/data/tableData'
const {appModel} = window.$models
export default {
  name: 'RunningApps',
  data(){
    return {
      type:'all',
      settings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: true,
        suppressScrollX: false,
        wheelPropagation: true
      },
      openAppList:[
        {
          icon:'minus-circle-fill',
          title:'待办',
          img:'clock'
        },
        {
          icon:'minus-circle-fill',
          title:'待办',
          img:'clock'
        },
      ],
      recently:[
      ]
    }
  },
  mounted () {
    ipc.send('getRunningApps')
    ipc.send('getRunningTableApps')

    this.loadRecently().then()
  },
  computed:{
    ...mapWritableState(appsStore,['runningApps','runningAppsInfo','runningTableApps']),
    listData(){
      return navigationData.systemAppList.slice(0,5)
    },

  },methods:{
    async loadRecently(){
      this.recently=await appModel.getAllApps({order:'last_execute_time'})
    },
    clickListItem(item){
      item.fn();
      this.$emit('closeChangeApp')
    },
    openApp(item){
      ipc.send('executeApp', { app: JSON.parse(JSON.stringify(item)) })
    },
    closeAll(){
      this.runningApps.forEach(app=>{
        ipc.send('closeApp',{nanoid:app})
      })
    },
    setType(tag){
      this.type=tag
    },
  }
}
</script>

<style scoped>
.open-app,.last-app{
  max-width: 430px;
  display: inline-block;
}
@media screen and (max-height: 600px) and (min-width: 880px) {
  .open-app,.last-app{
    max-width: 280px;
  }
}
.app-small{
  display: inline-block;
  max-width: 600px !important;
  min-width: 200px;
}

</style>
