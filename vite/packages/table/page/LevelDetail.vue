<template>
  <vueCustomScrollbar :settings="scrollbarSettings"
                      style="height: calc(100vh - 35px);padding: 15px;white-space: nowrap">
    <div class="card mr-3" style="height: calc(100vh - 13em) ;width: 300px">
      <div class="line-title">互动
        <span style="float: right;font-weight: normal;font-size: 0.8em">
         <icon icon="yonghu"/>
        在线：- 人
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

    <div class="mr-3" style="display:inline-block ;width: 400px;white-space: pre-wrap;vertical-align: top">
      <div class="card mb-3" style="width: 400px">
        <div>
          反馈问题？提交Bug？进入想天浏览器官方版块。
         <div class="pointer p-1 mt-2" @click="goUrl('https://s.apps.vip/forum?id=3')">
           <a-avatar class="mr-2" src="https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/8befa3834d2eb29e75685563ef513215.png?imageMogr2/crop/260x260/gravity/center"></a-avatar>

           想天工作台
         <a-button size="small" style="float: right" type="primary">访问社区</a-button>
         </div>
        </div>
      </div>
      <div class="card " style="width: 400px;padding: 1em;display: inline-block;vertical-align: top">

        <GradePanel></GradePanel>
      </div>
    </div>

    <div class="mr-3" style="width: 400px;display: inline-block;vertical-align: top;white-space: pre-wrap">
      <div class="card half" style="width: 400px;padding: 1em;display: inline-block;margin-bottom: 1em">
        <ComPanel></ComPanel>
      </div>
      <div class="card half" style="width: 400px;padding: 1em;display: inline-block">
        <ComActionPanel></ComActionPanel>
      </div>
    </div>

    <div class="card" style="width: 400px;padding: 1em;display: inline-block;margin-bottom: 1em">
      <GroupPanel></GroupPanel>
    </div>

  </vueCustomScrollbar>
</template>

<script>
import GradePanel from '../components/comp/GradePanel.vue'
import ComPanel from '../components/comp/ComPanel.vue'
import ComActionPanel from '../components/comp/ComActionPanel.vue'
import GroupPanel from '../components/comp/GroupPanel.vue'
import { message } from 'ant-design-vue'

export default {
  name: 'LevelDetail',
  components: { GroupPanel, GradePanel, ComPanel, ComActionPanel },
  data () {
    return {
      hideAdmin:false,
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
      barrages: [],
      postContent: ''
    }
  },
  async mounted () {
    this.CONST = tsbApi.barrage.CONST
    this.loadBarrages().then()
  },
  methods: {
    goUrl(url){
      ipc.send('addTab',{url:url})
    },
    async loadBarrages () {
      tsbApi.barrage.getList(this.CONST.CHANNEL.PUBLIC, 'table').then(rs => {
        console.log(rs)
        if (rs.status) {
          rs.data.forEach(item => {
            item.create_time_text = tsbApi.util.friendlyDate(item.create_time)
          })
          this.barrages = rs.data

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
    }
  }
}
</script>

<style scoped>
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
.card{
  background: #3a3a3a;
}
</style>
