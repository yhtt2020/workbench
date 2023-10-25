<template>
  <ShareToChat :visible="shareVisible" @close="shareVisible=false" :content="shareContent" type="game" alias="游戏"></ShareToChat>

  <div class="flex">
    <div class="flex-grow">
      <div class="left-flex flex items-center">
        <div class="w-12 h-12 flex items-center button-active cursor-pointer detail-bg justify-center rounded-lg "  @click="goBack">
          <Icon icon="xiangzuo" style="font-size:1.5em;"></Icon>
        </div>
        <span style="font-size:20px;font-weight: 500;" class="ml-4 px-2 py-2 rounded-lg detail-name">{{ discountDetail.name }}</span>
      </div>
    </div>
    <div class="flex-grow-0">
      <div class="right-flex flex items-center justify-center mr-5">
        <xt-button class="mr-3" @click="shareSteamGame" :w="40" :h="40">
          <Icon style="" icon="fenxiang"></Icon>
        </xt-button>
        <span class="rounded-lg px-10 py-2 button-active detail-bg pointer mr-3 min-store" @click="enterSteamStore">前往购买</span>
        <span class="px-10 py-2 detail-bg button-active rounded-lg pointer" @click="openDetailDrawer">地区:{{defaultDetailRegion.name}}</span>
      </div>
    </div>
  </div>
  <vue-custom-scrollbar :settings="settingsScroller" style="height: calc(100vh - 15.8em)" class="mt-3 mr-3">
    <div class="detail-container">
      <div v-if="loading">
      </div>
      <WheelCastingUnit :loading="loading" v-else :wheelList="wheelData"></WheelCastingUnit>
      <div class="flex flex-col min-width detail-bg ml-4 rounded-lg px-4 py-4">
        <span style="font-size: 16px; font-weight: 400;color:var(--primary-text);">{{ discountDetail.content }}</span>
        <div class="flex justify-between items-center mt-4" >
          <span style="font-size: 16px; font-weight: 400; color: var(--secondary-text);">发行日期</span>
          <span style="font-size: 16px; font-weight: 400; color: var(--primary-text);">{{ discountDetail.IssueDate }}</span>
        </div>
        <div class="flex justify-between items-center mt-4" >
          <span style="font-size: 16px; font-weight: 400; color: var(--secondary-text);">发行商</span>
          <span style="font-size: 16px; font-weight: 400; color: var(--primary-text);">{{discountDetail.publisher}}</span>
        </div>
        <div class="flex justify-between items-center mt-4" >
          <span style="font-size: 16px; font-weight: 400; color:var(--secondary-text);">开发商</span>
          <span style="font-size: 16px; font-weight: 400; color: var(--primary-text);">{{discountDetail.developers}}</span>
        </div>
        <span class="w-1/3 mt-1" style="font-size: 16px; font-weight: 400; color: var(--secondary-text);">标签</span>
        <div class="flex items-center mt-1">
          <span v-for="item in discountDetail.genres"  class="rounded-lg mr-1" style="background: rgba(255, 255, 255, 0.4);padding: 2px 6px 1px 6px;">{{item.description}}</span>
        </div>
        <span class="mt-4 mb-3" style="font-size: 16px; font-weight: 400; color: var(--secondary-text);">语言</span>
        <span style="font-size: 16px; font-weight: 400; color: var(--secondary-text);">
          {{ discountDetail.language }}
        </span>
        <div  style="padding: 12px 13px;" class="detail-bg flex rounded-lg items-center justify-between mt-6">
          <div class="flex flex-col mt-1">
           <span style="font-size: 16px; font-weight: 400; color: var(--secondary-text);">价格</span>
           <span style="font-size: 14px; max-width: 120px; font-weight: 400; color: var(--secondary-text);">特价促销！{{ acquisitionDate(exTime) }}截止</span>
          </div>
          <div class="flex flex-col">
             <span class="line-through mr-2" style="text-align: right; color:rgba(255, 255, 255, 0.4);font-size: 14px; font-weight: 400;">{{ discountDetail.oldPrice }}</span>
             <div>
                <span class="mr-2 rounded-lg oswald-font" style="color:var(--active-text); padding: 2px 4px 5px 4px;background: rgba(255, 77, 79, 1);"> -{{discountDetail.percent}}%</span>
                <span class="oswald-font" style="font-size: 18px;color:rgba(255, 77, 79, 1);font-weight: 500;">{{ discountDetail.newPrice }}</span>
             </div>
          </div>

        </div>
      </div>
    </div>

    <div class="flex items-center justify-center flex-col mt-5">
      <div class="rounded-lg px-4 py-4 min-introduction detail-bg" style="width: 960px;">
        <span style="font-size: 18px;color:var(--primary-text); font-weight: 600;">游戏介绍</span>
        <div v-html="discountDetail.gameIntroduction" class="game-intro"></div>
      </div>
    </div>
  </vue-custom-scrollbar>

  <HorizontalDrawer
  :drawerTitle="drawerTitle" ref="regionDrawer" :rightSelect="rightSelect"
  @getArea="getArea"
  ></HorizontalDrawer>
</template>

<script>
import { regionRange } from '../../js/axios/api';
import WheelCastingUnit from '../../components/WheelCastingUnit.vue'
import HorizontalDrawer from '../../components/HorizontalDrawer.vue';
import browser from '../../js/common/browser'
import { mapActions, mapWritableState } from 'pinia';
import { steamStore } from '../../store/steam';
import ShareToChat from '../../ui/chat/ShareToChat.vue'
import XtButton from '../../ui/libs/Button/index.vue'
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
      XtButton,
      ShareToChat,
      WheelCastingUnit,
      HorizontalDrawer
    },
    data(){
      return{
        shareVisible:false,//分享组件可见
        loading:true,
        rightSelect:regionRange,
        defaultDetailRegion:{
          id:'cn',
          name:'国区'
        },
        settingsScroller: {
         useBothWheelAxes: true,
         swipeEasing: true,
         suppressScrollY: false,
         suppressScrollX: true,
         wheelPropagation: true
        },
        drawerTitle:'地区',
      }
    },
    computed:{
      ...mapWritableState(steamStore,['discountDetail']),
      wheelData(){
        if(this.discountDetail && this.discountDetail.movie_image){
          return this.discountDetail.movie_image
        }
      },
      shareContent(){
        return {
          description:'steam游戏',
          data:JSON.stringify({
            type:'game',
            game:{
              ...this.discountDetail,
              chineseName:this.discountDetail.name,
            }
          })
        }
      }
    },
    mounted(){
      this.loading=true
      this.getDiscountDetail(this.id,this.defaultDetailRegion.id).then(()=>{
        this.loading =false
      })
    },
    methods:{
      ...mapActions(steamStore,['getDiscountDetail']),
      goBack(){
        this.$router.go(-1)
      },
      shareSteamGame () {
        this.shareVisible=true
      },
      enterSteamStore(){
        browser.openInUserSelect(`https://store.steampowered.com/app/${this.id}`)
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
.detail-bg{
  background: var(--primary-bg);
  color: var(--primary-text);
}
.button-active{
  &:active{
    filter: brightness(0.8);
    opacity: 0.8;
  }
  &:hover{
    opacity: 0.8;
  }
}
.detail-name{

  font-size: 20px;
  color:var(--primary-text);
  font-weight: 500;
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
.oswald-font{
  font-family: Oswald-SemiBold;
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
