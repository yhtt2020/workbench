<script lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import {defineComponent, ref} from "vue";
import {EyeOutlined, LayoutOutlined, SearchOutlined, AimOutlined, ControlOutlined,CheckSquareOutlined,HomeOutlined,LockOutlined,
  NodeIndexOutlined,GoldOutlined
} from '@ant-design/icons-vue'

export default defineComponent({
  components: {
    EyeOutlined, LayoutOutlined, SearchOutlined, AimOutlined, ControlOutlined,CheckSquareOutlined,HomeOutlined,
    LockOutlined,NodeIndexOutlined,GoldOutlined
  },
  setup() {

    const activeKey = ref('Privacy')
    return {
      activeKey
    }
  }
})
</script>

<template>
  <div style="background:white">
    <a-tabs
      v-model:activeKey="activeKey"
      type="card"
      tabPosition="left"
      size="small"
      style="height: 100vh; "
    >
      <template #leftExtra>
      </template>
      <a-tab-pane key="Privacy">
        <template #tab>
        <span>
          <eye-outlined/>
          隐私设置
        </span>
        </template>
      </a-tab-pane>
      <a-tab-pane key="Appearance">
        <template #tab>
        <span>
          <layout-outlined/>
          外观
        </span>
        </template>
      </a-tab-pane>
      <a-tab-pane key="Feature">
        <template #tab>
        <span>
          <ControlOutlined/>
          其他功能
        </span>
        </template>
      </a-tab-pane>
      <a-tab-pane key="SearchEngine">
        <template #tab>
        <span>
          <SearchOutlined/>
          搜索引擎
        </span>
        </template>
      </a-tab-pane>
      <a-tab-pane key="Operation">
        <template #tab>
        <span>
          <AimOutlined/>
          操作
        </span>
        </template>

        dd
      </a-tab-pane>
      <a-tab-pane key="Default">
        <template #tab>
        <span>
          <check-square-outlined />
          默认浏览器
        </span>
        </template>
        默认里
      </a-tab-pane>
      <a-tab-pane key="NewTab">
        <template #tab>
        <span>
          <home-outlined />
          起始页
        </span>
        </template>

        dd
      </a-tab-pane>
      <a-tab-pane key="Password">
        <template #tab>
        <span>
         <lock-outlined />
          密码管理
        </span>
        </template>

        dd
      </a-tab-pane>
      <a-tab-pane key="Proxy">
        <template #tab>
        <span>
          <NodeIndexOutlined />
          代理
        </span>
        </template>

        dd
      </a-tab-pane>
      <a-tab-pane key="ShortCuts">
        <template #tab>
        <span>
          <AimOutlined/>
          快捷键
        </span>
        </template>

        dd
      </a-tab-pane>
      <a-tab-pane key="Bangs">
        <template #tab>
        <span>
         <gold-outlined />
          快捷指令
        </span>
        </template>

        dd
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
currentTab
<style>
</style>
