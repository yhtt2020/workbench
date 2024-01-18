<template>
  <xtMixMenu :menus="rightMenus" name="name" :menuHeight="'max-h-full flex'">
    <!-- <xt-menu :menus="rightMenus" name="name" class="flex max-h-full" :beforeCreate="beforeCreate"> -->
    <!-- style="z-index: 99" -->
    <!-- 文件夹弹窗 -->
    <div v-if="true"
      style="position: fixed;top: 10px;background: black;color:white;z-index:99999;line-height: 14px;text-align: left;max-width: 100vw;left:150px">
      <div>{{ `left: ${navAttribute.navSize / 100 * this.left}px; top: ${navAttribute.navSize / 100 * this.top}px` }}</div>
      <div>选中的id{{ hoverIndex }}</div>
      <div v-for="( item, index) in navigationList" style="margin-bottom: 5px;border-bottom: 4px solid white">
        {{ index }} {{ item.name }} {{ item.id }} {{ item.children?.length }}
      </div>
    </div>
    <div style="position: absolute; z-index: 500 !important;"
      :style="{ left: `${navAttribute.navSize / 100 * this.left}px`, top: `${this.top}px` }" class="rounded-xl pointer "
      id="folder">
      <Folder @clickFile="clickFile" @update:layout="updateLayout" @update:size="updateSize" :customData="customData"
        :customIndex="sideKey" :secondary="true" v-if="folderVisible" :expand="{ disabled: true }" :navBar="{
          resize: false,
          sizeOption: false,
          isDel: true,
          hierarchy: true
        }" :auto="true" />
    </div>
    <Drop @createFile="createFile">
      <transition>
        <div v-if="hoverIndex > -1 && hoverRealItemId() !== dragItem?.id" :style="mergeTag"
          style="position: absolute;z-index:99999999999;top:50%;transform: translateY(-50%) translateX(-100%);writing-mode: vertical-rl;"
          class="px-3 py-10 rounded-lg s-bg xt-text">松开鼠标合并</div>
      </transition>
      <div 
        @click.stop :id="currentId" 
        style="min-height: 80px;z-index: 99;border: 1px solid var(--divider) !important;"
        class="flex flex-row justify-center box common-panel s-bg w-[80px]  xt-bg pt-0 pb-0 relative max-h-full side-bar"
        ref="sideContent" @contextmenu="showMenu"
        :style="{ zoom: `${(this.navAttribute.navSize / 100)}`, borderRadius: this.navAttribute.navRadius + 'px' }">
        <div 
          style="width: 52px;margin-top: 20px;margin-bottom: 20px;" 
          class="w-full" >
          <div 
            :id="sortId" 
            :key="sideKey" 
            @drop.prevent="drop" @dragover.prevent=""
            class="flex flex-col items-center flex-1 max-h-full scroller-wrapper hide-scrollbar xt-container"
            style="width: 56px;display: flex;flex-direction: column;overflow: hidden;align-items: flex-start; gap: 20px;">
            <a-tooltip 
              v-for="(item, index) in navigationList" 
              :key="item.id" :title="item.name"
              :overlayStyle="{ zoom: `${(this.navAttribute.navSize / 100)}` }" 
              @mouseenter="showElement(item, index)"
              :placement="sortId === 'left' ? 'right' : 'left'">
              <!-- 左右导航栏隐藏入口 -->
              <xt-menu 
                :menus="folderOptions" 
                :id="item.id" 
                class="relative overflow-visible item-content">
                <div 
                  @dragover="onDrag" 
                  @dragend="hoverIndex = -1" 
                  :key="item.name" 
                  @click="newOpenApp(item)"
                  :class="{ hover: (dragItem && item.id === hoverRealItemId() && dragItem?.id !== hoverRealItemId()) }"
                  >
                  <div v-if="!(this.isOffline && this.navList.includes(item.event))" class="item-content item-nav"
                    :class="{ 'active-back': current(item) }" :style="{ borderRadius: this.iconRadius + 'px' }">
                    <Team v-if="item.value === 'commun'" :item="item" :shakeElement="shakeElement"
                      :placement="sortId === 'left' ? 'right' : 'left'"></Team>
                    <FolderVue v-else-if="item.type === 'folder'" :iconList="item.children" :item="item"
                      @click="openFolder(item)">
                    </FolderVue>
                    <template v-else>
                      <Avatar :item="item" :shakeElement="shakeElement"></Avatar>
                    </template>

                  </div>
                </div>
              </xt-menu>
            </a-tooltip>
          </div>

        </div>
        <div class="flex items-center justify-center -ml-12" v-if="this.navigationList.length <= 0"
          @click="this.editNavigation(this.drawerMenus[0])">
          <xt-new-icon icon="fluent:add-16-regular" size="28"></xt-new-icon>
        </div>

      </div>
    </Drop>
    <!-- </xt-menu> -->
  </xtMixMenu>
  <Common ref="common"></Common>
  <transition name="fade">
    <div :style="{ zIndex: componentId === 'navigationSetting' ? 100 : 90 }" v-if="quick">
      <EditNewNavigation @setQuick="setQuick" ref="editNewNavigation" v-if="componentId === 'EditNavigationIcon'">
      </EditNewNavigation>
      <navigationSetting @setQuick="setQuick" v-if="componentId === 'navigationSetting'" @hiedNav="hiedNav">
      </navigationSetting>
      <!-- 图标编辑 -->
      <EditIcon @setQuick="setQuick" v-if="componentId === 'EditIcon'"></EditIcon>
    </div>
  </transition>
</template>

<script>
import { useDeskStore } from '../components/desk/store'
import { mapActions, mapState, mapWritableState } from "pinia";
import { useNavigationStore } from './desk/navigationBar/navigationStore'
import { navStore } from "../store/nav";
import { appStore } from '../store'
import { cardStore } from '../store/card';
import { offlineStore } from '../js/common/offline';
import { useWidgetStore } from '../components/card/store'
import Sortable from 'sortablejs';
import { message } from 'ant-design-vue';
import routerTab from '../js/common/routerTab'
import { Icon as navIcon } from '@iconify/vue';
import { renderIcon } from '../js/common/common'
import { moreMenus, extraRightMenu, rightMenus, iconMenus, mergeIconFolder } from '../components/desk/navigationBar/index'
import navigationSetting from './desk/navigationBar/navigationSetting.vue'
import EditNewNavigation from './desk/navigationBar/EditNewNavigation.vue'
// import EditNavigation from './bottomPanel/EditNavigation.vue';
import { Notifications } from '../js/common/sessionNotice'
import Common from './desk/navigationBar/components/Common.vue'
import xtMenu from '../ui/components/Menu/index.vue'
import xtMixMenu from '../ui/new/mixMenu/FunMenu.vue'
import _ from 'lodash-es'
import EditIcon from './desk/navigationBar/components/EditIcon/EditIcon.vue'
import { startApp } from '../ui/hooks/useStartApp'
import { updateIcon } from '../components/desk/navigationBar/index'
import Avatar from "./desk/navigationBar/components/Avatar.vue";
import Team from './bottomPanel/Team.vue'
import FolderVue from './desk/navigationBar/components/folder/Folder.vue'
import Folder from '../apps/folder'
import { defaultFolderData } from '../apps/folder/src/components/options'
import { nanoid } from 'nanoid'
import Drop from './desk/navigationBar/components/folder/Drop.vue'
import { useWindowSize, } from '../ui/new/drag/src/hooks/useWindowSize'
import { useElementSize } from "../ui/new/drag/src/hooks/useElementSize";
import { replaceType } from '../components/desk/navigationBar/hook/replaceType'
export default {
  name: 'SidePanel',
  components: {
    navIcon,
    navigationSetting,
    EditNewNavigation,
    Common,
    xtMenu,
    xtMixMenu,
    EditIcon,
    Avatar,
    Team,
    FolderVue,
    Drop,
    Folder,
  },
  emits: ['getDelIcon', 'hiedNavBar'],
  data() {
    return {
      dragItem: null,
      targetItem: null,
      cancelUpdate: false,
      sortable: null,
      sideKey: Date.now(),
      hoverIndex: -1,//当前选中的项目（排除gap）
      debug: false,
      tab: 'screen',

      menuVisible: false,
      quick: false,
      delNav: false,
      dragEnable: false,
      dragEvent: null,
      drawerMenus: [...extraRightMenu, ...moreMenus],
      componentId: 'EditNavigation',
      iconMenus: [
        {
          id: 1,
          newIcon: 'fluent:open-16-regular',
          label: '打开',
          callBack: () => { this.newOpenApp(this.currentItem) },
        },
        {
          id: 2,
          label: '编辑',
          newIcon: 'fluent:compose-16-regular',
          callBack: () => { this.editIcon(this.currentItem) },
        },
        {
          id: 3,
          label: '删除',
          newIcon: 'fluent:delete-16-regular',
          color: '#FF4D4F',
          callBack: () => { this.delCurrentIcon(this.currentIndex, this.currentItem) }
        },
        {
          id: 5,
          divider: true
        },
        {
          id: 6,
          label: '添加导航图标',
          newIcon: 'fluent:add-16-regular',
          callBack: () => { this.editNavigation(this.drawerMenus[0]) },
        },
        {
          id: 7,
          label: '导航栏设置',
          newIcon: 'fluent:settings-16-regular',
          callBack: () => { this.editNavigation(this.drawerMenus[1]) }
        }
      ],
      mainMenus: [
        {
          id: 1,
          newIcon: 'fluent:add-16-regular',
          name: '添加导航图标',
          fn: () => { this.editNavigation(this.drawerMenus[0]) },
        },
        {
          id: 2,
          name: '导航栏设置',
          newIcon: 'fluent:settings-16-regular',
          fn: () => { this.editNavigation(this.drawerMenus[1]) },
        },
        {
          id: 3,
          name: '隐藏当前导航',
          newIcon: 'fluent:eye-off-16-regular',
          fn: () => { this.$emit('hiedNavBar', 'foot') },
        },
        {
          id: 8,
          name: '清空当前导航栏',
          newIcon: 'fluent:circle-off-16-regular',
          fn: () => { this.clearAll() },
        },
        {
          id: 4,
          name: '更多',
          newIcon: 'fluent:more-horizontal-16-filled',
          children: []

        },
        {
          divider: true,
          id: 5
        },
        {
          type: 'systemApp',
          newIcon: 'fluent:lock-closed-16-regular',
          name: '锁定屏幕',
          event: 'lock',
          fn: () => { this.newOpenApp(this.builtInFeatures[0]) }
        },
        {
          type: 'systemApp',
          newIcon: 'fluent:settings-16-regular',
          name: '基础设置',
          event: 'setting',
          fn: () => { this.newOpenApp(this.builtInFeatures[1]) }
        },
        {
          type: 'systemApp',
          newIcon: 'fluent:full-screen-maximize-16-filled',
          name: '全屏显示',
          event: 'fullscreen',
          fn: () => { this.newOpenApp(this.builtInFeatures[2]) }
        },
        {
          type: 'systemApp',
          newIcon: 'fluent:slide-settings-24-regular',
          name: '设备设置',
          event: 'status',
          fn: () => { this.newOpenApp(this.builtInFeatures[3]) }
        }
      ],
      shakeElement: false,
      currentItem: null,
      currentIndex: null,
      currentNav: 'left',
      notifications: new Notifications(),
      targetPosition: { x: 0, y: 0 },
      defaultPosition: { x: 0, y: 0 },
      defaultFolderData,
      folderVisible: false,
      folderList: [],
      folderName: '文件夹',
      customData: {},
      folderItem: {},
      folderId: '',
      // 弹窗显示
      noticeFlag: true,
      left: 0,
      top: 0,
      parentSize: 0,
      sideList: []

    }
  },
  props: {
    // 当前导航列表
    navigationList: {
      type: Array,
      default: () => []
    },
    // 排序的方法
    sortNavigationList: {
      type: Function,
      default: () => { }
    },
    //要排序的容器id
    sortId: {
      type: Function,
      default: () => { }
    },
    //删除的方法
    delNavList: {
      type: Function,
      default: () => { }
    },
    // 其他开关1
    otherSwitch1: {
      type: Boolean,
      default: () => false
    },
    // 其他开关2
    otherSwitch2: {
      type: Boolean,
      default: () => false
    },
    // 其他导航列表1
    otherNavList1: {
      type: Array,
      default: () => []
    },
    // 其他导航列表2
    otherNavList2: {
      type: Array,
      default: () => []
    },
    // 删除区域的开关
    delZone: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    ...mapWritableState(navStore, [
      'footNavigationList',
      'builtInFeatures',
      'navigationToggle',
      'sideNavigationList',
      'rightNavigationList',
      'mainNavigationList',
      'navigationToggle', 'maxItemNum',
      'copyFootNav', 'copySideNav', 'copyRightNav'
    ]),
    ...mapWritableState(cardStore, ['routeParams']),
    ...mapWritableState(offlineStore, ['isOffline', 'navList']),
    ...mapWritableState(useWidgetStore, ['rightModel']),
    ...mapWritableState(useNavigationStore, [
      'editToggle', 'taskBoxVisible',
      'selectNav', 'bottomToggle',
      'popVisible', 'currentList',
      'editItem', 'navAttribute', 'iconRadius', 'jumpDesk'
    ]),
    ...mapWritableState(appStore, ['settings']),
    ...mapWritableState(useDeskStore, ['isEnterBar']),
    // 判断当前为左侧栏还是右侧栏，返回拖拽id
    currentId() {
      if (this.currentNav === 'left') {
        return 'left-bar'
      } else if (this.currentNav === 'right') {
        return 'right-bar'
      }
    },
    /**
     * 动态子菜单
     */
    childrenMenu() {
      return [
        {
          id: 1,
          name: this.bottomToggle[0] ? '隐藏用户中心' : '显示用户中心',
          newIcon: "fluent:person-16-regular",
          fn: () => { this.bottomToggle[0] = !this.bottomToggle[0] }
        },
        {
          id: 2,
          name: this.bottomToggle[1] ? '隐藏社区助手' : '显示社区助手',
          newIcon: "fluent:people-community-16-regular",
          fn: () => { this.bottomToggle[1] = !this.bottomToggle[1] }
        },
        {
          id: 3,
          name: this.bottomToggle[2] ? '隐藏任务中心' : '显示任务中心',
          newIcon: "fluent:task-list-square-16-regular",
          fn: () => { this.bottomToggle[2] = !this.bottomToggle[2] }
        },
        {
          id: 4,
          name: this.settings.enableChat ? '隐藏社群沟通' : '显示社群沟通',
          newIcon: "fluent:chat-16-regular",
          fn: () => { this.settings.enableChat = !this.settings.enableChat }
        },
      ]

    },
    /**
     * 主菜单
     */
    rightMenus() {
      // const arr=[...this.mainMenus[3].children]
      this.mainMenus[4].children = [...this.childrenMenu]
      // this.mainMenus[3].children=arr
      return this.mainMenus
    },
    /**
     * 文件夹选项
     */
    folderOptions() {
      if (this.currentItem && this.currentItem.type === 'folder') {
        const reset = {
          id: 4,
          label: '解散文件夹',
          newIcon: 'fluent:circle-off-16-regular',
          callBack: () => {
            this.resetFolder(this.currentItem, this.currentIndex)
          }
        }
        let arr = [...this.iconMenus, reset]
        return arr.sort((a, b) => a.id - b.id)
      }
      return this.iconMenus
    },
    /**
     * 通过文件夹中数据的多少来自定义大小
     */
    resize() {
      const length = this.folderList.length
      if (length <= 6) {
        return '2x2'
      } else if (length <= 12 && length > 6) {
        return '3x3'
      } else if (length <= 18 && length > 12) {
        return '4x4'
      } else {
        return '6x4'
      }
    },
    // \
    mergeTag(){
      if(this.sortId === 'left'){
        return {left:145+'px'}
      }else{
        return {right:65+'px'}
      }
    }
  },
  mounted() {
    this.enableDrag()
    this.loadNav()
    if (this.sortId === 'left') {
      this.sideList = this.sideNavigationList
    } else {
      this.sideList = this.rightNavigationList
    }
    // this.navigationList = this.replaceType(this.navigationList)
    /**
     * 监听窗口变化,更新导航栏最大添加个数
     */
    this.useWindowSize((size) => {
      // 获取最大可添加图标个数
      const windowWidth = size.height.value
      this.parentSize = windowWidth
      this.maxItemNum = Math.round((windowWidth) / 72)
      const height = windowWidth / (this.navigationList.length * 72)
      this.navAttribute.navSize = height.toFixed(2) * 100
      this.navAttribute.navSize = this.navAttribute.navSize < 100 ? this.navAttribute.navSize : 100
    }, 200)
  },
  watch: {
    delZone(val) {
      this.delNav = val
    },
    editToggle() {
      if (this.editToggle) {
        this.enableDrag()
        this.shakeElement = true
        setTimeout(() => {
          this.shakeElement = false
        }, 2000)
      } else {
        this.disableDrag()
      }
    },
    navigationList: {
      handler(newVal, oldVal) {
        // 获取最大可添加图标个数
        const windowWidth = window.innerHeight
        this.maxItemNum = Math.round((windowWidth) / 72)
        // console.log(this.maxItemNum, 'this.maxItemNum', windowWidth, 'windowWidth')
        // let flag = true
        if (this.navigationList.length > this.maxItemNum && this.maxItemNum !== null) {
          // console.log(this.maxItemNum, 'maxItemNum')
          if (this.noticeFlag) {
            this.$xtConfirm('最多只能添加' + this.maxItemNum + '个', '若继续添加将缩小导航栏', {
              onOk: () => {
                const width = window.innerHeight / (this.navigationList.length * 72)
                this.navAttribute.navSize = width
              }
            })
          }
          const width = window.innerHeight / (this.navigationList.length * 72)
          this.navAttribute.navSize = width.toFixed(2) * 100
          this.noticeFlag = false
        }
        // this.syncSidePanel()
      },
      immediate: true,
      deep: true,
    },
    sideNavigationList: {
      handler(newV, oldV) {
        console.log('=====>>>>>>>>',newV, oldV)
        this.syncSidePanel()
      },
      deep:true,
    },
    rightNavigationList: {
      handler(newV, oldV) {
        this.syncSidePanel()
      },
      deep:true
    },
    folderList() {
      this.customData = {
        ...this.defaultFolderData,
        list: this.folderList,
        size: this.currentItem.size || this.resize,
        name: this.folderName,
        layout: this.currentItem.layout || 'rows',
      }
    },
    'customData.list': {
      handler(newV, oldV) {
        // console.log('newV', newV, 'oldV', oldV)
        const list = [...newV]
        this.folderItem.children = list
      },
      deep: true,

    },
    'customData.name': {
      handler(newV, oldV) {
        this.folderName = newV
        this.folderItem.name = newV
        // console.log('newV', newV, 'oldV', oldV)
      },
      deep: true
    },

  },
  methods: {
    ...mapActions(navStore, ['removeSideNavigationList', 'removeRightNavigationList', 'setSideNavigationList', 'setRightNavigationList', 'setRightNavigationList', 'loadNav']),
    ...mapActions(useNavigationStore, ['toggleEdit']),
    ...mapActions(appStore, ['toggleFullScreen']),
    updateIcon,
    renderIcon,
    replaceType,
    disableDrag() {
      // if (this.sortable) {
      document.removeEventListener('click', this.disableDrag)
      // this.sortable.destroy()
      this.sortable = null
      // message.info('已中止侧栏调整')
      return
      // }
    },
    editIcon(item) {
      this.quick = true
      this.componentId = 'EditIcon'
      this.editItem = item
      if (item.default) return
      item.default = {
        name: item.name,
        icon: item.icon
      }
    },
    /**
    * 更新底部导航栏，包括刷新和启动拖拽
    */
    syncSidePanel() {
      this.sideKey = Date.now()
      this.$nextTick(() => {
        this.enableDrag()
      })
    },
    /**
     *
     * @param {*} value 导航栏设置中关闭的导航
     */
    hiedNav(value) {
      this.$emit('hiedNavBar', value)
    },
    /**
     * sortable拖拽函数
     */
    enableDrag() {
      console.log('触发一次重置 ')
      if (this.sortable) {
        console.log('先清理 ')
        this.sortable.destroy()
      }
      let that = this
      let drop = document.getElementById(this.sortId)
      if (!drop) {
        console.error('更新侧边导航栏失败，元素不存在')
        return
      }
      let index = null
      // let isTimer = false
      let isDrag = false
      this.sortable = Sortable.create(drop, {
        sort: true,
        animation: 150,
        delay: 50,
        delayOnTouchOnly: true,
        // 设置交换区域的阈值
        swapThreshold: 0.4,
        // 反向拖拽
        invertSwap: true,
        //
        onStart: function (event) {
          that.cancelUpdate = false
          console.log('onStart')
          that.dragItem = that.navigationList[event.oldIndex]
          console.log('启动拖拽的元素', that.dragItem)
          if (that.popVisible) {
            that.notifications.NoticeToast()
          }
          let delIcon = document.getElementById('delIcon2')
          that.delItemIcon = true
          that.$emit('getDelIcon', true)
          that.delNav = true
          if (that.delNav) {
            delIcon.ondragover = function (ev) {
              ev.preventDefault()
            }
          }
          delIcon.ondrop = function (ev) {
            let oneNav = that.navigationList[event.oldIndex]
            //将要删除的是否是主要功能
            if (!that.mainNavigationList.find(f => f.name === oneNav.name)) {
              that.delNavList(event.oldIndex)
              return
            }
            let sumList = []
            // 判断其他导航栏是否是打开状态，是则获取功能列表
            if (that.otherSwitch1 && that.otherSwitch2) {
              sumList = that.otherNavList1.concat(that.otherNavList2)
            } else if (that.otherSwitch1 && !that.otherSwitch2) {
              sumList = that.otherNavList1
            } else if (!that.otherSwitch1 && that.otherSwitch2) {
              sumList = that.otherNavList2
            } else {
              message.info(`导航栏中至少保留一个「${oneNav.name}」`)
              // console.log('不可删除')
              return
            }
            that.delNavigation(sumList, oneNav, event.oldIndex, that.delNavList)
          }
        },
        onUpdate: _.debounce((event) => {
          if (that.cancelUpdate) {
            //如果执行过合并，这里就不需要刷新顺序了。
            return
          }
          console.log('onUpdate')
          //拖拽排序后，更新数据
          console.log('移动event=', event)
          let cur = this.sideList.splice(event.oldIndex, 1)[0]
          if (!cur) {
            console.error('移动失败，无法获取到元素')
            return
          }
          this.sideList.splice(event.newIndex, 0, cur)
          this.updateList(this.sideList)
          return
        }, 100),
        onEnd: function (event) {
          console.log('onEnd')
          // console.log(event.originalEvent.clientX, event, 'to end X Y ');
          that.$emit('getDelIcon', false)
          //
          that.popVisible = false
          // 删除
          that.isDelete = true
          index = null
          that.isBorder = false
          isDrag = false
          // console.log('isDelete', that.footNavigationList);
          // console.log(that.copyFootNav,'copyFootNav');

        },
        onMove: function (event, originalEvent) {
          // console.log(event, originalEvent, 'move');
          console.log('onMove')
          isDrag = true
          that.isDelete = false
          const moveLeft = event.originalEvent.clientY
          const panelLeft = that.defaultPosition.y
          const relativePos = (moveLeft - panelLeft) % 72
          const isGap = relativePos <= 20 && relativePos >= 0
          console.log('isGap=', isGap, relativePos)
          return true
        },
        onChoose: function (event) {
          console.log('onChoose')
          index = event.oldIndex
          that.defaultPosition = {
            x: event.originalEvent.clientX,
            y: event.originalEvent.clientY,
          }
          // console.log(that.defaultPosition)
        },
        onSort: function (event) {
          console.log('onSort', event)
          console.log('item', that.navigationList[event.newIndex])
        },
        // 触发替换中发生的事件
        onChange(event) {
          console.log('onChange', event, that.navigationList[event.newIndex])
          console.log('item')
        },
        /**
         * 合并文件夹操作
         * @param event
         * @returns {number}
         */
        onUnchoose: function (event) {
          if (that.hoverRealItemId() && that.hoverRealItemId() !== that.dragItem?.id) {
            //存在目标，且不等于自身，符合合并条件，则执行合并
            const merged = that.mergeIconFolder(that.sideList, that.dragItem, that.sideList.find(item => {
              return item.id === that.hoverRealItemId()
            }))
            that.sideList.splice(that.sideList.findIndex(item => {
              return item.id === that.hoverRealItemId()
            }), 1, merged)
            that.sideList = that.sideList.filter(item => {
              return item.id !== that.dragItem.id
            })
            that.updateList(that.sideList)
            //执行合并后，因为更改了数组，已经自动触发了重置数组，所以不需要再执行update，数据也是正确的
            that.cancelUpdate = true
          }
          that.hoverIndex = -1
          return
        }
      })
    },
    updateList(list) {
      if (this.sortId === 'left') {
        this.sideNavigationList = _.cloneDeep(list)
      } else {
        this.rightNavigationList = _.cloneDeep(list)
      }
      // this.syncSidePanel()
    },
    /**
    * 取出当前鼠标指针所对应的数组内的元素的真实id，采用视图查找，所以是精准的
    * @returns {string}
    */
    hoverRealItemId() {
      // if (this.isEnterBar) return
      let parent = document.getElementById(this.sortId)
      if (!parent) {
        return ''
      }
      if (this.hoverIndex < 0) {
        return
      }
      let i = 0
      for (const child of parent.children) {
        if (i === this.hoverIndex) {
          if (child) {
            return child.id
          }
        }
        i++
      }
      return ''
    },
    /**
     * 自动根据当前位置获取到要合并的位置
     * @param currentLeft
     * @returns {{gap: boolean, index: number}|number}
     */
    getHoverIndex(currentLeft) {
      const panelLeft = document.getElementById(this.sortId).getBoundingClientRect().top * (this.navAttribute.navSize / 100)
      const relativePos = (currentLeft - panelLeft) % (72 * this.navAttribute.navSize / 100)
      const isGap = !(relativePos <= (42 * this.navAttribute.navSize / 100) && relativePos >= (10 * this.navAttribute.navSize / 100))
      let nIndex = Math.floor((currentLeft - panelLeft + 20) / (72 * this.navAttribute.navSize / 100))
      console.log(panelLeft,relativePos,isGap,nIndex,currentLeft,'getHoverIndex')
      if (nIndex > this.navigationList.length - 1) {
        //超出
        return 0
      }
      if (isGap) {
        return {
          gap: true,
          index: nIndex
        }
      } else {
        return {
          gap: false,
          index: nIndex
        }
      }
    },
    mergeIconFolder,
    /**
    * 重置元素位置
    */
    resetElementPosition() {
      const draggableSize = this.currentItem.size ? this.currentItem.size.split('x') : this.resize.split('x')
      // 视图大小
      let vW = this.parentSize
      // 元素坐标
      let posY = Number((this.defaultPosition.y).toFixed(0))
      let posX = Number((this.defaultPosition.x).toFixed(0))
      // 元素大小
      let menuW = draggableSize[1] * 100
      // let menuW = draggableSize[0] * 140
      // console.log(vW,posY,menuW, 'vW');
      posY = posY > vW - (menuW / 2) ? vW - menuW : (posY - menuW / 2 < 0 ? 0 : posY - menuW / 2);
      this.top = posY
      this.left = posX < 100 ? 100 : posX - menuW - 130
      console.log(this.left, this.top , 'posY')
    },
    /**
     * 获取当前拖拽元素的坐标
     */
    onDrag: function (e) {
      let hoverRs = this.getHoverIndex(e.y)
      if (hoverRs.gap) {
        this.hoverIndex = -1
      } else {
        this.hoverIndex = hoverRs.index
      }
    },
    /**
     * 拖拽添加文件
     */
    createFile(item, e) {
      const bottom = document.getElementById(this.sortId)
      const rect = bottom.getBoundingClientRect()
      const index = Math.round((e.y - rect.y) / (72 * this.navAttribute.navSize / 100))
      console.log(index, item, 'index');
      this.dragItem = null
      if (this.sideList[this.hoverIndex]?.type === 'folder') {
        const merged = this.mergeIconFolder(this.sideList, item, this.sideList.find(i => {
          return i.id === this.hoverRealItemId()
        }))
        this.sideList.splice(this.sideList.findIndex(i => {
          return i.id === this.hoverRealItemId()
        }), 1, merged)
        this.sideList = this.sideList.filter(i => {
          return i.id !== item.id
        })
        this.updateList(this.sideList)
      }
      else {
        this.sideList.splice(index, 0, _.cloneDeep(item))
        this.updateList(this.sideList)
      }
      // 从外部拖拽元素到导航栏，跳过合并提示
      this.hoverIndex = -1

    },
    /**
 * 解散文件夹和切换文件夹
 * @param {*} item
 * @param {*} index
 */
    resetFolder(item, index) {
      if (item.children.length > 0) {
        if (item.children.length + this.sideList.length > this.maxItemNum) {
          this.$xtConfirm('最多只能添加' + this.maxItemNum + '个', '若继续添加将缩小导航栏', {
            onOk: () => {
              return true
            }
          })
        }
        this.sideList.splice(index, 1, ...item.children)
        this.updateList(this.sideList)
        if (this.folderId == item.id) {
          this.closeFolder()
        }

      }
    },
    current(item) {
      if (item.tab) {
        return routerTab.isActive(item.tab, 1)
      }
      if (item.data?.name) {
        return this.$route.params.name === item.data.name
      } else if (item.event) {
        return this.$route.name === item.event
      } else {
        return false
      }
    },
    /**
   * 打开文件夹
   */
    openFolder(item) {
      // 获取当前的文件夹
      this.folderItem = item
      this.folderList = item.children.map((i) => ({
        ...i,
        id: nanoid(6),
        default: i.default ? i.default : { name: i.name, icon: i.icon }
      }))
      this.folderName = item.name
      this.resetElementPosition()
      if (!this.folderVisible) {
        this.folderVisible = true
      } else if (this.folderVisible && this.currentItem.id && this.folderId === this.currentItem.id) {
        this.folderVisible = false
      } else {
        console.log(this.currentItem.id, this.folderId, 'this.currentItem.id, this.folderId')
        this.customData = {
          ...this.defaultFolderData,
          list: this.folderList,
          size: this.currentItem.size || this.resize,
          name: this.folderName,
          layout: this.currentItem.layout || 'rows',
        }
      }
      this.folderId = item.id
    },
    /**
     * 更新大小尺寸
     * @param {*} value
     */
    updateSize(value) {
      this.currentItem.size = value
      this.resetElementPosition()
    },
    /**
     * 更新图标排序方式
     * @param {*} value
     */
    updateLayout(value) {
      this.currentItem.layout = value
    },
    /**
     * 打开应用
     * @param {*} item 图标详细信息
     */
    async newOpenApp(item) {
      this.sideKey = Date.now()
      let { type, value } = item
      if (value === 'control') {
        this.controlVisible = !this.controlVisible;
        this.resetElementPosition()
      }
      if (item) this.msgNotice(item)
      if (value === 'home' && item.home) {
        this.jumpDesk = item.home
      }
      let rs = await startApp(type, value, this.$router)
      if (!rs) {
        message.error({
          content: `打开「${item.name}」失败`
          , key: 'tipRun'
        })
      }
      type !== 'folder' ? this.folderVisible = false : ''

    },
    /**
 * 点击文件夹子图标
 * @param {*} item
 */
    clickFile(item) {
      this.folderVisible = false
      this.msgNotice(item)
    },
    /**
     * 清空当前导航栏
     */
    clearAll() {
      this.sideList = []
      this.updateList(this.sideList)
    },
    closeFolder() {
      this.folderVisible = false
    },
    /**
     * 打开桌面应用提示
     * @param {*} item 当前图标
     */
    msgNotice(item) {
      if (item.type === 'tableApp') {
        message.loading({
          content: `打开「${item.name}」...`
          , key: 'tipRun'
        })
      }
    },
    useWindowSize,
    delCurrentIcon(currentIndex, currentItem) {
      if (!this.mainNavigationList.find(f => f.name === currentItem.name)) {
        this.delNavList(currentIndex)
        return
      }
      let arr = []
      if (this.otherSwitch1 && this.otherSwitch2) {
        arr = this.otherNavList1.concat(this.otherNavList2)
      } else if (this.otherSwitch1 && !this.otherSwitch2) {
        arr = this.otherNavList1
      } else if (!this.otherSwitch1 && this.otherSwitch2) {
        arr = this.otherNavList2
      } else {
        message.info(`导航栏中至少保留一个「${currentItem.name}」`)
        return
      }
      this.delNavigation(arr, currentItem, currentIndex, this.delNavList)
    },
    navVisible() {
      if (this.currentNav === 'left') {
        this.navigationToggle[0] = false
      } else {
        this.navigationToggle[1] = false
      }
    },
    closeDrawer() {
      this.menuVisible = false
    },
    // 添加导航图标
    editNavigation(item) {
      if (item.component) {
        this.componentId = item.component
        // console.log(this.componentId,'===>>1');
        if (item.component === 'EditNavigationIcon') {
          this.editToggle = true
          this.selectNav = this.sortId
          message.success('进入编辑模式')
        }
        this.quick = true
      } else if (item.visible) {
        switch (item.tag) {
          case 'task':
            this.bottomToggle[2] = !this.bottomToggle[2]
            break;
          case 'community':
            this.bottomToggle[1] = !this.bottomToggle[1]
            break;
          case 'user':
            this.bottomToggle[0] = !this.bottomToggle[0]
            break;
          case 'chat':
            this.settings.enableChat = !this.settings.enableChat
            break;
          case 'hide':
            this.navVisible()
            break;
        }
      } else {
        return
      }

      this.menuVisible = false
    },
    showMenu() {
      if (this.rightModel === 'follow') {
        return
      }
      this.routeParams.url && ipc.send('hideTableApp', { app: JSON.parse(JSON.stringify(this.routeParams)) })
      // if(this.rightModel !=='follow'){
      this.menuVisible = true
      // this.editToggle=true
      // }

    },
    setQuick() {
      this.quick = false
      this.editToggle = false
    },
    delNavigation(sumList, oneNav, index, delMethod) {
      if (!this.mainNavigationList.find(item => item.name === oneNav.name)) {
        //如果不是必须的
        delMethod(index)
      } else {
        if (sumList.find(item => item.name === oneNav.name)) {
          //正常移除
          delMethod(index)
        } else {
          //不可移除
          message.info(`导航栏中至少保留一个「${oneNav.name}」`)
        }
      }
    },
    showElement(item, index) {
      this.currentItem = item
      this.currentIndex = index
    },
  }
}
</script>

<style scoped lang="scss">
:deep(.icon) {
  fill: var(--secondary-text);
}



.item:hover {
  background: var(--active-bg) !important;

  // :deep(.icon) {
  //   // fill: var(--primary-text) !important
  // }
}

// .active-back {
//   :deep(.icon) {
//     // fill: var(--active-bg) !important
//   }
// }
.shaking-element {
  // animation: shake 0.5s infinite;
  animation: shake 1s ease-in-out;
}

@keyframes shake {
  0% {
    transform: translateY(0);
  }

  25% {
    transform: rotate3d(0, 0, 1, -15deg);
  }

  50% {
    transform: rotate3d(0, 0, 1, 15deg);
  }

  75% {
    transform: rotate3d(0, 0, 1, -15deg);
  }

  100% {
    transform: translateY(0);
  }
}

.item {
  margin: 8px;
}

.item-nav {
  width: 52px;
  height: 52px;
  // margin: 6px auto;
  // margin-top: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  // border-radius: 12px;
  // background-color: var(--secondary-transp-bg);

}

// .item-nav:last-child{
//   margin-bottom: 12px;
// }

// .item-nav:hover {
//   background: var(--active-bg);
//   .icon-color {
//     :deep(.icon) {
//       fill: rgba(255,255,255,0.9) !important;
//     }
//   }
// }
.icon-color {
  height: 52px;
  width: 52px;
}

.icon-color:hover {
  color: rgba(255, 255, 255, 0.8) !important;
}

//.dark-model .active-back{
//  background: var(--active-secondary-bg) !important;
//}
.active-back {
  // border: 1px solid red;

  // color: var(--primary-text) !important;
  // background: var(--active-bg);

  :deep(.icon) {
    fill: rgba(255, 255, 255, 0.9) !important;
  }

  //:deep(.icon) {
  //  fill: var(white) !important;
  //}
}

.active-color {
  color: rgba(255, 255, 255, 0.8) !important;
}

.btn {
  text-align: center;
  margin-right: 12px;
  border-radius: 12px;
  width: 110px;
  height: 100px;
  padding-top: 16px;
  line-height: 30px;
  margin-bottom: 24px;
  flex-shrink: 0;
}

@media screen and (max-height: 510px) {
  .side-panel {
    zoom: 0.82;
    margin-top: 3.5em;
  }
}

@media screen and (min-height: 511px) and (max-height: 550px) {
  .side-panel {
    zoom: 0.9;
  }
}

@media screen and (min-height: 551px) and (max-height: 610px) {
  .side-panel {
    zoom: 0.9;
  }
}

.hide-scrollbar {
  &::-webkit-scrollbar {
    display: none;
    /* Chrome Safari */
  }
}</style>
