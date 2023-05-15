<template>
  <div style="height: 100%;display: flex;justify-content: center;align-content: center;flex-direction: column">
    <div @click.stop style="background: #111;border: 1px solid #333" class="p-3 rounded-md mt-3">

      <div @click="click(screen)" @dblclick="dblclick(screen)"
           :class="{die:!screen.running && screen.key!=='main',active:screen.active}" v-for="screen in screens"
           class="pointer screen rounded-md mb-2" style="display: inline-block;position: relative">
        <a-image :preview="false"
                 fallback="/public/icons/logo128.png"
                 class="screen-preview" :width="120" :height="80" :src="'file://'+screen.capture"></a-image>
        <span style="" class="p-2 screen-title">{{ screen.title }}</span>
      </div>
      <div class="text-right ">
        <a-button @click="add" class="mr-3">创建</a-button>
        <a-button @click="tagScreen">辨别</a-button>
      </div>
    </div>
    <div class="p-3" @click.stop>
      <div class="line-title text-center" style="font-size: 24px">
        <span :style="{'cursor':currentScreen.key!=='main'?'text':''}" v-if="!editing" @click="toggleEdit"><edit-outlined v-if="currentScreen.key!=='main'"/> {{ currentScreen.title }}</span>
        <a-input-group size="large" v-else compact>
          <a-input @keyup.esc="toggleEdit" @keyup.enter="setTitle" v-model:value="newTitle" placeholder="Enter确认"
                   style="width: calc(100% - 200px);"></a-input>
          <a-button size="large" @click="toggleEdit">取消</a-button>
        </a-input-group>
      </div>
      <template v-if="currentScreen.key!=='main'">
        <a-row :gutter="[20,20]" style="font-size: 1.2em;text-align: center;">
          <a-col :span="6">
            <div class="btn relative ">
              <a-switch @change="toggleScreen" v-model:checked="currentScreen.running"></a-switch>
              <div class="mt-3">
                启用分屏
              </div>
            </div>
          </a-col>
          <a-col v-if="currentScreen.settings" :span="6">
            <div class="btn relative ">
              <a-switch v-model:checked="currentScreen.settings.autoRun"></a-switch>
              <div class="mt-3">
                自启动
              </div>
            </div>
          </a-col>
          <a-col :span="6" >
            <div @click="restore" class="btn">
              <Icon icon="huanyuan" style="font-size: 2em"></Icon>
              <div >
                重置缩放
              </div>
            </div>
          </a-col>

          <a-col :span="6" v-if="false">
            <div @click="setTouch" class="btn">
              <Icon icon="Touch" style="font-size: 2em"></Icon>
              <div >
                设置屏幕
              </div>
            </div>
          </a-col>
        </a-row>
      </template>
    </div>
  </div>

</template>

<script>
import { mapWritableState, mapActions } from 'pinia'
import { screenStore } from '../../store/screen'
import _ from 'lodash-es'
import { EditOutlined } from '@ant-design/icons-vue'
import { mainIPC } from '../../js/common/screenIPC'

export default {
  name: 'ScreenManage',
  data () {
    return {
      currentScreen: {},
      editing: false,
      newTitle: ''
    }
  },
  components: { EditOutlined },
  computed: {
    ...mapWritableState(screenStore, ['screens']),
  },

  mounted () {
    this.screens.forEach(s => {
      if (!s.settings) {
        s.settings = {}
      }
    })
    this.screens.map(s => {
      if (s.active) {
        this.currentScreen = s
      }
    })
  },
  methods: {
    ...mapActions(screenStore, ['startupScreen', 'tagScreen', 'stopScreen', 'add']),
    toggleScreen (checked) {
      if (checked) {
        this.startupScreen(this.currentScreen.key)
      } else {
        this.stopScreen(this.currentScreen.key)
        this.currentScreen.running = false
      }
    },
    toggleEdit () {
      if(this.currentScreen.key==='main') return
      this.editing = !this.editing
      if (this.editing) {
        this.newTitle = ''
      }
    },
    setTitle () {
      this.currentScreen.title = this.newTitle
      this.toggleEdit()
      mainIPC.sendToSub(this.currentScreen.key, 'updateDetail', { detail: JSON.parse(JSON.stringify(this.currentScreen)) })
    },
    dblclick (screen) {
      if (screen.key !== 'main')
        this.startupScreen(screen.key)
    },
    restore(){
      mainIPC.sendToSub(this.currentScreen.key,'restore')
    },
    click (screen) {
      this.currentScreen = screen
      this.screens.forEach(s => {
        s.active = false
      })
      screen.active = true
    }
  }
}
</script>
<style lang="scss">
.screen.die {
  .ant-image-img {
    filter: grayscale(100%);
  }

  opacity: 0.7
}

.screen {
  .ant-image-img {
    object-fit: scale-down;
    width: 120px !important;
    height: 80px !important;
  }
}
</style>
<style scoped lang="scss">
.screen {
  opacity: 0.7;
  border: #343434 2px solid;
  margin-right: 0.5em;
  background: #1c1c1c;
  cursor: pointer;

  &:hover {
    border: rgba(255, 255, 255, 0.56) 2px solid;
    opacity: 0.9;
  }
}


.screen.active {
  border: white 2px solid;
  opacity: 1;
}

.screen-title {
  position: absolute;
  bottom: 0;
  right: 0;
  color: white;
  background: rgba(51, 51, 51, 0.6);
  padding-top: 3px;
  padding-bottom: 3px;
  font-size: 13px;
}
</style>
