<template>
  <div  class="p-5 text-base no-drag">
    <div class="flex flex-row justify-between items-center">
    <div class="text-white">打开的应用</div>
    <div @click="closeAll()" class="h-10 w-28 bg-gray-800 rounded-xl flex justify-evenly items-center pointer">
      <Icon icon="minus-circle-fill "  ></Icon>全部关闭</div>
  </div>
    <vue-custom-scrollbar :settings="settings"
                          style="position:relative;height:250px;  border-radius: 8px;">
    <div class="mt-2 " style="white-space: nowrap">
      <a-empty v-if="!runningApps.length" class="mt-10 mb-10" description="暂无运行中的应用">

      </a-empty>
      <div @click="openApp(item)" v-for="item in runningAppsInfo" class="w-1/3 open-app pointer mb-10 mt-5">
        <div class="flex flex-row items-center w-1/2">
          <div class="h-8 w-8 rounded-xl flex justify-evenly items-center mr-2">
            <a-avatar :src="item.logo"  class="pointer"></a-avatar></div>
         {{item.name}}
        </div>
        <a-avatar  :src="'file://'+item.capture" shape="square" alt="" class="w-2/3 h-full object-contain mt-3  " ></a-avatar>
      </div>
    </div>
    </vue-custom-scrollbar>
    <div>
      <div class="text-white mt-8 ">最近使用</div>
      <vue-custom-scrollbar :settings="settings"
                            style="position:relative;height:150px;  border-radius: 8px;">
      <div class="" style="position: relative;white-space: nowrap">
        <div class="mt-6 last-app app-small pointer" @click="openApp(item)" v-for="item in recently">
        <div class="rounded-xl p-3 flex flex-row">
          <div>
            <div class="h-10 w-10 rounded-xl flex justify-evenly items-center mr-2">
              <a-avatar :src="item.logo"  class="pointer"></a-avatar></div>
          </div>
          <div class="flex flex-col">
            <div class="text-white">{{item.name}}</div>
            <div class="text-xs">{{item.appType||'轻应用'}}</div>
          </div>
        </div>
      </div>
      </div>
      </vue-custom-scrollbar>
    </div>
    <div class="w-96 justify-between flex flex-row absolute bottom-8 left-1/2 -translate-x-1/2">
      <div style="width: 56px;height: 56px" class="flex justify-center items-center" v-for="item in listData">
        <Icon :icon="item.icon" style="width: 32px;height: 32px;color:white;" class="pointer" @click.stop="clickListItem(item)"></Icon>
      </div>
    </div>
  </div>
</template>

<script>
import navigationData from '../../js/data/tableData'
import { appsStore } from '../../store/apps'
import {mapWritableState} from 'pinia'
const {appModel} = window.$models

export default {
  name: "ChangeApp",
  data(){
    return{
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
  props:{
    full:{
      type:Boolean,
      default:false
    }
  },
  created() {
    navigationData.sendThis(this)
  },
  mounted () {
    ipc.send('getRunningApps')
    this.loadRecently().then()
  },
  computed:{
    ...mapWritableState(appsStore,['runningApps','runningAppsInfo']),
    listData(){
      return navigationData.systemAppList.slice(0,5)
    }
  },
  methods:{
    async loadRecently(){
      this.recently=await appModel.getAllApps({order:'last_execute_time'})
    },
    clickListItem(item){
        item.fn();
        this.$emit('closeChangeApp')
    },
    openApp(item){
      console.log(item)
      ipc.send('executeApp', { app: JSON.parse(JSON.stringify(item)) })
    },
    closeAll(){
      this.runningApps.forEach(app=>{
        ipc.send('closeApp',{nanoid:app})
      })
    }
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
