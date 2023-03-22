<template>
  <h1 style="text-align: center">
    数据监控小助手
  </h1>

  <div>
    <a-tabs v-model:activeKey="currentTab" destroy-inactive-tab-pane="false">
      <a-tab-pane key="running" tab="运行中">
        <a-empty v-if="runningTasks.length===0" style="margin-top: 3em"
                 description="当前还没有正在监控中的任务"></a-empty>
        <div v-else>
          <vue-custom-scrollbar @contextmenu.stop="showMenu(-1,undefined,'wrapper')" :settings="scrollbarSettings"
                                style="position:relative;width:calc(100vw - 9em);  border-radius: 8px;height: calc(100vh - 12em)">
            <Vuuri :options="{layout:{horizontal:true}}" :getItemWidth="()=>{return '250px'}"
                   :getItemHeight="()=>{return '500px'}" class="monitor"
                   v-model="runningTasks">
              <template #item="{ item }">
                <Widget :uniqueKey="item.id">
                  <div class="p-2 bili-card">
                    <div class="text-more text-base mb-4 text-left">
                      <!--               <a-avatar :src="item.task.icon"></a-avatar> -->
                      <Icon icon="bilibili" style="font-size: 20px;vertical-align: text-top"></Icon>
                      {{ item.title || '-' }}
                    </div>
                    <div class="mb-3">
                      <a-row>
                        <a-col :span="10">
                          <img v-if="item.data.cover" class="bili-cover" :src="item.data.cover"/>
                          <a-avatar v-else class="bili-cover" style="line-height: 1.3;padding-top: 0.4em">
                            首次运行后<br/>自动获取
                          </a-avatar>
                        </a-col>
                        <a-col :span="14">
                          <div class="text-more text-xs" :title="item.data.title">{{ item.data.title || '-' }}</div>
                          <div>
                            <a-row class="text-xs" :gutter="10">
                              <a-col :span="8">
                                <Icon icon="bofang"></Icon>
                                <br/> {{ item.data.viewText || '-' }}
                              </a-col>
                              <a-col :span="8">
                                <Icon icon="dianzan"></Icon>
                                <br/> {{ item.data.like || '-' }}
                              </a-col>
                              <a-col :span="8">
                                <Icon icon="jinbi"></Icon>
                                <br/>{{ item.data.coin || '-' }}
                              </a-col>
                            </a-row>
                          </div>
                        </a-col>
                      </a-row>
                    </div>
                    <div class="mb-3">
                      <div class="bili-tag" v-for="tag in item.tags">{{ tag }}</div>
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
                          <div class="text-lg">-</div>
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
                          {{item.executed_times}}次
                        </a-col>
                        <a-col :span="12">
                          1小时32分钟<br>
                          <div v-if=" item.last_execute_info">
                            {{ friendlyDate(item.last_execute_info.grab_time) }} 更新
                          </div>
                          <div v-else>
                            未成功执行过
                          </div>

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
          </vue-custom-scrollbar>
        </div>
      </a-tab-pane>
      <a-tab-pane key="other" tab="未运行">
        <a-empty v-if="stoppedTasks.length===0" style="margin-top: 3em"
                 description="当前没有待机状态的任务"></a-empty>
        <div v-else>
          <vue-custom-scrollbar @contextmenu.stop="showMenu(-1,undefined,'wrapper')" :settings="scrollbarSettings"
                                style="position:relative;width:calc(100vw - 9em);  border-radius: 8px;height: calc(100vh - 12em)">
            <Vuuri :options="{layout:{horizontal:true}}" :getItemWidth="()=>{return '250px'}"
                   :getItemHeight="()=>{return '500px'}" class="monitor"
                   v-model="stoppedTasks">
              <template #item="{ item }">
                <Widget :uniqueKey="item.id">
                  <div class="p-2 bili-card">
                    <div class="text-more text-base mb-4 text-left">
                      <!--               <a-avatar :src="item.task.icon"></a-avatar> -->
                      <Icon icon="bilibili" style="font-size: 20px;vertical-align: text-top"></Icon>
                      {{ item.data.data.title }}
                    </div>
                    <div class="mb-3">
                      <a-row>
                        <a-col :span="10">
                          <img v-if="item.cover" class="bili-cover" :src="item.cover "/>
                          <a-avatar v-else class="bili-cover" style="line-height: 1.3;padding-top: 0.4em">
                            首次运行后<br/>自动获取
                          </a-avatar>
                        </a-col>
                        <a-col :span="14">
                          <div class="text-more text-xs">{{ item.data.title }}</div>
                          <div>
                            <a-row class="text-xs" :gutter="10">
                              <a-col :span="8">
                                <Icon icon="bofang"></Icon>
                                <br/> {{ item.data.play || '0' }}
                              </a-col>
                              <a-col :span="8">
                                <Icon icon="dianzan"></Icon>
                                <br/> {{ item.data.support || '0' }}
                              </a-col>
                              <a-col :span="8">
                                <Icon icon="jinbi"></Icon>
                                <br/>{{ item.data.coin || '0' }}
                              </a-col>
                            </a-row>
                          </div>
                        </a-col>
                      </a-row>
                    </div>
                    <div class="mb-3">
                      <div class="bili-tag" v-for="tag in item.tags">{{ tag }}</div>
                    </div>

                    <div v-if="0" class="mb-4">
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

                    <div v-if="0" class="mb-4">
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
                          {{ item.last_execute_times || '0' }}次
                        </a-col>
                        <a-col :span="12">
                          {{ item.executed_time_length || '从未运行' }}
                          <br> <span v-if="item.executed_time_length">
                        刷新于 {{ friendlyDate(item.last_execute_time) }}
                        </span><span v-else>请点击运行</span>
                        </a-col>
                        <a-col :span="6">
                          <a-button @click="startTask(item)" type="primary">
                            <Icon class="text-xl" icon="bofang"></Icon>
                          </a-button>

                        </a-col>
                      </a-row>
                    </div>
                  </div>

                </Widget>
              </template>
            </Vuuri>
          </vue-custom-scrollbar>
        </div>
      </a-tab-pane>
      <a-tab-pane key="taskTemplate" tab="任务模板">

      </a-tab-pane>
      <template #rightExtra>
        <a-dropdown-button type="primary" @click="addVideo">
          创建任务
          <template #overlay>
            <a-menu @click="handleMenuClick">
              <a-menu-item @click="test" key="1">
                创建任务模板
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown-button>
      </template>
    </a-tabs>
  </div>

  <a-drawer :width="600" class="no-drag" v-model:visible="addVideoVisible" style="overflow: hidden">
    <div style="margin:1em;overflow: hidden">
      <div class="line-title">
        任务信息
      </div>
      <div class="line">
        <a-row>
          <a-col :span="4">
            网页URL：
          </a-col>
          <a-col :span="4">
            <a-input-group style="width:538px;" compact>
              <a-input v-model:value="addTask.url" placeholder="网页链接，http或https开头"
                       style="width: calc(100% - 200px)">
              </a-input>
              <a-button @click="test" type="primary">
                测试
              </a-button>
            </a-input-group>
          </a-col>
        </a-row>
      </div>
      <div class="line">
        <a-row>
          <a-col :span="4">
            任务名称：
          </a-col>
          <a-col>
            <a-input style="width: 400px" placeholder="输入任务名称" v-model:value="addTask.title"></a-input>
          </a-col>
        </a-row>
      </div>
      <div class="line">
        <a-row>
          <a-col :span="4">
            更新频率：
          </a-col>
          <a-col>
            <a-select style="width: 7em" v-model:value="addTask.interval">
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
          </a-col>
        </a-row>

      </div>
      <div class="line title">
        测试结果：
      </div>
      <div v-if="addTaskInfo.title" class="line">
        {{ addTaskInfo.title }}
      </div>
      <div v-else class="line">
        请点击“测试”按钮获得视频信息。
      </div>

      <div class="line" style="position: absolute;bottom: 1em;">
        <a-button @click="doAddTask" size="large" type="primary">
          确定
        </a-button>
      </div>

    </div>

  </a-drawer>
</template>

<script>
import { message, Modal } from 'ant-design-vue'
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
      scrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: true,
        suppressScrollX: false,
        wheelPropagation: true
      },
      addTask: {//添加任务表单
        title: '',
        url: ''
      },
      currentTab: 'running',
      addVideoVisible: false,
      updateInterval: 15,
      addUrl: '',
      addTaskInfo: {
        title: ''
      },
      watchTask: [],
      currentTaskId: '',

      tasks: [],
      runningTasks: [],//运行中的任务，需要单独一个数组，不然回被影响到
      stoppedTasks: [],//停止的任务，这些任务都是要刷新分类的

      taskIntervals: {}//任务自动刷新数据的interval 用于更新数据 ,id=>timer
    }
  },
  computed: {},
  mounted () {
    this.loadAllTasks().then()
    this.setUpTaskUpdateHandler()//挂载状态更新器
  },
  unmounted () {
    tableApi.watch.setTaskUpdateHandler(null)//卸载处理器，防止不在这个页面上也执行这个处理方法
    this.cleanTaskIntervals()
  },
  methods: {
    friendlyDate (time) {
      return tsbApi.util.friendlyDate(time)
    },
    sortTasks () {
      this.runningTasks = this.tasks.filter(task => {
        return task.running
      })
      this.stoppedTasks = this.tasks.filter(task => {
        return !task.running
      })
    },

    /**
     * 设置任务状态更新处理方法
     */
    setUpTaskUpdateHandler () {
      tableApi.watch.setTaskUpdateHandler(this.taskUpdateHandler)
    },
    /**
     * 任务状态更新的处理器
     * @param task
     */
    taskUpdateHandler (task) {
      this.tasks.forEach((t, index) => {
        if (t.nanoid === task.nanoid) {
          this.tasks.splice(index, 1)
          this.tasks.splice(index, 0, task)
        }
      })
      this.sortTasks()
    },
    startTask (task) {
      tableApi.watch.startTask(task)
    },
    cleanTaskIntervals () {
      try {
        let keys = Object.keys(this.taskIntervals)
        keys.forEach(key => {
          clearInterval(this.taskIntervals[key])
        })
        this.taskIntervals = {}
      } catch (e) {
        console.warn('清理计时器错误')
      }
    },
    setupInterval (task) {
      this.taskIntervals[task.nanoid] = setInterval(() => {
        if(task){
          //只有当任务还存在的时候才执行
          this.updateTaskLatestData(task).then()
        }
      }, task.interval * 1000)
    },

    async updateTaskLatestData (task) {
      let lastInfo=await tableApi.watch.getLatestData(task)
      if(lastInfo){
        console.log('抓到了task的数据，准备更新',task,lastInfo)
        this.runningTasks.forEach(t=>{
          //去更新运行中的任务信息
          if(t.nanoid===task.nanoid){
            t.data=lastInfo.data
            t.last_execute_info=lastInfo.last_execute_info
          }
        })
      }
    },
    async loadAllTasks () {
      this.cleanTaskIntervals()
      let tasks = await tableApi.watch.listAllTasks()
      tasks.forEach((task) => {
        this.setupInterval(task)
        //无需处理了
        if (!task.data) {
          task.data = {
            data: {}
          }//重新处理一下data
        }
      })
      this.tasks = tasks

      this.sortTasks()
    },
    addVideo () {
      this.addVideoVisible = true
    },
    async doAddTask () {
      let addTask = this.addTask
      if (!addTask.title.trim()) {
        message.error('必须输入一个标题')
        return
      }
      if (!addTask.url.trim() && !addTask.title.startsWith('http')) {
        message.error('必须输入正确的网址，建议输入后测试是否可正确获取。')
        return
      }

      let result = await tableApi.watch.addTask({
        title: addTask.title,
        url: addTask.url,
        interval: addTask.interval
      })

      if (result.status) {
        this.loadAllTasks().then()
        message.success('添加任务成功。')
      } else {
        console.warn(result.info)
        message.error('添加任务失败，请检查输入。')
      }

    },
    test () {
      if (this.addTask.url === '' || !this.addTask.url.startsWith('http')) {
        message.error('请输入正确的网页链接')
        return
      }
      this.currentTaskId = Date.now()
      message.info({ content: '开始测试，正在等待测试结果', key: 'test' })
      tableApi.watch.testTask({
        id: this.currentTaskId,
        url: this.addTask.url
      }, (data) => {
        this.addTaskInfo = data.data
        message.success({ content: '测试成功。', key: 'test' })
      }, () => {
        this.addTaskInfo = {}
        Modal.info({ 'content': '测试未能成功返回，请稍后再试。' })
      }, () => {
        this.addTaskInfo = {}
        Modal.info({ content: '测试超时，请稍后再试。', key: 'test' })
      }, 10)
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
  box-shadow: rgba(47, 44, 45, 0.49) 0 0 12px;
}

.bili-card {
  margin-right: 10px;
  background: linear-gradient(146deg, rgba(241, 94, 137, 0.82), rgba(255, 109, 151, 0.71));
  border-radius: 8px;
}

.stage {
  transform: rotate(30deg);
  background: #487cff;
  border-radius: 4px;
  width: 30px;
  display: inline-block;
  margin-top: 0.6em;
  font-weight: bold;
}

.bili-tag {
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
.monitor .muuri-item-content {
  background: none !important;
}
</style>
