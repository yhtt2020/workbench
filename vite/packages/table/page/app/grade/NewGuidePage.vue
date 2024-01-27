<template>
  <div class="fixed overflow-hidden modal-center xt-modal tran" :class="popState ? 'pop' : step == 4 ? 'theme' : 'Popup'"
    style="">
    <div v-if="!popState" class="h-full">
      <!-- 顶部按钮 -->
      <div v-if="step !== 0" @click="prevStep" class="absolute ml-4 top-icon no-drag">
        <MyIcon icon="fluent:chevron-left-16-filled" width="20" height="20" />
      </div>
      <div @click="themeSwitch" class="absolute mr-4 top-icon no-drag" style="right:0;">
        <MyIcon icon="fluent:weather-moon-16-regular" width="20" height="20" />
      </div>
      <!-- 选择偏好 -->
      <div v-if="step == 0" class="w-full h-full ">
        <DeskType :deskTypeObj="deskTypeObj" @setDeskType="setDeskType"></DeskType>
      </div>
      <!-- 导入桌面图标 -->
      <div v-else-if="step == 1">
        <DeskIcon :loading="loading" :appList="appList" @setDeskType="setDeskType"></DeskIcon>
      </div>

      <!-- 导入小组件 -->
      <div v-else-if="step == 2">
        <CardList :cardList="cardList" @setDeskType="setDeskType"></CardList>
      </div>

      <!-- 导入导航栏 -->
      <div v-else-if="step == 3">
        <Navbar :NavbarList="NavbarList" @changeNavList="changeNavList"></Navbar>
      </div>

      <!-- 定制主题 -->
      <div v-else-if="step == 4">
        <Theme :backgroundSettings="backgroundSettings"  ></Theme>
      </div>

      <!-- 按钮 -->
      <div class="flex justify-between w-full px-3" style="position: absolute;bottom: 12px;">
        <div class="float-left">
          <xt-button class="float-left button-bottom" @click="preview" style="width:113px !important;" size="large">
            <div class="flex items-center ">
              <MyIcon class="mr-1" icon="fluent:desktop-16-regular" width="20" height="20" />
              预览桌面
            </div>
          </xt-button>
        </div>
        <div class="flex" v-if="step == 0">
          <xt-button class="ml-3 button-bottom" @click="nextStep" size="large">暂不分析</xt-button>
          <!-- <xt-button class="ml-3 button-bottom" @click="analysis" size="large" type="theme">开始分析</xt-button> -->
        </div>
        <div class="flex" v-if="step == 1">
          <xt-button class="ml-3 button-bottom"  @click="nextStep" :disabled="loading" size="large">暂不添加</xt-button>
          <xt-button class="ml-3 button-bottom"  @click="addFolder" :disabled="loading" size="large" type="theme">确定添加({{ folderNum
          }})</xt-button>
        </div>
        <div class="flex" v-if="step == 2">
          <xt-button class="ml-3 button-bottom" @click="nextStep" size="large">暂不添加</xt-button>
          <xt-button class="ml-3 button-bottom" @click="addDeskCard" size="large" type="theme">确定添加</xt-button>
        </div>
        <div class="flex" v-if="step == 3">
          <xt-button class="ml-3 button-bottom" @click="nextStep" size="large">暂不添加</xt-button>
          <xt-button class="ml-3 button-bottom" @click="addNavList" size="large" type="theme">确定添加</xt-button>
        </div>
        <div class="flex" v-if="step == 4">
          <xt-button class="ml-3 button-bottom" @click="close" size="large" type="theme">Go ~</xt-button>
        </div>
      </div>
    </div>

    <!-- 预览桌面 效果 -->
    <div v-else>
      <div style="height:60px;width:200px" class="flex items-center justify-between px-4 xt-text font-16 pointer"
        @click="popState = flase">
        定制桌面
        <div class="flex items-center justify-center w-8 h-8 rounded-lg xt-bg-2">
          <MyIcon icon="fluent:full-screen-maximize-16-filled" width="20" height="20" />
        </div>
      </div>
    </div>
    <!-- 壁纸模块 -->
    <GalleryModal ref="paperModal" />
    <teleport to="body">
      <div style="z-index: 9999">
        <!-- @afterAdded="afterAdded" -->
        <Preview
          :deskTypeObj="deskTypeObj"
          :deskList="deskList"
          :scheme="scheme"
          :showModal="showModal"
          @closePreview="closePreview"
          @analysis="analysis"
        ></Preview>
      </div>
      <!-- <FrameTip v-if="1"></FrameTip> -->
    </teleport>
  </div>
</template>

<script>
import { mapWritableState, mapActions } from 'pinia';
import { appStore } from '../../../store';
import { cardStore } from '../../../store/card';
import _ from 'lodash-es'
import { Icon as MyIcon, listIcons } from '@iconify/vue';
// 修改浅色模式
import { setThemeSwitch } from "../../../components/card/hooks/themeSwitch";
// ai分析
import { getStreamData } from "../../AIAssistant/chat/main/api";
import { defaultData, defaultFolderData } from '../../../apps/folder/src/components/options';
import { nanoid } from 'nanoid'
import { NavList } from '../card/navList'
import { navStore } from '../../../store/nav';
import { message } from "ant-design-vue";
import GalleryModal from "../../../components/paperModal/GalleryModal.vue";
import DeskType from "./components/DeskType.vue";
import DeskIcon from "./components/DeskIcon.vue";
import CardList from "./components/CardList.vue";
import Navbar from "./components/Navbar.vue";
import Theme from "./components/Theme.vue";
import Preview from "./components/Preview.vue";
import { NavListTmp, GameDesk, AssistDesk } from './components/data';
import {completeTask} from '../../../apps/task/task'
import { FreeLayoutStore } from "./components/FreeLayout";
import { useFreeLayoutStore } from "../../../components/desk/freeLayout/store";
import { useWidgetStore } from "../../../components/card/store";
import { useCustomLayout } from "../../../components/desk/freeLayout/useCustomLayout";

import FrameTip from "./components/FrameTip.vue";


export default {
  components: {
    MyIcon,
    GalleryModal,
    DeskType,
    DeskIcon,
    CardList,
    Navbar,
    Theme,
    Preview,
    FrameTip,
  },
  data() {
    return {
      deskTypeObj: {
        assist: false,
        game: false,
      },
      step: 0,
      content: '',
      // 图片格式
      pictureFormat: ['png', 'jpeg', 'jpg', 'gif', 'psd', 'bmp', 'fpx', 'tiff', 'dxf', 'eps', 'svg', 'cdr', 'pcx', 'emf', 'wmf', 'swf', 'exif', 'pdf', 'cgm', 'raw', 'lic', 'dng', 'raf'],
      // 音视频格式
      audioFormat: ['cda', 'wav', 'mp3', 'aif', 'aiff', 'mid', 'wma', 'ra', 'vqf', 'ape', 'wmv', 'asf', 'asx', 'rm', 'rmvb', 'mpg', 'mpeg', 'mpe', '3gp', 'avi', 'mov', 'ram', 'swf', 'flv', 'mp4', 'ram', 'vob'],
      appList: [
        { name: '游戏', type: 'rows', list: [], isCheck: false, },
        { name: '常用程序', type: 'rows', list: [], isCheck: false, },
        { name: '文件夹', type: 'columns', list: [], isCheck: false, },
        { name: '图片', type: 'rows', list: [], isCheck: false, },
        { name: '音视频', type: 'columns', list: [], isCheck: false, },
        { name: '其他文件', type: 'columns', list: [], isCheck: false, },
      ],
      loading: false,
      timer: null,
      time: 0,
      setTime: 120,
      setTimer: null,
      // 转换好的数据
      // 预览模式
      popState: false,
      // 定制主题
      themeState: true,
      baseNavList: [],
      // 两种不同的分类组件
      assist: ['yuanCommunity', 'news', 'HotSearch', 'wallpaper', 'clocks', 'historyInfo', 'notes'],
      assistList: [],
      game: ['yuanCommunity', 'news', 'HotSearch', 'notes', 'search', 'AIaides', 'countdownDay'],
      gameList: [],
      // 壁纸模糊
      imgBlur: 0,
      // 添加到导航栏的游戏常用程序列表
      exeNavList: [
        { type: 'folder', id: '1705024724', icon: '', name: '游戏', bg: '', isBg: '', mode: 'app', value: 'folder', isCheck: false, children: [] },
        { type: 'folder', id: '1705024725', icon: '', name: '常用程序', bg: '', isBg: '', mode: 'app', value: 'folder', isCheck: false, children: [] },
      ],
      //  给ai做的容错
      fault: [],
      NavbarList: [],
      scheme: {},
      showModal: false,
      // 
      headerList: [],
      folderList: [],
    }
  },
  props: ['deskId'],
  computed: {
    ...mapWritableState(cardStore, ['desks', 'addCard']),
    ...mapWritableState(appStore, ['backgroundSettings', 'backgroundImage', 'styles','backgroundName']),
    ...mapWritableState(navStore, ['copyFootNav']),
    ...mapWritableState(FreeLayoutStore, ["assistDesk", "gameDesk"]),
    ...mapWritableState(useFreeLayoutStore, [
      "isFreeLayout",
      "getFreeLayoutState",
      "defaultState",
      "previewFlag",
    ]),
    ...mapWritableState(useWidgetStore, ["edit"]),
    cardList() {
      if (this.deskTypeObj.game) {
        return this.gameList
      } else {
        return this.assistList
      }
    },
    folderNum() {
      let n = 0
      this.appList?.forEach(item => {
        if (item.isCheck) {
          n++
        }
      })
      return n
    },

  },
  mounted() {
    // 卡片数据去重
    this.NavbarList = [...NavListTmp]
    let items = []
    NavList.map(li => {
      return items.push(...li.children)
    })
    //取得全部不重复的数组元素
    items = _.uniqBy(items, (li) => { return li.name })
    this.baseNavList = items

    // 效率辅助
    this.assist.forEach(i => {
      this.baseNavList.forEach(item => {
        if (i == item.name) {
          this.assistList.push({
            ...item,
            download: Math.floor(Math.random() * 10000) + 1,
            isCheck: true,
            imgIndex: 0,
          })
        }
      })
    })
    // 游戏娱乐
    this.game.forEach(i => {
      this.baseNavList.forEach(item => {
        if (i == item.name) {
          this.gameList.push({
            ...item,
            download: Math.floor(Math.random() * 10000) + 1,
            isCheck: true,
            imgIndex: 0,
          })
        }
      })
    })
  },

  watch: {
  },
  methods: {
    ...mapActions(useFreeLayoutStore, ["clearFreeLayoutData", "setFreeLayoutData", "setFreeLayoutState", 'renewFreeLayout', 'getFreeLayout1']),

    // 设置自由布局数据 
    showFreeLayout(type){
      if(type == 'game'){
        this.setFreeLayoutData('mj36hf6h', this.gameDesk.freeLayoutData)
        this.setFreeLayoutState('mj36hf6h', this.gameDesk.freeLayoutState)
        this.scheme = {...GameDesk}
      }else{
        this.setFreeLayoutData('mj36hf6h', this.assistDesk.freeLayoutData)
        this.setFreeLayoutState('mj36hf6h', this.assistDesk.freeLayoutState)
        this.scheme = {...AssistDesk}
      }
      this.getFreeLayout1()

      console.log('this.scheme', this.scheme)

      // this.scheme = {...GameDesk}

      this.showModal = true
      this.previewFlag = true
      this.edit = true
    },

    closePreview() {
      this.previewFlag = false
      this.showModal = false;
    },
    // 触发打开壁纸弹窗
    openPaperModal() {
      this.$refs.paperModal.openGalleryModal()
    },

    // 

    // 调整类型
    setDeskType(type) {
      this.deskTypeObj['game'] = false
      this.deskTypeObj['assist'] = false
      this.deskTypeObj[type] = true
      this.showFreeLayout(type)
    },
    // 修改导航图标选中
    changeNavList(item, index) {
      if (index > 0) {
        this.NavbarList[index].isCheck = !this.NavbarList[index].isCheck
      } else {
        message.info("导航栏中至少包含一个桌面主页");
      }
    },
    // 主题色切换
    themeSwitch() {
      this.styles = !this.styles
      setThemeSwitch(this.styles);
    },
    prevStep() {
      const index = this.searchDeskIndex(this.deskId)
      if (this.step == 1) {
        this.$xtConfirm("返回上一步将会清空桌面已有的数据并进行重新分析。", "", {
          type: "warning",
          ok: () => {
            this.step--
            this.desks[index].cards = []
          },
        });
      } else if (this.step == 2) {
        this.$xtConfirm("返回上一步将会清空桌面已有的数据。", "", {
          type: "warning",
          ok: () => {
            this.step--
            this.desks[index].cards = []
          },
        });
      } else if (this.step == 3) {
        this.$xtConfirm("返回上一步将会清除桌面已添加的小组件的数据。", "", {
          type: "warning",
          ok: () => {
            this.step--
            let tmp = []
            this.desks[index]?.cards.forEach(item => {
              if (item.name == 'folder') {
                tmp.push(item)
              }
            });
            this.desks[index].cards = [...tmp]
          },
        });
      } else {
        this.step--
      }
    },
    nextStep() {
      this.step++
    },

    // 分析过程
    async analysis() {
        // message.info("正在分析，请稍等。");
      message.loading({
        content: "正在分析，请稍等。",
        key: "preparing",
      });
      // 请求开始
      this.loading = true
      this.step = 1
      this.getAiAnswer()
      this.timer = setInterval(() => {
        if (this.time < 98) {
          this.time++
        }
      }, this.setTime)

      // 添加容错 15秒之后如果ai没跑完 认定为报错 直接进行下一步
      this.setTimer = setTimeout(() => {
        this.appList = [...this.fault]
        this.loading = false
        this.messageFinish()
        this.time = 0
        this.clear()
      }, 15000);
    },

    clear() {
      this.time = 0
      clearInterval(this.timer)
      this.timer = null
    },

    messageFinish(){
      message.success({
        content: "分析完成，请继续完成桌面定制。",
        key: "preparing",
      });
    },

    // 添加文件夹
    addFolder() {
      let folders = []
      const n = this.searchDeskIndex(this.deskId)



      this.appList.forEach((item, index) => {
        if (item.isCheck) {
          let tmp = [];
          item.list?.forEach(i => {
            tmp.push({
              ...defaultData,
              name: i.name + i.ext,
              icon: i.icon,
              value: i.path,
              id: nanoid(6),
              type: 'tableApp',
            })
          })
          let obj = {
            data: {},
            // id: nanoid(6),
            customSize: "2x2",
            name: 'folder',
            customData: {
              ...defaultFolderData,
              name: item.name,
              layout: item.type,
              list: [...tmp]
            }
          }
          folders.push(obj)
        }
      })

      // 以下操作将游戏以及常用程序的文件夹区别于其他文件夹放在导航条内
      this.exeNavList[0].children = []
      this.exeNavList[1].children = []
      this.folderList = []

      folders.forEach(item => {
        if (item.customData.name == '游戏') {
          item.customData?.list.forEach(i => {
            this.exeNavList[0].children?.push({ type: 'tableApp', icon: i.icon, name: i.name, addNav: true, bg: '', isBg: '', ext: '', summary: '', mode: 'app', value: i.value })
          })
          this.exeNavList[0].isCheck = true

        } else if (item.customData.name == '常用程序') {
          item.customData?.list.forEach(i => {
            this.exeNavList[1].children?.push({ type: 'tableApp', icon: i.icon, name: i.name, addNav: true, bg: '', isBg: '', ext: '', summary: '', mode: 'app', value: i.value })
          })
          this.exeNavList[1].isCheck = true
        } else {
          console.log('itemitem', item);
          // this.addCard(item, this.desks[n]);
          this.folderList.push({...item})
        }
      })

      if(this.deskTypeObj.assist){
        this.headerList = this.assistDesk.desk[0]?.cards.slice(0,6)
        // folder = this.assistDesk.desk[0]?.cards.slice(6, 10)
      }else{
        this.headerList = this.gameDesk.desk[0]?.cards.slice(0,5)
        // folder = this.gameDesk.desk[0]?.cards.slice(5, 9)
      }
      this.clearFreeLayoutData()
      setTimeout(()=>{
        useCustomLayout({
          headerList: this.headerList,
          folderList: this.folderList,
          cb: () => {
            this.$bus.emit("adsorbGrid");
          },
        });
      },1)


      this.setExeListNav()
      this.nextStep();
    },
    // 单独处理游戏和常用文件夹 需要添加到导航栏里面
    setExeListNav() {
      // 用于添加游戏常用程序文件夹到导航条 与其他添加事件独立开来
      if (this.exeNavList[0]?.children.length) {
        let num = this.searchNavIndex(this.exeNavList[0].id)
        if (num) {
          console.log(1);
          // 如果存在直接删除
          this.copyFootNav.splice(num, 1, this.exeNavList[0])
        } else if(this.copyFootNav.length > 3) {
          console.log(2);
          this.copyFootNav.splice(-2, 0, this.exeNavList[0])
        }else{
          console.log(3);
          this.copyFootNav.push({...this.exeNavList[0]})
        }
      }
      if (this.exeNavList[1]?.children.length) {
        let num = this.searchNavIndex(this.exeNavList[1].id)
        if (num) {
          this.copyFootNav.splice(num, 1, this.exeNavList[1])
        } else if(this.copyFootNav.length > 3) {
          this.copyFootNav.splice(-2, 0, this.exeNavList[1])
        }else{
          this.copyFootNav.push({...this.exeNavList[1]})
        }
      }
    },

    // 寻找导航条id
    searchNavIndex(id) {
      let n = null;
      this.copyFootNav.forEach((item, index) => {
        if (item.id == id) {
          n = index
        }
      })
      return n
    },

    // 添加小组件
    addDeskCard() {
      const n = this.searchDeskIndex(this.deskId)
      let cards = []
      this.cardList.forEach((item, index) => {
        console.log('item', item )
        if (item.isCheck) {
          cards.push({
            customData: {
              customSize: item.option[0]?.size,
              name: item.option[0]?.name
            },
            name: item.option[0]?.name
          })
        }
      })
      console.log('cards', cards)
      this.clearFreeLayoutData()
      setTimeout(()=>{
        useCustomLayout({
          headerList: this.headerList,
          folderList: this.folderList,
          mainList: cards,
          cb: () => {
            this.$bus.emit("adsorbGrid");
          },
        });
      },1)
      // 删除 添加
      this.nextStep();
    },

    // 替换导航栏
    addNavList() {
      let tmp = []
      NavListTmp.forEach(item => {
        if (item.isCheck) {
          tmp.push(item)
        }
      })
      this.copyFootNav = [...tmp]
      this.setExeListNav()
      this.nextStep()
    },

    // 遍历取桌面序号
    searchDeskIndex(id) {
      this.desks.forEach((item, index) => {
        if (item.id == id) {
          return index
        }
      })
      return 0
    },

    // 预览桌面
    preview() {
      this.popState = true
    },

    // 关闭预览桌面
    close() {
      completeTask('z0201')
      this.$emit('closeShowGuide')
    },

    // 直接分类可能会失效 需要先将 文件夹 exe文件区分开来
    async getAiAnswer() {
      const desktopApps = await ipc.sendSync('getDeskApps')
      // 文件夹
      let folderList = []
      // 图片
      let pictureList = []
      // 音视频
      let audioList = []
      // 其他文件
      let otherList = []
      // exe
      let exeList = []
      let exeStr = '['
      // game
      let gameList = []

      desktopApps.forEach((item, index) => {
        if (item.ext == '') {
          // 分离文件夹
          folderList.push(item)
        } else if (item.ext == '.exe' || item.ext == '.url') {
          console.log('item', item);
          // 分离exe文件以及url文件 url文件暂时认定为 常用程序
          if (!item.icon.includes('steam')) {
            exeStr = exeStr + `{"name":"${item.name}","index":${index}},`
            exeList.push(item)
            this.appList[0].isCheck = true
          }else{
            gameList.push(item)
            this.appList[1].isCheck = true
          }
        } else {
          // 判断图片
          if (this.pictureFormat.includes(item.ext.slice(1))) {
            pictureList.push({ ...item, type: 'img' })
          }
          // 判断音视频
          else if (this.audioFormat.includes(item.ext.slice(1))) {
            audioList.push(item)
          } else {
            otherList.push(item)
          }
        }
      });
      exeStr += ']'
      // 游戏、常用程序
      await this.processGPTResults([{
        role: 'user',
        content: `这些是电脑桌面图标的名称，请从效率辅助角度下，将以下数据转换成数组对象之后， ${exeStr} 这些文件根据name属性分成游戏、常用程序两个分类数组，对象名使用"game"和"programs",然后以一个对象包裹着数组的形式将两个数组一起返回，不要带分析过程，不要有多余文字说明，直接返回结果`
      }]).then(res => {
        // 存储超时数据 用于超时作为应急数据
        this.fault = [...this.appList]
        this.fault[0].list = gameList
        this.fault[1].list = exeList
        this.fault[2].list = folderList
        this.fault[3].list = pictureList
        this.fault[4].list = audioList
        this.fault[5].list = otherList

        // 这步有可能 会被ai传回数据格式错误 导致报错
        let tmp = JSON.parse(res)

        console.log('tmp', tmp)
        if(tmp.game.length + tmp.programs.length != exeList.length) return


        tmp.file = folderList
        tmp.picture = pictureList
        tmp.audio = audioList
        tmp.other = otherList

        // 处理 常用程序 和 游戏 的数据 上一步ai只是根据名字进行筛选 这步根据返回的序号 将数据分开存储
        tmp.game?.forEach(i => {
          // i.icon = desktopApps[i.index]?.icon
          // i.path = desktopApps[i.index]?.path
          // i.ext = desktopApps[i.index]?.ext
          this.appList[0].list.push({
            ...i,
            icon: desktopApps[i.index]?.icon,
            path: desktopApps[i.index]?.path,
            ext: desktopApps[i.index]?.ext,
          })
        })
        tmp.programs?.forEach(i => {
          i.icon = desktopApps[i.index]?.icon
          i.path = desktopApps[i.index]?.path
          i.ext = desktopApps[i.index]?.ext
          // this.appList[1].list.push({
          //   ...i,
          //   icon: desktopApps[i.index]?.icon,
          //   path: desktopApps[i.index]?.path,
          //   ext: desktopApps[i.index]?.ext,
          // })
        })

        // this.appList[0].list = tmp.game
        this.appList[1].list = tmp.programs

        this.appList[2].list = tmp.file
        this.appList[3].list = tmp.picture
        this.appList[4].list = tmp.audio
        this.appList[5].list = tmp.other

        // 请求结束 进入下一步
        this.loading = false
        this.messageFinish()
        this.time = 15
        this.clear()

        // 清楚超时操作
        clearTimeout(this.setTimer)
        this.setTimer = null
      })
    },
    
    // ai封装方法
    async processGPTResults(arr) {
      // 获取聊天机器人的回复
      for await (const result of getStreamData(arr)) {
        if (result.value) {
          message.error(result.value.error.message);
          return;
        }
        this.content = this.content + result.content
      }
      return this.content
    },
  },
}
</script>

<style lang="scss" scoped>

.modal-center {
  background: #212121;
  border: 1px solid var(--divider);
  box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.03);
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.2);
  border-radius: 12px 12px 12px 12px;
  z-index: 999;
}

// 桌面主体部分
.Popup {
  width: 800px;
  height: 620px;
  top: 50%;
  left: 50%;
  transform: translateX(-400px) translateY(-300px);
}

// 右下角 预览桌面
.pop {
  position: fixed;
  bottom: 80px;
  right: 40px;
  width: 200px;
  height: 60px;
}

// 右上角 定制主题
.theme {
  width: 400px;
  height: 660px;
  position: fixed;
  top: 60px;
  right: 20px;
}

.tran {
  transition: all 0.15s linear;
}

.top-icon {
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--secondary-bg);
  border-radius: 8px;
  color: var(--secondary-text);
  cursor: pointer;
  margin-top: 16px;
}

.button-bottom {
  width: 95px !important;
  height: 40px !important;
  border-radius: 10px !important;
}

.span-list {
  width: 245px;
  height: 240px;
  border-radius: 10px;
}

// 滚动条配置
::-webkit-scrollbar-thumb {
  background-color: #ccc;
  /* 滚动条颜色 */
  border-radius: 6px;
  /* 滚动条圆角 */
}

::-webkit-scrollbar-thumb:hover {
  background-color: #999;
  /* 悬停时滚动条颜色 */
}

::-webkit-scrollbar-track {
  border-radius: 6px;
  /* 轨道圆角 */
}

</style>
