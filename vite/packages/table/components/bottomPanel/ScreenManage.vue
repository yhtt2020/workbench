<template>
  <div style="height: 100%;display: flex;justify-content: center;align-content: center;flex-direction: column">
    <div @click.stop style="background: #111;border: 1px solid #333" class="p-3 rounded-md mt-3">

      <div @click="click(screen)" :class="{die:!screen.running,active:screen.active}" v-for="screen in screens"
           class="pointer screen rounded-md" style="display: inline-block;position: relative">
        <a-image
          fallback="/public/icons/logo128.png"
          class="screen-preview" :width="120" :height="80" src="/screen.jpg"></a-image>
        <span style="" class="p-2 screen-title">{{ screen.title }}</span>
      </div>
      <div class="text-right mt-2">
        <a-button class="mr-3">创建</a-button>
        <a-button @click="tagScreen">辨别</a-button>
      </div>
    </div>
    <div class="p-3" @click.stop>
      <div class="line-title text-center" style="font-size: 24px">
        {{ currentScreen.title }}
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
          <a-col v-if="currentScreen.settings" :span="6" >
            <div class="btn relative ">
              <a-switch v-model:checked="currentScreen.settings.autoRun"></a-switch>
              <div class="mt-3">
                自启动
              </div>
            </div>
          </a-col>
          <a-col :span="6" >
            <div @click="setTouch" class="btn">
              <Icon icon="Touch" style="font-size: 2em"></Icon>
              <div>
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

export default {
  name: 'ScreenManage',
  data () {
    return {
      currentScreen: {}
    }
  },
  computed: {
    ...mapWritableState(screenStore, ['screens']),
  },

  mounted () {
    this.screens.forEach(s => {
      if (!s.settings) {
        s.settings = {}
      }
    })
    this.screens.map(s=>{
      if(s.active){
        this.currentScreen=s
      }
    })
  },
  methods: {
    ...mapActions(screenStore, ['startupScreen','tagScreen']),
    toggleScreen (checked) {
      if (checked) {
        this.startupScreen(this.currentScreen.key)
      } else {
      }
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

.screen.die {
  & .screen-preview {
    filter: grayscale(100%);
  }

  opacity: 0.7
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
