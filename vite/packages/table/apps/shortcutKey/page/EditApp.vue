<script lang="ts">
import {mapActions, mapWritableState} from "pinia";
import {keyStore} from "../store";
import XtButton from "../../../ui/libs/Button/index.vue";
import {Modal, message} from "ant-design-vue";

export default {
  name: "EditApp",
  components: {XtButton},
  data() {
    return {
      formApp: {
        hide:false,
      },
      originApp: {}
    }
  },
  computed:{
    ...mapWritableState(keyStore,['executedApps'])
  },
  async mounted() {
    if (this.$route.params.exeName) {
      this.formApp = await this.getCustomApp(this.$route.params.exeName)
      if(this.formApp.hide===undefined){
        this.formApp.hide=false
      }
      this.originApp = {...this.formApp}
    }
  }, methods: {
    ...mapActions(keyStore, ['getCustomApp','removeCustomApp','syncSessionList']),
    onBack() {
      this.$router.go(-1)
    },
    save(){
      this.originApp.alias=this.formApp.alias
      this.originApp.summary=this.formApp.summary
      this.originApp.icon=this.formApp.icon
      let found=this.executedApps.find(item=>{
        return item.exeName===this.$route.params.exeName
      })
      if(found){
        console.log('found=',found)
        found.hide=this.formApp.hide
        this.syncSessionList()
      }
      message.success('保存成功')
    },
    async refresh() {
      let newIcon = await tsbApi.system.extractFileIcon(this.formApp.path)
      this.formApp.icon=newIcon
    },
    async removeApp() {
      Modal.confirm({
        content: '是否删除此应用，此操作会删除应用，但不会删除应用关联的快捷键方案。',
        centered: true,
        onOk: () => {
          this.removeCustomApp(this.originApp)
          message.success('删除成功')
          this.$router.go(-1)
        }
      })
    }
  }
}</script>

<template>
  <div class="flex flex-1">
    <div @click="onBack"
         class="pointer button-active xt-mask h-12 w-12 flex items-center rounded-lg justify-center mr-3">
      <Icon icon="xiangzuo" style="font-size: 1.5em;color:var(--primary-text)"></Icon>
    </div>
    <div class="ml-3" style="font-size: 18px;line-height: 40px">编辑软件： {{ formApp.exeName }}</div>
  </div>


  <div class="add-content">
    <span>图标</span>
    <div class="flex">
      <div class="avatar">
        <div>
          <a-avatar shape="square" :size="100" :src="formApp.icon"/>
        </div>
      </div>
      <div class="ml-10 xt-text-2" style="font-size: 16px;">
        <div>推荐图片尺寸：256*256，不要超过2MB</div>
        <div class="pointer xt-bg-2 xt-text-2 flex items-center rounded-lg justify-center mr-3 mt-2"
             @click="refresh" style="width:120px; height:48px;">重新获取
        </div>
      </div>
    </div>
    <span>软件名称</span>
    <a-input v-model:value="formApp.alias" spellcheck="false" class="input" placeholder="请输入应用名称"
             aria-placeholder="font-size: 14px;" style="width:480px;height: 48px;"/>
    <span>方案简介</span>
    <a-textarea v-model:value="formApp.summary" spellcheck="false" class="input xt-text" placeholder="请输入描述"
                aria-placeholder="font-size: 14px;" :rows="4" style="width:480px;height: 100px;"/>
    <span>隐藏软件</span>
    <a-switch v-model:checked="formApp.hide"></a-switch>
    <a-row :gutter="10" class="mt-3">
      <a-col :span="16">
        <xt-button @click="save" type="theme" style="width: 100%"
        >保存
        </xt-button>
      </a-col>
      <a-col :span="8">
        <xt-button @click="removeApp" type="error">
          删除软件
        </xt-button>
      </a-col>
    </a-row>


  </div>

</template>

<style scoped lang="scss">

</style>
