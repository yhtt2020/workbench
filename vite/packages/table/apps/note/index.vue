<template>
  <div class="mr-3 h-full overflow-hidden" style="min-width: 400px;">
    <LeftTab>
      <div class="h-full w-full flex">
        <div class="flex h-full">
          <LeftSearch :changeEditorValue="changeEditorValue" :selDesk="selDesk" :menus="menus"></LeftSearch>
        </div>
        <div class="flex h-full flex-col w-full" style="min-width: 400px;">
          <NoteContent :menus="menus" :selDesk="selDesk" ref="content"
                       v-if="this.selNote>=0 && this.noteList.length >0"></NoteContent>
        </div>
      </div>
    </LeftTab>
    <Modal v-if="promptVisible" blurFlag="true" style="z-index:99999;">
      <div class="p-5 pt-1 pb-1 flex flex-col justify-center"
           style="width:500px;height:516px;border-radius:12px;border: 1px solid rgba(255,255,255,0.1);box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.5);">
        <div style="width:100%;height:46px;position:relative;color: var(--primary-text);">
          <div class='flex h-full items-center justify-center font-16'>添加到桌面</div>
          <div class="flex justify-center items-center pointer btn-active"
               style='position:absolute;top:-5px;right:-7px;background: var(--secondary-bg);border-radius: 10px;width:40px;height:40px;'
               @click='promptVisible=false'>
            <Icon :icon="icons.dismiss16Filled"/>
          </div>
        </div>
        <div class="mt-1">
          <!-- <div class="mb-4">我的桌面（{{ this.desks.length }}）</div> -->
          <div
            style="background: var(--secondary-bg);border-radius: 10px; padding: 10px 12px;color: var(--primary-text);">
            将当前便签添加到指定桌面，你可以再桌面上快速查看和编辑。
          </div>
          <div class="overflow-hidden xt-scrollbar mt-3" style="height: 336px;">
            <div class="w-full flex items-center rounded-lg pointer"
                 style="height: 64px;background: var(--secondary-bg);justify-content: space-between;padding: 0 24px;"
                 v-for="(item,index) in this.desks"
                 :key="index"
                 :style="{background: this.selIndex == index? 'rgba(80,139,254,0.20)' : 'var(--secondary-bg)',border:this.selIndex == index? '1px solid rgba(80,139,254,1)' : '1px solid transparent' ,
                'margin-bottom': index == this.desks.length-1? '0' : '16px'}"

                 @click="changeSelIndex(index)">
              <div style="font-size: 16px;color: var(--primary-text);" class="flex items-center">
                <Icon icon="fluent-emoji-flat:desktop-computer" width="24" height="24" class="mr-4"/>
                {{ item.name }}
              </div>
              <!-- <div style="font-size: 14px;color: var(--secondary-text);">主页桌面</div> -->

            </div>
          </div>
        </div>
        <div class='flex font-16 mt-2' style='color: rgba(255,255,255,0.60);width:100%;justify-content: flex-end;'>
          <xt-button style="width: 64px;height:40px;" class="mr-3" @click="this.promptVisible = false">取消</xt-button>
          <xt-button style="width: 64px;height:40px;" class="xt-active-btn" @click="changeDesk">选择</xt-button>
        </div>
      </div>
    </Modal>
    <teleport to="body">

      <Modal @close="selectVersion=null" v-if="showVersion" :blur-flag="true" v-model:visible="showVersion">
        <div class="flex rounded-lg overflow-hidden" style="width: 800px;height: 600px;">
          <history-list :changeEditorValue="changeEditorValue" :showVersion="showVersion" :changeShowVersion="changeShowVersion" :noteId="noteList[selNote]._id"></history-list>
        </div>

      </Modal>

      <xt-print  v-if="modelValue" v-model="modelValue"  :content="content"></xt-print>
    </teleport>
    <!-- 专门处理复制功能 -->
    <Markdown ref="copyEditor" class="overflow-hidden" style="width:0;height:0;"></Markdown>
  </div>

</template>

<script>
import NoteContent from './components/NoteContent.vue'
import LeftTab from './components/leftTab.vue'
import LeftSearch from './components/leftSearch.vue'
import { mapActions, mapState, mapWritableState } from 'pinia'
import { noteStore } from './store'
import Modal from '../../components/Modal.vue'
import { Icon } from '@iconify/vue'
import dismiss16Filled from '@iconify-icons/fluent/dismiss-16-filled'
import { cardStore } from '../../store/card'
import { message } from 'ant-design-vue'
import HistoryList from './components/HistoryList.vue'
import {Modal as AntModal} from 'ant-design-vue'
import Markdown from './components/markdown.vue'
export default {
  name: 'note',
  components: {
    HistoryList,
    LeftTab,
    LeftSearch,
    NoteContent,
    Modal,
    Icon,
    Markdown,
  },
  props: {
    customIndex: String
  },
  data () {
    return {
      // 打印
      modelValue: false,
      // 右键菜单
      showVersion: false,

      icons: {
        dismiss16Filled,
      },
      // 弹窗
      promptVisible: false,

    }
  },
  mounted () {
    // 重置默认数据
    this.selNote = -1
    if (this.$route.params.customIndex) {
      this.isSelTab = false
    }
    // 处理从桌面跳转过来的数据
    this.getNotes().then(() => {
      if (this.$route.params.customIndex) {
        this.noteList.forEach((item, index) => {
          if (item.id == this.$route.params.customIndex) {
            this.selNote = index
            this.selNoteTitle = this.noteList[this.selNote]?.customData.title
          }
        })
      }
    })
  },
  computed: {
    ...mapWritableState(noteStore, ['noteList', 'selNote', 'noteBgColor', 'isTrash', 'deskList', 'selNoteTitle']),
    ...mapWritableState(cardStore, ['desks', 'selIndex']),
    content(){
      return this.noteList[this.selNote].customData?.text
    },
    menus(){
      return [
        // {
        //     label: "小窗模式",
        //     // callBack: this.callBack,
        //     newIcon: "fluent:window-multiple-16-filled",
        // },
        {
          label: '版本历史',
          newIcon:'fluent:history-48-filled',
          callBack: async () => {
            this.showVersion = true

          }
        },
        {
          newIcon: 'fluent:print-20-regular',
          label: '打印',
          callBack: () => {
            this.modelValue = true
          },
        },
        {
          newIcon: 'fluent:copy-20-regular',
          label: '复制内容',
          callBack: () => {
            const text = this.noteList[this.selNote]?.customData.text
            this.$refs.copyEditor?.setEditorValue(text);
            let content = this.$refs.copyEditor?.getContent();
            require('electron').clipboard.writeHTML(content)
            message.success('复制内容成功')
            console.log(content, '内容')
          }
        },
        {
          newIcon: 'fluent:markdown-20-regular',
          label: '复制MD文本',
          callBack: () => {
            const text = this.noteList[this.selNote]?.customData.text
            this.$refs.copyEditor?.setEditorValue(text);
            let content = this.$refs.copyEditor?.getMarkdown();

            require('electron').clipboard.writeText(content)
            message.success('复制内容成功')
            console.log(content, 'md内容')
          }
        },
        {
          newIcon: 'fluent:clipboard-code-24-regular',
          label: '复制HTML代码',
          callBack: () => {
            const text = this.noteList[this.selNote]?.customData.text
            this.$refs.copyEditor?.setEditorValue(text);
            let content = this.$refs.copyEditor?.getContent();
            
            require('electron').clipboard.writeText(content)
            message.success('复制内容成功')
            console.log(content, 'HTML内容')
          }
        },
        {
          label: this.isTrash?'还原':this.noteList[this.selNote]?.deskName?'切换桌面':'添加到桌面',
          callBack: () => {
            // 修改当前选中桌面
            if (this.isTrash) {
              // 还原
              this.restore()
            } else {
              // 添加到桌面
              this.selDesk()
            }
          },
          newIcon: 'fluent:open-20-filled',
        },
        {
          label: '跳转到桌面',
          newIcon: 'majesticons:monitor-line',
          callBack: () => {
            if (this.noteList[this.selNote].deskName) {
              this.deskList?.forEach((item, index) => {
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
          label: this.isTrash?'彻底删除':'删除',
          newIcon: 'akar-icons:trash-can',
          color: '#FF4D4F',
          callBack: () => {
            if (this.isTrash) {
              // 彻底删除
              AntModal.confirm({
                content:'彻底删除后无法还原，请确认。',
                okText:'确认删除',
                centered:true,
                onOk:()=>{
                  this.deleteNote()
                }
              })
            } else {
              // 删除
              this.moveToTrash()
            }
          }
        },
      ]
    }
  },
  methods: {
    ...mapActions(noteStore, ['getNotes', 'switchDesk', 'selDesk', 'restore', 'moveToTrash', 'deleteNote']),
    // 修改编辑器的值
    changeEditorValue(value){
      this.$refs.content.changeValue(value)
    },
    // 隐藏版本历史
    changeShowVersion(flag){
      this.showVersion = flag
    },
    // 选择便签
    changeSelIndex (n) {
      this.selIndex = n
    },
    // 选择桌面
    selDesk () {
      this.desks.forEach((item, index) => {
        if (item.id == this.noteList[this.selNote].deskId) {
          this.selIndex = index
        }
      })
      this.promptVisible = true
    },
    // 切换便签在不同的桌面
    changeDesk () {
      this.promptVisible = false
      this.switchDesk(this.selNote, this.selIndex)
    },

  }
}
</script>

<style scoped>


  ::-webkit-scrollbar-thumb {
    background-color: #ccc; /* 滚动条颜色 */
    border-radius: 6px; /* 滚动条圆角 */
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background-color: #999; /* 悬停时滚动条颜色 */
  }

  ::-webkit-scrollbar-track {
    border-radius: 6px; /* 轨道圆角 */
  }

</style>
