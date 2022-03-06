<template>
  <div class="side-bar">
    <a-menu class="nav"
      v-model:openKeys="openKeys"
      v-model:selectedKeys="tab"
      style="width: 180px;background: none"
      mode="inline"
      @click="handleNavClick"
    >
      <a-menu-item key="all" @titleClick="titleClick">
        <template #icon>
          <AppstoreOutlined/>
        </template>
        <span>全部</span>
      </a-menu-item>
      <a-menu-item key="collection" @titleClick="titleClick">
        <template #icon>
          <InboxOutlined/>
        </template>
        <span>收集箱</span>
      </a-menu-item>
      <a-menu-item key="latest">
        <template #icon>
          <ClockCircleOutlined/>
        </template>
        <span>最近</span>
      </a-menu-item>
    </a-menu>
    <h3>重要类型</h3>
    <div>
      <a-row class="content-types" type="flex">
        <a-col v-for="content in contentTypes" :key="content" :span="12">
          <div class="type" :class="{'active':content.tab===tab[0]}" type="link" @click="setTab(content.tab)"><FolderOutlined/> {{ content.name }}</div>
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
import {AppstoreOutlined, InboxOutlined, ClockCircleOutlined,FolderOutlined} from '@ant-design/icons-vue';
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
          tab:'bookmark'
        },
        {
          name: '图片',
          tab:'pic'
        },
        {
          name: '文字',
          tab:'text'
        },
        {
          name: '密码',
          tab:'pwd'
        },
        {
          name: '视频',
          tab:'video'
        },
        {
          name: '文件',
          tab:'file'
        }, {
          name: '下载',
          tab:'download'
        }
      ]
    }
  },
  computed:{
    tab(){
      return [this.$store.state.currentTab.name]
      //return this.$store.state.currentTab.name
    }
  },
  methods:{
    handleNavClick(e){
      console.log(e)
      this.setTab(e.key)
    },
    titleClick(e){
      console.log(e)
      this.setTab(e.key)
    },
    setTab(tabName){
      this.$store.commit('setTab',{
        name:tabName
      })
    }
  },
  components: {
    AppstoreOutlined,
    InboxOutlined,
    ClockCircleOutlined,
    FolderOutlined,
    TreeList,

  }
}
</script>
