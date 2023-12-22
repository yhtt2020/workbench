<template>
  <div class="pickModal rounded-lg p-4 xt-modal">
    <RadioTab :navList="pickParams.tabList" v-model:selectType="pickParams.setting.tabValue" class="mb-4 " style="height: 40px !important;"/>
    <xt-select :list="paperCateList" v-model="pickParams.setting.cateValue"  style="margin-right: 12px;text-align:start;" @click.native="handleSelectClick"
     :h="isModal ? 32 : 40" :borderClass="'rounded-md w-full '" :border="false" @change="handleEmitData"/>

    <div class="w-full flex flex-col mt-4" @click.native="handleSelectClick">
      <div class="flex items-center justify-start" style="padding-bottom: 18px;">
        <span class="xt-text-2 xt-font font-400 mr-4" :class="isModal ? 'font-14':'font-16'">壁纸</span>
        <span class="xt-text xt-font font-400" :class="isModal ? 'font-14':'font-16'">{{paperDescribe.name}}</span>
      </div>
      <div class="flex items-center justify-start" style="padding-bottom: 18px;">
        <span class="xt-text-2 xt-font font-400 mr-4" :class="isModal ? 'font-14':'font-16'">简介</span>
        <span class="xt-text xt-font font-400" :class="isModal ? 'font-14':'font-16'">{{paperDescribe.synopsis}}</span>
      </div>
      <div class="flex items-center justify-start" style="padding-bottom: 18px;">
        <span class="xt-text-2 xt-font font-400 mr-4" :class="isModal ? 'font-14':'font-16'">官网</span>
        <xt-button h="0" style="width: auto !important;" @click="toOfficialWebsite">
          <div class="flex items-center justify-center">
            <span class="xt-text xt-font font-400" :class="isModal ? 'font-14':'font-16'" style="color: var(--active-bg) !important;">访问官网</span>
          </div>
        </xt-button>
      </div>
      <div class="flex items-center justify-center xt-text-2 xt-font font-400" :class="isModal ? 'font-14':'font-16'">
        「拾光壁纸」提供技术支持
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia';
import { pickPaperStore } from '../../store/PickPaperStore';
import browser from '../../../../js/common/browser';

import RadioTab from '../../../../components/RadioTab.vue';

export default {
  name:'PickDropDetail',

  props:['isModal'],

  components:{
    RadioTab
  },


  computed:{
    ...mapWritableState(pickPaperStore,['pickParams']),
    paperCateList(){
      if(this.pickParams.setting.paperValue === '/wallhaven/v2'){
        this.pickParams.setting.cateValue = this.pickParams.wallhavenList[0].value;
        return this.pickParams.wallhavenList;
      }
      else { 
        this.pickParams.setting.cateValue = this.pickParams.paperList[0].value;
        return this.pickParams.paperList; 
      }
    },
    paperDescribe(){
      const params = this.pickParams.setting.paperValue;
      const index = this.pickParams.paperSelect.findIndex((find)=>{ return String(find.value) === String(params) })
      return this.pickParams.paperSelect[index];
    }
  },

  methods:{
    // 阻止dropdown菜单关闭触发事件
    handleSelectClick(evt){
      evt.stopPropagation();
    },
    // 访问官网
    toOfficialWebsite(){
      browser.openInInner('https://timeline.ink')
    },
    handleEmitData(){
      this.$emit('emitPick')
    },
  },


  watch:{
    'pickParams.setting.cateValue':{
      handler(newVal){
        this.$emit('emitPaper');
      },
      immediate:true,
      deep:true,
    }
  },
  

};
</script>

<style lang="scss" scoped>
:deep(.panel-title){
  margin-left: 8px !important;
}

:deep(.nav-box){
  border-radius: 8px !important;
}
.pickModal{
  border: 1px solid var(--divider);
  box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.03);
  box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.1);
  box-shadow: 0px 0px 40px 0px rgba(0,0,0,0.2);
}

:deep(.round-dot){
 background: var(--active-text) !important;
}
</style>