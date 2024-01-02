<template>
  <!-- 快速搜索 分屏 -->
  <div style="height: 100%;display: flex;justify-content: center;align-content: center;flex-direction: column;">
    <div @click.stop
         style="background: #111;border: 1px solid #333;background-color:var(--primary-bg) ; color: var(--primary-text);"
         class="p-3 rounded-md mt-3">

      <div @click="click(screen)" @dblclick="dblclick(screen)"
           :class="{die:!screen.running && screen.key!=='main',active:screen.active}" v-for="screen in screens"
           class="pointer screen rounded-md mb-2" style="display: inline-block;position: relative;">
        <a-image v-if="screen.key!=='main'" :preview="false"
                 fallback="/public/icons/main.png"
                 class="screen-preview" :width="120" :height="70" :src="'file://'+screen.capture"></a-image>
        <a-image v-else :preview="false"
                 fallback="/public/icons/logo128.png"
                 class="screen-preview" :width="120" :height="70" src="/public/icons/main.png"></a-image>
        <span v-if="screen.key!=='main'" style="" class="p-2 screen-title">{{ screen.title }}</span>
        <span v-else
              style="left: 50%;top:50%;font-size: 24px;width: 100px;transform: translateY(-60%) translateX(-50%);text-align: center;line-height: 30px;border-radius: 4px;background: none;"
              class="p-2 screen-title">{{ screen.title }}</span>
      </div>
      <div class="text-right ">
        <a-button @click="addScreen" class="mr-3 no-dark" style="color:var(--primary-text)">创建</a-button>
        <a-button @click="tagScreen" style="color:var(--primary-text)">辨别</a-button>
      </div>
    </div>
    <div class="p-3" @click.stop>
      <div class="line-title text-center" style="font-size: 24px">
        <span :style="{'cursor':currentScreen.key!=='main'?'text':''}" v-if="!editing" @click="toggleEdit"><edit-outlined
          v-if="currentScreen.key!=='main'"/> {{ currentScreen.title }}</span>
        <a-input-group size="large" v-else compact>
          <a-input @keyup.esc="toggleEdit" @keyup.enter="setTitle" v-model:value="newTitle" placeholder="Enter确认"
                   style="width: calc(100% - 200px);"></a-input>
          <a-button size="large" @click="toggleEdit">取消</a-button>
        </a-input-group>
      </div>
      <template v-if="currentScreen.key!=='main'">
        <a-row :gutter="[20,20]" style="font-size: 1.2em;text-align: center;">
          <a-col :span="5">
            <div class="btn relative ">
              <a-switch @change="toggleScreen" v-model:checked="currentScreen.running"></a-switch>
              <div class="mt-3">
                启用分屏
              </div>
            </div>
          </a-col>
          <a-col v-if="currentScreen.settings" :span="5">
            <div class="btn relative ">
              <a-switch v-model:checked="currentScreen.settings.autoRun"></a-switch>
              <div class="mt-3">
                自启动
              </div>
            </div>
          </a-col>
          <a-col :span="5">
            <div @click="restore" class="btn">
              <Icon icon="huanyuan" style="font-size: 2em"></Icon>
              <div>
                重置缩放
              </div>
            </div>
          </a-col>
          <a-col :span="5">
            <div @click="chooseScreen" class="btn">
              <Icon icon="touping" style="font-size: 2em"></Icon>
              <div>
                选择屏幕
              </div>
            </div>
          </a-col>
          <a-col :span="4" v-if="false">
            <div @click="setTouch" class="btn">
              <Icon icon="Touch" style="font-size: 2em"></Icon>
              <div>
                设置目标屏幕
              </div>
            </div>
          </a-col>
          <a-col :span="4">
            <div @click="remove" class="btn">
              <Icon icon="shanchu" style="font-size: 2em"></Icon>
              <div>
                删除屏幕
              </div>
            </div>
          </a-col>
        </a-row>
      </template>
    </div>
  </div>
  <xt-modal v-model="chooseScreenVisible">
    <div style="width: 500px;height:400px">
      <ChooseScreen :customCallback="true" @setScreen="setSubBounds"></ChooseScreen>
      <a-checkbox style="position: absolute;left:50%;bottom:0;transform: translateX(-50%)"
                  v-model:checked="setFullscreen">自动最大化
      </a-checkbox>
    </div>

  </xt-modal>
</template>

<script>
import { mapWritableState, mapActions } from 'pinia'
import { screenStore } from '../../store/screen'
import _ from 'lodash-es'
import { EditOutlined } from '@ant-design/icons-vue'
import { mainIPC } from '../../js/common/screenIPC'
import { Modal } from 'ant-design-vue'
import ChooseScreen from '../../page/ChooseScreen.vue'

export default {
  name: 'ScreenManage',
  data () {
    return {
      currentScreen: {},
      editing: false,
      newTitle: '',
      setFullscreen: false,
      chooseScreenVisible: false,
    }
  },
  components: { ChooseScreen, EditOutlined },
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
    addScreen () {
      let s = this.add()
      this.select(s.key)
    },
    toggleScreen (checked) {
      if (checked) {
        this.startupScreen(this.currentScreen.key)
      } else {
        this.stopScreen(this.currentScreen.key)
        this.currentScreen.running = false
      }
    },
    toggleEdit () {
      if (this.currentScreen.key === 'main') return
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
    restore () {
      mainIPC.sendToSub(this.currentScreen.key, 'restore')
    },
    chooseScreen () {
      this.chooseScreenVisible = true
    },
    setSubBounds (data) {
      console.log('点击触发')
      console.log(data)
      let bounds = data.display.bounds
      let width = bounds.width > 1200 ? 1200 : bounds.width
      let height = bounds.height > 800 ? 800 : bounds.height
      let setBounds={
        x:+ (bounds.x + bounds.width/2  - width / 2).toFixed(0),
        y: + (bounds.y + bounds.height/2 - height / 2).toFixed(0),
        width: width,
        height: height
      }
      console.log(setBounds,'setbounds')
      mainIPC.sendToSub(this.currentScreen.key, 'setScreen', {
        bounds: setBounds,
        fullscreen: this.setFullscreen
      })
    },
    select (key) {
      this.screens.map(s => {
        s.active = false
        if (s.key === key) {
          this.currentScreen = s
          s.active = true
        }
      })
    },
    remove () {
      Modal.confirm({
        centered: true,
        content: '确认删除分屏？此操作不可恢复，将丢失分屏全部的设置，请谨慎操作。',
        onOk: () => {
          this.screens.splice(this.screens.findIndex(s => {
            return s.key === this.currentScreen.key
          }), 1)
          this.select('main')

        },
        okText: '确认删除'
      })
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
.btn {
  background: var(--mask-item-background-color);
  color: var(--font-color);
}

.screen.die {
  .ant-image-img {
    filter: grayscale(100%);
  }

  opacity: 0.7
}

.screen {
  .ant-image-img {
    object-fit: cover;
    width: 120px !important;
    border-radius: 4px;
    height: 70px !important;
  }
}
</style>
<style scoped lang="scss">
.screen {
  opacity: 0.7;
  border: #343434 2px solid;
  margin-right: 1em;
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
