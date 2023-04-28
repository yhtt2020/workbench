<template>
  <div class="search flex justify-start align-center">
    <a-dropdown :trigger="['click']"><search-outlined :style="{ fontSize: '26px' }"></search-outlined>
      <template #overlay>
        <a-menu>
          <a-menu-item key="learn"><bulb-outlined /> 学习ChatGPT提问</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
    <input
      id="myTextField"
      :value="searchWord"
      class="search-rg"
      onfocus="this.select()"
      placeholder="搜索应用、网页、标签组"
      spellcheck="false"
      style="font-size: 20px"
      tabindex="-1"
      type="text"
      @input="handleInput($event)"
    />
    <div>
      <a-avatar :size="35" alt="" class="app-hover" shape="circle"
                src="https://up.apps.vip/logo/favicon.svg"
                style="-webkit-app-region:no-drag;cursor: pointer"
                @click="openAppstore"
      ></a-avatar>
    </div>
  </div>
</template>

<script>
import {mapWritableState} from 'pinia'
import { appStore } from '../store'
import {SearchOutlined, SmileOutlined,CloseOutlined,BulbOutlined} from '@ant-design/icons-vue'
export default {
  name: 'SearchInput',
  components:{
    SearchOutlined
  },
  computed:{
    ...mapWritableState(appStore,['searchWord','contentLoading'])
  },

  methods:{
    handleInput(e) {
      this.searchWord = e.target.value
      this.contentLoading = true
      let path=this.$route.path
      if(this.searchWord===''){
        if(path!=='/'){
          this.$router.push({
            path:'/'
          })
        }
      }else{
        if(path!=='/results'){
          this.$router.push({
            path:'/results'
          })
        }
      }
    },
    openAppstore() {
      ipc.send('executeAppByPackage', {package: 'com.thisky.appStore'})
    },
  }
}
</script>

<style scoped>

</style>
