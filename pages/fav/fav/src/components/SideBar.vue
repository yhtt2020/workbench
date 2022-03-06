<template>
  <div class="side-bar">
    <a-menu class="nav"
      id="dddddd"
      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      style="width: 180px;background: none"
      mode="inline"
      @click="handleClick"
    >
      <a-menu-item key="sub1" @titleClick="titleClick">
        <template #icon>
          <AppstoreOutlined/>
        </template>
        <span>全部</span>
      </a-menu-item>
      <a-menu-item key="sub2" @titleClick="titleClick">
        <template #icon>
          <InboxOutlined/>
        </template>
        <span>收集箱</span>
      </a-menu-item>
      <a-menu-item key="sub4">
        <template #icon>
          <ClockCircleOutlined/>
        </template>
        <span>最近</span>
      </a-menu-item>
    </a-menu>
    <h3>重要类型</h3>
    <div>
      <a-row type="flex">
        <a-col v-for="content in contentTypes" :key="content" :span="12">
          <a-button>{{ content.name }}</a-button>
        </a-col>
      </a-row>
    </div>
    <h3>文件夹</h3>
    <TreeList></TreeList>
    <h3>团队文件夹</h3>
    <TreeList></TreeList>
  </div>

</template>

<script>
import {AppstoreOutlined, InboxOutlined, ClockCircleOutlined} from '@ant-design/icons-vue';
import TreeList from './TreeList.vue'

export default {
  name: 'SideBar',
  props: {
    msg: String
  },
  data() {
    return {
      contentTypes: [
        {
          name: '书签',
        },
        {
          name: '图片'
        },
        {
          name: '文字'
        },
        {
          name: '密码'
        },
        {
          name: '视频'
        },
        {
          name: '文件'
        }, {
          name: '下载'
        }
      ]
    }
  },
  components: {
    AppstoreOutlined,
    InboxOutlined,
    ClockCircleOutlined,
    TreeList
  }
}
</script>
