<template>
  <div class="flex w-full justify-between items-center" style="margin-bottom: 16px;">
    <div class="w-96 h-12 flex items-center">
       <div class="w-80 h-12 bg-black bg-opacity-10 rounded-lg flex items-center ">
           <div class="w-20 h-12 flex items-center justify-center" style="border-right: 1px solid rgba(255, 255, 255, 0.1);">壁纸源</div>
           <a-select class="w-full" :bordered="false" v-model:value="pickFilterValue" @change="pickFilterChange($event)">
             <!-- <a-select-option value="">ONE ? 一个</a-select-option> -->
             <a-select-option value="/timeline/v2">拾光</a-select-option>
             <a-select-option value="/glutton/journal">贪食鬼</a-select-option>
             <a-select-option value="/wallhaven/v2">wallhaven</a-select-option>
           </a-select>
       </div>
    </div>
    <div class="w-48 h-12 flex items-center">
       <div class="w-2/5 h-12 flex items-center rounded-lg cursor-pointer justify-center bg-black bg-opacity-10" @click="openFilter">
         <Icon icon="filter" style="font-size: 1.715em;"></Icon>
         <span style="font-size: 1.15em;">筛选</span>
       </div>
       <div class="w-12 h-12 flex items-center rounded-lg cursor-pointer justify-center bg-black bg-opacity-10" @click="openInfo" style="margin-left: 12px;">
         <InfoCircleOutlined style="font-size: 1.715em;"/>
       </div>
    </div>
</div>
</template>

<script>
import { defineComponent,ref } from 'vue';
import {InfoCircleOutlined} from '@ant-design/icons-vue'
import axios from 'axios';
export default defineComponent({
  name:'Picking',
  components:{
    InfoCircleOutlined
  },
  mounted() {
     
  },
  methods:{
    // 获取拾光壁纸数据
    getPickingData(v){
      const apiUrl = `https://api.nguaduot.cn/${v}`
      console.log(apiUrl);
    },
    pickFilterChange(e){
      this.pickFilterValue = e
      this.getPickingData(e)
    }
  },
  setup() {
    const pickFilterValue = ref('/timeline/v2')
    const pickInfoShow = ref(false)
    const pickFilterShow = ref(false)
    // 右侧打开拾光壁纸官网信息
    const openInfo = () =>{
      pickInfoShow.value = true
    }
    // 点击筛选
    const openFilter = () =>{
      pickFilterShow.value = true
    }
    // 跳转至拾光壁纸官网
    const toOfficialWebsite = () =>{
      ipc.send('addTab',{url:'https://app.nguaduot.cn/timeline'})
    }
    return{
      pickFilterValue,
      pickInfoShow,
      pickFilterShow,
      openInfo,
      toOfficialWebsite,
      openFilter
    }
  }
})
</script>

<style lang="scss" scoped>
.pick-container{
   width: auto;
   background: pink;
}
.center-loading{
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>