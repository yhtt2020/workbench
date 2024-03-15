<template>
  <xt-modal v-model="editVisible" :footer="false" boxClass="" :mask="0" :header="false">
    <div class="flex overflow-hidden rounded-xl" style="height: 75vh;width: 65vw;">
      <!-- 左侧导航栏 -->
      <xt-left-menu :list="leftMenu" model="id" last="6" end="1" :index="iconIndex" w="64" leftClass="xt-main-bg"
        class="w-full">
        <!-- 右侧功能区 -->
        <div class="flex flex-col w-full h-full p-3 xt-modal">
          <!-- 头部 -->
          <div class="flex items-center w-full mb-3">
            <!-- 输入框 -->
            <a-input placeholder="搜索" style="width: 244px;height: 32px;border-radius: 10px;background: var(--main-bg);"
              v-model:value="inputValue">
              <template #suffix>
                <xt-new-icon icon="fluent:search-16-regular" size="20" class="xt-text-2" />
              </template>
            </a-input>
            <xt-button 
              class="absolute right-3 top-3" 
              @click="closeNav" 
              icon="fluent:dismiss-16-regular" 
              w="32" 
              h="32"
              radius="8" 
              iconSize="16">
            </xt-button>
          </div>
          <xt-scrollbar class="flex-1 w-full overflow-hidden" :x="false" :y="true" :key="iconIndex">
            <!-- <StartPage @choose="chooseItem"></StartPage> -->
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
              <xt-preview v-if="previewFlag" v-model="previewFlag" @ok="addFolderIcon"></xt-preview>
            </teleport>
          </xt-scrollbar>
        </div>
      </xt-left-menu>
      <!-- 多图标下显示添加图标个数 -->
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
import { ref, watch, defineAsyncComponent } from 'vue'
import { useNavigationStore } from '../navigationBar/navigationStore';
import { navStore } from '../../../store/nav';

import { useIconStore } from './store';
import { storeToRefs } from 'pinia';
const iconStore = useIconStore()
const { multipleList, isMultiple } = storeToRefs(iconStore)

const useNavStore = useNavigationStore()
const { selectNav } = storeToRefs(useNavStore)

const useNav = navStore()
const { copyFootNav,sideNavigationList,rightNavigationList} = storeToRefs(useNav)


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
const Labor = defineAsyncComponent(() => import('../../../apps/favorites/components/Labor.vue'))

// 常量
const iconIndex = ref('Windows')  // 默认显示的组件
const editVisible = ref(true)  // 是否显示
const inputValue = ref('')  // 输入框的值
const previewFlag = ref(false)  // 是否显示预览

// 右下角添加的菜单
const menus = ref([
  {
    label: '添加到桌面',
    newIcon:'fluent:desktop-16-regular',
    callBack: async () => {
    }
  },
  {
    label: '添加到分组',
    newIcon: 'fluent:app-folder-16-regular',
    callBack: () => {
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

// 关闭回调事件
const emit = defineEmits(['setQuick','addIcon'])

// 选择左侧导航栏
const chooseItem = (item) => {
  iconIndex.value = item.component
}

// 添加图标
const addIcon = (item:object | undefined) => {
  console.log(item,'>>>>>>>>')
  const tag = selectNav.value
  switch (tag) {
    case 'foot':
      copyFootNav.value.unshift(item)
      break;
    case 'left':
      sideNavigationList.value.unshift(item)
      break;
    case 'right':
      rightNavigationList.value.unshift(item)
      break;
    default:
      emit('addIcon', item)
      break;
  }
}

const addMultiple = () => {
  previewFlag.value = true
  isMultiple.value = false
}


watch(
  () => iconIndex.value,
  () => {
    multipleList.value = []
  }
)
</script>
<style lang='scss' scoped></style>