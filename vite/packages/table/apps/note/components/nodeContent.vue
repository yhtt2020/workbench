<template>
  <teleport to="body">

    <Modal  @close="selectVersion=null" v-if="showVersion" :blur-flag="true" v-model:visible="showVersion">
      <div class="p-6 flex" style="width: 600px">
        <div>
          <div class="line-title">
            版本历史
          </div>
          <div style="height: 500px">
            <xt-scrollbar :y="true" :w="false" >
              <div @click="selectVersion=version;" :class="{'xt-bg':version===selectVersion}" class="pointer mb-2 pb-2 flex p-2 rounded-md" v-for="(version,index) in versions"
                   style="gap:15px;border-bottom:1px solid var(--secondary-bg)">
                <div>
                  <div style="font-size: 26px">
                    #{{ versions.length - index }}
                  </div>
                  <div class="xt-text-2">{{ formatTime(version.createTime) }}</div>
                </div>
              </div>
            </xt-scrollbar>
          </div>

        </div>
        <div class="p-6 w-1/2" v-if="selectVersion" v-html="selectVersion.content"></div>
      </div>

    </Modal>

  </teleport>

  <div class="w-full h-full flex justify-center items-center">
    <div class="w-full center overflow-hidden flex justify-center flex-wrap h-full">
      <!-- 顶部 -->
      <div style="justify-content: space-between;" class="flex w-full">
        <div class="flex items-center">
          <div
            class="flex justify-center items-center mr-3 pointer center"
            style="background-color: var(--mask-bg);border-radius:10px;height: 40px;padding: 0 10px;"
            @click="changeDesk"
          >
            <Icon icon="majesticons:monitor-line" width="20" height="20"/>
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
                    padding: 8px 5px 4px 5px;border-radius: 12px;" class="flex flex-wrap">
            <div class="flex rounded-lg pointer" style="height:40px;width:40px;"
                 v-for="(item,index) in this.noteBgColor" :key="index" :style="{background:item}"
                 @click="changeBgColor(index)"></div>
          </div>
          <div class="flex items-center pointer justify-center mr-3"
               style="width: 40px;height:40px;background: var(--mask-bg);border-radius: 10px;"
               @click="save(true)">
            <Icon icon="fluent:save-16-regular" width="20" height="20"/>
          </div>
          <!-- 全屏 -->
          <div class="flex items-center pointer justify-center mr-3"
               style="width: 40px;height:40px;background: var(--mask-bg);border-radius: 10px;"
               @click="changeIsFull">
            <Icon icon="fluent:full-screen-maximize-16-filled" width="20" height="20"/>
          </div>
          <!-- 设置 -->
          <xt-menu :menus="menus" model="click">
            <div class="flex items-center pointer justify-center no-drag"
                 style="width: 40px;height:40px;background: var(--mask-bg);border-radius: 10px;">
              <Icon icon="fluent:more-horizontal-16-filled" width="20" height="20"/>
            </div>
          </xt-menu>
        </div>
      </div>
      <!-- 主体 -->
      <div class="h-full" style="width:950px;">
        <div class="mt-4 shadow overflow-hidden h-full" style="border-radius: 12px;padding: 24px 0 0 0 ;"
             :style="{background:background}">
          <a-input placeholder="标题"
                   style="color:rgba(255,255,255,0.85);font-size: 18px;font-weight: 500;word-wrap: break-word;text-wrap: wrap;
                        border: none;box-shadow: none;padding: 0 0 0 50px; "
                   v-model:value="this.selNoteTitle"
                   maxlength="15"
                   @blur="changeNoteTitle"
          ></a-input>
          <div class="mt-4 scroll-color xt-scroll" style="height: 92%;">
            <Markdown ref="child"></Markdown>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 全屏模式 -->
  <FullScreen v-if="isFull" :changeIsFull="changeIsFull" :watchEditorValue="watchEditorValue"
              :selDesk="selDesk"></FullScreen>
</template>

<script>
import { Icon } from '@iconify/vue'
import moreHorizontal16Filled from '@iconify-icons/fluent/more-horizontal-16-filled'
import { mapActions, mapState, mapWritableState } from 'pinia'
import { noteStore } from '../store'
import { cardStore } from '../../../store/card'
import { formatTime, formatTimestamp } from '../../../util'
import Markdown from './markdown.vue'
import FullScreen from './fullScreen.vue'

import { message } from 'ant-design-vue'
import Modal from '../../../components/Modal.vue'

export default {
  components: {
    Modal,
    Icon,
    Markdown,
    FullScreen,
  },
  props: ['selDesk'],
  computed: {
    ...mapWritableState(noteStore, ['noteList', 'selNote', 'noteBgColor', 'selNoteTitle', 'selNoteText', 'deskList', 'isSelTab']),
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
  data () {
    return {
      showVersion: false,
      versions: [],
      selectVersion: '',
      icons: {
        moreHorizontal16Filled,
      },
      isColor: false,
      isFull: false,
      menus: [
        {
          label: '版本历史',
          callBack: async () => {
            this.showVersion = true
            this.versions = await this.getHistory(this.noteList[this.selNote]._id)
            if(this.versions.length>0){
              this.selectVersion=this.versions[0]
            }
          }
        },
        {
          label: '添加到桌面',
          newIcon: 'fluent:open-20-filled',
          callBack: () => {
            // 修改当前选中桌面
            if (!this.isSelTab) {
              // 添加到桌面
              this.selDesk()
            } else {
              // 还原
              this.restore()
            }
          },

        },
        {
          label: '跳转到桌面',
          newIcon: 'majesticons:monitor-line',
          callBack: () => {
            if (this.noteList[this.selNote].deskName) {
              this.deskList.forEach((item, index) => {
                if (this.noteList[this.selNote].deskId == item.id) {
                  this.currentDeskId = item.id
                  this.$router.push({
                    name: 'home',
                  })
                }
              })
            } else {
              if (this.isSelTab) {
                message.error('该便签已被删除')
              } else {
                message.error('请先添加桌面')
              }
            }
          }
        },
        {
          label: '删除便签',
          newIcon: 'akar-icons:trash-can',
          color: '#FF4D4F',
          callBack: () => {
            // this.menus.
            if (!this.isSelTab) {
              // 删除
              this.moveToTrash()
            } else {
              // 彻底删除
              this.deleteNote()

            }
          }
        },
      ],
    }
  },
  mounted () {
    this.getNotes()
  },
  methods: {
    ...mapActions(cardStore, ['updateCustomData']),
    ...mapActions(noteStore, ['saveNoteDb', 'getNotes', 'addNoteToDesk', 'changeBg', 'moveToTrash', 'restore', 'deleteNote']),
    formatTime,
    changeIsFull () {
      this.isFull = !this.isFull
    },
    async getHistory (id) {
      console.log(id, '要查询的id')
      const result = await tsbApi.db.find({
        selector: {
          noteId: {
            $eq: id
          }
        }
      })
      console.log(result, '查找到的版本历史')
      const history = result.docs.map(doc => doc)
      console.log(history, '查找到的历史')
      return history.reverse()
    },
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
    async save () {
      let saveRs = await this.$refs.child.save()
      if (saveRs) {
        message.success({
          content: '保存成功。', key: 'save'
        })
      } else {
        message.error({
          content: '保存失败，请手动将当前文本复制，以免丢失内容。', key: 'save'
        })
      }
      console.log('保存结果', saveRs)

    },
    changeDesk () {
      if (!this.isSelTab) {
        this.selDesk()
      }
    },
    watchEditorValue (value) {
      this.$refs.child.childEvent(value)
    },

  },
  watch: {
    isSelTab (newval, oldval) {
      if (newval) {
        this.menus[0].label = '还原'
        this.menus[2].label = '彻底删除'
      } else {
        this.menus[0].label = '添加到桌面'
        this.menus[2].label = '删除便签'
      }
    }
  }
}
</script>
<style lang="scss" scoped>

.shadow {
  box-shadow: 0px 0px 3.12px 0px rgba(0, 0, 0, 0.03);
  box-shadow: 0px 0px 10.23px 0px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.2);
}

.scroll-color::-webkit-scrollbar-thumb {
  background-color: #ccc; /* 滚动条颜色 */
  border-radius: 6px; /* 滚动条圆角 */
}

.scroll-color::-webkit-scrollbar-thumb:hover {
  background-color: #999; /* 悬停时滚动条颜色 */
}

.scroll-color::-webkit-scrollbar-track {
  border-radius: 6px; /* 轨道圆角 */
}

:deep(.vditor-toolbar) {
  background: var(--main-bg) !important;
}

:deep(.vditor-reset) {
  background: var(--main-bg) !important;
}

</style>
