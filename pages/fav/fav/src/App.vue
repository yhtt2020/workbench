<template>
  <template v-if="!isApp && userInfo.uid===0">
    <a-result status="403" title="403" sub-title="此站点需要登录后使用，请点击登录后再访问。">
      <template #extra>
        <a-button type="primary" @click="goLogin()" >
          点击登录
        </a-button>
        <!--//todo 此处要后续继续完善纯web端的同步登陆机制-->
      </template>
    </a-result>
  </template>
  <a-layout v-else>
    <a-layout-sider class="wrapper-scroller" theme="light" :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 ,background:'#f1f1f1'}">
      <SideBar />
    </a-layout-sider>
    <a-layout  class="wrapper-scroller" :style="{background:'white', marginLeft: '200px',marginRight:'240px',height:'100vh', position: 'fixed',width:'calc(100vw - 440px)',overflowY:'auto' }">
      <ContentHeader/>
      <a-layout-content style="background: white;padding: 20px">
        <ContentList/>
      </a-layout-content>
    </a-layout>
    <a-layout-sider  class="wrapper-scroller" theme="light" :width="240" style="background: #f1f1f1;height: 100vh;position: fixed;overflow: auto;right: 0">
      <ContentInfo/>
    </a-layout-sider>
  </a-layout>
<!--  <img alt="Vue logo" src="./assets/logo.png">-->
<!--  <SideBar />-->
<!--  <HelloWorld msg="Welcome to Your Vue.js App"/>-->

</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import SideBar from './components/SideBar.vue'
import ContentHeader from './components/ContentHeader.vue'
import ContentInfo from './components/ContentInfo.vue'
import ContentList from './components/ContentList.vue'
import { mapState } from 'vuex'
import contentListModel from '@/models/contentListModel'
import tools from '@/utils/tools'
tools.getWindowArgs(window)
const defaultStorePath = window.globalArgs['user-data-dir'] + '/tmpStore/'

export default {
  name: 'App',
  components: {
    // HelloWorld,
    SideBar,
    ContentHeader,
    ContentInfo,
    ContentList
  },
  data(){
    return{
      isApp:window.isApp
    }
  },
  computed:{
    ...mapState(
      {
        userInfo:state=>state.user.userInfo,
        storePath:state=>state.config.storePath
      }
      )
  },
  mounted () {
    //初始化，设置默认的StorePath，这里还需要//todo 读入用户设置的本地路径
    this.$store.commit('config/setStorePath',defaultStorePath)
    if(window.isApp){
      this.$store.commit('config/setIsApp',this.isApp) //设置当前为应用模式，全局统一维护这个配置
      this.$store.dispatch('ui/changeTab',{
        name:'all',
        alias:'全部'
      })

    }
  },
  methods:{
    goLogin(){
      location.href=this.$store.state.config.server.loginUrl
    }
  }
}
</script>

<style>

</style>
