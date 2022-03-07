<template>
  <div class="side-bar "  style="overflow-x: hidden">
    <UserInfo/>
    <a-menu class="nav"
      v-model:openKeys="openKeys"
      v-model:selectedKeys="tab"
      style="background: none;"
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

    <a-collapse class="tab-wrapper" v-model:activeKey="collapseContentType" :bordered="false" :ghost="true" >
      <a-collapse-panel key="contentType" header="内容类型">
        <div>
          <a-row class="content-types" type="flex">
            <a-col v-for="content in contentTypes" :key="content" :span="12">
              <div class="type" :class="{'active':content.tab===tab[0]}" type="link" @click="setTab(content.tab,content.name)"><FolderOutlined/> {{ content.name }}</div>
            </a-col>
          </a-row>
        </div>
      </a-collapse-panel>
    </a-collapse>
    <a-collapse class="tab-wrapper" v-model:activeKey="collapseFolder" :bordered="false" :ghost="true" >
      <a-collapse-panel key="folder" header="文件夹">
        <div>
          <TreeList></TreeList>
        </div>
        <template #extra><PlusOutlined  @click="handleClick" /></template>
      </a-collapse-panel>
    </a-collapse>
    <a-collapse class="tab-wrapper"  v-model:activeKey="collapseGroupFolder" :bordered="false" :ghost="true">
      <a-collapse-panel key="groupFolder" header="团队文件夹">
        <div v-for="group in groups" v-bind:key="group">
          <div style="margin-top: 10px"><a-avatar shape="square" :size="18" :src="group.icon"></a-avatar> {{group.name}}</div>
          <TreeList></TreeList>
        </div>
        <template #extra><PlusOutlined  @click="handleClick" /></template>
      </a-collapse-panel>
    </a-collapse>
  </div>

</template>

<script>
import {AppstoreOutlined, InboxOutlined, ClockCircleOutlined,FolderOutlined,PlusOutlined} from '@ant-design/icons-vue';
import TreeList from './TreeList.vue'
import {mapState} from 'vuex'
import UserInfo from '@/components/UserInfo'

export default {
  name: 'SideBar',
  props: {
    msg: String
  },
  data() {
    return {
      collapseContentType:['contentType'],
      collapseFolder:['folder'],
      collapseGroupFolder:['groupFolder'],
      contentTypes: [
        {
          name: '书签',
          tab:'bookmark'
        },
        {
          name: '应用',
          tab:'app'
        },
        {
          name: '密码',
          tab:'pwd'
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
    },
    ...mapState([
      'groups'
    ])
  },
  methods:{
    handleNavClick(e){
      const tabs= {
        'all': '全部',
        'collection':'收集箱',
        'latest':'最近'
      }
      this.setTab(e.key,tabs[e.key])
    },
    titleClick(e){
      this.setTab(e.key)
    },
    setTab(tabName,alias){
      this.$store.commit('setTab',{
        name:tabName,
        alias:alias
      })
    }
  },
  components: {
    UserInfo,
    AppstoreOutlined,
    InboxOutlined,
    ClockCircleOutlined,
    FolderOutlined,
    PlusOutlined,
    TreeList,

  }
}
</script>
