<template>
  <div class="flex w-full h-12 justify-between">
    <div class="left-flex flex items-center justify-center">
       <div class="w-12 h-12 flex items-center cursor-pointer btn-active justify-center rounded-lg s-bg"  @click="goBack">
         <Icon icon="xiangzuo" style="font-size:1.5em;"></Icon>
       </div>
       <span style="font-size:20px;font-weight: 500;" class="ml-4">{{ detailData.name }}</span>
    </div>
    <div class="right-flex flex items-center justify-center mr-5">
      <span class="rounded-lg btn-active s-bg cursor-pointer mr-3 " @click="enterSteamStore"  style="padding: 13px 41px 12px 41px;">Steam商店</span>
      <a-select style="border: 1px solid rgba(255, 255, 255, 0.1);" @change="selectOptionValue($event)"  
       class="w-56 h-auto rounded-xl  text-xs s-item" size="large"
       :bordered="false" v-model:value="defaultDetailRegion">
       <a-select-option v-for="item in rightSelect" :value="item.id">{{item.name}}</a-select-option>
      </a-select>
    </div>
  </div>
  <vue-custom-scrollbar :settings="settingsScroller" style="height: calc(100vh - 15.8em)" class="mt-3 mr-3">
    <a-row :gutter="[24,8]">
      <a-col :span="12" class="mr-48 ml-4">
        <WheelCastingUnit></WheelCastingUnit>
        <!-- :screenshots="detailScreenshots" :movies="detailMovies -->
      </a-col>
      <a-col :span="8">
        <div class="flex flex-col">
          <span style="font-size: 16px; font-weight: 400;color: rgba(255, 255, 255, 0.85);">{{ detailData.description }}</span>
          <div class="flex justify-between items-center mt-4" >
            <span style="font-size: 16px; font-weight: 400; color: rgba(255, 255, 255, 0.6);">发行日期</span>
            <span style="font-size: 16px; font-weight: 400; color: rgba(255, 255, 255, 0.85);">{{ detailData.releaseDate }}</span>
          </div>
          <div class="flex justify-between items-center mt-4" >
            <span style="font-size: 16px; font-weight: 400; color: rgba(255, 255, 255, 0.6);">发行商</span>
            <span style="font-size: 16px; font-weight: 400; color: rgba(255, 255, 255, 0.85);">{{detailData.publishers}}</span>
          </div>
          <div class="flex justify-between items-center mt-4" >
            <span style="font-size: 16px; font-weight: 400; color: rgba(255, 255, 255, 0.6);">开发商</span>
            <span style="font-size: 16px; font-weight: 400; color: rgba(255, 255, 255, 0.85);">{{detailData.developers}}</span>
          </div>
          <div class="flex  items-center justify-between mt-4" >
            <span class="w-1/3" style="font-size: 16px; font-weight: 400; color: rgba(255, 255, 255, 0.6);">标签</span>
            <div class="flex items-center justify-center">
               <span v-for="item in detailData.genres"  class="rounded-lg mr-1" style="background: rgba(255, 255, 255, 0.4);padding: 2px 6px 1px 6px;">{{item.description}}</span>
            </div>
          </div>
          <span class="mt-4 mb-3" style="font-size: 16px; font-weight: 400; color: rgba(255, 255, 255, 0.6);">语言</span>
          <span style="font-size: 16px; font-weight: 400; color: rgba(255, 255, 255, 0.6);">
            {{ detailData.language }}
          </span>
          <div  style="padding: 12px 13px;" class="s-bg flex mb-4 rounded-lg items-center justify-between mt-6">
            <div class="flex flex-col mt-1">
             <span style="font-size: 16px; font-weight: 400; color: rgba(255, 255, 255, 0.6);">价格</span>
             <span style="font-size: 14px; font-weight: 400; color: rgba(255, 255, 255, 0.6);">特价促销！4 月 24 日 截止</span>
            </div>
            <div class="flex flex-col">
               <span class="line-through mr-2" style="text-align: right; color:rgba(255, 255, 255, 0.4);font-size: 14px; font-weight: 400;">{{ detailData.oldPrice }}</span>
               <div>
                  <span class="mr-2 rounded-lg" style="padding: 2px 4px 5px 4px;background: rgba(255, 77, 79, 1);"> -{{detailData.percent}}%</span>
                  <span style="font-size: 18px;color:rgba(255, 77, 79, 1);font-weight: 500;">{{ detailData.newPrice }}</span>
               </div>
            </div>
          </div>
         </div>
      </a-col>
    </a-row>
  </vue-custom-scrollbar>
</template>

<script>
import { regionRange,sendRequest } from '../../js/axios/api';
import _ from 'lodash-es';
import WheelCastingUnit from '../../components/WheelCastingUnit.vue'
export default {
    name:'GameDiscountDetail',
    props:{
      id:{
        type:Object,
        default:()=>{}
      }
    },
    components:{
      WheelCastingUnit
    },
    data(){
      return{
        rightSelect:regionRange,
        defaultDetailRegion:'cn',
        detailData:{
          name:'',
          genres:[],
          releaseDate:'',
          developers:'',
          publishers:'',
          oldPrice:'',
          newPrice:'',
          percent:'',
          language:'',
          description:''
        },
        // 接收轮播视频和图片
        detailMovies:[],
        detailScreenshots:[],
        settingsScroller: {
         useBothWheelAxes: true,
         swipeEasing: true,
         suppressScrollY: false,
         suppressScrollX: true,
         wheelPropagation: true
        },
      }
    },
    mounted(){
      this.getDetailVal()
    },
    methods:{
      goBack(){
        this.$router.push({name:'gameDiscount'}) 
      },
      getDetailVal(){
        if(this.id !== undefined){
          sendRequest(`https://store.steampowered.com/api/appdetails?appids=${this.id}&cc=${this.defaultDetailRegion}&l=${this.defaultDetailRegion}`,3).then(res=>{
            const result = res.data[this.id].data
            console.log(result);
            const newLanguages = result.supported_languages.replaceAll('<strong>*</strong>','')
            this.detailData = {
              name:result.name,
              language:newLanguages.split('<br>')[0],
              publishers:result.publishers[0],
              developers:result.developers[0],
              releaseDate:result.release_date.date,
              genres:result.genres,
              percent:result.price_overview.discount_percent,
              description:result.short_description,
              newPrice:result.price_overview.final_formatted,
              oldPrice:result.price_overview.initial_formatted
            }
            this.detailMovies = result.movies // 详情图片和视频数组拼接方便后期渲染
            this.detailScreenshots = result.screenshots
          })
        }else{
          this.$router.push({name:'gameDiscount'})
        }
      },
      selectOptionValue(e){
        this.defaultDetailRegion = e
        this.getDetailVal()
      },
      enterSteamStore(){
        window.ipc.send('addTab', { url: `https://store.steampowered.com/app/${this.id}` })
      }
    }
  }
</script>

<style lang="scss" scoped>
.btn-active:active{
  filter: brightness(0.8);
  background:rgba(42, 42, 42, 0.25);
} 
::v-deep .ps__thumb-y{
  display: none !important;
}
</style>