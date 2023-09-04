<script lang="ts">
import {defineComponent} from 'vue'
import Search from "../../../components/Search.vue";
import XtButton from "../../../ui/libs/Button/index.vue";
import {mapActions, mapWritableState} from "pinia";
import {keyStore} from "../store";
import NotShortcutKey from "../shortcutKey/NotShortcutKey.vue";
import {PlusOutlined} from '@ant-design/icons-vue'
export default {
  name: "schemeList",
  components: {NotShortcutKey, XtButton, Search,PlusOutlined},
  data() {
    return {
      shortcutSchemeList: [],
      exeName: ''
    }
  },
  computed: {
    ...mapWritableState(keyStore, ['shortcutKeyList', 'schemeList', 'currentApp','settings']),
  },
  watch:{
     currentApp:{
       handler(){
         if(this.settings.enableAutoChange){
           this.exeName=this.currentApp.exeName
           this.refreshList()

         }

       },
       deep:true
     }
  },
  mounted() {
    this.exeName = this.$route.params.exeName
    this.refreshList()
  },
  beforeRouteUpdate(to) {
    this.exeName = to.params.exeName
    this.refreshList()
  },
  methods: {
    ...mapActions(keyStore, ['setRecentlyUsedList', 'loadShortcutSchemes']),
    async refreshList() {
      console.log(this.exeName,'查询调节')

      this.shortcutSchemeList = await this.loadShortcutSchemes(this.exeName)
      if(this.settings.enableAutoEnter && this.shortcutSchemeList.length>0){
          this.btnDetail(this.shortcutSchemeList[0])
      }
    },
    createScheme(){
      this.$router.push({name: 'shareKey',params:{
        exeName:this.exeName
        }})
    },
    btnDetail (item) {
      this.setRecentlyUsedList(item)
      this.$router.push({
        name:'schemeDetail'
      })
    },
  }
}
</script>

<template>
  <!-- 有内容 -->

  <div class="container rounded-lg w-full px-2">
    <div class=" m-2   my-1 flex">
      <div class="  rounded-md px-2 p-2  " :span="12" style="flex: 1">
        <div class="flex flex-row">
          <div hidden="">
            - {{ currentApp.pid }} - {{ currentApp.title }}
          </div>

          <div hidden="">{{ currentApp.lastFocus }}</div>
          <div class="    truncate">
            <a-avatar :size="48" shape="square" :src="currentApp.software.icon"></a-avatar>

            <div v-if="!currentApp.inRep" class="mt-2">
              <xt-button type="theme" size="mini" style="width:100%" :h="36">登记入库</xt-button>
            </div>
          </div>
          <div class="ml-4">
            <div class="font-16 font-bold">
              {{ currentApp.software.alias }}
            </div>
            <span class="" style="font-size: 16px;color: var(--secondary-text);">共{{
                shortcutSchemeList.length
              }}个应用快捷键方案</span>
            <div class="xt-text-2">
              {{ currentApp.path }}
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="btn-item mt-3">
          <div class="pointer" @click="createScheme"><plus-outlined /> 创建方案</div>
          <div class="pointer" @click="market">创意市场</div>

          <span class="button-active pointer" @click="setShow = true">
                <Icon icon="setting" style="width: 20px;height: 20px;color:var(--primary-text);"></Icon>
            </span>
        </div>
      </div>
    </div>
    <div class="flex justify-between px-4">
      <div class="flex items-center">


      </div>

    </div>

    <div v-if="shortcutSchemeList.length>0" class="main-part item-content"
         style="flex:1">
      <div v-for="item in shortcutSchemeList" class="flex items-center pointer" @click="btnDetail(item)">
            <span class="mx-4 h-14 w-14 flex justify-center items-center">
                <a-avatar shape="square" :src="item.icon" :size="48"></a-avatar>
            </span>
        <span class="xt-text">{{ item.name }}</span>
        <div class="flex flex-col justify-center items-center">
          <span>{{ item.number }}</span>
          <span class="xt-text-2" style="font-size: 14px;">快捷键</span>
        </div>
      </div>
      <div v-if="shortcutSchemeList.length > 2" style="opacity:0;height: 1px;"></div>
      <div v-if="shortcutSchemeList.length > 2" style="opacity:0;height: 1px;"></div>
    </div>
    <!-- 无内容 -->
    <div v-else style="flex:1">
      <NotShortcutKey @createScheme="createScheme"></NotShortcutKey>
    </div>
  </div>

</template>

<style scoped lang="scss">

</style>
