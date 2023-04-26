<template>
  <div style="width: 100%">
    <vueCustomScrollbar :settings="scrollbarSettings"
                        style="height: 100%;padding: 15px;white-space: nowrap;width: 100%;overflow: hidden">
        <div class="card mr-3" style="height: calc(100vh - 13em) ;width: 300px;display: inline-block;vertical-align: top">
          <div class="line-title">互动
            <span style="float: right;font-weight: normal;font-size: 0.8em">
         <icon icon="yonghu"/>
        在线：{{ online|| '-' }} 人
      </span>
          </div>
          <div class="mb-3" >
            <div>
              <vueCustomScrollbar :settings="scrollbarSettingsBarrage"
                                  style="height: calc(100vh - 21em);white-space: nowrap">
                <a-row class="mb-3" v-if="!hideAdmin" :gutter="[10,10]">
                  <a-col :span="4">
                    <a-avatar src="/icons/logo128.png"></a-avatar>
                  </a-col>
                  <a-col :span="20">
                    <div class="barrage-name">
                      弹幕管理员
                    </div>
                    <div class="barrage-content">
                      欢迎使用想天工作台弹幕功能，请文明发言。
                    </div>
                  </a-col>
                </a-row>
                <a-row class="mb-5" :gutter="[10,15]">


                  <template v-for="barrage in barrages">
                    <a-col :span="4">
                      <a-avatar :src="barrage.avatar"></a-avatar>
                    </a-col>
                    <a-col :span="20">
                      <div class="barrage-name">
                        {{ barrage.nickname }} · {{ barrage.create_time_text }}
                      </div>
                      <div class="barrage-content">
                        {{ barrage.content }}
                      </div>
                      <div class="barrage-time">

                      </div>
                    </a-col>
                  </template>
                </a-row>
              </vueCustomScrollbar>
            </div>
          </div>

          <a-input @keyup.enter="postBarrage" v-model:value="postContent" placeholder="和大家说句话吧~"></a-input>
        </div>
        <div class="mr-3" style="display:inline-block ;width: 300px;white-space: pre-wrap;vertical-align: top">
          <div class="card mb-3" style="width: 300px">
            <div>
              反馈问题？提交Bug？进入想天浏览器官方版块。
              <div class="pointer p-1 mt-2" @click="goUrl('https://s.apps.vip/forum?id=3')">
                <a-avatar class="mr-2" src="https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/8befa3834d2eb29e75685563ef513215.png?imageMogr2/crop/260x260/gravity/center"></a-avatar>
                想天工作台
                <a-button size="small" style="float: right" type="primary">访问社区</a-button>
              </div>
            </div>
          </div>
          <div class="card mb-3" style="width: 300px">
            <div >
              当前版本：<br>

              <div  class="bg-indigo-500 w-1/8 inline-block px-4 py-1 text-white text-center font-extrabold rounded-full mt-3 mr-5 ml-5">{{appVersion}}</div>反馈问题请附版本号

            </div>
          </div>
          <div class="card mb-3" style="width: 300px">
            <div class="line-title">
              成为开发者：
            </div>
            <div class="line">我们欢迎每一位前端开发者、独立软件开发者、主题设计师、浏览器插件开发者入驻。我们将对早期开发者提供各项支持与流量奖励。
              <div class="mt-5">
                <a-row :gutter="10">
                  <a-col :span="12">
                    <a-button @click="openTab('https://www.yuque.com/tswork/mqon1y/hugtrbdiax9863ug')" type="primary" block>开发者入驻</a-button>
                  </a-col>
                  <a-col :span="12">
                    <a-button @click="openTab('https://www.yuque.com/tswork/mqon1y/ldt3ll8lqoedpo07')" block>前端实习</a-button>
                  </a-col>
                </a-row>
              </div>
            </div>
          </div>

        </div>

        <div style="height: 100%;display: inline-block">
          <div class="line font-bold text-white" >更新日志：</div>
          <vuuri v-model="updateLog" style="height: 100%">
            <template #item="{ item }">
              <div class="card mb-3 " style="width: 400px;background: rgba(55,102,255,0.67);color:white;height: auto">
                <div class="line-title">
                  {{ item.name }} 更新内容
                </div>
                <div class="line">
                  <div v-for="(li,index) in item.list">
                    {{index+1}}.{{ li }}
                  </div>
                </div>
                <div class="text-right">
                 更新日期： {{item.date}}
                </div>
              </div>
            </template>
          </vuuri>

        </div>




    </vueCustomScrollbar>
  </div>

</template>

<script>
import GradePanel from '../../components/comp/GradePanel.vue'
import { message } from 'ant-design-vue'
import axios from 'axios'
import { Server } from '../../consts'
import vuuri from '../../components/vuuriHome/Vuuri.vue'
let updateLog=[
  {
    name:'3.7.28',
    date:'04月25日',
    list:[
      '修复工作台打开轻应用错误',
      '修复缩放显示器后导致浏览器左侧栏空白'
    ]
  },
  {
    name:'3.7.27',
    date:'04月24日',
    list:[
      '新增壁纸小卡片，壁纸卡片支持独立壁纸源',
      '支持创建小队',
      '支持加入小队',
      'steam折扣卡片支持独立源!暂时无法正常使用!',
      '修复部分用户不能累计在线时长的问题',
      '增加设置双击托盘菜单默认打开',
      '增加设置任务栏是否显示工作台',
      '增加更新日志显示'
    ]
  },
  {
    name:'3.7.26',
    date:'04月22日',
    list:[
      '天气不刷新问题解决',
      '新增壁纸大卡片',
      '修复大量Bug',
    ]
  }
]
export default {
  name: 'Com',
  components: { GradePanel ,vuuri},
  data(){
    return {
      barrages: [],
      postContent: '',
      scrollbarSettingsBarrage: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      scrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: true,
        suppressScrollX: false,
        wheelPropagation: true
      },
      online:0,
      appVersion:'',
      updateLog:updateLog
    }
  },
  mounted () {
    this.CONST = tsbApi.barrage.CONST
    this.loadBarrages().then()
    this.getOnline().then()
    this.appVersion=tsbApi.runtime.appVersion
    console.log(tsbApi.runtime)
  },
  methods:{
    openTab(url){
      ipc.send('addTab',{url:url})
    },
    async loadBarrages () {
      tsbApi.barrage.getList(this.CONST.CHANNEL.PUBLIC, 'table').then(rs => {
        if (rs.status) {
          rs.data.forEach(item => {
            item.create_time_text = tsbApi.util.friendlyDate(item.create_time)
          })
          this.barrages = rs.data

        }
      })
    },
    async getOnline(){
      axios.get(Server.baseUrl+'/app/open/usageStats/online').then((rs)=>{
        if(rs.data.code===1000){
          this.online=rs.data.data
        }
      })
    },
    async postBarrage () {
      if (!this.postContent) {
        message.error('请输入弹幕内容')
        return
      } else {
        let data = {
          channel_type: this.CONST.CHANNEL.PUBLIC,
          content: this.postContent,
          page_url: 'table',
        }
        let rs = await tsbApi.barrage.add(data)
        if (rs.status) {
          this.postContent = ''
          if (!this.hideAdmin) {
            this.hideAdmin=true
          }
          message.success('弹幕发送成功')
          setTimeout(()=>{
            window.loadBarrage('table')
          },3000)
        } else {
          message.error('弹幕发送失败，失败原因：' + rs)
        }
      }
    },
    goUrl(url){
      ipc.send('addTab',{url:url})
    },
  }
}
</script>

<style scoped>
.card{
  background: #252525;
}
.barrage-name{
  font-size: 0.8em;
}
.barrage-content {
  color: white;
  white-space: pre-wrap;
  word-break: break-all;
}

.barrage-time {
  font-size: 0.8em;
}

</style>
