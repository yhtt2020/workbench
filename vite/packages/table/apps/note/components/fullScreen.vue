<template>
  <teleport to="body">
    <img class="pop-container" :src="this.backgroundImage.path" alt="" />
    <div class="pop-box flex flex-wrap justify-center" style="min-width: 1000px;">
      <!-- 顶部 -->
      <div style="justify-content: space-between;background-color: var(--secondary-bg);height: 64px;" class="flex w-full items-center px-3"> 
        <div class="flex items-center">
          <div
            class="flex justify-center items-center mr-3 pointer center no-drag"
            style="background-color: var(--mask-bg);border-radius:10px;height: 40px;padding: 0 10px;color: var(--primary-text);"
            @click="changeDesk"
          >
            <Icon icon="majesticons:monitor-line" width="20" height="20" />
            <div class="ml-2" v-if="deskName">{{ deskName }}</div>
          </div>
          <div style="font-size: 14px;color: var(--secondary-text);">{{ time }}</div>
        </div>
        <div class="flex" style="position: relative;">
          <div class="flex justify-center items-center mr-3 pointer shadow"
              style="width:40px;height:40px;border-radius: 10px;" :style="{background:background}"
              @click="isColor=!isColor"></div>
          <!-- 颜色选择 -->
          <div v-show="isColor" 
              style="justify-content: space-around;position: absolute;
                    width: 146px;height: 103px;top: 46px;left: -118px;
                    background-color: #2A2A2A;z-index: 100;
                    padding: 8px 5px 4px 5px;border-radius: 12px;" class="flex flex-wrap no-drag">
            <div class="flex rounded-lg pointer" style="height:40px;width:40px;"
                v-for="(item,index) in this.noteBgColor" :key="index" :style="{background:item}"
                @click="changeBgColor(index)"></div>
          </div>
        <div class="flex items-center pointer justify-center mr-3"
            style="width: 40px;height:40px;background: var(--mask-bg);border-radius: 10px;color: var(--primary-text);"
            @click="changeIsFull">
            <Icon icon="fluent:full-screen-minimize-16-filled" width="20" height="20" />
        </div>
        <xt-menu :menus="menus" model="click">
          <div class="flex items-center pointer justify-center no-drag"
              style="width: 40px;height:40px;background: var(--mask-bg);border-radius: 10px;color: var(--primary-text);">
            <Icon icon="fluent:more-horizontal-16-filled" width="20" height="20"/>
          </div>
        </xt-menu>
        </div>
      </div>
      <!-- 主体 -->
      <div class=" h-full" style="width:950px;margin-top: 20px;">
        <div class="shadow overflow-hidden h-full" style="border-radius: 12px;padding: 24px 0 0 0 ;"
              :style="{background:background}">
          <a-input
            style="color:rgba(255,255,255,0.85);font-size: 18px;font-weight: 500;word-wrap: break-word;text-wrap: wrap;
              border: none;box-shadow: none;padding: 0 0 0 50px; "
            v-model:value="this.selNoteTitle"
            maxlength="15"
            @blur="changeNoteTitle"
          ></a-input>
          <div class="mt-4 scroll-color xt-scroll" style="height:92%;"  >
            <Markdown ref="mdEditor"></Markdown>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>
<script>

import { Icon } from '@iconify/vue'
import { mapActions, mapState, mapWritableState } from 'pinia'
import { appStore } from '../../../store'
import { cardStore } from '../../../store/card'
import Markdown from './markdown.vue'
import { noteStore } from '../store'
import { formatTime } from '../../../util'
import { message } from 'ant-design-vue'

export default {
  components: {
    Icon,
    Markdown,
  },
  props: ['changeIsFull', 'selDesk', 'watchEditorValue','menus'],
  watch: {},
  computed: {
    ...mapWritableState(noteStore, ['noteList', 'selNote', 'noteBgColor', 'selNoteTitle', 'selNoteText', 'deskList', 'isSelTab']),
    ...mapState(appStore, ['userInfo', 'backgroundImage']),
    deskName () {
      if (this.noteList.length) {
        return this.selNote >= 0 ? this.noteList[this.selNote].deskName : ''
      }
    },
    background () {
      if (this.noteList.length) {
        if (this.selNote >= 0) {
          return this.selNote >= 0 ? this.noteList[this.selNote].customData.background : ''
        } else {
          return
        }
      }
    },
    time () {
      // return
      if (this.selNote >= 0 && this.noteList) {
        if (this.noteList[this.selNote]) {
          let timestamp = this.noteList[this.selNote].updateTime // 假设您已经获取了时间戳
          return formatTime(timestamp)
        } else {
          return
        }
      } else {
        return
      }
    },

  },
  mounted () {

  },
  data () {
    return {
      isColor: false,
    }
  },
  unmounted () {
    if (this.noteList.length > 0 && this.selNote >= 0) {
      // 将数据直接传入到小屏幕编辑器中
      this.watchEditorValue(this.noteList[this.selNote].customData.text)
    }
  },
  methods: {
    ...mapActions(cardStore, ['updateCustomData']),
    ...mapActions(noteStore, ['saveNoteDb', 'getNotes', 'addNoteToDesk', 'changeBg', 'moveToTrash', 'restore', 'deleteNote']),
    // 修改当前便签颜色
    changeBgColor (i) {
      this.noteList[this.selNote].customData.background = this.noteBgColor[i]
      if (this.noteList[this.selNote].deskId != '') {
        let nowIndex = -1
        this.deskList.forEach((item, index) => {
          if (item.id == this.noteList[this.selNote].deskId) {
            nowIndex = index
          }
        })
        this.updateCustomData(this.noteList[this.selNote].id, {
          background: this.noteBgColor[i]
        }, this.deskList[nowIndex])
      }
      // 改变db中的颜色
      this.changeBg(this.noteBgColor[i])
      this.isColor = false
    },
    // 修改当前便签标题
    changeNoteTitle (e) {
      if (this.noteList[this.selNote].customData.title != e.target.value) {
        let n = -1
        this.deskList.forEach((item, index) => {
          if (item.name == this.noteList[this.selNote].deskName) {
            n = index
          }
        })
        if (n >= 0) {
          this.updateCustomData(this.noteList[this.selNote].id, {
            title: e.target.value,
          }, this.deskList[n])
        }
        this.noteList[this.selNote].customData.title = e.target.value
        this.saveNoteDb()
      }
    },
    changeDesk () {
      if (!this.isSelTab) {
        this.selDesk()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.pop-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background-repeat: no-repeat;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  width: 100%;
  height: 100%;
  filter: blur(10px);
  // -webkit-backdrop-filter: blur(5px);
  // transform: scale(1.2);
}

.pop-box {
  z-index: 99919;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

:deep(.vditor-reset){
  background: var(--main-bg) !important;
}

// :deep(.vditor-toolbar){

// }

:deep(.vditor-toolbar .vditor-toolbar--pin){
  position: absolute;
  height: 100px !important;
}

:deep(.vditor-toolbar__item .vditor-tooltipped){
  color: var(--primary-text) !important;
}
</style>
