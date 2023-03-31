<template>
  <div class="flex w-full justify-between items-center" style="margin-bottom: 16px;">
       <div class="w-96 h-12 flex items-center">
          <div class="w-80 h-12 bg-black bg-opacity-10 rounded-lg flex items-center ">
              <div class="w-20 h-12 flex items-center justify-center" style="border-right: 1px solid rgba(255, 255, 255, 0.1);">壁纸源</div>
              <a-select class="w-full" :bordered="false" v-model:value="pickFilterValue" @change="pickFilterChange($event)">
                <!-- <a-select-option value="">ONE • 一个</a-select-option> -->
                <a-select-option value="/timeline/v2">拾光</a-select-option>
                <a-select-option value="/glutton/journal">贪食鬼</a-select-option>
                <a-select-option value="/wallhaven/v2">wallhaven</a-select-option>
              </a-select>
          </div>
       </div>
       <div class="w-48 h-12 flex items-center">
          <div class="w-2/5 h-12 flex items-center rounded-lg cursor-pointer justify-center bg-black bg-opacity-10">
            <Icon icon="filter" style="font-size: 1.715em;"></Icon>
            <span style="font-size: 1.15em;">筛选</span>
          </div>
          <div class="w-12 h-12 flex items-center rounded-lg cursor-pointer justify-center bg-black bg-opacity-10" style="margin-left: 12px;">
            <InfoCircleOutlined style="font-size: 1.715em;"/>
          </div>
       </div>
  </div>

  <vue-custom-scrollbar  id="containerWrapper" :settings="settingsScroller" style="height: 80vh">
    <viewer :images="pickDataList">
      <a-row :gutter="[20,20]" id="bingImages" style="margin-right: 1em">
        <a-col class="image-wrapper " v-for="img in pickDataList" :span="6" style="">
          <img @contextmenu.stop="showMenu(img)"  class="image-item pointer" :src="img.thumburl" style="position: relative">
          <div style="position: absolute;right: 0;top: -10px ;padding: 10px">
            <div  class="bottom-actions pointer" >
              <Icon  icon="tianjia1"></Icon>
            </div>
          </div>
          <!-- 
            <div  class="bottom-actions pointer" >
              @click.stop="addToActive(img)":style="{background:isInActive(img)?'rgba(255,0,0,0.66)':''}"
            
            v-if="!isInActive(img)"
            <Icon v-else style="" icon="yiwancheng"></Icon>
          </div>
          </div> -->
        </a-col>
      </a-row>
    </viewer>
  </vue-custom-scrollbar>
</template>

<script>
import axios from 'axios';
import {InfoCircleOutlined} from '@ant-design/icons-vue'
export default {
  name:'Picking',
  components:{
    InfoCircleOutlined
  },
  data(){
    return{
      pickFilterValue:'/glutton/journal',
      pickDataList:[],

    }
  },
  mounted(){
    this.getPickPaperData(this.pickFilterValue)
  },
  methods:{
    pickFilterChange(e){
      this.pickFilterValue = e
      this.getPickPaperData(this.pickFilterValue)
    },
    getPickPaperData(val){
      const url = `https://api.nguaduot.cn${val}?score=100`
      axios.get(url).then(res=>{
        this.pickDataList = res.data.data
      }).catch(err=>{
        return
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>