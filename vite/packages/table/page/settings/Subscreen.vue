<template>
  <div class="mb-3">
    此功能暂时未完成开发，请勿尝试。
  </div>
  <a-tabs v-if="false" style="width:100%" v-model:activeKey="activeKey" type="editable-card" @edit="onEdit">
    <a-tab-pane v-for="screen in screens" :key="screen.key" :tab="screen.title" :closable="screen.closable">
      <div class="line-title">
        基础设置
      </div>
      <div v-if="screen.key!=='main'" class="line">
        名称：
        <a-input class="ml-3" v-model:value="screen.title" style="width: 250px"></a-input>
      </div>
      <div class="line">
        默认进入页面： <a-button type="primary" size="small">选择</a-button>
      </div>
      <template v-if="screen.key!=='main'">
        <div class="line">
          开机自启动：
          <a-switch v-model:checked="screen.autoStart"></a-switch>
        </div>
        <!--分屏专属设置项目        -->

        <!--分屏专属设置项目end        -->
      </template>
      <div class="line-title">
        系统功能设置
      </div>
      <template v-if="this.currentTip && this.tips[this.currentTip]">
        <a-alert class="mb-3"
                 v-if=" this.tips[this.currentTip].status"
                 :message="this.tips[this.currentTip].content"
                 type="info"
                 closable
                 :after-close="closeTip(this.currentTip)"
        />
      </template>

      <template v-if="screen.key!=='main'">
        <div v-if="screen.apps" class="line">
          独立底部导航栏：
          <a-switch v-model:checked="screen.apps.bottomPanel"></a-switch>
        </div>
        <div v-if="screen.apps" class="line">
          独立桌面：
          <a-switch v-model:checked="screen.apps.home"></a-switch>
        </div>
        <div v-if="screen.apps" class="line">
          独立壁纸：
          <a-switch v-model:checked="screen.apps.paper"></a-switch>
        </div>
        <div v-if="screen.apps" class="line">
          独立快捷指令：
          <a-switch v-model:checked="screen.apps.deck"></a-switch>
        </div>
      </template>
    </a-tab-pane>
  </a-tabs>
</template>

<script lang="ts">
import {screenStore} from '../../store/screen'
import {mapWritableState, mapActions} from 'pinia'
import {nanoid} from 'nanoid'
import {Modal} from 'ant-design-vue'

export default {
  name: 'subScreen',
  data() {
    return {
      activeKey: 'main',

    }
  },
  mounted() {
     this.resetTips()
    this.getTip()
  },
  methods: {
    ...mapActions(screenStore, ['reset','tips','currentTip','resetTips']),
    getTip(){
      this.currentTip=''
      console.log(Object.keys(this.tips),'this.tips')
      Object.keys(this.tips).forEach(key=>{
        if(this.tips[key].status){
          this.currentTip=key
          return false
        }
      })
      console.log(this.currentTip)
    },
    closeTip(tag){
      this.tips[tag].status=false
      this.getTip()
    },
    onEdit(targetKey: string | MouseEvent, action: string) {
      if (action === 'add') {
        this.add()
      } else {
        this.remove(targetKey as String)
      }
    },
    add() {
      this.screens.push({
        key: nanoid(6),
        title: '分屏',
        autoStart: true,
        closable: true,
        apps: {
          deck: false
        }
      })
    },
    remove(targetKey) {
      Modal.confirm({
        content: '确认删除分屏？此操作不可恢复，将丢失分屏全部的设置，请谨慎操作。',
        onOk: () => {
          this.screens.splice(this.screens.findIndex(s => {
            return s.key === targetKey
          }), 1)
        },
        okText: '确认删除'
      })
    }
  },
  computed: {
    ...mapWritableState(screenStore, ['screens'])
  }
}
</script>

<style scoped>

</style>
