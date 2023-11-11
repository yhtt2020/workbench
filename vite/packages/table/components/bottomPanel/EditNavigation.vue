<template>
  <div style="background: var(--main-mask-bg) !important;width: 100%;height:100%;" class="pt-6">
    <transition name="fade">
      <div class="back pointer no-drag" @click="onBack" v-show="!editFlag">
        <Icon icon="xiangzuo" style="color: var(--primary-text);height: 24px;width: 24px"></Icon>
      </div>
    </transition>
    <transition name="fade">
      <div class="box-content" v-show="!editFlag" id="boxContent">
        <div class="box-center">
          <div style="width: 100px;">
            <div class="side-nav" v-show="leftNav" id="leftBox">
              <div style="width: 73px;overflow: hidden;" class="flex flex-col items-center w-full">
                <div style="overflow: hidden;" id="sideNavList"
                     class="flex flex-col items-center flex-nowrap scroll-content" ref="sideContent">
                  <div v-for="item in sideNavigationList" :key="item.name" style="margin: 20px 0;">
                    <!-- {{ 11111 }} -->
                    <a-dropdown :trigger="['contextmenu']">

                      <div v-if="item.type==='systemApp'"
                           style="display: flex;justify-content: center;align-items: center;margin: 0 auto;border-radius: 12px">
                           <!-- {{ item.icon }} -->
                        <navIcon :icon="item.icon" style="width: 40px;height: 40px;color:var(--secondary-text)"></navIcon>
                      </div>
                      <a-avatar v-else :size="40" shape="square" :src="renderIcon(item.icon)"></a-avatar>
                    </a-dropdown>
                  </div>
                </div>
              </div>
              <div>
                <Icon icon="tianjia" style="width: 56px;height: 56px;color:var(--secondary-text);" class="pointer"
                      @click="addEdit('left')"></Icon>
              </div>
            </div>
          </div>

          <div class="center-text" style="transform: translateY(-20px)">

            <div class="con-center" v-show="navText && !promptModal" style="width:800px">
               <span class="mt-5 mb-4">本界面不支持触摸，请使用滚轮滚动，支持鼠标拖拽！</span>
<!--              <div class="mb-2 ">
                <div class="mb-2 xt-text-2">
                  注意：侧边栏图标风格会自动调整
                </div>
                <div class="flex mb-2">
                <span class="flex items-center justify-center mr-4">
              <Icon icon="home" style="width: 30px;height: 30px;color:var(&#45;&#45;secondary-text);"></Icon>
              <Icon icon="arrowright" style="width: 20px;height: 20px;"></Icon>
              <Icon icon="shouye1" style="width: 30px;height: 30px;color:var(&#45;&#45;secondary-text);"></Icon>
            </span>
                  <Icon icon="thunderbolt" style="width: 30px;height: 30px;color:var(&#45;&#45;secondary-text);"></Icon>
                  <Icon icon="arrowright" style="width: 20px;height: 20px;margin-top: 6px"></Icon>
                  <Icon icon="kuaijie1" style="width: 30px;height: 30px;color:var(&#45;&#45;secondary-text);"></Icon>
                </div>

              </div>-->
              <xt-task  id='M0104' no='3'></xt-task>
              <div class="mb-2 xt-text-2">必选功能（拖拽添加）</div>
              <div class="main-nav" id="mainList" style="width: 320px;zoom:0.8">
                <div v-for="item in mainNavList" :key="item.name" style="margin:5px">
                  <!-- {{ item.icon }} -->
                  <div style="width: 100%;height: 100%;opacity: 0.3;" class="flex flex-col items-center justify-center">
                    <navIcon :icon="item.icon" style="width: 40px;height: 40px;color:var(--secondary-text);"></navIcon>
                    <span class="mt-2 xt-text-2">{{ item.name }}</span>
                  </div>
                  <div class="add-toggle" v-if="item.addNav">
                    <icon icon="yixuan" style="font-size:32px;color: #52ff52"></icon>
                  </div>
                </div>
              </div>
              <div style="width: 600px;text-align: center;zoom: 0.8;display: flex;flex-direction: column;align-items:center;justify-content: center;justify-items: center;">
                <div class="mt-2 mb-2" style="color:var(--secondary-text);">推荐功能（拖拽添加）</div>
                <div class="main-nav" id="suggestList" style="width:430px;white-space: pre-wrap;flex-wrap: wrap;">
                  <div v-for="item in suggestNavList" :key="item.name" style="margin:5px">
                    <div style="width: 100%;height: 100%;opacity: 0.3;"
                         class="flex flex-col items-center justify-center">
                      <navIcon :icon="item.icon" style="width: 40px;height: 40px;color:var(--secondary-text);"></navIcon>
                      <span class="mt-2 xt-text-2">{{ item.name }}</span>
                    </div>
                    <div class="add-toggle" v-if="item.addNav">
                      <icon icon="yixuan" style="font-size:32px;color: #52ff52"></icon>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="nav-toggle" v-show="navText && !promptModal">
              <div class="left-point">
                <span class="mb-1 xt-text-2"><Icon icon="arrowleft"></Icon>左侧</span>
                <div>
                  <!-- <a-switch v-model:checked="leftNav" @change="navToggle(sideNavigationList,'left')"/> -->
                  <a-switch v-model:checked="leftNav" @change="navToggle('left')"/>
                </div>
              </div>
              <div class="foot-point">
                <span class="mb-1 xt-text-2"><Icon icon="arrowdown"></Icon>底部</span>
                <div>
                  <a-switch v-model:checked="footNav" @change="navToggle('foot')"/>
                </div>
              </div>
              <div class="right-point">
                <span class="mb-1 xt-text-2">右侧<Icon icon="arrowright"></Icon></span>
                <div>
                  <a-switch v-model:checked="rightNav" @change="navToggle('right')"/>
                </div>
              </div>
            </div>
            <div class="prompt-modal " v-show="promptModal ">
              <div class="flex flex-col items-center justify-center p-5 xt-modal" style="border-radius:16px">
                <div>
                  <Icon icon="tishi-xianxing" style="font-size: 16px;color: orange"></Icon>
                  <span class="ml-3">提示</span>
                </div>
                <span class="my-5">在导航栏中至少保留一个
              <span v-for="item in delMainItem" :key="item.name">
                「{{ item.name }}」
              </span>
              入口，以保持功能完整性。</span>
                <!-- <span class="my-5">在导航栏中至少保留一个「{{delMainItem.name}}」入口，以保持功能完整性。</span> -->
                <div class="modal-btn">
                  <div class="mr-3 rounded-lg cursor-pointer xt-bg-2" @click="promptModal = false">好的</div>
                  <!-- <div @click="delMainCore">移除</div> -->
                </div>
              </div>
            </div>
            <div class="del-icon" id="delIcon" v-show="!navText && !promptModal">拖到此处删除图标</div>
          </div>
          <div style="width:100px;" class="flex justify-end">
            <div class="side-nav" v-show="rightNav" id="rightBox">
              <div style="width: 73px;overflow: hidden;" class="flex flex-col items-center w-full">
                <div style="overflow: hidden;" id="rightNavList"
                     class="flex flex-col items-center flex-nowrap scroll-content" ref="rightContent">
                  <div v-for="item in rightNavigationList" :key="item.name" class="my-5 width: 56px;height: 56px;">
                    <a-dropdown :trigger="['contextmenu']">
                      <div v-if="item.type==='systemApp'"
                           style="display: flex;justify-content: center;align-items: center;margin: 0 auto;border-radius: 12px">
                        <navIcon :icon="item.icon" style="width: 40px;height: 40px;color:var(--secondary-text);"></navIcon>
                      </div>
                      <a-avatar v-else :size="40" shape="square" :src="renderIcon(item.icon)"></a-avatar>
                    </a-dropdown>
                  </div>
                </div>
              </div>
              <div>
                <Icon icon="tianjia" style="width: 56px;height: 56px;color:var(--secondary-text);" class="pointer"
                      @click="addEdit('right')"></Icon>
              </div>
            </div>
          </div>
        </div>
        <!-- {{ foot }} -->
        <div class="box-foot" v-show="footNav" id="footBox">
          <div style="height: 73px;overflow: hidden;" class="flex flex-row items-center w-full pl-2">
            <div style="overflow: hidden;" id="navList"
                 class="flex flex-row items-center mr-2 flex-nowrap scroll-content" ref="content">
              <div v-for="item in footNavigationList" style="margin: 4px 18px" :key="item.name">
                <!-- {{ item.type }} -->
                <a-dropdown :trigger="['contextmenu']">
                  <div
                    style="width: 56px;height: 56px;display: flex;justify-content: center;align-items: center;background: var(--secondary-bg);border-radius: 12px"
                    v-if="item.type==='systemApp'" @click="clickNavigation(item)">
                    <navIcon :icon="item.icon" style="width: 32px;height: 32px;color:var(--secondary-text);"></navIcon>
                  </div>
                  <a-avatar :size="40" shape="square"  :src="renderIcon(item.icon)" v-else></a-avatar>
                </a-dropdown>
              </div>
            </div>
          </div>
          <div>
            <xt-task  id='M0104' no='4'  @cb="addEdit('foot')">
            <Icon icon="tianjia"
                  style="width: 56px;height: 56px;color:var(--secondary-text);position:relative;top:2px;"
                  class="mr-8 pointer" @click="addEdit('foot')"></Icon>
           </xt-task>
          </div>
          <div style="border-left: 1px solid rgba(255, 255, 255, 0.4);"
               class="flex items-center justify-center pl-6 mr-6 pointer">
            <navIcon icon="appstore-fill" style="width: 48px;height: 48px;color:var(--secondary-text);"></navIcon>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <Classification :navClassify="navClassify" v-if="editFlag" v-model:show="editFlag" @clickLeftList="clickItem">
        <div v-show="nowClassify!=='localApp'" class="h-full">
          <a-input v-model:value="selectContent" class="h-10 rounded-lg no-drag" placeholder="搜索"
                   style="background: var(--secondary-bg)">
            <template #prefix>
              <Icon icon="sousuo" class="text-gray-600"></Icon>
            </template>
          </a-input>
          <vue-custom-scrollbar key="scrollbar" :settings="rightScrollbarSettings"
         class="relative" style="height: calc(100% - 40px);padding: 5px 0">
<template v-for="(item,index) in filterList">
    <xt-task  id='M0104' no='6'  v-if="item.name == '主页'" @cb="clickRightListItem(item,index)">
      <listItem  :item="item" class="rounded-lg right-scroll-list" @click="clickRightListItem(item,index)"></listItem>
    </xt-task>
      
      <listItem v-else  :item="item" class="rounded-lg right-scroll-list" @click="clickRightListItem(item,index)"></listItem>
</template>


          </vue-custom-scrollbar>
        </div>
        <!-- 拖拽文件快速定位 -->
        <div v-show="nowClassify==='localApp'" class="flex flex-col items-start h-full text-zinc-500"
             style="color:var(--secondary-text)">
          <div>1. 点击选择需要添加的应用快捷方式</div>
          <div>2. 拖动应用快捷方式拖放到下方</div>
          <div>3. 支持批量添加</div>
          <div class="border-dashed w-full h-1/2 mt-2.5 rounded-lg flex flex-row justify-center items-center"
               @dragover.prevent="" @drop.prevent="drop">
               <!-- class="add-icon" -->
            <div class="flex items-center justify-center w-40 h-12 rounded-lg pointer add-style" @click="showOpenFileDialog">
              <Icon icon="tianjia2" style="width:18px;height:18px;" class="mr-2"></Icon>
              添加快捷方式
            </div>
          </div>
          <ScrolX :height="66">
            <div class="flex flex-row justify-start w-full pt-4 mt-4 -ml-8">
              <div v-for="(item,index) in dropList" class="flex ml-4">
                <!-- {{ item }} -->
                <a-badge>
                  <template #count>
                    <Icon icon="guanbi2" style="height: 24px;width: 24px;color: crimson" @click="deleteDropList(index)"
                          class="pointer"></Icon>
                  </template>
                  <a-avatar :size="40" shape="square" :src="item.icon">
                  </a-avatar>
                </a-badge>
              </div>
            </div>
          </ScrolX>
          <div @click="clickRightListItem(dropList)"
               class="flex items-center justify-center w-24 h-12 mt-2 rounded-lg pointer add-style">
            确定添加
          </div>
        </div>
      </Classification>
    </transition>
  </div>
</template>

<script>
import vuuri from '../vuuriHome/Vuuri.vue'
import listItem from './listItem.vue'
import { mapActions, mapWritableState } from 'pinia'
import { cardStore } from '../../store/card'
import { navStore } from '../../store/nav'
import ScrolX from '../ScrolX.vue'
import Sortable from 'sortablejs'
import navigationData from '../../js/data/tableData'
import Classification from '../comp/Classification.vue'
import { Icon as navIcon } from '@iconify/vue'
import { message } from 'ant-design-vue'
import {renderIcon} from '../../js/common/common'
const { appModel } = window.$models

const suggestNavigationList = [

  {
    type: 'systemApp',
    icon: 'fluent:chat-16-regular',
    name: '社群(开发中)',
    event:'chat',
    tab:'community',
   fn:()=>{
     vm.$router.push({ name: 'chat' })
   }
  },
  {
    type: 'systemApp',
    icon: 'fluent:document-bullet-list-multiple-24-regular',
    name: '办公',
    tab:'work',
    event: 'work',
  },
  {
    type: 'systemApp',
    icon: 'fluent:games-16-regular',
    name: '游戏',
    tab:'game',
    event: 'gameIndex'
  },

  {
    type: 'systemApp',
    icon: 'fluent:globe-16-regular',
    name: '浏览器',
    event: 'browser',
  },

  {
    type: 'systemApp',
    icon: 'fluent:music-note-2-16-regular',
    name: '音乐',
    event: 'music'
  },

  {
    type: 'systemApp',
    icon: 'fluent:image-multiple-16-regular',
    name: '壁纸',
    tab:'paper',
    event: 'my',
  },

]
export default {
  name: 'EditNavigation',
  data () {
    return {
      scrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: true,
        suppressScrollX: false,
        wheelPropagation: true,
      },
      rightScrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true,
      },
      selectContent: '',
      listData: [],
      editFlag: false,
      activeItem: 0,
      activeRightItem: 0,
      rubbish: false,
      nowClassify: 'systemApp',
      navClassify: [
        ...navigationData.navigationClassify
      ],
      ClassifyData: [
        ...navigationData.coolAppList, ...navigationData.systemAppList
      ],
      dropList: [],
      leftNav: false,
      rightNav: false,
      footNav: false,
      promptModal: false,
      selectNav: '',
      navText: true,
      mainNavList: [],
      suggestNavList: [],//推荐
      // sumNavList: [],
      darggingCore: false,
      delMainIndex: -1,
      delMainItem: [],
      delNavType: '',
      testVal: ''
    }
  },
  computed: {
    ...mapWritableState(cardStore, ['routeParams']),
    ...mapWritableState(navStore, ['mainNavigationList', 'sideNavigationList', 'footNavigationList', 'rightNavigationList', 'navigationToggle']),

    filterList () {
      return this.ClassifyData.filter(i => {
        // 离线模式下隐藏 创意市场
        if(window.$isOffline){
          return i.type === this.nowClassify && i.name.includes(this.selectContent) && i.name != '创意市场'
        }else{
          return i.type === this.nowClassify && i.name.includes(this.selectContent)
        }
      })
    }
  },
  components: {
    vuuri,
    ScrolX,
    listItem,
    Classification,
    navIcon
  },
  created () {
    this.loadDeskIconApps()
  },
  mounted () {
    this.leftNav = this.navigationToggle[0]
    this.rightNav = this.navigationToggle[1]
    this.footNav = this.navigationToggle[2]
    let that = this
    this.updateMainNav()
    this.updateSuggestNav()
    // let content = this.$refs.content
    // content.addEventListener('wheel',(event) => {
    //   event.preventDefault();
    //   content.scrollLeft += event.deltaY
    // });
    let boxContent = document.getElementById('boxContent')
    boxContent.addEventListener('ondragover', () => {
      ev.preventDefault()
    })
    boxContent.addEventListener('drop', () => {
      this.darggingCore = false
    })
    this.scrollNav('content', 'scrollLeft')
    this.scrollNav('sideContent', 'scrollTop')
    this.scrollNav('rightContent', 'scrollTop')
    this.$nextTick(() => {
      this.rowDrop()
      this.colDrop()
      this.rightDrop()
      this.mainDrop()
    }),
    // 替换原有图标
    // console.log(this.ClassifyData);
    navigationData.systemAppList.forEach((item) => {
      this.ClassifyData.forEach((i) => {
        if (item.name === i.name) {
          i.icon=item.icon
        }
      })
    })
    navigationData.systemFillAppList.forEach((item) => {
      this.sideNavigationList.forEach((i) => {
        if (item.name === i.name) {
          i.icon=item.icon
        }
      })
    })
    navigationData.systemAppList.forEach((item) => {
      this.footNavigationList.forEach((i) => {
        if (item.name === i.name) {
          i.icon=item.icon
        }
      })
    })
    navigationData.systemFillAppList.forEach((item) => {
      this.rightNavigationList.forEach((i) => {
        if (item.name === i.name) {
          i.icon=item.icon
        }
      })
    })
  },
  methods: {
    scrollNav (refVal, scrollDirection) {
      let content = this.$refs[refVal]
      content.addEventListener('wheel', (event) => {
        event.preventDefault()
        content[scrollDirection] += event.deltaY
      })
    },
    clickNavigation (type) {
      console.log(type);
    },
    navToggle (type) {
      this.delMainItem = []
      switch (type) {
        case 'left':
          for (const i in this.mainNavList) {
            this.sideNavigationList.forEach(item => {
              if (item.name === this.mainNavList[i].name) {
                if (this.footNav && this.rightNav) {
                  let sumNav = this.footNavigationList.concat(this.rightNavigationList)
                  if (!sumNav.find(f => f.name === item.name)) {
                    this.delMainItem.push(item)
                    this.promptModal = true
                    this.leftNav = true
                  }
                } else if (this.footNav && !this.rightNav) {
                  if (!this.footNavigationList.find(f => f.name === item.name)) {
                    this.delMainItem.push(item)
                    this.promptModal = true
                    this.leftNav = true
                  }
                } else if (!this.footNav && this.rightNav) {
                  if (!this.rightNavigationList.find(f => f.name === item.name)) {
                    this.delMainItem.push(item)
                    this.promptModal = true
                    this.leftNav = true
                  }
                } else {
                  this.delMainItem.push(item)
                  this.promptModal = true
                  this.leftNav = true
                }
              }
            })
          }
          break
        case 'foot':
          for (const i in this.mainNavList) {
            this.footNavigationList.forEach(item => {
              if (item.name === this.mainNavList[i].name) {
                // let sumNav = this.sideNavigationList.concat(this.rightNavigationList)
                // if(!sumNav.find(f => f.name === item.name)){
                //   this.delMainItem.push(item)
                //   this.promptModal = true
                //   this.footNav = true
                // }
                if (this.leftNav && this.rightNav) {
                  let sumNav = this.sideNavigationList.concat(this.rightNavigationList)
                  if (!sumNav.find(f => f.name === item.name)) {
                    this.delMainItem.push(item)
                    this.promptModal = true
                    this.footNav = true
                  }
                } else if (this.leftNav && !this.rightNav) {
                  if (!this.sideNavigationList.find(f => f.name === item.name)) {
                    this.delMainItem.push(item)
                    this.promptModal = true
                    this.footNav = true
                  }
                } else if (!this.leftNav && this.rightNav) {
                  if (!this.rightNavigationList.find(f => f.name === item.name)) {
                    this.delMainItem.push(item)
                    this.promptModal = true
                    this.footNav = true
                  }
                } else {
                  this.delMainItem.push(item)
                  this.promptModal = true
                  this.footNav = true
                  this.setNavigationToggle(type, true)
                }

              }
            })
          }
          break
        case 'right':
          for (const i in this.mainNavList) {
            this.rightNavigationList.forEach(item => {
              if (item.name === this.mainNavList[i].name) {
                if (this.leftNav && this.footNav) {
                  let sumNav = this.sideNavigationList.concat(this.footNavigationList)
                  if (!sumNav.find(f => f.name === item.name)) {
                    this.delMainItem.push(item)
                    this.promptModal = true
                    this.rightNav = true
                  }
                } else if (this.leftNav && !this.footNav) {
                  if (!this.sideNavigationList.find(f => f.name === item.name)) {
                    this.delMainItem.push(item)
                    this.promptModal = true
                    this.rightNav = true
                  }
                } else if (!this.leftNav && this.footNav) {
                  if (!this.footNavigationList.find(f => f.name === item.name)) {
                    this.delMainItem.push(item)
                    this.promptModal = true
                    this.rightNav = true
                  }
                } else {
                  this.delMainItem.push(item)
                  this.promptModal = true
                  this.rightNav = true
                }
              }
            })
          }
          break
      }
    },
    // navToggle(navList,type){
    //   this.delMainItem = []
    //   for (const i in this.mainNavList) {
    //     navList.forEach(item => {
    //       if(item.name === this.mainNavList[i].name){
    //         this.delMainItem.push(item)
    //         this.promptModal = true
    //       }
    //     })
    //   }
    //   switch (type) {
    //     case 'left':
    //       this.leftNav = !this.leftNav
    //       break;
    //     case 'foot':
    //       this.footNav = !this.footNav
    //       break;
    //     case 'right':
    //       this.rightNav = !this.rightNav
    //       break;
    //   }
    // },
    ...mapActions(navStore, ['setFootNavigationList', 'sortFootNavigationList', 'removeFootNavigationList', 'setSideNavigationList', 'sortSideNavigationList', 'removeSideNavigationList', 'setRightNavigationList', 'sortRightNavigationList', 'removeRightNavigationList', 'setNavigationToggle']),
    updateMainNav (addItem, type) {
      this.mainNavList = this.mainNavigationList
      let sumNavList = this.sideNavigationList.concat(this.footNavigationList, this.rightNavigationList)
      if (type) {
        this.mainNavList.forEach(item => {
          if (item.name === addItem.name) {
            if (type === 'add') {
              item.addNav = true
            } else if (type === 'del') {
              item.addNav = false
            }
          }
        })
      } else {
        for (const i in this.mainNavList) {
          let stateNav = sumNavList.some(item => item.name === this.mainNavList[i].name)
          this.mainNavList[i].addNav = stateNav
        }
      }
    },
    updateSuggestNav (addItem, type) {
      this.suggestNavList = suggestNavigationList
      if (window.$isOffline) {
        this.suggestNavList = this.suggestNavList.filter(i=>{
          return i.tab != 'community'
        })
      }
      let sumNavList = this.sideNavigationList.concat(this.footNavigationList, this.rightNavigationList)
      if (type) {
        this.mainNavList.forEach(item => {
          if (item.name === addItem.name) {
            if (type === 'add') {
              item.addNav = true
            } else if (type === 'del') {
              item.addNav = false
            }
          }
        })
      } else {
        for (const i in this.suggestNavList) {
          let stateNav = sumNavList.some(item => item.name === this.suggestNavList[i].name)
          this.suggestNavList[i].addNav = stateNav
        }
      }
    },
    mainDrop () {
      let that = this
      let main = document.getElementById('mainList')

      Sortable.create(main, {
        sort: false,
        animation: 150,
        removeCloneOnHide: true,
        forceFallback: false,
        onStart (evt) {
          that.darggingCore = true
          that.draggingArea('leftBox', evt.oldIndex, that.sideNavigationList, that.setSideNavigationList, that.mainNavigationList)
          that.draggingArea('rightBox', evt.oldIndex, that.rightNavigationList, that.setRightNavigationList, that.mainNavigationList)
          that.draggingArea('footBox', evt.oldIndex, that.footNavigationList, that.setFootNavigationList, that.mainNavigationList)
        },
      })

      let suggest = document.getElementById('suggestList')

      Sortable.create(suggest, {
        sort: false,
        animation: 150,
        removeCloneOnHide: true,
        forceFallback: false,
        onStart (evt) {
          that.darggingCore = true
          that.draggingArea('leftBox', evt.oldIndex, that.sideNavigationList, that.setSideNavigationList, suggestNavigationList, false)
          that.draggingArea('rightBox', evt.oldIndex, that.rightNavigationList, that.setRightNavigationList, suggestNavigationList, false)
          that.draggingArea('footBox', evt.oldIndex, that.footNavigationList, that.setFootNavigationList, suggestNavigationList, false)
        },
      })

    },
    renderIcon,
    /**
     *
     * @param id
     * @param oldIndex
     * @param NavigationList
     * @param setNavigationList
     * @param source 来源数据
     * @param compare 是否比对，排重
     */
    draggingArea (id, oldIndex, NavigationList, setNavigationList, source, compare = true) {
      let that = this
      let slider = document.getElementById(id)
      slider.ondragover = function (ev) {
        ev.preventDefault()
      }
      slider.ondrop = () => {
        if (that.darggingCore || compare === false) {
          if (!NavigationList.find(j => j.name === source[oldIndex].name)) {
            setNavigationList(source[oldIndex])
            that.updateMainNav()
            that.updateSuggestNav()
          } else {
            message.info('已添加', 1)
          }
        }
      }
    },
    delNavigation (sumList, oneNav, index, delMethod, type) {
      this.delMainItem = []
      if (!this.mainNavList.find(item => item.name === oneNav.name)) {
        //如果不是必须的
        delMethod(index)
        this.updateSuggestNav()
      } else {
        if (sumList.find(item => item.name === oneNav.name)) {
          //正常移除
          delMethod(index)
          this.updateSuggestNav()
        } else {
          //不可移除全部的弹窗
          this.promptModal = true
          this.delNavType = type
          this.delMainIndex = index
          this.delMainItem.push(oneNav)
        }
      }
    },
    delMainCore () {
      if (this.delNavType === 'delFoot') {
        this.removeFootNavigationList(this.delMainIndex)
      } else if (this.delNavType === 'delLeft') {
        this.removeSideNavigationList(this.delMainIndex)
      } else if (this.delNavType === 'delRight') {
        this.removeRightNavigationList(this.delMainIndex)
      }
      this.promptModal = false
      this.delMainIndex = -1
      this.updateMainNav(this.delMainItem[0], 'del')
      this.navText = true
    },
    rowDrop () {
      let that = this
      let drop = document.getElementById('navList')
      Sortable.create(drop, {
        sort: true,
        animation: 150,
        onStart: function (event) {
          that.navText = false
          if (!this.navText) {
            let delIcon = document.getElementById('delIcon')
            delIcon.ondragover = function (ev) {
              ev.preventDefault()
            }
          }
          delIcon.ondrop = function (ev) {
            let oneNav = that.footNavigationList[event.oldIndex]
            let sumList = []
            if (that.leftNav && that.rightNav) {
              sumList = that.sideNavigationList.concat(that.rightNavigationList)
            } else if (that.leftNav && !that.rightNav) {
              sumList = that.sideNavigationList
            } else if (!that.leftNav && that.rightNav) {
              sumList = that.rightNavigationList
            }
            that.delNavigation(sumList, oneNav, event.oldIndex, that.removeFootNavigationList, 'delFoot')

            // let oneNav = that.footNavigationList[event.oldIndex]
            // that.delMainItem = []
            // if(!that.mainNavList.find(item => item.name === oneNav.name)){
            //   that.removeFootNavigationList(event.oldIndex)
            // }else{
            //   if(sumList.find(item => item.name === oneNav.name)){
            //     that.removeFootNavigationList(event.oldIndex)
            //   }else{
            //     that.promptModal = true
            //     that.delNavType = 'delFoot'
            //     that.delMainIndex = event.oldIndex
            //     that.delMainItem.push(oneNav)
            //   }
            // }
            // that.mainNav()
            // that.navText = true
          }
        },
        onUpdate: function (event) {
          let newIndex = event.newIndex,
            oldIndex = event.oldIndex
          let newItem = drop.children[newIndex]
          let oldItem = drop.children[oldIndex]

          // 先删除移动的节点
          drop.removeChild(newItem)
          // 再插入移动的节点到原有节点，还原了移动的操作
          if (newIndex > oldIndex) {
            drop.insertBefore(newItem, oldItem)
          } else {
            drop.insertBefore(newItem, oldItem.nextSibling)
          }
          that.sortFootNavigationList(event)
          that.updateMainNav()
          that.updateSuggestNav()
        },
        onEnd: function (event) {
          that.navText = true
        }
        // onChoose: function (/**Event*/evt) {
        //   that.rubbish=true
        // },
        // onUnchoose: function(/**Event*/evt) {
        //    that.rubbish=false
        // },
        // onRemove: function (/**Event*/event) {
        //     that.removeNavigationList(event)
        // },
      })
    },
    colDrop () {
      let that = this
      let side = document.getElementById('sideNavList')
      Sortable.create(side, {
        sort: true,
        animation: 150,
        direction: 'vertical',
        scroll: false,
        delay: 0,
        onStart: function (event) {
          that.navText = false
          if (!this.navText) {
            let delIcon = document.getElementById('delIcon')
            delIcon.ondragover = function (ev) {
              ev.preventDefault()
            }
          }
          delIcon.ondrop = function (ev) {
            let oneNav = that.sideNavigationList[event.oldIndex]
            let sumList = []
            if (that.footNav && that.rightNav) {
              sumList = that.footNavigationList.concat(that.rightNavigationList)
            } else if (that.footNav && !that.rightNav) {
              sumList = that.footNavigationList
            } else if (!that.footNav && that.rightNav) {
              sumList = that.rightNavigationList
            }
            that.delNavigation(sumList, oneNav, event.oldIndex, that.removeSideNavigationList, 'delLeft')
          }
        },
        onUpdate: function (event) {
          let newIndex = event.newIndex,
            oldIndex = event.oldIndex
          let newItem = side.children[newIndex]
          let oldItem = side.children[oldIndex]
          // 先删除移动的节点
          side.removeChild(newItem)
          // 再插入移动的节点到原有节点，还原了移动的操作
          if (newIndex > oldIndex) {
            side.insertBefore(newItem, oldItem)
          } else {
            side.insertBefore(newItem, oldItem.nextSibling)
          }
          that.sortSideNavigationList(event)
        },
        onEnd: function (event) {
          that.navText = true
        }
      })
    },
    rightDrop () {
      let that = this
      let right = document.getElementById('rightNavList')
      Sortable.create(right, {
        sort: true,
        animation: 150,
        direction: 'vertical',
        delay: 0,
        onStart: function (event) {
          that.navText = false
          if (!this.navText) {
            let delIcon = document.getElementById('delIcon')
            delIcon.ondragover = function (ev) {
              ev.preventDefault()
            }
          }
          delIcon.ondrop = function (ev) {
            let oneNav = that.rightNavigationList[event.oldIndex]
            let sumList = []
            if (that.leftNav && that.footNav) {
              sumList = that.footNavigationList.concat(that.sideNavigationList)
            } else if (that.leftNav && !that.footNav) {
              sumList = that.sideNavigationList
            } else if (!that.leftNav && that.footNav) {
              sumList = that.footNavigationList
            }
            that.delNavigation(sumList, oneNav, event.oldIndex, that.removeRightNavigationList, 'delRight')
          }
        },
        onUpdate: function (event) {
          let newIndex = event.newIndex,
            oldIndex = event.oldIndex
          let newItem = right.children[newIndex]
          let oldItem = right.children[oldIndex]
          // 先删除移动的节点
          right.removeChild(newItem)
          // 再插入移动的节点到原有节点，还原了移动的操作
          if (newIndex > oldIndex) {
            right.insertBefore(newItem, oldItem)
          } else {
            right.insertBefore(newItem, oldItem.nextSibling)
          }
          that.sortRightNavigationList(event)
        },
        onEnd: function (event) {
          that.navText = true
        }
      })
    },
    deleteDropList (index) {
      this.dropList.splice(index, 1)
    },
    async drop (e) {
      let files = e.dataTransfer.files
      let filesArr = []
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          filesArr.push(files[i].path)
        }
      }
      this.dropFiles = await ipc.sendSync('getFilesIcon', { files: JSON.parse(JSON.stringify(filesArr)) })
      this.dropList.push(...this.dropFiles)
    },
    clickItem (item) {
      this.activeRightItem = 0
      this.nowClassify = item.name
    },
    async loadDeskIconApps () {
      const lightApps = await appModel.getAllApps()
      for (let i = 0; i < lightApps.length; i++) {
        lightApps[i].icon = lightApps[i].logo
        lightApps[i].type = 'lightApp'
      }
      const desktopApps = await ipc.sendSync('getDeskApps')
      for (let i = 0; i < desktopApps.length; i++) {
        desktopApps[i].type = 'tableApp'
      }
      this.ClassifyData.push(...desktopApps, ...lightApps)
    },
    onBack () {
      this.$emit('setQuick')
      this.routeParams.url && setTimeout(() => {this.$router.push({ name: 'app', params: this.routeParams })}, 400)
    },
    addEdit (val) {
      this.selectNav = val
      this.editFlag = true
      this.nowClassify = 'systemApp'
      this.dropList = []
    },
    closeAdd () {
      this.editFlag = false
    },
    clickRightListItem (item, index) {
      this.activeRightItem = index
      this.editFlag = false
      if (this.selectNav === 'foot') {
        if (item instanceof Array) {
          for (let i = 0; i < item.length; i++) {
            if (!this.footNavigationList.find(j => j.name === item[i].name)) {
              this.updateMainNav(item[i], 'add')
              item[i].addNav = true
              this.setFootNavigationList(item[i])
            } else {
              message.info('已添加', 1)
            }
          }
          this.dropList = []
        } else {
          for (let i = 0; i < this.footNavigationList.length; i++) {
            if (this.footNavigationList[i].name === item.name) return message.info('已添加', 1)
          }
          this.updateMainNav(item, 'add')
          item.addNav = true
          this.setFootNavigationList(item)
          this.$nextTick(() => {
            let scrollElem = this.$refs.content
            scrollElem.scrollTo({ left: scrollElem.scrollWidth, behavior: 'smooth' })
          })
        }
      } else if (this.selectNav === 'left') {
        if (item instanceof Array) {
          for (let i = 0; i < item.length; i++) {
            if (!this.sideNavigationList.find(j => j.name === item[i].name)) {
              this.updateMainNav(item[i], 'add')
              item[i].addNav = true
              this.setSideNavigationList(item[i])
            } else {
              message.info('已添加', 1)
            }
          }
          this.dropList = []
        } else {
          for (let i = 0; i < this.sideNavigationList.length; i++) {
            if (this.sideNavigationList[i].name === item.name) return message.info('已添加', 1)
          }
          this.updateMainNav(item, 'add')
          item.addNav = true
          this.setSideNavigationList(item)
          this.$nextTick(() => {
            let scrollElem = this.$refs.sideContent
            scrollElem.scrollTo({ top: scrollElem.scrollHeigth, behavior: 'smooth' })
          })
        }
      } else if (this.selectNav === 'right') {
        if (item instanceof Array) {
          for (let i = 0; i < item.length; i++) {
            if (!this.rightNavigationList.find(j => j.name === item[i].name)) {
              this.updateMainNav(item[i], 'add')
              item[i].addNav = true
              this.setRightNavigationList(item[i])
            } else {
              message.info('已添加', 1)
            }
          }
          this.dropList = []
        } else {
          for (let i = 0; i < this.rightNavigationList.length; i++) {
            if (this.rightNavigationList[i].name === item.name) return message.info('已添加', 1)
          }
          this.updateMainNav(item, 'add')
          item.addNav = true
          this.setRightNavigationList(item)
        }
      }
    },
    async showOpenFileDialog () {
      let savePath = await tsbApi.dialog.showOpenDialog({
        title: '选择', message: '请选择文件', multiple: 'true', properties: [
          'openFile ',
          'multiSelections'
        ]
      })
      if (savePath) {
        let filesArr = []
        if (savePath && savePath.length > 0) {
          for (let i = 0; i < savePath.length; i++) {
            filesArr.push(savePath[i])
          }
        }
        let dropFiles = await ipc.sendSync('getFilesIcon', { files: JSON.parse(JSON.stringify(filesArr)) })
        this.dropList.push(...dropFiles)
      } else {
        // console.log('取消选择')
      }
    },
  },
  watch: {
    leftNav (newVal) {
      this.setNavigationToggle('left', newVal)
    },
    rightNav (newVal) {
      this.setNavigationToggle('right', newVal)
    },
    footNav (newVal) {
      this.setNavigationToggle('foot', newVal)
    }
  },
}
</script>
<style lang="scss">
.bottom-edit {
  .muuri-item {
    width: 56px;

  }

  .muuri-item {
    margin-right: 32px;
  }

}
</style>
<style lang="scss" scoped>
@media screen and (max-height: 660px) {
  .side-nav {
    max-height: 350px;
  }
}

@media screen and (min-height: 660px) {
  .side-nav {
    max-height: 508px;
  }
}

.box-content {
  height: 100%;

  .box-center {
    height: 70%;
    margin: 32px 12px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .side-nav {
      border-radius: 12px;
      width: 80px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      border-radius: 12px;
      background: var(--primary-bg);
      // max-height: 508px;
      overflow: hidden;
      padding: 24px 0 24px;
    }

    .center-text {
      width: 90%;
      // width: 1056px;
      margin: 0 10px;
      height: 100%;
      display: flex;
      justify-content: center;
      position: relative;
    }
  }

  .box-foot {
    position: absolute;
    bottom: 12px;
    left: 50%;
    transform: translate(-50%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 auto;
    // padding-left: 24px;
    min-width: 827px;
    width: 70%;
    height: 80px;
    border-radius: 12px;
    background: var(--primary-bg);
    box-sizing: border-box;
  }
}

.con-center {
  width: 512px;
  display: flex;
  align-items: center;
  flex-direction: column;
  // justify-content: center;
  // align-items: center;
  > span:nth-child(1),
  > span:nth-child(3) {
    display: block;
    font-size: 18px;
    font-weight: 500;
    color: var(--primary-text);

  }

  > span:nth-child(2),
  > span:nth-child(4) {
    margin: 8px 0 16px;
    // width: 65%;
    // text-align: center;
    color: var(--secondary-text);

    font-size: 16px;
  }
}

.main-nav {
  padding: 10px;
  background: var(--modal-bg);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  > div {
    width: 88px;
    height: 88px;
    background: var(--secondary-bg);
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .add-toggle {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 16px;
    // background: rgba(0, 0, 0, 0.5);
    // background: rgba(255,255,255,0.50);
  }
}

.nav-toggle {
  background: red;

  > div {
    display: flex;
    flex-direction: column;
    padding:12px 12px;
    text-align: center;
    background: var(--modal-bg);
    border-radius: 12px;
  }
}

.left-point {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}

.right-point {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

.foot-point {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
}

.prompt-modal {
  position: relative;
  top: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  // height: 200px;
  width: 380px;
  margin: 0 auto;
  color: var(--primary-text);

  .modal-btn {
    display: flex;

    > div {
      padding: 8px 50px;
      border-radius: 12px;
      background: var(--mask-bg);
    }
  }
}

.del-icon {
  width: 100%;
  height: 100%;
  opacity: 0.5;
  background: var(--secondary-bg);
  border: 1px dashed rgba(255, 255, 255, 0.4);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: var(--primary-text);
  font-weight: 500;
}


.grid {
  position: relative;
  display: inline-block;
  height: 56px;
  line-height: 56px;
  border-radius: 4px;
  vertical-align: top;
  left: 0;
  right: 0;
}

.back {
  margin-left: 12px;
  width: 80px;
  height: 48px;
  border-radius: 12px;
  background: var(--secondary-bg);
  display: flex;
  justify-content: center;
  align-items: center;
}

.add-navigation {
  padding: 16px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: calc(100vw - 20%);
  height: calc(100vh - 10%);
  border-radius: 16px;
  background: rgba(33, 33, 33, 1);
  max-width: 800px;
  max-height: 600px;
  display: flex;
  flex-direction: column;
  text-align: center;

  > :nth-child(1) {
    font-size: 18px;
    color: var(--primary-text);
    margin-top: 8px;
  }

  > :nth-child(2) {
    width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgb(42, 42, 42);
    border-radius: 12px;
    position: absolute;
    top: 16px;
    right: 16px;
  }

  .add-navigation-content {
    margin-top: 30px;
    width: 100%;
    height: 80%;

    .left-content {
      width: 136px;
      border-right: 1px rgba(255, 255, 255, 0.1) solid;
      height: 100%;

      > div {
        width: 136px;

        > div {
          width: 120px;
          height: 56px;
          font-size: 16px;
          font-weight: 400;
          color: var(--primary-text);
          line-height: 56px;
        }

        .active {
          border-radius: 12px;
          // background: rgba(42, 42, 42, 1);
        }
      }

    }
  }
}
.add-icon{
  padding: 8px;
  cursor:pointer;
  display: flex;
  align-items: center;
  border: 1px solid;
  border-radius: 8px;
}
.add-icon:hover{
  // border: 1px solid var(--active-bg);
  // color: #508BFE;
  opacity: 0.8;
}
.add-style{
  background: var(--secondary-bg);
  color: var(--primary-text);
}
.add-style:hover{
  opacity: 0.8;
}

.right-scroll-list:hover {
  background: var(--secondary-bg);
}
</style>
