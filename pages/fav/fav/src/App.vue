<template>
  <a-layout>
    <a-layout-sider theme="light" :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 ,background:'#f1f1f1'}">
      <SideBar />
    </a-layout-sider>
    <a-layout :style="{ marginLeft: '200px',marginRight:'240px' }">
      <ContentHeader/>
      <a-layout-content style="background: white">
        <div>
          <h3>文件夹(3)</h3>
          <div style="background: #dbdbff;min-height:200px">

          </div>
        </div>
        <div>
          <h3>内容(23)</h3>
          <div>

          </div>
        </div>
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
export default {
  name: 'App',
  components: {
    // HelloWorld,
    SideBar,
    ContentHeader,
    ContentInfo
  }
}
</script>

<style>

</style>
