<template>
  <div class="mx-7 flex flex-col">
    <div class="flex justify-between h-12 items-center">
      <HorizontalPanel :navList="leftTitle" v-model:selectType="leftTitleType"></HorizontalPanel>
      <span class="px-10 right-select-active s-bg rounded-lg area-name pointer" @click="openRightDrawer" v-if="leftTitleType.name === 'steam' ">地区: {{defaultGameValue.name}}</span>
    </div>
  </div>
  <template v-if="leftTitleType.name === 'steam' ">
    <div class="flex mx-5 items-center justify-center epic-container">
      <vue-custom-scrollbar  @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" class="mt-3 px-3" style="height: calc(100vh - 15.8em)">
        <a-spin v-if="isLoading === true" class="" style="margin-top: 2em;"></a-spin>
        <div class="flex items-center flex-col justify-center" v-else>
          <div class="flex steam-item steam-sw-item">
            <div v-for="item in steamList.slice(0,2)" @click="enterDiscountDetail(item.id)" class="steam-mw s-bg pointer rounded-lg mb-3 mr-4">
              <div style="height:228px;">
                <img :src="item.header_image" alt="" class="rounded-lg"  style="width:100%;height: 100%;object-fit: cover;">
              </div>
              <div class="px-3 py-3 name-size">{{item.name}}</div>
              <div class="px-3 mb-3">优惠截止时间: {{ deadline(item.discount_expiration) }}</div>
              <div class="px-3 flex  items-center mb-3">
                <span class="percent px-1 rounded-md">- {{item.discount_percent}} %</span>
                <span class="final-price ml-3">{{ currencyFormat(item.final_price,item.currency) }}</span>
                <span class="line-through old-price ml-3">{{ currencyFormat(item.original_price,item.currency) }}</span>
              </div>
            </div>
          </div>
          <div class="flex flex-wrap steam-sw-item ">
            <div class="steam-sw  mb-3 mr-2 s-bg rounded-lg pointer" v-for="item in steamList.slice(2)" @click="enterDiscountDetail(item.id)">
              <div class="epic-sh mb-3">
                <img :src="item.header_image" alt="" class="rounded-lg"  style="width:100%;height: 100%;object-fit: cover;">
              </div>
              <div class="px-3 flex  items-center mb-3">
                <span class="percent px-1 rounded-md">- {{item.discount_percent}} %</span>
                <span class="final-price ml-3">{{ currencyFormat(item.final_price,item.currency) }}</span>
                <span class="line-through old-price ml-3">{{ currencyFormat(item.original_price,item.currency) }}</span>
              </div>
            </div>
          </div>
        </div>
      </vue-custom-scrollbar>
    </div>
  </template>

  <template v-else>
    <div class="flex mx-3 epic-container">
      <vue-custom-scrollbar  @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" class="mt-3 px-3" style="height: calc(100vh - 15.8em)">
         <div class="epic-item flex">
            <div v-for="item in epicList" class="epic-w s-bg flex rounded-lg flex-col mb-3 mr-3">
              <div class="height:272px;">
                <img  :src="item.keyImages.url"  class="w-full h-full rounded-lg object-cover"  alt="">
              </div>
              <div class="flex flex-col ">
                <span  class="mb-2 pointer px-3 my-2" style="font-size: 18px;font-weight: 500;color: rgba(255, 255, 255, 0.85);">
                  {{ item.el.title === 'Mystery Game' ? '神秘游戏' : item.el.title }}
                </span>
                <div v-if="item.el.promotions !== null" class="px-3 mb-3">
                  <div v-if="item.el.promotions.promotionalOffers.length !== 0" class="flex item-center">
                    <span class="px-2 py-1 mr-2 rounded-md free-font">现在免费</span>
                    <span class="py-1">截止时间: {{ deadline(item.el.promotions.promotionalOffers[0].promotionalOffers[0].endDate) }}</span>
                  </div>
                  <div v-if="item.el.promotions.upcomingPromotionalOffers.length !== 0" class="flex item-center">
                    <span class="px-1  mr-2 rounded-md next-notice">下周预告</span>
                    <span class="py-1">开始时间: {{ deadline(item.el.promotions.upcomingPromotionalOffers[0].promotionalOffers[0].startDate) }}</span>
                  </div>
                </div>
              </div>
            </div>
         </div>
      </vue-custom-scrollbar>
    </div>
  </template>

  <router-view></router-view>
  <HorizontalDrawer :drawerTitle="drawerTitle" :rightSelect="rightSelect" ref="regionDrawer" @getArea="getArea"></HorizontalDrawer>
</template>

<script>
import { sendRequest,regionRange,remainderDay,currencyFormat } from '../../js/axios/api';
import HorizontalPanel from '../../components/HorizontalPanel.vue';
import HorizontalDrawer from '../../components/HorizontalDrawer.vue';
import browser from '../../js/common/browser'
export default {
  name: "GameDiscount",
  components:{
    HorizontalPanel,
    HorizontalDrawer
  },
  data(){
    return{
      leftTitle:[{title:'Steam折扣',name:'steam'},{title:'Epic喜加一',name:'epic'}],
      leftTitleType:{title:'Steam折扣',name:'steam'},
      rightSelect:regionRange,
      defaultGameValue:{
        name:'国区',
        id:'cn',
        defaultLocale:'zh-CN',
      },
      defaultGameIndex:0,
      discountDisplay:false, // 控制右侧抽屉显示
      steamList:[],
      epicList:[],
      isLoading:false,
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      drawerTitle:'地区'
    }
  },
  mounted(){
    this.getSteamDataList()
    this.getEpicData()
  },
  methods:{
    remainderDay,
    currencyFormat,
    // 打开右侧抽屉事件
    openRightDrawer(){
       this.$refs.regionDrawer.openDrawer()
    },
    // 打开右侧抽屉区服选中事件
    getArea(v){
      this.defaultGameValue = v
      this.getSelectCCData(v.id)
    },

    // 进入详情
    enterDiscountDetail(val){
      this.$router.push({name:'GameDiscountDetail',params:{id:val}})
    },

    // 获取默认的加载数据
    getSteamDataList(){
      if(!this.isLoading){
        this.isLoading = true
        setTimeout(()=>{
          sendRequest(`https://store.steampowered.com/api/featuredcategories/?cc=${this.defaultGameValue.id}&l=${this.defaultGameValue.id}`,{},{
            localCache:true,
            localTtl:60*12*60
          }).then(res=>{
            const listData = res.data.specials.items
            this.steamList = listData
          }).finally(()=>{
            this.$nextTick(()=>{
              this.isLoading = false
            })
          })
        },0)
      }
    },

    // 根据不同区服切换数据
    getSelectCCData(v){
      this.steamList = []
      if(!this.isLoading){
        this.isLoading = true
        setTimeout(()=>{
          sendRequest(`https://store.steampowered.com/api/featuredcategories/?cc=${v}&l=${v}`,{},{
            localCache:true,
            localTtl:60*12*60
          }).then(res=>{
            const listData = res.data.specials.items
            this.steamList = listData
          }).finally(()=>{
            this.$nextTick(()=>{
              this.isLoading = false
            })
          })
        },1000)
      }
    },

    // 根据区服获取epic数据
    getEpicData(){
      sendRequest(`https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions?locale=${this.defaultGameValue.defaultLocale}&country=${this.defaultGameValue.id.toLocaleUpperCase()}&allowCountries=${this.defaultGameValue.id.toLocaleUpperCase()}`,{},{
        localCache:true,
        localTtl:60*12*60
      }).then(res=>{
        const result = res.data.data.Catalog.searchStore.elements
        const resultArr = []
        result.forEach(el=>{
          if(el.price.totalPrice.discountPrice === 0){
            // 取出epic图片
            const fIndex = el.keyImages.findIndex(keyImg=>{
              return keyImg.type === 'OfferImageWide'
            })
            if(fIndex !== -1){
             resultArr.push({
              el,
              keyImages:el.keyImages[fIndex]
             })
            }else{
              resultArr.push({
              el,
              keyImages:el.keyImages[0]
             })
            }
          }
        })
        this.epicList  = resultArr
      })
    },
    openEpicStore(){
      browser.openInUserSelect(`https://store.epicgames.com/zh-CN`)
    },

    deadline(value){
      const date = new Date( typeof value === 'string' ?  `${value}`: parseInt(value) * 1000);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const ampm = hour >= 12 ? '下午' : '上午'; // 判断上午或下午
      const formattedDate = `${month}月${day}日 ${ampm} ${hour % 12}:${minute.toString().padStart(2, '0')}`;
      return formattedDate
    }
  },
}
</script>

<style lang="scss" scoped>
.active{
  background:rgba(33, 33, 33, 1);
  border-radius: 10px;
}
.content-introduction{
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre-wrap;
  margin-bottom: 5px;
}
.reset-day{
  padding: 5px 14px;
  background: rgba(255, 77, 79, 1);
  color: rgba(255, 255, 255, 0.85);
  font-size: 16px;
  font-weight: 600;
}
::v-deep .ps__thumb-y{
  display: none !important;
}
.area-name{
  padding-top: 9px;
  padding-bottom: 9px;
}
.right-select-active:active{
  filter: brightness(0.8);
  background:rgba(42, 42, 42, 0.25);
}
.btn-active{
  filter: brightness(0.8);
  background:rgba(42, 42, 42, 0.25);
}

.free-font{
  background: #508BFE;
  font-size: 16px;
  color: rgba(255,255,255,0.85);
  font-weight: 600;
}
.next-notice{
  font-size: 16px;
  color: rgba(255,255,255,0.85);
  font-weight: 600;
}

.old-price{
  font-size: 14px;
  color: rgba(255,255,255,0.40);
  font-weight: 400;
}
.final-price{
  font-family: Oswald-SemiBold;
  font-size: 18px;
  color: #FF4D4F;
  font-weight: 600;
}

.percent{
  background: #FF4D4F;
  font-family: Oswald-Bold;
  font-size: 16px;
  color: rgba(255,255,255,0.85);
  font-weight: 700;
}
.epic-w{
  max-width: 484px;
}

.epic-sh{
  height: 112px !important;
}

.steam-mw{
  max-width: 484px;
}

.steam-sw-item{
  flex: 1;
  width: 1000px;
}



@media screen and (max-width: 840px){
  .epic-container{
    align-items: center !important;
    justify-content: center !important;
    .epic-item{
      flex-direction: column !important;
    }
    .steam-sw{
      max-width: 484px !important;
    }
    .steam-item{
      flex-direction: column !important;
    }
    .epic-sh{
      height: 228px !important;
    }
    .steam-sw-item{
      width: 484px !important;
      flex-direction: column !important;
    }
  }
}

/*
@media screen and (min-width: 840px) and (max-width: 1140px){
  .epic-w{
    margin-right: 12px !important;
  }
  .epic-container{
    align-items: center !important;
    justify-content: center !important;
  }
}
*/

</style>
