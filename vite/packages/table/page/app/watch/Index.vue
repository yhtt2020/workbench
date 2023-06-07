<template>
  <h1 style="text-align: center;color:var(--primary-text)">
    数据监控小助手
  </h1>

  <div>
    <a-tabs v-model:activeKey="currentTab" destroy-inactive-tab-pane="false">
      <a-tab-pane key="running" tab="运行中">
        <a-empty v-if="runningTasks.length===0" style="margin-top: 3em;color:var(--primary-text)"
                 description="当前还没有正在监控中的任务"></a-empty>
        <div v-else>
          <vue-custom-scrollbar :settings="scrollbarSettings"
                                style="position:relative;width:calc(100vw - 9em);  border-radius: 8px;height: calc(100vh - 12em)">
            <Vuuri :key="runningTasksKey" :options="{layout:{horizontal:true}}" :getItemWidth="()=>{return '250px'}"
                   :getItemHeight="()=>{return '500px'}" class="monitor"
                   v-model="runningTasks">
              <template #item="{ item }">
                <Widget :uniqueKey="item.nanoid" >
                  <div @contextmenu.stop="showMenu(item)"   @click="goDashboard(item.nanoid)" class="p-2 bili-card" style="background: var(--primary-bg);color: var(--primary-text);">
                    <div class="text-more text-base mb-4 text-left">
                      <!--               <a-avatar :src="item.task.icon"></a-avatar> -->
                      <Icon icon="bilibili" style="font-size: 20px;vertical-align: text-top"></Icon>
                 {{ item.title || '-' }} <span style="float:right"><Icon icon="shijian"></icon> {{formatSeconds(item.interval)}}</span>
                    </div>
                    <div class="mb-3">
                      <a-row>
                        <a-col :span="10">
                          <img v-if="item.data.cover" class="bili-cover" :src="fixHttp(item.data.cover+'@320w_200h')"/>
                          <a-avatar v-else class="bili-cover" style="line-height: 1.3;padding-top: 0.4em;background: var(--primary-bg);color: var(--primary-text);">
                            首次运行后<br/>自动获取
                          </a-avatar>
                        </a-col>
                        <a-col :span="14">
                          <div class="text-more text-xs" :title="item.data.title">{{ item.data.title || '-' }}</div>
                          <div>
                            <a-row class="text-xs" :gutter="10">
                              <a-col :span="12">
                                <Icon icon="bofang"></Icon>
                                <br/> {{ item.data.viewText || '-' }}
                              </a-col>
                              <a-col :span="12">
                                <Icon icon="dianzan"></Icon>
                                <br/> {{ item.data.like || '-' }}
                              </a-col>

                            </a-row>
                          </div>
                        </a-col>
                      </a-row>
                    </div>
<!--                    <div class="mb-3">-->
<!--                      <div class="bili-tag" v-for="tag in item.tags">{{ tag }}</div>-->
<!--                    </div>-->

<!--                    <div class="mb-4">-->
<!--                      <a-row>-->
<!--                        <a-col :span="8">-->
<!--                          <div class="text-xs">今日票房</div>-->
<!--                          <div class="text-lg">5321</div>-->
<!--                        </a-col>-->
<!--                        <a-col :span="8">-->
<!--                          <div class="text-xs">全天预测-->
<!--                          </div>-->
<!--                          <div class="text-lg">-->
<!--                            1.5万-->
<!--                          </div>-->
<!--                        </a-col>-->
<!--                        <a-col :span="8">-->
<!--                          <div class="text-xs"> 当前在看</div>-->
<!--                          <div class="text-lg">-</div>-->
<!--                        </a-col>-->
<!--                      </a-row>-->
<!--                    </div>-->

                    <div class="mb-4" v-if="item.stage">
                     <BiliStage :stage="item.stage"></BiliStage>
                    </div>
                    <div class="text-xs action-button" style="background: var(--primary-bg);color: var(--primary-text);">
                      <a-row>
                        <a-col :span="6">
                          已运行<br>
                          {{ item.executed_times }}次
                        </a-col>
                        <a-col :span="12">
                          {{ item.executed_time_until_now }}<br>
                          <div v-if=" item.last_execute_info">
                            {{ friendlyDate(item.last_execute_info.grab_time) }} 更新
                          </div>
                          <div v-else>
                            未成功执行过
                          </div>

                        </a-col>
                        <a-col  :span="6">
                          <a-button @click.stop="stopTask(item)" type="primary">
                          <Icon class="text-xl" icon="zanting"></Icon>
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
      <a-tab-pane key="other" tab="未运行">
        <a-empty v-if="stoppedTasks.length===0" style="margin-top: 3em;color:var(--primary-text)"
                 description="当前没有待机状态的任务"></a-empty>
        <div v-else>
          <vue-custom-scrollbar :settings="scrollbarSettings"
                                style="position:relative;width:calc(100vw - 9em);  border-radius: 8px;height: calc(100vh - 12em);">
            <Vuuri :key="stoppedTasksKey" :options="{layout:{horizontal:true}}" :getItemWidth="()=>{return '250px'}"
                   :getItemHeight="()=>{return '500px'}" class="monitor"
                   v-model="stoppedTasks">
              <template #item="{ item }">
                <Widget :uniqueKey="item.id" >
                  <div @contextmenu.stop="showMenu(item)" @click="goDashboard(item.nanoid)" class="p-2 bili-card" style="background: var(--primary-bg);color: var(--primary-text);">
                    <div class="text-more text-base mb-4 text-left">
                      <!--               <a-avatar :src="item.task.icon"></a-avatar> -->
                      <Icon icon="bilibili" style="font-size: 20px;vertical-align: text-top"></Icon>
                   233   {{ item.title }} <span style="float:right"><Icon icon="shijian"></icon> {{formatSeconds(item.interval)}}</span>
                    </div>
                    <div class="mb-3">
                      <a-row>
                        <a-col :span="10">
                          <img v-if="item.data.cover" class="bili-cover" :src="fixHttp(item.data.cover+'@320w_200h')"/>
                          <a-avatar v-else class="bili-cover" style="line-height: 1.3;padding-top: 0.4em">
                            首次运行后<br/>自动获取
                          </a-avatar>
                        </a-col>
                        <a-col :span="14">
                          <div class="text-more text-xs">{{ item.data.title }}</div>
                          <div>
                            <a-row class="text-xs" :gutter="10">
                              <a-col :span="12">
                                <Icon icon="bofang"></Icon>
                                <br/> {{ item.data.viewText || '0' }}
                              </a-col>
                              <a-col :span="12">
                                <Icon icon="dianzan"></Icon>
                                <br/> {{ item.data.like || '0' }}
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

                    <div class="mb-4" v-if="item.stage">
                      <BiliStage :stage="item.stage"></BiliStage>
                    </div>
                    <div class="text-xs action-button" style="background: var(--primary-bg);color: var(--primary-text);">
                      <a-row>
                        <a-col :span="6">
                          已运行<br>
                          {{ item.executed_times || '0' }}次
                        </a-col>
                        <a-col :span="12">
                          <div style="line-height: 35px" v-if=" item.last_execute_info">
                            {{ friendlyDate(item.last_execute_info.grab_time) }} 停止
                          </div>
                          <div v-else>
                            未成功执行过
                          </div>
                        </a-col>
                        <a-col :span="6">
                          <a-button @click.stop="startTask(item)" type="primary" class="relative">
                            <Icon class="text-xl" icon="suoding" v-if="superiorLimit<=runningTasks.length||blocking===false"></Icon>
                            <Icon class="text-xl" icon="bofang" v-else></Icon>
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

  <a-drawer :width="600" class="no-drag" v-model:visible="addTaskVisible" style="overflow: hidden">
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
            <a-select style="width: 7em" default-value="300" v-model:value="addTask.interval">
<!--              <a-select-option value="15">-->
<!--                15秒钟-->
<!--              </a-select-option>-->
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
            <div class="mt-1">
              更新频率越小，越吃电脑性能，推荐每5-10分钟更新一次。
            </div>
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

  <a-drawer
    :title="null"
    placement="bottom"
    :closable="true"
    v-model:visible="menuVisible"
    @close="onClose"
  >
    <a-row :gutter="20">
      <template  v-if="currentTask">
        <a-col>
          <div @click="delTask" class="btn">
            <Icon style="font-size: 3em" icon="shanchu"></Icon>
            <div>删除任务</div>
          </div>
        </a-col>
        <a-col>
          <div @click="editTask" class="btn">
            <Icon style="font-size: 3em" icon="shenqing"></Icon>
            <div>编辑任务</div>
          </div>
        </a-col>
      </template>

    </a-row>
    <a-row style="margin-top: 1em" :gutter="[20,20]">
      <a-col>
        <div @click="toggleEditing" class="btn">
          <Icon   style="font-size: 3em" icon="shezhi"></Icon>
          <div><span >设置</span></div>
        </div>
      </a-col>
    </a-row>

  </a-drawer>
  <a-modal v-model:visible="clickTipShow" :closable="false"  title="" @ok="()=>{}" :footer="null" style="font-size: 8px" :maskClosable="false" :centered="true">
    <div class="flex flex-col items-center rounded-lg h-44 w-96 justify-evenly text-sm text-white mx-auto" style="background: rgba(33, 33, 33, 1);">
      <div><Icon icon="-dengpao" style="font-size: 1.2em" class="mr-2"></Icon>提示</div>
      <div v-if="blocking===false">当前「 等级{{lv}} 」，解锁{{powerAlias}}功能需要达到「 等级 {{powerLv}} 」</div>
      <div v-else>当前「 等级{{lv}} 」，已达当前等级上限</div>
      <div class="flex flex-row w-2/3  justify-between">
        <div class="rounded-lg w-28 h-10 flex justify-center items-center mt-4 pointer" style="background: rgba(42, 42, 42, 1);" @click="goGrade">了解更多</div>
        <div class="rounded-lg w-28 h-10 flex justify-center items-center mt-4 pointer" style="background: rgba(42, 42, 42, 1);" @click="closeTip">关闭</div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { message, Modal } from 'ant-design-vue'
import Vuuri from '../../../components/vuuri/Vuuri.vue'
import Widget from '../../../components/muuri/Widget.vue'
import bili from '../../../js/watch/bili'
import BiliStage from '../../../components/watch/BiliStage.vue'
import { formatSeconds,fixHttp } from '../../../util'
import {powerState} from '../../../js/watch/grade'
export default {
  name: 'Index',
  components: {
    BiliStage,
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
        url: '',
        interval:'300',
      },
      currentTab: 'running',
      addTaskVisible: false,
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

      updateExecutedTimer:null,

      taskIntervals: {},//任务自动刷新数据的interval 用于更新数据 ,id=>timer

      currentTask:null,
      menuVisible:false,
      stoppedTasksKey:Date.now(),
      runningTasksKey:Date.now(),
      superiorLimit:10,
      lv:0,
      clickTipShow:false,
      blocking:false,
      powerAlias:'',
      powerLv:0,
    }
  },
  computed: {},
  mounted () {
    this.lv = lv
    const {blocking,superiorLimit,powerAlias,powerLv}=this.powerState('dataMonitoring',lv)
    this.superiorLimit=superiorLimit
    this.blocking=blocking
    this.powerAlias=powerAlias
    this.powerLv=powerLv
    this.loadAllTasks().then()
    this.setUpTaskUpdateHandler()//挂载状态更新器
    this.updateExecutedTimer=setInterval(()=>{
      this.updateExecutedTime()
    },1000)
  },
  unmounted () {
    tableApi.watch.setTaskUpdateHandler(null)//卸载处理器，防止不在这个页面上也执行这个处理方法
    this.cleanTaskIntervals()
    clearInterval(this.updateExecutedTimer)
  },
  methods: {
    powerState,
    closeTip(){
      this.clickTipShow=false
    },
    goGrade(){
      this.closeTip()
      this.$router.push({ name: 'grade'})
    },
    showMenu(task){
      this.currentTask=task
      this.menuVisible=true
    },
    delTask(){
      this.menuVisible=false
      if(!this.currentTask){
        console.warn('不存在任务',this.currentTask)
        return
      }
      Modal.confirm({
        content:'是否删除任务？这将导致关于此任务的所有统计数据丢失。此操作不可恢复。',
        centered:true,
        onOk:async () => {
          let rs=await tableApi.watch.delTask(this.currentTask)
          if(rs){
            this.removeFromTasks(this.currentTask.nanoid)
            message.success('删除任务成功')
          }else{
            message.error('删除任务失败，数据库操作失败')
          }
        }
      })
    },
    fixHttp:fixHttp,
    removeFromTasks(taskId){
      let foundTasks=this.tasks.findIndex(t=>{
        return t.nanoid===taskId
      })
      if(foundTasks>-1){
        this.tasks.splice(foundTasks,1)
      }
      let foundRunningTask= this.runningTasks.findIndex(t=>{
        return t.nanoid===taskId
      })
      if(foundRunningTask>-1){
        this.runningTasks.splice(foundRunningTask,1)
        this.runningTasksKey=Date.now()
      }

      let foundStoppedTask=this.stoppedTasks.findIndex(t=>{
        return t.nanoid===taskId
      })
      if(foundStoppedTask>-1){
        this.stoppedTasks.splice(foundStoppedTask,1)
        this.stoppedTasksKey=Date.now()
      }
    },
    updateExecutedTime(){
      this.runningTasks.forEach(task=>{
        task.executed_time_until_now=this.formatSeconds((Date.now()-task.last_execute_time)/1000)
      })
    },
    formatSeconds:formatSeconds,
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
      if(this.superiorLimit<=this.runningTasks.length||this.blocking===false) {
        this.clickTipShow=true
        return
      }
      task.last_execute_time=Date.now()
      tableApi.watch.startTask(task)
    },
    stopTask (task) {
      tableApi.watch.stopTask(task)
    },
    goDashboard(nanoid){
      console.log('go',nanoid)
      this.$router.push({
        name:'dashboard',
        params:{
          nanoid:nanoid
        }
      })
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
      if(!task.interval){
        console.warn('task的interval不存在，默认赋值10s')
        task.interval=10
      }
      this.taskIntervals[task.nanoid] = setInterval(() => {
        if (task) {
          //只有当任务还存在的时候才执行
          this.updateTaskLatestData(task).then()
        }
      }, task.interval * 1000)
    },
    updateTask (id, info) {
      this.tasks.forEach((t, index) => {
        if (t.nanoid === id) {
          this.tasks.splice(index, 1)
          let replace = Object.assign(t, info)
          this.tasks.splice(index, 0, replace)
        }
      })
      this.runningTasks.forEach((t, index) => {
        //去更新运行中的任务信息
        if (t.nanoid === id) {
          this.runningTasks.splice(index, 1)
          let replace = Object.assign(t, info)
          this.runningTasks.splice(index, 0, replace)
        }
        this.runningTasksKey=Date.now()//刷新
      })

      this.stoppedTasks.forEach((t, index) => {
        if (t.nanoid === id) {
          this.stoppedTasks.splice(index, 1)
          let replace = Object.assign(t, info)
          this.stoppedTasks.splice(index, 0, replace)
        }
      })
    },

    async updateTaskLatestData (task) {
      let lastInfo = await tableApi.watch.getLatestData(task)
      if (lastInfo) {
        console.log('抓到了task的数据，准备更新', task, lastInfo)
        this.updateTask(task.nanoid, lastInfo)
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
            data: {
              stage:{
                data:{}
              }
            }
          }//重新处理一下data
        }else{
          task.stage=bili.guessStage(task.data.view)
        }

      })
      this.tasks = tasks

      this.sortTasks()
    },
    addVideo () {
      this.addTaskVisible = true
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
        this.addTaskVisible=false
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
      message.info({ content: '开始测试', key: 'test' })
      tableApi.watch.testTask({
        id: this.currentTaskId,
        url: this.addTask.url
      }, (data) => {
        this.addTaskInfo = data.data
        message.success({ content: '测试成功。', key: 'test' })
      }, () => {
        this.addTaskInfo = {}
        Modal.info({ 'content': '测试未能成功返回，请稍后再试。', key: 'test' })
      }, () => {
        this.addTaskInfo = {}
        Modal.info({ content: '测试超时，请稍后再试。', key: 'test' })
      }, 10)
    }
  }
}
</script>

<style scoped>
:deep(.ant-tabs-tab) {
  background: none !important;
}
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
