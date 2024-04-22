<template>
  <div
    style="display: flex;flex-direction: column;height: 100vh;flex-wrap: nowrap;align-content: stretch;align-items: stretch;gap:10px">
    <div v-if="!fullScreen" style="height: auto;flex: 0" ref="topPanel">
      <!--顶部状态栏      -->
      <TopPanel isHidden="true" v-if="currentNavPosition !== 'top'"></TopPanel>
      <BottomPanel
        enter="animate__fadeInDown"
        leave="animate__fadeOutUp"
        winPosition="position:fixed;top:0;width:100%;z-index: 10;"
        v-if="currentNavPosition === 'top' && loaded"
        :delZone="delZone"
        @getDelIcon="getDelIcon"
        @hiedNavBar="hiedNavBar"
        :mainClass="'top-20 right-6'">
      </BottomPanel>
      <!-- 当顶部window版导航栏开启自动隐藏后，用于占位，通过vueuse中的方法，来检测鼠标是否移入，防止导航栏闪烁 -->
      <div
        v-if="autoHideNav.foot.state && currentNavPosition === 'top'"
        class="w-full h-[70px]">
      </div>
    </div>
    <div :style="{ margin: fullScreen ? 0 : '-3px', padding: fullScreen ? 0 : '8px' }"
      style="display: flex;flex-grow: 1;flex-shrink: 1;flex-basis: fit-content;overflow: hidden;height: 100%;">
      <AutoHide
        :enter="'animate__fadeInLeft'"
        :leave="'animate__fadeOutLeft'"
        :autoHideNav="autoHideNav.left.state"
        v-model:isLeaveBar="isEnterLeft">
        <div
          style="z-index: 9;"
          v-show="sideVisible"
          class="flex items-center justify-center max-h-full">
          <!--左侧栏区域        -->
          <SidePanel
            sortId="left"
            :state="autoHideNav.left.state"
            fixedPosition="position: fixed;top: 50% - 32px;transform: translateY(-50%);"
            :navigationList="sideNavigationList"
            :delZone="delZone"
            @getDelIcon="getDelIcon"
            @hiedNavBar="hiedNavBar"
            @openFolder="openFolder">
          </SidePanel>
        </div>
      </AutoHide>
      <div :style="{ margin: fullScreen ? 0 : '-8px', padding: fullScreen ? 0 : '8px' }"
        style="flex-shrink: 1;flex-grow: 1;align-items: center;align-content: center;flex-direction: column;position: relative;overflow: hidden;">
        <!--主题区域，自动滚动条        -->
         <router-view></router-view>
        <!-- 删除区域 -->
        <div class="del-icon" id="delIcon2" v-show="delZone && navigationToggle[2] && currentNavPosition === 'bottom'"
          style="z-index:500;bottom: 0;right: 50%;transform: translateX(50%);width: 400px;height: 120px;">
          <xt-new-icon icon="fluent:delete-16-regular" size="32" color="red"></xt-new-icon>
        </div>
        <div class="del-icon" id="delIconTop" v-show="delZone && navigationToggle[2] && currentNavPosition === 'top'"
          style="z-index:500;top: 0;right: 50%;transform: translateX(50%);width: 400px;height: 120px;">
          <xt-new-icon icon="fluent:delete-16-regular" size="32" color="red"></xt-new-icon>
        </div>
        <div class="del-icon" id="delIcon3" v-show="delZone && navigationToggle[0]"
          style="z-index:500;bottom: 50%;left: 0;transform: translateY(50%);width: 120px;height: 400px;">
          <xt-new-icon icon="fluent:delete-16-regular" size="32" color="red"></xt-new-icon>
        </div>
        <div class="del-icon" id="delIcon3" v-show="delZone && navigationToggle[1]"
          style="z-index:500;bottom: 50%;right: 0;transform: translateY(50%);width: 120px;height: 400px;">
          <xt-new-icon icon="fluent:delete-16-regular" size="32" color="red"></xt-new-icon>
        </div>

      </div>
      <Transition name="bounce">
        <div v-if="teamVisible && !fullScreen" class="h-100 "
          style="height: auto;display: flex;flex-direction: column;align-items: center;justify-content: center;z-index:120">
          <TeamPanel></TeamPanel>
        </div>
      </Transition>
      <AutoHide
        :enter="'animate__fadeInRight'"
        :leave="'animate__fadeOutRight'"
        :autoHideNav="autoHideNav.right.state"
        v-model:isLeaveBar="isEnterRight">
        <div
          style="z-index: 9;"
          class="flex items-center justify-center"
          v-show="rightVisible"
          >
          <!--右侧栏区域        -->
          <SidePanel
            sortId="right"
            fixedPosition="position: fixed;top: 50% - 32px;transform: translateY(-50%);right: 5px;"
            :navigationList="rightNavigationList"
            :state="autoHideNav.right.state"
            :delZone="delZone"
            @getDelIcon="getDelIcon"
            @hiedNavBar="hiedNavBar"
            @openFolder="openFolder">
          </SidePanel>
        </div>
      </AutoHide>
    </div>
    <div style="flex: 0;" ref="isBottom">
      <BottomPanel
        winPosition="position:fixed;width: 100%;bottom: 0;z-index: 10;"
        enter="animate__fadeInUp"
        leave="animate__fadeOutDown"
        v-if="!fullScreen && loaded && currentNavPosition === 'bottom'"
        :delZone="delZone"
        @getDelIcon="getDelIcon"
        @hiedNavBar="hiedNavBar"
        :mainClass="'bottom-20 right-6'">
      </BottomPanel>
      <!-- 当底部开启自动隐藏时，通过一个div来占位，防止桌面切换过于靠下，导致自动隐藏和桌面切换发生冲突 -->
      <div
        v-if="autoHideNav.foot.state" class="w-full"
        :class="[currentNavFormat === 'mac' ? 'h-[80px]' : 'h-[60px]' ]">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { appStore } from '../store'
import { teamStore } from '../store/team'
import { isMain } from '../js/common/screenUtils'
import { navStore } from '../store/nav'
import { message } from 'ant-design-vue'
import { useNavigationStore } from '../components/desk/navigationBar/navigationStore'

import { ref, onMounted, watch, computed, onBeforeUnmount, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useMouseInElement } from '@vueuse/core'

// 按需加载组件
const SidePanel = defineAsyncComponent(() => import('../components/SidePanel.vue'))
const TopPanel = defineAsyncComponent(() => import('../components/TopPanel.vue'))
const BottomPanel = defineAsyncComponent(() => import('../components/BottomPanel.vue'))
const TeamPanel = defineAsyncComponent(() => import('../components/team/TeamPanel.vue'))
const AutoHide = defineAsyncComponent(() => import('../components/desk/navigationBar/components/folder/AutoHide.vue'))

// 路由
const router = useRouter()

// pinia数据
const useApp = appStore()
const { routeUpdateTime, fullScreen, settings, init } = storeToRefs(useApp)

const useTeam = teamStore()
const { teamVisible } = storeToRefs(useTeam)

const useNav = navStore()
const {
  sideNavigationList,
  rightNavigationList,
  navigationToggle,
  loaded,
  copyFootNav
} = storeToRefs(useNav)

const useNavigation = useNavigationStore()
const {
  autoHideNav,
  isLeaveBar,
  isEdge,
  currentNavPosition,
  currentNavFormat
} = storeToRefs(useNavigation)

const delZone = ref(false)
const isLeftEdge = ref(false)
const isRightEdge = ref(false)
const isEnterLeft = ref(false)
const isEnterRight = ref(false)
const sideIsOpenFolder = ref(false)
const rightIsOpenFolder = ref(false)
const fixedLeftPosition = ref('position:fixed;transform:translateY(50%);top:50%;left:0px')
const fixedRightPosition = ref('position:fixed;transform:translateY(-50%);top: 50%;right:0px')

// 底部导航栏开启自动隐藏后，当鼠标移入导航栏区域时，显示导航栏
const isBottom = ref(null)
const { isOutside : isOutBottom } = useMouseInElement(isBottom)

const topPanel = ref(null)
const { isOutside : isOutTop } = useMouseInElement(topPanel)

watch(
  () => isOutTop.value,
  (val) => {
    if(currentNavPosition.value === 'top') {
      isLeaveBar.value = val
    }
  }
)

watch(
  () => isOutBottom.value,
  (val) => {
    isLeaveBar.value = val
  }
)

// 左侧栏
const sideVisible = computed(() => {
  if (autoHideNav.value.left.state) {
    if (isLeftEdge.value) {
      return true
    }
    if (isEnterLeft.value  && !sideIsOpenFolder.value) {
      return false
    }
    return true
  } else {
    return navigationToggle.value[0] && !fullScreen.value
  }
})

// 右侧栏
const rightVisible = computed(() => {
  if (autoHideNav.value.right.state) {
    if (isRightEdge.value) {
      return true
    }
    if (isEnterRight.value  && !rightIsOpenFolder.value) {
      return false
    }
    return true
  } else {
    return navigationToggle.value[1] && !fullScreen.value
  }
})

// 监听鼠标，当数据移入到边界时，显示导航栏
const listenMouse = (e) => {
  const { clientX } = e
  if (clientX < 50) {
    isLeftEdge.value = true
  } else if (clientX > window.innerWidth - 50) {
    isRightEdge.value = true
  } else {
    isLeftEdge.value = false
    isRightEdge.value = false
  }
}

// 删除图标时，回调，显示删除区域
const getDelIcon = (value) => {
  delZone.value = value
}

// 隐藏导航栏时，判断是否至少保留一个图标
const hiedNavBar = (value) => {
  const foot = navigationToggle.value[2] ? copyFootNav.value : []
  const left = navigationToggle.value[0] ? sideNavigationList.value : []
  const right = navigationToggle.value[1] ? rightNavigationList.value : []
  //
  const checkAndToggle = (listToCheck, toggleIndex) => {
    if(listToCheck.some((item) => item.value === 'home')) {
      navigationToggle.value[toggleIndex] = false
      return;
    }
    navigationToggle.value[toggleIndex] = true
    message.info('至少保留一个主页图标')
  }

  if (value === 'foot') {
    checkAndToggle([...left, ...right], 2)
  } else if (value === 'left') {
    checkAndToggle([...right, ...foot], 0)
  } else if (value === 'right') {
    checkAndToggle([...left, ...foot], 1)
  }
}

// 当在自动隐藏模式下，打开文件时，取消自动隐藏
const openFolder = (value,id) => {
  id === 'left' ? sideIsOpenFolder.value = value : rightIsOpenFolder.value = value
}

onMounted(() => {
  router.afterEach((to, from) => {
    routeUpdateTime.value = Date.now()
  })
  useNav.loadNav()
  window.addEventListener('mousemove', listenMouse)
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', listenMouse)
})
</script>
<style lang="scss" scoped>
.del-icon {
  border-radius: 16px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px dashed red;
  font-size: 18px;
  // color: var(--primary-text);
  font-weight: 500;
  position: absolute;
  z-index: 9;
  background-color:rgba(244, 58, 58, 0.5) ;
  color:red !important;
}
</style>
