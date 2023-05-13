<template>
  <div class="flex">
    <div class="flex-grow">
      <div class="left-flex flex items-center">
        <div class="w-12 h-12 flex items-center cursor-pointer btn-active justify-center rounded-lg s-bg"  @click="goBack">
          <Icon icon="xiangzuo" style="font-size:1.5em;"></Icon>
        </div>
        <span style="font-size:20px;font-weight: 500;" id="detail-name" class="ml-4 px-2 py-2 rounded-lg truncate">{{ detailData.name }}</span>
      </div>
    </div>
    <div class="flex-grow-0">
      <div class="right-flex flex items-center justify-center mr-5">
        <span class="rounded-lg px-10 py-2 btn-active s-bg cursor-pointer mr-3 min-store" @click="enterSteamStore">前往购买</span>
        <span class="px-10 py-2 s-bg btn-active rounded-lg pointer" @click="openDetailDrawer">地区:{{defaultDetailRegion.name}}</span>
      </div>
    </div>
  </div>
  <vue-custom-scrollbar :settings="settingsScroller" style="height: calc(100vh - 15.8em)" class="mt-3 mr-3">
    <div class="detail-container">
      <WheelCastingUnit :screenshots="detailScreenshots" :movies="detailMovies"></WheelCastingUnit>
      <div class="flex flex-col min-width ml-4 rounded-lg px-4 py-4 s-bg">
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
        <span class="w-1/3 mt-1" style="font-size: 16px; font-weight: 400; color: rgba(255, 255, 255, 0.6);">标签</span>
        <div class="flex items-center mt-1">
          <span v-for="item in detailData.genres"  class="rounded-lg mr-1" style="background: rgba(255, 255, 255, 0.4);padding: 2px 6px 1px 6px;">{{item.description}}</span>
        </div>
        <span class="mt-4 mb-3" style="font-size: 16px; font-weight: 400; color: rgba(255, 255, 255, 0.6);">语言</span>
        <span style="font-size: 16px; font-weight: 400; color: rgba(255, 255, 255, 0.6);">
          {{ detailData.language }}
        </span>
        <div  style="padding: 12px 13px;" class="s-bg flex rounded-lg items-center justify-between mt-6">
          <div class="flex flex-col mt-1">
           <span style="font-size: 16px; font-weight: 400; color: rgba(255, 255, 255, 0.6);">价格</span>
           <span style="font-size: 14px; font-weight: 400; color: rgba(255, 255, 255, 0.6);">特价促销！{{ acquisitionDate(exTime) }} 截止</span>
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
    </div>
    <div class="flex items-center justify-center flex-col mt-5">
      <div class="s-bg rounded-lg px-4 py-4 min-introduction" style="width: 960px;">
        <span style="font-size: 18px;color: rgba(255,255,255,0.85); font-weight: 600;">游戏介绍</span>
        <div v-html="gameIntroduction" class="game-intro"></div>
      </div>
    </div>
  </vue-custom-scrollbar>

  <HorizontalDrawer 
  :drawerTitle="drawerTitle" ref="regionDrawer" :rightSelect="rightSelect"
  @getArea="getArea" 
  ></HorizontalDrawer>
</template>

<script>
import { regionRange,sendRequest } from '../../js/axios/api';
import WheelCastingUnit from '../../components/WheelCastingUnit.vue'
import HorizontalDrawer from '../../components/HorizontalDrawer.vue';
export default {
    name:'GameDiscountDetail',
    props:{
      id:{
        type:Object,
        default:()=>{}
      },
      exTime:{
        type:Object,
        default:()=>{}
      }
    },
    components:{
      WheelCastingUnit,
      HorizontalDrawer
    },
    data(){
      return{
        rightSelect:regionRange,
        defaultDetailRegion:{
          id:'cn',
          name:'国区'
        },
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
        gameIntroduction:'',  // 接收游戏介绍
        drawerTitle:'地区'
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
          sendRequest(`https://store.steampowered.com/api/appdetails?appids=${this.id}&cc=${this.defaultDetailRegion.id}&l=${this.defaultDetailRegion.id}`,{},{
            localCache:true,
            localTtl:60*12*60
          }).then(res=>{
            const result = res.data[this.id].data
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
            this.gameIntroduction = result.detailed_description
          })
        }else{
          this.$router.push({name:'gameDiscount'})
        }
      },
      enterSteamStore(){
        window.ipc.send('addTab', { url: `https://store.steampowered.com/app/${this.id}` })
      },
      acquisitionDate(val){
        const expireDate = new Date(parseInt(val)*1000)
        let m = expireDate.getMonth() + 1 // 月
        let d = expireDate.getDate() // 日
        return m + '月' + d + '日'
      },
      // 打开详情区服选项
      openDetailDrawer(){
        this.$refs.regionDrawer.openDrawer()
      },
      // 获取地区状态和选中情况
      getArea(v){
        this.defaultDetailRegion = v
        this.getDetailVal()
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
.detail-container{
  display: flex;
  align-items: stretch;
  justify-content: center;
}
.min-width{
  max-width: 344px;
}
.active{
  background: rgba(255,255,255,0.40);
}

.min-introduction{
  .game-intro{
    width: 100%;
    ::v-deep .bb_ul{
      padding: 0 !important;
      li{
        list-style: none !important;
        padding: 0 !important;
        img{
          height: 10px !important;
          width: 10px !important;
          object-fit: cover;
        }
      }
    }
    ::v-deep p img{
      width: 100% !important;
      object-fit: cover;
    }
    ::v-deep img{
      width: 100% !important;
      object-fit: cover;
    }
  }
}

@media screen and (max-width:1224px) {
  #detail-name{
    max-width: 120px;
  }
  .min-store{
    padding: 8px 12px !important;
  }
  .detail-container{
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content:center !important;
  }
  .min-width{
    max-width: 600px !important;
    margin: 24px 0 0 0  !important;
  }
  .min-introduction{
    max-width:600px !important;
    .game-intro{
      width: 100% !important;
      ::v-deep p img{
        width: 100% !important;
      }
      ::v-deep img{
        width: 100% !important;
      }
      ::v-deep .bb_ul {
        width: 100% !important;
        li{
          padding: 0 !important;
          list-style: none !important;
          img{
            height: 10px !important;
            width: 10px !important;
          }
        }
      }
    }
  }

}

@media screen and (max-width:850px){
  .min-width{
    max-width: 500px !important;
  }
  .detail-container{
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content:center !important;
  }
  .wheel-content{
    max-width: 500px !important;
  }
  .min-introduction{
    max-width:500px !important;
    .game-intro{
      width: 100% !important;
      ::v-deep p img{
        width: 100% !important;
      }
      ::v-deep img{
        width: 100% !important;
      }
      ::v-deep .bb_ul {
        width: 100% !important;
        li{
          padding: 0 !important;
          list-style: none !important;
          img{
            height: 10px !important;
            width: 10px !important;
          }
        }
      }
    }
  }
}
</style>