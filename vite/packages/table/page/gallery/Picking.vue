<template>
  <div class="w-full h-full flex flex-col">
    <div class="flex items-center justify-between">
      <div class="flex items-center justify-center">
        <xt-new-icon icon="fluent:image-multiple-16-regular" :size="isModal ? 20 : 32" class="mr-2" style="color:var(--active-text) !important;"></xt-new-icon>
        <span class="xt-font xt-text font-400" :class="isModal ? 'font-14':'font-16'">拾光壁纸</span>
      </div>
      <div class="flex items-center justify-center">
        <xt-select :list="pickParams.paperSelect" v-model="pickParams.setting.paperValue" style="width: 140px;margin-right: 12px;text-align: center;" 
        :h="isModal ? 32 : 40" :borderClass="'rounded-md'" :border="false" @change="pickFilterChange($event)"/>
        <xt-dropdown :w="isModal ? 32 : 40" :h="isModal ? 32 : 40"  :iconSize="16" :placement="'bottomRight'" :buttonClass="'xt-active-bg'" :newIcon="'fluent:filter-16-regular'" :class="isModal ? 'mr-3':''">
          <PickDropDetail :isModal="isModal"/>
        </xt-dropdown>
        <ClosePaperButton v-if="isModal"/>
      </div>
    </div>

    <div class="flex-1 h-4/5">

    </div>
  </div>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia';
import { pickPaperStore } from './store/PickPaperStore';

import ClosePaperButton from './components/close/ClosePaperButton.vue';
import PickDropDetail from './components/content/PickDropDetail.vue';

export default {
  name:'Picking',

  props:['isModal'],

  components:{
    ClosePaperButton,PickDropDetail,
  },

  computed:{
    ...mapWritableState(pickPaperStore,['pickParams']),
  },

  mounted(){
    if(this.isModal){
      document.querySelector('.ant-select-selection-item').style = 'line-height:32px !important;height:30px !important;'
    }
  },

  methods:{
    // 下拉菜单切换数据
    pickFilterChange(evt){
      this.pickParams.setting.paperValue = evt;
    },


  }

};
</script>

<style lang="scss" scoped>
</style>