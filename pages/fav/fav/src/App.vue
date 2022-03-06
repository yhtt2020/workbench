<template>
  <a-layout>
    <a-layout-sider theme="light" :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 ,background:'#f1f1f1'}">
      <SideBar />
    </a-layout-sider>
    <a-layout :style="{ marginLeft: '200px',marginRight:'240px',height:'100vh' }">
      <ContentHeader/>
      <a-layout-content style="background: white;padding: 20px">
        <ContentList/>
      </a-layout-content>
    </a-layout>
    <a-layout-sider theme="light" :width="240" style="background: #f1f1f1;height: 100vh;position: fixed;overflow: auto;right: 0">
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
export default {
  name: 'App',
  components: {
    // HelloWorld,
    SideBar,
    ContentHeader,
    ContentInfo,
    ContentList
  }
}
</script>

<style>

</style>
