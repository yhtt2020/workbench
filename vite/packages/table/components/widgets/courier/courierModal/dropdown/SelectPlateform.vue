<template>
 <a-select v-model:value="selectValue"  style="width: 120px;border-radius: 8px;" :bordered="false">
  <a-select-option v-for="item in selectList" class="option-item" :value="item.value">
   <div class="flex items-center justify-center xt-text-2">
    <div v-if="item.alias" class="rounded-md flex items-center xt-active-text justify-center w-6 h-6 mr-1.5" :style="{background:`${item.color}`}">
     {{ item.alias }}
    </div>
    <span>{{ item.title }}</span>
   </div>
  </a-select-option>
 </a-select>
</template>

<script>
export default {
  data(){
   return{
    selectList:[
     { value:'all',title:'全部平台' },
     { value:'jd',title:'京东',alias:'JD',color:'#E12419'},
     { value:'tb',title:'淘宝',alias:'淘',color:'#FA5000' },
      { value:'',title:'普快',alias:'普',color:'#0d6f09' }
    ],
    selectValue:'all'
   }
  },
  watch:{
    selectValue:{
      handler(newVal){
        this.$emit('changePlatform',newVal)
      },
      immediate:true
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.option-item){
  &:hover{
   background: var(--active-secondary-bg) !important;
  }
}

:deep(.ant-select-selector){
  height: 40px !important;
  display: flex !important;
  line-height: 40px !important;
  align-items: center !important;
  justify-content: center !important;
}

:deep(.ant-select-selection-item){
 height: 40px !important;
 display: flex !important;
 line-height: 40px !important;
 align-items: center !important;
 justify-content: center !important;
}
</style>
