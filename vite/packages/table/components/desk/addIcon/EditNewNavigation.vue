<template>
  <xt-modal v-model="editVisible" :footer="false" boxClass="" :mask="0" :header="false">
    <div class="flex overflow-hidden rounded-xl" style="height: 75vh;width: 65vw;">
      <!-- 左侧导航栏 -->
      <div class="xt-main-bg" style="width: 64px;">
        <xt-left-menu :list="leftMenu" model="id" last="7" end="1" :index="iconIndex" />
      </div>
      <!-- 右侧功能区 -->
      <div class="flex flex-col h-full p-3 xt-modal" style="width: calc( 100% - 80px)">
        <!-- 头部 -->
        <div class="flex items-center w-full mb-3">
          <!-- 输入框 -->
          <a-input placeholder="搜索"
            style="width: 244px;height: 32px;border-radius: 10px;margin-left: 12px;background: var(--main-bg);"
            v-model:value="inputValue">
            <template #suffix>
              <xt-new-icon icon="fluent:search-16-regular" size="20" class="xt-text-2" />
            </template>
          </a-input>
          <xt-button class="absolute right-3 top-3" @click="closeNav" icon="fluent:dismiss-16-regular" w="32" h="32"
            radius="8" iconSize="16"></xt-button>
        </div>
        <xt-scrollbar class="flex-1 w-full overflow-hidden" :x="false" :y="true">
          <!-- 起始页，进入后选择需要添加的图标页 -->
          <!-- <StartPage @choose="chooseItem"></StartPage> -->
          <SelectIcon />
          <KeepAlive>
            <Component :is="iconIndex" />
          </KeepAlive>
        </xt-scrollbar>
      </div>
    </div>
  </xt-modal>
</template>

<script setup lang='ts'>
import { ref, reactive, defineAsyncComponent } from 'vue'
import SelectIcon from './components/SelectIcon.vue'

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

// 常量
const iconIndex = ref('Windows')  // 默认显示的组件
const editVisible = ref(true)  // 是否显示

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
  {
    newIcon: 'fluent:people-community-16-regular',
    callBack: (item) => { chooseItem(item) },
    component: 'Team'
  },
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

const emit = defineEmits(['setQuick'])

// 选择左侧导航栏
const chooseItem = (item) => {
  iconIndex.value = item.component
}

</script>
<style lang='scss' scoped></style>