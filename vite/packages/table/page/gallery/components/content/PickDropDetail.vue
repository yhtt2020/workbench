<template>
  <div class="pickModal rounded-lg p-4" :class="isModal ? 'xt-bg-t-2' :' xt-modal'">
    <RadioTab :navList="pickParams.tabList" v-model:selectType="pickParams.setting.tabValue" class="mb-4"/>
  </div>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia';
import { pickPaperStore } from '../../store/PickPaperStore';

import RadioTab from '../../../../components/RadioTab.vue';

export default {
  name:'PickDropDetail',

  props:['isModal'],

  components:{
    RadioTab
  },


  computed:{
    ...mapWritableState(pickPaperStore,['pickParams']),
    

  },


  mounted(){
    this.getWallHeavenClass();
    this.getPickLightClass();
  },

  methods:{
    ...mapActions(pickPaperStore,['getPickLightClass','getWallHeavenClass'])
  },

};
</script>

<style lang="scss" scoped>
:deep(.panel-title){
  margin-left: 8px !important;
}
</style>