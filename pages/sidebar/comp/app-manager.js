const appManagerTpl =
  `
   <div class="wrapper">
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
                <a-row type="flex">
                <a-col class="in-process-app" flex="320px">
                <div style="padding-top: 35px;text-align: center" v-if="runningApps.length===0">
                <a-empty description="暂无运行中的应用" ></a-empty>
</div>
            <div class="scroller-wrapper">
             <ul class="app-list">
             <li  v-for="(appId,index) in runningApps" >
             <div style="cursor:pointer;" @click="executeApp(getApp(appId))" class="app-title">
             <img :src="getApp(appId).logo" class="app-logo"><span class="app-name">{{getApp(appId).name}}</span>
             <span style="float: right"><a-icon title="彻底退出" @click.stop="closeApp(appId)" type="poweroff"></a-icon></span>
</div>
             <div>
             <div class="app-capture">
                 <div class="overlay"></div>
             <img :src="getApp(appId).capture" onerror="this.src='../../icons/svg/empty.svg'"  :alt="getApp(appId).name">

</div>
</div>

             </li>
             </ul>
             </div>
</a-col>
<a-col class="more-app" flex="60px">
<ul class="other-app-list">
<li v-if="runningApps.length===apps.length">
均已运行
</li>
    <li @click="executeApp(app)" v-for="app in apps" v-if="!app.processing">
    <div>
        <img class="logo" :src="app.logo" onerror="this.src='../../icons/default.svg'">
</div>
<div class="title">
{{app.name}}
</div>
</li>
</ul>

</a-col>
</a-row>
                </template>
                <div class="wrapper" >
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
    }
  },
  mounted () {
  },
  methods: {
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
      let currentApp={
        name:'',
        id:'',
        logo:'',
        capture:''
      }
      appVue.$refs.sidePanel.apps.forEach((app)=>{
        if(app.id===id)
          currentApp=app
      })
      return currentApp
    },
    closeApp(appId){
        ipc.send('closeApp',{id:appId})
    }
  },
  computed:{

  }
})
