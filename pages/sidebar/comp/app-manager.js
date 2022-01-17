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
                <a-col class="in-process-app" :flex="1">
                <div style="padding: 40px" v-if="runningApps.length===0">
                <a-empty description="暂无运行中的应用" ></a-empty>
</div>
            <div class="scroller-wrapper">
             <ul class="app-list">
             <li v-for="(appId,index) in runningApps" >
             <div class="app-title">
             <img :src="getApp(appId).logo" class="app-logo"><span class="app-name">{{getApp(appId).name}}</span>
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
    <li>
    <div>
        <img class="logo" src="https://qingflow.com/favicon.ico">
</div>
<div class="title">
轻流
</div>

</li>
<li>
    <div>
        <img class="logo" src="https://qingflow.com/favicon.ico">
</div>
<div class="title">
轻流
</div>

</li>
<li>
    <div>
        <img class="logo" src="https://qingflow.com/favicon.ico">
</div>
<div class="title">
轻流
</div>

</li>
</ul>

</a-col>
</a-row>
                </template>
                <div class="wrapper" >
                  <div class="item-icon ">
                    <img class="icon" src="../../icons/svg/control.svg"/>
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
      console.log(currentApp)
      return currentApp
    }
  },
  computed:{

  }
})
