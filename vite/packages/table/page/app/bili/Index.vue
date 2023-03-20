<template>
  <h1 style="text-align: center">
    数据监控小助手
  </h1>

  <div>
    <a-tabs v-model:activeKey="currentTab">
      <a-tab-pane key="running" tab="运行中">
        <a-empty v-if="runningTasks.length===0" style="margin-top: 3em"
                 description="当前还没有正在监控中的任务"></a-empty>
        <div v-else>
          <Vuuri :getItemWidth="()=>{return '250px'}" :getItemHeight="()=>{return '500px'}" class="monitor"
                 v-model="runningTasks">
            <template #item="{ item }">
              <Widget :uniqueKey="item.id">
                <div class="p-2 bili-card">
                  <div class="text-more text-base mb-4 text-left" >
                    <!--               <a-avatar :src="item.task.icon"></a-avatar> -->
                   <Icon icon="bilibili" style="font-size: 20px;vertical-align: text-top"></Icon> {{ item.title }}
                  </div>
                  <div class="mb-3">
                    <a-row>
                      <a-col :span="10">
                        <img class="bili-cover" src="/img/cover.jpg"/>
                      </a-col>
                      <a-col :span="14">
                        <div class="text-more text-xs">{{ item.data.title }}</div>
                        <div>
                          <a-row class="text-xs" :gutter="10">
                            <a-col :span="8">
                             <Icon icon="bofang"></Icon><br/> {{ item.data.play }}
                            </a-col>
                            <a-col :span="8">
                              <Icon icon="dianzan"></Icon><br/>  {{ item.data.support }}
                            </a-col>
                            <a-col :span="8">
                              <Icon icon="jinbi"></Icon> <br/>{{ item.data.coin }}
                            </a-col>
                          </a-row>
                        </div>
                      </a-col>
                    </a-row>
                  </div>
                  <div class="mb-3">
                    <div class="bili-tag" v-for="tag in item.tags" >{{tag}}</div>
                  </div>

                  <div class="mb-4">
                    <a-row>
                      <a-col :span="8">
                        <div class="text-xs">今日票房</div>
                        <div class="text-lg">5321</div>
                      </a-col>
                      <a-col :span="8">
                        <div class="text-xs">全天预测
                        </div>
                        <div class="text-lg">
                          1.5万
                        </div>
                      </a-col>
                      <a-col :span="8">
                        <div class="text-xs"> 当前在看</div>
                        <div class="text-lg">23</div>
                      </a-col>
                    </a-row>
                  </div>

                  <div class="mb-4">
                    <a-row>
                      <a-col :span="6">
                        <div class="stage">S4</div>
                      </a-col>
                      <a-col :span="16">
                        <div>初级流量池：10-15万</div>
                        <div>预测总播放量：4.5万</div>
                      </a-col>
                    </a-row>
                  </div>
                  <div class="text-xs action-button">
                    <a-row>
                      <a-col :span="6">
                        已运行<br>
                        32次
                      </a-col>
                      <a-col :span="12">
                        1小时32分钟<br>
                        刷新于 10：44
                      </a-col>
                      <a-col :span="6">
                        <Icon class="text-xl" icon="zanting"></Icon>
                        <br>
                        暂停
                      </a-col>
                    </a-row>
                  </div>
                </div>

              </Widget>
            </template>
          </Vuuri>
        </div>
      </a-tab-pane>
      <a-tab-pane key="other" tab="未运行">

      </a-tab-pane>
      <a-tab-pane key="taskTemplate" tab="任务模板">

      </a-tab-pane>
      <template #rightExtra>
        <a-dropdown-button type="primary" @click="addVideo">
          创建任务
          <template #overlay>
            <a-menu @click="handleMenuClick">
              <a-menu-item @click="addWatch" key="1">
                创建任务模板
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown-button>
      </template>
    </a-tabs>
  </div>

  <a-drawer class="no-drag" v-model:visible="addVideoVisible" style="overflow: hidden">
    <div style="margin:1em;overflow: hidden">
      <a-input-group style="width: 30em;margin-bottom: 2em" compact>
        <a-input v-model:value="addUrl" placeholder="PC端视频链接" style="width: calc(100% - 200px)">
        </a-input>
        <a-button @click="addWatch" type="primary">
          获取
        </a-button>
      </a-input-group>
      <div class="line title">
        视频基本信息：
      </div>
      <div class="line" style="padding: 0.5em">
        <div v-if="!videoInfo.title">
          请点击“获取”按钮获得视频信息。
        </div>
      </div>
      <div class="line title">
        更新频率
      </div>
      <div class="line">
        <a-select style="width: 7em" v-model:value="updateInterval">
          <a-select-option value="15">
            15秒钟
          </a-select-option>
          <a-select-option value="30">
            30秒
          </a-select-option>
          <a-select-option value="60">
            1分钟
          </a-select-option>
          <a-select-option value="300">
            5分钟
          </a-select-option>
          <a-select-option value="600">
            10分钟
          </a-select-option>
          <a-select-option value="1800">
            30分钟
          </a-select-option>
          <a-select-option value="3600">
            1小时
          </a-select-option>
        </a-select>
      </div>

      <div class="line" style="position: absolute;bottom: 1em;">
        <a-button :disabled="!this.videoInfo.title" size="large" type="primary">
          确定
        </a-button>
      </div>

    </div>

  </a-drawer>
</template>

<script>
import { message } from 'ant-design-vue'
import Vuuri from '../../../components/vuuri/Vuuri.vue'
import Widget from '../../../components/muuri/Widget.vue'

const runningTasks = [
  {
    template: {
      name: 'B站数据监控',
      icon: ''
    },
    id: '21312132',
    title: '第五期视频数据监控',
    data: {
      url: 'https://www.bilibili.com/video/BV1Tc411E75d/?vd_source=2b7e342ffb60104849f5db6262bb1e0b',
      cover: 'https://i0.hdslb.com/bfs/archive/5cba2bf8a22e79c6e2d4d0ef17b15eafdca9cf1d.jpg@320w_200h',
      title: '副屏操作系统，支持快捷指令化身超级控制台！闲置手机、平板终于能派上用场了',
      play: '2.3万',
      support: '1754',
      coin: '913',
      collection: '1082',
      share: '47',
      online: 9,
      prompt: 146,
      author: '玩屏开发者皮克斯'
    },
    tags: [
      '破万', '热门', '活动'
    ],
    current: {
      today: 5321,
      forecast: '1.5万',
      online: 23
    },
    suggest: {
      stage: 'S4',
      poolTitle: '初级流量池：10-15万',
      forecastTotal: '4.5万'
    },
    info: {
      startedTime: 92,
      times: 32,
      lastUpdate: '12:32'
    }
  }
]
export default {
  name: 'Index',
  components: {
    Widget,
    Vuuri,
  },
  data () {
    return {
      currentTab: 'running',
      addVideoVisible: false,
      updateInterval: 15,
      addUrl: '',
      videoInfo: {
        title: ''
      },
      watchTask: [],
      runningTasks: runningTasks,//正在运行中的任务
      currentTaskId: '',
    }
  },
  methods: {
    addTemplate(){

    },
    addVideo () {
      this.addVideoVisible = true
    },
    addWatch () {
      if (this.addUrl === '') {
        message.error('请输入视频链接')
      }
      this.currentTaskId = Date.now()
      tableApi.watch.addTask({
        id: this.currentTaskId,
        url: this.addUrl
      })
    }
  }
}
</script>

<style scoped>
.line {
  margin-bottom: 1em;
  padding-left: 1em;
}

.title {
  padding-left: 0;
  font-weight: bold;
}

.btn {
  text-align: center;
}

.bili-card {

}

.action-button {
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.62);
  padding: 1em;
  line-height: 1.5;
  color: #333;
  box-shadow:  rgba(47, 44, 45, 0.49) 0 0 12px;
}

.bili-card {
  background: linear-gradient(146deg, rgba(241, 94, 137, 0.82), rgba(255, 109, 151, 0.71));
  border-radius: 8px;
}
.stage{
  transform: rotate(30deg);
  background: #487cff;
  border-radius: 4px;
  width: 30px;
  display: inline-block;
  margin-top: 0.6em;
  font-weight: bold;
}

.bili-tag{
  display: inline-block;
  margin-right: 1em;
  font-size: 0.8em;
  border-radius: 4px;
  background: #f62562;
  padding: 0.2em 0.8em;
}

.bili-cover {
  width: 90px;
  height: 50px;
  border-radius: 6px;
}
</style>
<style lang="scss">
.monitor .muuri-item-content{
  background: none !important;
}
</style>
