<template>
  <h3 style="color:var(--primary-text)">我的团队 <a-button class="relative" style="float: right;border-radius: 8px;border: none;" type="primary" @click="createGroup">创建团队
    <GradeSmallTip powerType="group" lastPowerType="创建团队"></GradeSmallTip></a-button></h3>
  <a-tabs v-model:activeKey="activeKey">
    <template #rightExtra>
      <a-button @click="look" style="border-radius: 8px;color:var(--primary-text)">寻找圈子</a-button>
    </template>
    <a-empty v-if="privateGroup.length===0">

    </a-empty>
    <a-tab-pane key="public" tab="公开">
      <vue-custom-scrollbar :settings="innerSettings" style="height: 19em">
      <a-row :gutter="[20,20]">
        <a-col class="pointer" @click="go('https://s.apps.vip/forum?id='+circle.id)" :span="12" v-for="circle in this.publicGroup">
         <a-row >
           <a-col :span="6">
             <a-avatar shape="square" :src="circle.logo_src_pc_46"></a-avatar>
           </a-col>
           <a-col :span="18">
             <div class="text-more" style="color:var(--primary-text)">
               {{circle.name}}
             </div>
           </a-col>
         </a-row>
        </a-col>
      </a-row>
      </vue-custom-scrollbar>
    </a-tab-pane>
    <a-tab-pane key="private" tab="私密" >
      <a-empty v-if="privateGroup.length===0">
      </a-empty>
      <vue-custom-scrollbar :settings="innerSettings" style="height: 19em">
      <a-row :gutter="[20,20]">
        <a-col class="pointer" @click="go('https://s.apps.vip/forum?id='+circle.id)" :span="12" v-for="circle in this.privateGroup">
          <a-row>
            <a-col :span="6">
              <a-avatar shape="square" :src="circle.logo_src_pc_46"></a-avatar>
            </a-col>
            <a-col :span="18">
              <div class="text-more">
                {{circle.name}}
              </div>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      </vue-custom-scrollbar>
    </a-tab-pane>
    <a-tab-pane key="audit" tab="审核中">
      <a-empty v-if="auditGroup.length===0">
      </a-empty>
      <vue-custom-scrollbar :settings="innerSettings" style="height: 19em">
      <a-row :gutter="[20,20]">
        <a-col class="pointer" @click="go('https://s.apps.vip/forum?id='+circle.id)" :span="12" v-for="circle in this.auditGroup">
          <a-row>
            <a-col :span="6">
              <a-avatar shape="square" :src="circle.logo_src_pc_46"></a-avatar>
            </a-col>
            <a-col :span="18">
              <div class="text-more">
                {{circle.name}}
              </div>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      </vue-custom-scrollbar>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import { appStore } from '../../store'
import {mapWritableState} from 'pinia'
import GradeSmallTip from "../GradeSmallTip.vue";
import browser from '../../js/common/browser'
const {groupApi} = window.$apis
export default {
  name: 'GroupPanel',
  data(){
    return{
      activeKey:'public',
      innerSettings:{
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: false
      },
    }
  },
  components:{GradeSmallTip},
  mounted () {
    this.getMyCircle({page: 1, row: 20})
    this.getJoinedCircle({page: 1, row: 20})
  },
  computed:{
    ...mapWritableState(appStore,['myData','userInfo']),
    publicGroup(){
      return this.myData.myCircle.filter(group=>{
        return group.is_private===0
      })
    },
    privateGroup(){
      return this.myData.myCircle.filter(group=>{
        return group.is_private===1
      })
    },
    auditGroup(){
      return this.myData.myCircle.filter(group=>{
        return group.is_audit===0 && group.creator===this.userInfo.uid
      })
    }
  },
  methods: {
    look(){
      browser.openInInner('https://s.apps.vip/groups')
    },
    go(url){
      browser.openInInner(url)
    },
    createGroup(){
      ipc.send('osxCreateCircle')
    },
    /**
     * 获取我的圈子
     * @param options
     * @returns {Promise<void>}
     */
    async getMyCircle ( options) {
      const result = await groupApi.getMyCircle(options)
      if (result.code === 1000) {
        this.myData.myCircle=result.data
      }
    },
    /**
     * 获取到我加入的圈子，此接口耗时较长，需要放宽超时时长。
     * @param options
     * @returns {Promise<void>}
     */
    async getJoinedCircle (options) {
      try {
        const result = await groupApi.getJoinedCircle(options)
        if (result.code === 1000) {
          const data = toString.call(result.data) === '[object Array]' ? [] : result.data.list
          this.myData.joinedCircle=data
        }
      } catch (e) {
        console.warn(e)
      }
    },
  }
}
</script>

<style scoped>
:deep(.ant-tabs-tab-btn) {
  color: var(--primary-text) !important;
}

:deep(.ant-tabs-tab) {
  background: none !important;

}
:deep(.ant-empty-description) {
  color: var(--primary-text) !important;

}
</style>
