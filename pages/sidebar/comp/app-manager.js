const appManagerTpl =
  `
   <div class="wrapper" >
   <a-popover
                placement="right"
                :mouse-enter-delay="0.1"
                :mouse-leave-delay="0.2"
                overlay-class-name="app-manager-overlay"
              >
              <template slot="title">
              <div class="app-manager-title">
              应用管理 (已运行)
</div>
</template>
                <template slot="content">
                <a-row type="flex" style="user-select: none">
                <a-col class="in-process-app" flex="320px">
                <div style="padding-top: 35px;text-align: center" v-if="runningApps.length===0">
                <a-empty description="暂无运行中的应用" ></a-empty>
</div>
            <div class="scroller-wrapper">
             <ul class="app-list">
             <li  v-for="(appId,index) in runningApps" >
             <div class="app-title">
             <span style="cursor:pointer" @click="executeApp(getApp(appId))">
             <img :src="getApp(appId).logo" class="app-logo"><span class="app-name">{{getApp(appId).name}}</span></span>
             <span style="float: right"><a-icon title="设置" @click.stop="openSetting(appId)" type="setting"></a-icon>&nbsp;&nbsp; <a-icon title="彻底退出" @click.stop="closeApp(appId)" type="poweroff"></a-icon> </span>
</div>
             <div>
             <div class="app-capture" style="position: relative" @mouseenter="startStat(appId)" @mouseleave="stopStat">
             <a-row class="app-info">
             <a-col :span="24" style="text-align: center">
             运行情况
</a-col>
             <a-col :span="6">
           内存：
</a-col>
<a-col class="value"  :span="6">
{{(getApp(appId).memoryUsage.memory.workingSetSize/2048).toFixed(1)}} MB
</a-col>
<a-col :span="6">
CPU:
</a-col>
<a-col class="value"  :span="6">
{{(getApp(appId).memoryUsage.cpu.percentCPUUsage *100).toFixed(1)}} %
</a-col>
<a-col :span="6">
进程pid:
</a-col>
<a-col class="value" :span="6">
{{getApp(appId).memoryUsage.pid}}
</a-col>
<a-col :span="6">
已运行：
</a-col>
<a-col class="value"  :span="6">
{{ ((Date.now()-getApp(appId).memoryUsage.creationTime)/1000/60).toFixed(1)}} 分钟
</a-col>
</a-row>


                 <div class="overlay"></div>
             <img :src="getApp(appId).capture" onerror="this.src='../../icons/svg/empty.svg'"  :alt="getApp(appId).name">

</div>
</div>

             </li>
             </ul>
             </div>
</a-col>
<!--<a-col class="more-app" flex="60px">-->
<!--<ul class="other-app-list">-->
<!--<li v-if="runningApps.length===apps.length">-->
<!--均已运行-->
<!--</li>-->
<!--    <li @click="executeApp(app)" v-for="app in apps" v-if="!app.processing">-->
<!--    <div>-->
<!--        <img class="logo" :src="app.logo" onerror="this.src='../../icons/default.svg'">-->
<!--</div>-->
<!--<div class="title">-->
<!--{{app.name}}-->
<!--</div>-->
<!--</li>-->
<!--</ul>-->

<!--</a-col>-->
</a-row>
                </template>
                <div class="wrapper"  @click="showAllSaApps">
                  <div class="item-icon ">
                    <img class="icon" style="width: 32px !important;height: 32px !important;" src="../../icons/svg/control.svg"/>
<!--                    <a-badge-->
<!--                      :count="item.count"-->
<!--                      :dot="true"-->
<!--                      status="processing"-->
<!--                      :style="{position: 'absolute',right:  '-2px',top:'-13px',visibility:item.count>5?'visible':'hidden'}"-->
<!--                    >-->
<!--                    </a-badge>-->
                  </div>
                  <div class="item-title">应用管理</div>
                </div>
              </a-popover>

    </div>


  `

Vue.component('app-manager', {
  template: appManagerTpl,
  name: 'app-manager',
  props:{
    apps:{
      type:Array,
      default:[]
    },
    runningApps:{
      type:Array,
      default:[]
    }
  },
  data () {
    return {
      setted:false,
      timer: 0
    }
  },
  mounted () {
  },
  methods: {

    startStat(id){
      if(!this.setted){
        window.tickId=id
       this.timer= setInterval(()=>{
         ipc.send('getAppRunningInfo',{id:window.tickId})
         console.log(window.tickId)
       },1000)
        this.setted=true
      }

    },
    stopStat(){
      clearInterval(this.timer)
      this.setted=false
    },
    destroyed () {
      // 销毁定时器
      clearInterval(this.timer)
    },
    executeApp(app){
      // if(!!!app.processing){
      //   ipc.send('executeApp',{app:app})
      // }
      // 判断单例的问题留给主进程处理
      ipc.send('executeApp',{app:app})
    },
    getApp(id){
      let defaultMemoryUsage={
        cpu:{
          percentCPUUsage:0
        },
        memory:{
          workingSetSize:0
        }
      }
      let currentApp={
        name:'',
        id:'',
        logo:'',
        capture:'',
        memoryUsage:defaultMemoryUsage
      }
      appVue.$refs.sidePanel.apps.forEach((app)=>{
        if(app.id===id)
        {
          if(!!!app.memoryUsage){
            app.memoryUsage=defaultMemoryUsage
          }
          if(!!!app.capture){
            app.capture=''
          }
          currentApp=app
        }

      })
      return currentApp
    },
    closeApp(appId){
        ipc.send('closeApp',{id:appId})
    },
    openSetting(appId){
      ipc.send('saAppOpenSetting',{id:appId})
    },
    showAllSaApps(){
      ipc.send('showAllSaApps')
    }
  },
  computed:{

  }
})
