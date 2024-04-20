<template>
  <xtMixMenu :menus="mainOption" name="name" :menuHeight="'max-h-full flex'">
    <!-- 文件夹弹窗 -->
    <FloatFolder 
      v-if="folderVisible"
      :folderPos="cardPos"
      :customData="customData"
      :sideKey="sideKey"
      @close="folderVisible = false"
      @clickFile="clickFile"
      @update:layout="updateLayout"
      @update:customSize="updateSize"
    />
    <!-- 卡片弹窗 -->
    <FloatCard 
      ref="floatCard"
      :position="cardPos"
      v-if="floatCardVisible" 
      :cardData="floatCard.cardData" 
      :currentComponent="floatCard.value"
      @close="floatCardVisible = false"
      :navId="sortId"
      @delete="deleteIcon(this.currentItem,this.sortId)">
    </FloatCard>
    <Drop 
      @createFile="createFile" 
      :currentId="sortId" 
      :dropClass="'w-full max-h-full'">
      <transition>
        <div v-if="hoverIndex > -1 && hoverRealItemId(this.sortId, this.hoverIndex) !== dragItem?.id" :style="mergeTag"
          style="position: absolute;z-index:99999999999;top:50%;transform: translateY(-50%) translateX(-100%);writing-mode: vertical-rl;"
          class="px-3 py-10 rounded-lg s-bg xt-text">松开鼠标合并</div>
      </transition>
      <div 
        @click.stop 
        :id="currentId" 
        style="min-height: 80px;z-index: 99;border: 1px solid var(--divider) !important;"
        class="flex flex-row justify-center box common-panel s-bg w-[80px]  xt-bg pt-0 pb-0 relative max-h-full side-bar"
        ref="sideContent" 
        :style="[
          { 
            zoom: `${(this.navAttribute.navSize / 100)}`,
             borderRadius: this.navAttribute.navRadius + 'px'
          },
          this.state ? this.fixedPosition : '']"
        >
        <div 
          style="width: 52px;margin-top: 20px;margin-bottom: 20px;" 
          class="w-full">
          <div :id="sortId" :key="sideKey"
            class="flex flex-col items-center flex-1 max-h-full scroller-wrapper hide-scrollbar xt-container w-[56px] overflow-hidden gap-5" 
            style="align-items: flex-start;">
            <a-tooltip 
              v-for="(item, index) in navigationList" 
              :key="item.id" 
              :title="item.name"
              @mouseenter="showElement(item, index)"
              :overlayStyle="{ zoom: `${(this.navAttribute.navSize / 100)}` }" 
              :placement="sortId === 'left' ? 'right' : 'left'">
              <!-- 左右导航栏隐藏入口 -->
              <xt-menu 
                :menus="folderOptions" 
                :id="item.id" 
                class="relative flex-shrink-0 item-content" >
                <div 
                  v-if="!(isSingle && this.navList.includes(item.event))" 
                  class="item-content item-nav"
                  @click="newOpenApp(item)" 
                  @dragover="onDrag" 
                  @dragend="hoverIndex = -1" 
                  :class="{
                    'active-back': current(item),
                    hover: 
                    (dragItem && item.id === hoverRealItemId(this.sortId, this.hoverIndex) && 
                    dragItem?.id !== hoverRealItemId(this.sortId, this.hoverIndex))
                  }" 
                  :style="{ borderRadius: this.iconRadius + 'px' }">
                  <Drag 
                    :data="item" 
                    :currentId="sortId" 
                    @deleteFile="deleteFile">
                    <NavIcon 
                      :size="54" 
                      :item="item" 
                      :community="community">
                    </NavIcon>
                  </Drag>
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
  </xtMixMenu>
  <Common ref="common"></Common>
  <transition name="fade">
    <div v-if="quick">
      <component :is="componentId" @setQuick="setQuick"></component>
    </div>
  </transition>
</template>

<script>
import Sortable from 'sortablejs';
import { message } from 'ant-design-vue';
import { Icon as navIcon } from '@iconify/vue';
import _ from 'lodash-es'
import { nanoid } from 'nanoid'

import { useDeskStore } from '../components/desk/store'
import { mapActions, mapState, mapWritableState } from "pinia";
import { useNavigationStore } from './desk/navigationBar/navigationStore'
import { navStore } from "../store/nav";
import { appStore } from '../store'
import { cardStore } from '../store/card';
import { singleStore } from '../js/common/single';
import { usePermissionStore } from '../permission/store';
import { useWidgetStore } from '../components/card/store'
import { useNavBarStore } from './desk/navigationBar/navBar'

import routerTab from '../js/common/routerTab'
import EditNewNavigation from './desk/addIcon/EditNewNavigation.vue'
import Common from './desk/navigationBar/components/Common.vue'
import xtMenu from '../ui/components/Menu/index.vue'
import xtMixMenu from '../ui/new/mixMenu/FunMenu.vue'
import EditIcon from './desk/navigationBar/components/EditIcon/EditIcon.vue'
import Folder from '../apps/folder'
import Drop from './desk/navigationBar/components/folder/Drop.vue'
import Drag from './desk/navigationBar/components/folder/Drag.vue'
import AutoHide from './desk/navigationBar/components/folder/AutoHide.vue';
import NavIcon from './windowPanel/components/NavIcon.vue';
import FloatCard from './windowPanel/components/FloatCard.vue';
import FloatFolder from './windowPanel/components/FloatFolder.vue';

import { renderIcon } from '../js/common/common'
import { moreMenus, extraRightMenu, mergeIconFolder } from '../components/desk/navigationBar/index'
import { Notifications } from '../js/common/sessionNotice'
import { startApp } from '../ui/hooks/useStartApp'
import { defaultFolderData } from '../apps/folder/src/components/options'
import { useWindowSize } from '../ui/new/drag/src/hooks/useWindowSize'
import { replaceType } from '../components/desk/navigationBar/hook/replaceType'
import { hoverRealItemId } from '../components/desk/navigationBar/hook/hoverRealItemId'
import { deleteIcon, checkItems } from '../components/card/hooks/addCardToNav'

export default {
  name: 'SidePanel',
  components: {
    navIcon,
    EditNewNavigation,
    Common,
    xtMenu,
    xtMixMenu,
    EditIcon,
    Drop,
    Folder,
    Drag,
    AutoHide,
    NavIcon,
    FloatCard,
    FloatFolder
  },
  emits: ['getDelIcon', 'hiedNavBar', 'openFolder'],
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
          callBack: () => { this.deleteIcon(this.currentItem,this.sortId) }
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
          callBack: () => {
            this.$bus.emit("openSystemSet");
            setTimeout(() => {
              this.$bus.emit("selectSystemNav", 3);
            }, 10);
          }
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
          fn: () => {
            this.$bus.emit("openSystemSet");
            setTimeout(() => {
              this.$bus.emit("selectSystemNav", 3);
            }, 10);
          },
        },
        {
          id: 3,
          name: '关闭当前导航',
          newIcon: 'fluent:eye-off-16-regular',
          fn: () => { this.$emit('hiedNavBar', this.sortId) },
        },
        {
          id: 4,
          name: '清空当前导航栏',
          newIcon: 'fluent:circle-off-16-regular',
          fn: () => { this.clearAll(); },
        },
        {
          id: 9,
          name: '更多',
          newIcon: 'fluent:more-horizontal-16-filled',
          children: []

        },
        {
          divider: true,
          id: 10
        },
        {
          id: 11,
          type: 'systemApp',
          newIcon: 'fluent:lock-closed-16-regular',
          name: '锁定屏幕',
          event: 'lock',
          fn: () => { this.newOpenApp(this.builtInFeatures[0]) }
        },
        {
          id: 15,
          type: 'systemApp',
          newIcon: 'fluent:settings-16-regular',
          name: '基础设置',
          event: 'setting',
          fn: () => { this.newOpenApp(this.builtInFeatures[1]) }
        },
        {
          id: 20,
          type: 'systemApp',
          newIcon: 'fluent:full-screen-maximize-16-filled',
          name: '全屏显示',
          event: 'fullscreen',
          fn: () => { this.newOpenApp(this.builtInFeatures[2]) }
        },
        {
          id: 25,
          type: 'systemApp',
          newIcon: 'fluent:slide-settings-24-regular',
          name: '设备设置',
          event: 'status',
          fn: () => { this.newOpenApp(this.builtInFeatures[3]) }
        }
      ],
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
      limitFlag: false,
      left: 0,
      top: 0,
      parentSize: 0,
      sideList: [],
      maxItemNum: 0,
      floatCard:{},
      floatCardVisible: false,
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
    },
    // 自动隐藏状态
    state: {
      type: Boolean,
      default: () => false
    },
    // 开启自动隐藏后定位
    fixedPosition: {
      type:String,
      default: () => ''
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
      'navigationToggle',
      'copyFootNav', 'copySideNav', 'copyRightNav'
    ]),
    ...mapWritableState(cardStore, ['routeParams']),
    ...mapWritableState(singleStore, ['navList']),
    ...mapWritableState(usePermissionStore, ['isSingle']),
    ...mapWritableState(useWidgetStore, ['rightModel']),
    ...mapWritableState(useNavigationStore, [
       'taskBoxVisible',
      'selectNav', 'bottomToggle',
      'popVisible', 'currentList',
      'editItem', 'navAttribute', 'iconRadius', 'jumpDesk', 'autoHideNav', 'isLeaveBar'
    ]),
    ...mapWritableState(appStore, ['settings']),
    ...mapWritableState(useDeskStore, ['isEnterBar']),
    ...mapWritableState(useNavBarStore, ['isEnterDesk']),
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
      ]

    },
    // 社区中心参数
    community() {
      if (this.sortId === 'left') {
        return {
          x: this.navAttribute.navSize / 100 * 100,
          y: this.top,
          visible: this.comVisible
        }
      }
      return {
        x: window.innerWidth - this.navAttribute.navSize / 100 * 100,
        y: this.top,
        visible: this.comVisible
      }
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
    // 合并提示位置
    mergeTag() {
      if (this.sortId === 'left') {
        return { left: 145 + 'px' }
      } else {
        return { right: 65 + 'px' }
      }
    },
    folderPos() {
      if (this.sortId === 'left') {
        return { left: `${this.navAttribute.navSize}px`, top: `${this.top}px` }
      }
      return { right: `${this.navAttribute.navSize}px`, top: `${this.top}px` }
    },
    // 卡片定位
    cardPos() {
      return {
        x: this.sortId === 'left' ? this.navAttribute.navSize : this.left,
        y: this.top
      }
    },
    mainOption() {
      const custom = {
        id: 5,
        name: this.state ? '关闭自动隐藏' : '开启自动隐藏',
        newIcon: 'fluent:eye-off-16-regular',
        fn: () => { this.autoHideNav[this.sortId].state = !this.autoHideNav[this.sortId].state }
      }
      let arr = [...this.rightMenus, custom]
      return arr.sort((a, b) => a.id - b.id)
    },
  },
  mounted() {
    this.enableDrag()
    this.loadNav()
    if (this.sortId === 'left') {
      this.sideList = this.sideNavigationList
    } else {
      this.sideList = this.rightNavigationList
    }
    /**
     * 监听窗口变化,更新导航栏最大添加个数
     */
    this.useWindowSize((size) => {
      // 获取最大可添加图标个数
      const windowWidth = size.height.value * 0.8
      this.parentSize = windowWidth
      this.maxItemNum = Math.floor((windowWidth) / 72)
      // console.log(windowWidth,this.maxItemNum,'<<<<<+++=======')
      const height = windowWidth / (this.navigationList.length * 72)
      this.navAttribute.navSize = height.toFixed(2) * 100
      this.navAttribute.navSize = this.navAttribute.navSize < 100 ? this.navAttribute.navSize : 100
    }, 200)
  },
  watch: {
    delZone(val) {
      this.delNav = val
    },
    navigationList: {
      handler(newVal, oldVal) {
        // 获取最大可添加图标个数
        const windowWidth = this.parentSize
        this.maxItemNum = Math.floor((windowWidth) / 72)
        if (this.navigationList.length > this.maxItemNum && this.maxItemNum !== 0) {
          if (this.noticeFlag && this.limitFlag) {
            window.$ui.confirm('最多只能添加' + this.maxItemNum + '个', '若继续添加将缩小导航栏', {
              ok: () => {
                const width = this.parentSize / (this.navigationList.length * 72)
                this.navAttribute.navSize = width.toFixed(2) * 100
                this.noticeFlag = false
              },
              noText: false,
            })
          }
          if (this.noticeFlag) return
          const width = this.parentSize / (this.navigationList.length * 72)
          this.navAttribute.navSize = width.toFixed(2) * 100
        }
      },
      immediate: true,
      deep: true,
    },
    'navigationList.length': {
      handler(newV, oldV) {
        if (oldV !== undefined && newV !== oldV) {
          this.limitFlag = true
        }
      }
    },
    sideNavigationList: {
      handler(newV, oldV) {
        this.syncSidePanel()
      },
      deep: true,
    },
    rightNavigationList: {
      handler(newV, oldV) {
        this.syncSidePanel()
      },
      deep: true
    },
    folderList() {
      this.customData = {
        ...this.defaultFolderData,
        list: this.folderList,
        customSize: this.currentItem.size || this.resize,
        name: this.folderName,
        layout: this.currentItem.layout || 'rows',
      }
    },
    'customData.list': {
      handler(newV, oldV) {
        const list = [...newV]
        this.folderItem.children = list
      },
      deep: true,

    },
    'customData.name': {
      handler(newV, oldV) {
        this.folderName = newV
        this.folderItem.name = newV
      },
      deep: true
    },

  },
  methods: {
    ...mapActions(navStore,
      ['removeSideNavigationList',
        'removeRightNavigationList',
        'setSideNavigationList',
        'setRightNavigationList',
        'setRightNavigationList',
        'loadNav'
      ]),
    ...mapActions(useNavigationStore, ['toggleEdit']),
    ...mapActions(appStore, ['toggleFullScreen']),
    renderIcon,
    replaceType,
    hoverRealItemId,
    editIcon(item) {
      this.quick = true
      this.componentId = 'EditIcon'
      this.editItem = item
      if (item.default?.name) return
      item.default = {
        name: item.name,
        icon: item.icon,
        bg: item.bg,
        color: item.color,
      }
    },
    deleteFile(data) {
      const index = this.sideList.findIndex((item) => item.id === data.id)
      this.sideList.splice(index, 1)
      this.syncSidePanel()
      this.updateList(this.sideList)
      this.$emit('getDelIcon', false)
    },
    /**
    * 更新侧边导航栏，包括刷新和启动拖拽
    */
    syncSidePanel() {
      this.sideKey = Date.now()
      this.$nextTick(() => {
        this.enableDrag()
      })
    },
    /**
     * @param {*} value 导航栏设置中关闭的导航
     */
    hiedNav(value) {
      this.$emit('hiedNavBar', value)
    },
    deleteIcon,
    /**
     * sortable拖拽函数
     */
    enableDrag() {
      // console.log('触发一次重置 ')
      if (this.sortable) {
        this.sortable.destroy()
      }
      let that = this
      let drop = document.getElementById(this.sortId)
      if (!drop) {
        // console.error('更新侧边导航栏失败，元素不存在')
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
          that.dragItem = that.navigationList[event.oldIndex]
          // console.log('启动拖拽的元素', that.dragItem)
          if (that.popVisible) {
            that.notifications.NoticeToast()
          }
          let del = document.querySelectorAll('#delIcon3')
          that.delItemIcon = true
          that.$emit('getDelIcon', true)
          that.delNav = true
          del.forEach((delIcon) => {
            if (that.delNav) {
              delIcon.ondragover = function (ev) {
                ev.preventDefault()
              }
            }
            delIcon.ondrop = function (ev) {
              let oneNav = that.navigationList[event.oldIndex]
              that.isEnterDesk = false
              // 删除图标
              that.deleteIcon(oneNav,that.sortId)
              // 更新删除区域状态
              that.$emit('getDelIcon', false)
              // 更新导航栏
              that.hoverIndex = -1
            }
          })

        },
        onUpdate: _.debounce((event) => {
          if (that.cancelUpdate) {
            //如果执行过合并，这里就不需要刷新顺序了。
            return
          }
          let cur = this.sideList.splice(event.oldIndex, 1)[0]
          if (!cur) {
            // console.error('移动失败，无法获取到元素')
            return
          }
          this.sideList.splice(event.newIndex, 0, cur)
          this.updateList(this.sideList)
          return
        }, 100),
        onEnd: function (event) {
          that.$emit('getDelIcon', false)
          //
          that.popVisible = false
          // 删除
          that.isDelete = true
          index = null
          that.isBorder = false
          isDrag = false
        },
        onMove: function (event, originalEvent) {
          isDrag = true
          that.isDelete = false
          const moveLeft = event.originalEvent.clientY
          const panelLeft = that.defaultPosition.y
          const relativePos = (moveLeft - panelLeft) % 72
          const isGap = relativePos <= 20 && relativePos >= 0
          // console.log('isGap=', isGap, relativePos)
          return true
        },
        onChoose: function (event) {
          // console.log('onChoose')
          index = event.oldIndex
          that.defaultPosition = {
            x: event.originalEvent.clientX,
            y: event.originalEvent.clientY,
          }
        },
        /**
         * 合并文件夹操作
         * @param event
         * @returns {number}
         */
        onUnchoose: function (event) {
          const hoverItem = that.hoverRealItemId(that.sortId, that.hoverIndex)
          if (hoverItem && hoverItem !== that.dragItem?.id) {
            if(that.checkItems(that.sideList,hoverItem,that.dragItem.id)){
              message.error('卡片类图标不能合并为文件夹')
              that.hoverIndex = -1
              return
            }
            //存在目标，且不等于自身，符合合并条件，则执行合并
            const merged = that.mergeIconFolder(that.sideList, that.dragItem, that.sideList.find(item => {
              return item.id === hoverItem
            }))
            that.sideList.splice(that.sideList.findIndex(item => {
              return item.id === hoverItem
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
    checkItems,
    updateList(list) {
      if (this.sortId === 'left') {
        this.sideNavigationList = _.cloneDeep(list)
      } else {
        this.rightNavigationList = _.cloneDeep(list)
      }
      // this.syncSidePanel()
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
      const draggableSize = (this.currentItem?.cardData?.customSize || this.currentItem?.customSize || this.resize || '1x1').split("x");
      // 视图大小
      let vH = this.parentSize
      let vW = window.innerWidth
      // 元素坐标
      let posY = Number((this.defaultPosition.y).toFixed(0))
      let posX = Number((this.defaultPosition.x).toFixed(0))
      // 元素大小
      let menuW = draggableSize[1] * 100
      let menuX = draggableSize[0] * 140
      posY = posY > vH - (menuW / 2) ? vH - menuW : (posY - menuW / 2 < 0 ? 0 : posY - menuW / 2);
      posX = posX > vW - (menuX / 2) ? vW - menuX - 100 : (posX - menuX / 2 < 0 ? 0 : posX - menuX / 2);
      this.top = posY
      this.left = posX
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
      // console.log(index, item, 'index');
      this.dragItem = null
      if (this.sideList[this.hoverIndex]?.type === 'folder') {
        const merged = this.mergeIconFolder(this.sideList, item, this.sideList.find(i => {
          return i.id === this.hoverRealItemId(this.sortId, this.hoverIndex)
        }))
        this.sideList.splice(this.sideList.findIndex(i => {
          return i.id === this.hoverRealItemId(this.sortId, this.hoverIndex)
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
          window.$ui.confirm('最多只能添加' + this.maxItemNum + '个', '若继续添加将缩小导航栏', {
            ok: () => {
              this.sideList.splice(index, 1, ...item.children)
              this.updateList(this.sideList)
            },
            no: () => {
              return this.sideList
            }
          })
        } else {
          this.sideList.splice(index, 1, ...item.children)
          this.updateList(this.sideList)
        }
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
      }))
      this.folderName = item.name
      this.resetElementPosition()
      if (!this.folderVisible) {
        this.folderVisible = true
      } else if (this.folderVisible && this.currentItem.id && this.folderId === this.currentItem.id) {
        this.folderVisible = false
      } else {
        this.customData = {
          ...this.defaultFolderData,
          list: this.folderList,
          size: this.currentItem.size || this.resize,
          name: this.folderName,
          layout: this.currentItem.layout || 'rows',
        }
      }
      this.folderId = item.id
      this.$emit('openFolder', this.folderVisible, this.sortId)
    },

    openCard(item) {
      if(this.floatCard.value !== item.value){
        this.floatCard = item
        this.floatCardVisible = true
        return
      }
      this.floatCardVisible = !this.floatCardVisible
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
    async newOpenApp(item, e) {
      const { type, value } = item;
      if (type !== "folder") {
        this.folderVisible = false;
      }
      if (value !== 'commun') {
        this.comVisible = false
      }
      if(type !== 'card') {
        this.floatCardVisible = false
      }
      // 更新鼠标定位
      this.resetElementPosition();
      if (window.$useEnvLimit("web", value)) return;
      // 桌面图标打开提示
      this.msgNotice(item);
      // 特殊图标处理
      const valueHandlers = {
        control: () => this.$emit("control", e),
        setting: () => {
          // this.$router.push({ name: "home" });
          setTimeout(() => {
            this.$bus.emit("openSystemSet");
          }, 500);
        },
        commun: () => {
          this.comVisible = !this.comVisible;
        },
        default: async () => {
          if (type === "card") {
            this.openCard(item)
          }
          if (type === "folder") {
            this.openFolder(item);
          }
          if (value === "fullscreen" && window.$useEnv()) {
            toggle();
            return;
          }
          if (value === "home" && item.home) {
            this.jumpDesk = item.home;
          }
          let rs = await startApp(type, value, this.$router);
          if (!rs) {
            message.error({
              content: `打开「${item.name}」失败`,
              key: "tipRun",
            });
          }
          this.comVisible = false;
        }
      };

      const handler = valueHandlers[value] || valueHandlers.default;
      await handler();
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
      this.$bus.emit('clearAll', this.sortId)
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
    // 添加导航图标
    editNavigation(item) {
      if (item.component) {
        this.componentId = item.component
        if (item.component === 'EditNewNavigation') {
          this.selectNav = this.sortId
          message.success('进入编辑模式')
        }
        this.quick = true
      }
    },
    setQuick() {
      this.quick = false
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
}

.item {
  margin: 8px;
}

.item-nav {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.icon-color {
  height: 52px;
  width: 52px;
}

.icon-color:hover {
  color: rgba(255, 255, 255, 0.8) !important;
}

.active-back {
  :deep(.icon) {
    fill: rgba(255, 255, 255, 0.9) !important;
  }
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
  }
}
</style>
../js/common/single