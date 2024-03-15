<template>
  <xt-modal v-model="editVisible" :footer="false" boxClass="" :mask="0" :header="false">
    <div class="flex overflow-hidden rounded-xl" style="height: 75vh;width: 65vw;">
      <xt-button 
        class="absolute right-3 top-3" 
        @click="closeNav" 
        icon="fluent:dismiss-16-regular" 
        w="32" 
        h="32"
        radius="8" 
        iconSize="16">
      </xt-button>
      <StartPage @choose="chooseItem" v-if="isStart"></StartPage>
      <!-- 左侧导航栏 -->
      <xt-left-menu v-else  
        :list="leftMenu" 
        model="id" 
        last="6" 
        end="1" 
        v-mode:index="iconIndex" 
        leftMargin="mr-0 py-3"
        w="64" 
        leftClass="xt-main-bg"
        class="w-full">
        <!-- 右侧功能区 -->
        <div class="flex flex-col w-full h-full p-3 xt-modal">
          <!-- 头部 -->
          <div class="flex items-center justify-between w-full mb-3">
            <!-- 输入框 -->
            <a-input placeholder="搜索" style="width: 244px;height: 32px;border-radius: 10px;background: var(--main-bg);"
              v-model:value="inputValue">
              <template #suffix>
                <xt-new-icon icon="fluent:search-16-regular" size="20" class="xt-text-2" />
              </template>
            </a-input>
            
            <!-- 下拉框 -->
            <div class="flex mr-12" v-if="!isFolder">
              <div class="mt-1 ml-3 text-base xt-text-2">添加到：</div>
              <DropDown 
                :list="dropArr" 
                v-model:defaultTitle="defaultTitle" 
                @change="changeTitle">
              </DropDown>
            </div>
            
          </div>
          <xt-scrollbar class="flex-1 w-full overflow-hidden" :x="false" :y="true" :key="iconIndex">
            <!-- 桌面应用 -->
            <Windows v-if="iconIndex === 'Windows'" v-model:value="inputValue" @addIcon="addIcon"></Windows>
            <!-- 团队应用 -->
            <Team v-if="iconIndex === 'Team'" v-model:value="inputValue" @addIcon="addIcon"></Team>
            <!-- 系统应用 -->
            <System v-if="iconIndex === 'System'" v-model:value="inputValue" @addIcon="addIcon"></System>
            <!-- 网址应用 -->
            <WebSite v-if="iconIndex === 'WebSite'" v-model:value="inputValue" @addIcon="addIcon"></WebSite>
            <!-- 收藏夹 -->
            <Browser v-if="iconIndex === 'Browser'" v-model:value="inputValue" @addIcon="addIcon"></Browser>
            <!-- 酷应用 -->
            <CoolApp v-if="iconIndex === 'CoolApp'" v-model:value="inputValue" @addIcon="addIcon"></CoolApp>
            <!-- 轻应用 -->
            <LightApp v-if="iconIndex === 'LightApp'" v-model:value="inputValue" @addIcon="addIcon"></LightApp>
            <!-- 自定义 -->
            <teleport to='body'>
              <CustomIcon v-if="iconIndex === 'CustomIcon'" @addIcon="addIcon"></CustomIcon>
              <!-- 以文件夹形式添加,预览 -->
              <xt-preview v-if="previewFlag" v-model="previewFlag" @ok="addFolderIcon"></xt-preview>
              <!-- 添加到桌面 -->
              <AddDesk v-if="deskFlag" :list="multipleList" @close="deskFlag=false"></AddDesk>
            </teleport>
          </xt-scrollbar>
        </div>
      </xt-left-menu>
      <!-- 多图标下显示添加图标个数 -->
      <transition
        name="animate__animated animate__bounce animate__delay-0.5s"  
        enter-active-class="animate__fadeInUp" 
        leave-active-class="animate__fadeOutDown">
        <xt-button 
          @click="addMultiple"
          v-if="isMultiple" 
          w="135" 
          h="40" 
          radius="20" 
          type="theme" 
          class="absolute left-1/2 bottom-4">
          共添加{{ multipleList.length }}个图标
        </xt-button>
      </transition>
      
      <!-- 右下角选择控制单选多选组件 -->
      <Labor 
        :menus="menus" 
        :checkFlag="isMultiple" 
        @changeCheck="changeState">
      </Labor>
    </div>
  </xt-modal>
</template>

<script setup lang='ts'>
import { ref, watch, defineAsyncComponent,onBeforeUnmount,onMounted, computed } from 'vue'
import {message} from 'ant-design-vue'
import 'animate.css'
import { storeToRefs } from 'pinia';
import {position} from './hook/defaultData'

import AddDesk from './components/AddDesk.vue'
import DropDown from './components/DropDown.vue'

import { useNavigationStore } from '../navigationBar/navigationStore';
import { navStore } from '../../../store/nav';
import {cardStore} from '../../../store/card'
import {homeStore} from '../../../store/home'
import { useIconStore } from './store';

const iconStore = useIconStore()
const { multipleList, isMultiple } = storeToRefs(iconStore)

const useNavStore = useNavigationStore()
const { selectNav } = storeToRefs(useNavStore)

const useNav = navStore()
const { copyFootNav,sideNavigationList,rightNavigationList} = storeToRefs(useNav)

const useCard = cardStore()
const {desks} = storeToRefs(useCard)

const useHome = homeStore()
const {currentDeskId} = storeToRefs(useHome)


// 组件动态引入
const StartPage = defineAsyncComponent(() => import('./components/Start/StartPage.vue'))
const Windows = defineAsyncComponent(() => import('./components/Windows/Windows.vue'))
const Team = defineAsyncComponent(() => import('./components/Team/Team.vue'))
const System = defineAsyncComponent(() => import('./components/System/System.vue'))
const WebSite = defineAsyncComponent(() => import('./components/WebSite/WebSite.vue'))
const Browser = defineAsyncComponent(() => import('./components/Browser/Browser.vue'))
const CoolApp = defineAsyncComponent(() => import('./components/CoolApp/CoolApp.vue'))
const LightApp = defineAsyncComponent(() => import('./components/LightApp/LightApp.vue'))
const CustomIcon = defineAsyncComponent(() => import('./components/CustomIcon/CustomIcon.vue'))
const Labor = defineAsyncComponent(() => import('./components/Labor.vue'))

// 限制message提示框最大显示数量
message.config({
  maxCount: 1
})

// 常量
const iconIndex = ref('Windows')  // 默认显示的组件
const editVisible = ref(true)  // 是否显示
const inputValue = ref('')  // 输入框的值
const previewFlag = ref(false)  // 是否显示预览
const deskFlag = ref(false)  // 是否显示添加到桌面
const isStart = ref(true)  // 是否显示开始页
const defaultTitle = ref({})  // 下拉框默认值

// 导航栏数据
const navMap = ref({
  'foot': copyFootNav.value,
  'left': sideNavigationList.value,
  'right': rightNavigationList.value
})

// export interface EditType {
//   isFolder: boolean
// }

const props = defineProps({
  isFolder: false
})

// 关闭回调事件
const emit = defineEmits(['setQuick','addIcon'])


// 右下角添加的菜单
const menus = ref([
  {
    label: '添加到桌面',
    newIcon:'fluent:desktop-16-regular',
    callBack: async () => {
      deskFlag.value = true
    }
  },
  {
    label: '添加到分组',
    newIcon: 'fluent:app-folder-16-regular',
    callBack: () => {
      previewFlag.value = true
    },
  },
])

const changeState = () => {
  isMultiple.value = !isMultiple.value
}

// 关闭
const closeNav = () => {
  emit('setQuick')
}

// 左侧导航栏数组类型格式
type LeftMenuType = {
  newIcon: string,  // 新版图标
  callBack: (item: any) => void,  // 回调
  component: string  // 加载的组件
}
// 左侧导航栏
const leftMenu = ref<LeftMenuType[]>([
  {
    newIcon: 'mingcute:windows-line',
    callBack: (item) => { chooseItem(item) },
    component: 'Windows'
  },
  // 功能暂未开发,暂时隐藏
  // {
  //   newIcon: 'fluent:people-community-16-regular',
  //   callBack: (item) => { chooseItem(item) },
  //   component: 'Team'
  // },
  {
    newIcon: 'fluent:settings-16-regular',
    callBack: (item) => { chooseItem(item) },
    component: 'System'
  },
  {
    newIcon: 'fluent:globe-16-regular',
    callBack: (item) => { chooseItem(item) },
    component: 'WebSite'
  },
  {
    newIcon: 'fluent:star-16-regular',
    callBack: (item) => { chooseItem(item) },
    component: 'Browser'
  },
  {
    newIcon: 'fluent:grid-16-regular',
    callBack: (item) => { chooseItem(item) },
    component: 'CoolApp'
  },
  {
    newIcon: 'fluent:window-multiple-16-regular',
    callBack: (item) => { chooseItem(item) },
    component: 'LightApp'
  },
  {
    newIcon: 'fluent:add-16-regular',
    callBack: (item) => { chooseItem(item) },
    component: 'CustomIcon'
  }
])



// 选择左侧导航栏
const chooseItem = (item) => {
  isStart.value = false
  iconIndex.value = item.component
}

// 添加图标
const addIcon = (item: object | undefined) => {
  const tag = selectNav.value;
  if (navMap.value.hasOwnProperty(tag)) {
    let check = checkNav(tag, item);
    if (check) {
      navMap[tag].unshift(item);
      message.success('添加成功');
    }
  } else {
    emit('addIcon', item);
    message.success('添加成功');
  }
}

// 检查导航栏图标是否重复添加
const checkNav = (nav,item) => {
  const index = navMap.value[nav].findIndex((i) => i.value === item.value)
  if(index !== -1) {
    message.error('图标已添加，请勿重复添加')
    return false
  }
  return true
}

const addMultiple = () => {
  previewFlag.value = true
}

const addFolderIcon = () => {
  previewFlag.value = false
  isMultiple.value = false
}


onMounted(() => {
  let tag = selectNav.value === '' ? 'desktop' : selectNav.value
  if(tag === 'desktop'){
    let target = desks.value.find(item => item.id === currentDeskId.value)
    defaultTitle.value = target
  } else {
    const target = position.find(item => item.value === tag)
    defaultTitle.value = target
  }
})

// 下拉框改变标题
const changeTitle = (item) => {
  defaultTitle.value = item
  selectNav.value = item.value
}

const dropArr = computed(() => {
  if(selectNav.value === 'desktop' || selectNav.value === ''){
    return desks.value.map((item,index) => {
      return {
        name:item.name,
        id:item.id,
        nid:item.nanoid,
        mdi:item.marketId,
        value:"desktop"
      }
    })
  } else{
    return position
  }
})

watch(
  () => iconIndex.value,
  () => {
    multipleList.value = []
  }
)

// 防止退出后，还是多选状态
onBeforeUnmount(() => {
  isMultiple.value = false
})
</script>
<style lang='scss' scoped></style>