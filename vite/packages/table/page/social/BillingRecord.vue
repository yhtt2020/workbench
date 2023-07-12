<template>
 <div class="ml-4">
  <div style="width: 328px;" class="mb-3">
    <HorizontalPanel :navList="recordType" v-model:selectType="defaultRecord"></HorizontalPanel>
  </div>
  <template v-if="defaultRecord.name === 'check'">
    <CheckRecord></CheckRecord>
  </template>
  <template v-else>
    <GiftRecord></GiftRecord>
  </template>
 </div>

</template>

<script>
import HorizontalPanel from '../../components/HorizontalPanel.vue'
import GiftRecord from './record/GiftRecord.vue'
import CheckRecord from './record/CheckRecord.vue'

export default {
  name:'BillingRecord',
  components:{
    HorizontalPanel,
    GiftRecord,
    CheckRecord
  },
  data(){
    return{
      recordType:[
        {title:'账单记录',name:'check'},
        {title:'礼物记录',name:'gift'}
      ],
      defaultRecord:{title:'账单记录',name:'check'},
    }
  }, 
  watch:{
    defaultRecord:{
      handler(){
        this.defaultRecord = this.defaultRecord
      }
    }
  }   
}
</script>

<style lang="scss" scoped>
:deep(.nav-item){
  border-radius: 7px !important;
}
</style>