<template>
  <div class="content">
    <div class="uni-flex uni-column">
      <div class="flex-item flex-item-V uni-bg-red">

      </div>
      <div class="flex-item flex-item-V uni-bg-green">
        <div class="screen-wrapper">
          <div v-for="display in displays">
            <div @click="setToScreen(display)" class="screen" :class="{'primary':display.workArea.x===0}"
                 @mouseenter="display.enter=true"
                 @mouseleave="display.enter=false"
                 :style="{
										left:getPosX(display.bounds.x)+'px',
										top:getPosY(display.bounds.y)+'px',
										width:getWidth(display.bounds.width)+'px',height:getHeight(display.bounds.height)+'px',display:'inline-block'}">

              <!-- 	({{getPosX(display.bounds.x)}} , {{getPosY(display.bounds.y)}}) -->
              <!-- 	{{getWidth(display.bounds.width)+'px'}} * {{getHeight(display.bounds.height)+'px'}} -->
              <text class="num">
                {{ getText(display) }}
              </text>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { appStore } from '../store'
import { mapWritableState } from 'pinia'

export default {
  name: 'ChooseScreen',
  emits:['setScreen'],
  props:['customCallback'],
  data () {
    return {
      displays: [],
      maxWidth: 0,
      maxHeight: 0,
      displayWidth: 200,//显示最大宽度
      displayHeight: 0,
    }
  },
  async mounted () {
    this.displays = await tsbApi.screen.getAllDisplays()
    this.getMaxWidth()
  },
  methods: {
    async setToScreen (display) {
      let bounds = {
        x: display.bounds.x,
        y: display.bounds.y,
        width: 600,
        height: 400
      }
      tsbApi.window.setFullScreen(false)
      console.log(this)
      if(this.customCallback ){
        console.log('向上传递事件')
        this.$emit('setScreen',{display})
        return //this.$emit('callback',{display})
      }
      setTimeout(() => {
        tsbApi.window.setBounds(bounds)
        setTimeout(() => {
          tsbApi.window.setFullScreen(true)
        }, 1000)
        this.settings.attachScreen.id = display.id
        this.settings.attachScreen.bounds = bounds
      }, 1000)

    },
    getMaxWidth () {
      this.maxWidth = 0
      this.maxHeight = 0
      this.displays.forEach(display => {
        if (display.bounds.width >= this.maxWidth) {
          this.maxWidth = display.bounds.width
          this.maxHeight = display.bounds.height
          this.displayHeight = display.bounds.height / display.bounds.width * this.displayWidth
        }

      })

    },
    getWidth (width) {
      return (width / this.maxWidth * this.displayWidth).toFixed(0)
    },
    getHeight (height) {
      return (height / this.maxHeight * this.displayHeight).toFixed(0)
    },
    getPosX (x) {
      return (x / this.maxWidth * this.displayWidth).toFixed(0)
    },
    getPosY (y) {
      return (y / this.maxHeight * this.displayHeight).toFixed(0)
    },
    getText (display) {
      if (display.enter) {
        return '使用'
      } else {
        if (display.workArea.x === 0) {
          return '主屏'
        }
        return '副屏'
      }
    }
  },
  computed: {
    ...mapWritableState(appStore, ['settings'])
  }
}
</script>

<style lang="scss" scoped>
.primary {
  .num {
    color: #383838 !important;
    font-weight: bold;
  }

  background: #c4c4c4 !important;
}

.s-screen {
  background: #333;
}

.screen-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  margin: auto;
}

.screen {
  box-sizing: border-box;
  cursor: pointer;
  margin: 10px;

  .num {
    color: white;
    font-size: 30 rpx;
    top: calc(50% - 25rpx);
  }

  text-align: center;
  background-color: #727272;
  border-radius: 4px;
  position: absolute;
  border: 1px solid #999;

  &:hover {
    box-shadow: 0 0 8px #999;
  }
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200 rpx;
  width: 200 rpx;
  margin-top: 200 rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50 rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36 rpx;
  color: #8f8f94;
}
</style>
