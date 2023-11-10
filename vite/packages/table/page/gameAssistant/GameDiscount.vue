<template>
  <div class="mx-7 pt-3.5 flex flex-col">
    <!-- 顶部tab切换 -->
    <div class="flex justify-between h-12 items-center mb-4">
      <HorizontalPanel :navList="leftTitle" v-model:selectType="leftTitleType"></HorizontalPanel>
      <div class="rounded-lg button-active p-3 place-name pointer" @click="openRightDrawer" v-if="leftTitleType.name === 'steam' ">地区: {{placeName.name}}</div>
    </div>

    <template v-if="leftTitleType.name === 'steam' ">
      <a-spin v-if="isLoading === true" />
      <vue-custom-scrollbar v-else  @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" class="mt-3 px-3" style="height: calc(100vh - 16.5em)">
        <div class="steam-top-content w-full mb-4" >
          <div v-for="item in steamList.slice(0,2)" @click="enterDiscountDetail(item)"
           class="steam-top-item rounded-lg flex pointer flex-col discount-bg"
          >
            <img :src="item.header_image" alt="" class="rounded-t-lg"  style="width:100%;height: 100%;object-fit: cover;">
            <div class="p-2.5 name-text">{{item.name}}</div>
            <div class="px-2.5 mb-3" style="color: var(--secondary-text);">优惠截止时间: {{ deadline(item.discount_expiration) }}</div>
            <div class="px-2.5 flex  items-center mb-3">
              <span class="percent px-1 rounded-md">-{{item.discount_percent}}%</span>
              <span class="final-price ml-3">{{ currencyFormat(item.final_price,item.currency) }}</span>
              <span class="line-through old-price ml-3">{{ currencyFormat(item.original_price,item.currency) }}</span>
            </div>
          </div>
        </div>
        <div class="steam-bottom-content">
          <div v-for="item in steamList.slice(2)" @click="enterDiscountDetail(item)"
           class="steam-bottom-item discount-bg pointer rounded-lg flex flex-col mr-2"
          >
            <img :src="item.header_image" alt="" class="rounded-t-lg mb-3"  style="width:100%;height: 100%;object-fit: cover;">
            <div class="px-3 flex  items-center mb-3">
              <span class="percent-bottom px-1 rounded-md">-{{item.discount_percent}}%</span>
              <span class="final-price ml-2">{{ currencyFormat(item.final_price,item.currency) }}</span>
              <span class="line-through old-price ml-2">{{ currencyFormat(item.original_price,item.currency) }}</span>
            </div>
          </div>
        </div>
      </vue-custom-scrollbar>
    </template>

    <template v-else>
      <vue-custom-scrollbar  @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller"  style="height: calc(100vh - 15.8em)">
        <div class="flex epic-container">
          <div v-for="item in epicList" @click="openEpicStore(item)" class="mr-4 mb-4 discount-bg pointer flex flex-col rounded-lg">
            <div class="epic-image">
              <img  :src="getSpecifiedPicture(item.keyImages).url"  class="w-full h-full rounded-t-lg object-cover"  alt="">
            </div>
            <div class="p-3 name-text epic-title truncate">{{ item.title === 'Mystery Game' ? '神秘游戏' : item.title }}</div>
            <div class="p-3">
              <div v-if="item.promotions.promotionalOffers.length !== 0" class="flex item-center">
                <span class="p-2 py-1 mr-2 rounded-md free-font">现在免费</span>
                <span class="py-1 time-text">截止时间: {{ deadline(item.promotions.promotionalOffers[0].promotionalOffers[0].endDate) }}</span>
              </div>
              <div v-if="item.promotions.upcomingPromotionalOffers.length !== 0" class="flex item-center">
                <span class="p-1  mr-2 rounded-md next-notice">下周预告</span>
                <span class="py-1 time-text" >开始时间: {{ deadline(item.promotions.upcomingPromotionalOffers[0].promotionalOffers[0].startDate) }}</span>
              </div>
            </div>
          </div>
        </div>
      </vue-custom-scrollbar>
    </template>
  </div>

  <router-view></router-view>
  <HorizontalDrawer :drawerTitle="drawerTitle" :rightSelect="rightSelect" ref="regionDrawer" @getArea="getArea"></HorizontalDrawer>
</template>

<script>
import { sendRequest,regionRange,currencyFormat } from '../../js/axios/api';
// remainderDay,
import HorizontalPanel from '../../components/HorizontalPanel.vue';
import HorizontalDrawer from '../../components/HorizontalDrawer.vue';
import browser from '../../js/common/browser'
import _ from 'lodash-es'
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
      placeName:{
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
    this.getSteamData(this.placeName.id)
    this.getEpicData()
  },
  methods:{
    // remainderDay,
    currencyFormat,
    // 打开右侧抽屉事件
    openRightDrawer(){
       this.$refs.regionDrawer.openDrawer()
    },
    // 打开右侧抽屉区服选中事件
    getArea(v){
      this.placeName = v
      this.getSteamData(v.id)
    },
    // 进入详情
    enterDiscountDetail(val){
      if(val.type === 1){  //  解决steam折扣列表，type1 组合包问题
        const storeUrl = `https://store.steampowered.com/sub/${val.id}/`
        browser.openInInner(storeUrl)
      }else{
        this.$router.push({name:'GameDiscountDetail',params:{id:val.id,exTime:val.discount_expiration}})
      }
    },

    // 获取特惠数据
    getSteamData(v){
      if(!this.isLoading){
        this.isLoading = true
        const url = `https://store.steampowered.com/api/featuredcategories/?cc=${v}&l=${v}`
        sendRequest(url,{},{localCache:true, localTtl:60*12*60}).then((result)=>{
          const listData = result.data.specials.items
          this.steamList = listData
        }).finally(()=>{
          this.$nextTick(()=>{
            this.isLoading = false
          })
        })
      }
    },

    // 获取epic数据
    async getEpicData(){
      const url = 'https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions?'
      const locale = `locale=${this.placeName.defaultLocale}&`
      const country = `country=${this.placeName.id.toLocaleUpperCase()}&`
      const allowCountries =  `allowCountries=${this.placeName.id.toLocaleUpperCase()}`
      const allUrl = url + locale + country + allowCountries
      const data = await sendRequest(allUrl, {},{localCache:true, localTtl:60*12*60})
      const result = data.data.data.Catalog.searchStore.elements
      const noResultNull = _.filter(result, function(o) { return o.promotions !== null });
      this.epicList = noResultNull
    },

    openEpicStore(v){
      if(v.urlSlug !== null){
        browser.openInInner(`https://store.epicgames.com/zh-CN/p/${v.urlSlug}`)
      }else{
        browser.openInInner(`https://store.epicgames.com/zh-CN`)
      }
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
    },

    // 获取指定需要的图片
    getSpecifiedPicture(arr){
      const newArr = _.filter(arr, function(o) {
        return o.type === 'OfferImageWide'
      })
      return newArr[0]
    },
  }
}
</script>

<style lang="scss" scoped>
.place-name{
  background: var(--primary-bg);
  color: var(--primary-text);
}
.name-text{
  font-family: PingFangSC-Semibold;
  font-size: 18px;
  color:var(--primary-text);
  font-weight: 600;
}
.discount-bg{
  background: var(--primary-bg);
}

//steam特惠内容区域
.steam-top-content{
  display: flex;
  align-items: center;
  justify-content: center;
}
.steam-bottom-content{
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

.steam-top-item{
  max-width: 484px;
  margin-right: 12px;
}
.steam-bottom-item{
  max-width: 236px;
}

.old-price{
  font-family: Oswald ;
  font-size: 12px;
  color:var(--disable-text);
  font-weight: 400;
}
.final-price{
  font-family: Oswald ;
  font-size: 14px;
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
.percent-bottom{
  background: #FF4D4F;
  font-family: Oswald-Bold;
  font-size: 16px;
  color: rgba(255,255,255,0.85);
  font-weight: 700;
  max-width: 80px;
}

// epic区域
.epic-image{
  max-width: 484px;
}
.free-font{
  background: #508BFE;
  font-size: 16px;
  color:var(--active-text);
  font-weight: 600;
}
.next-notice{
  font-size: 16px;
  color:var( --primary-text);
  font-weight: 600;
  background: var(--primary-bg);
}

.time-text{

  font-size: 14px;
  color:var(--secondary-text);
  font-weight: 400;
}

// 点击状态
.button-active{
  &:active{
   filter: brightness(0.8);
   opacity: 0.8;
  }
  &:hover{
    opacity: 0.8;
  }
}

:deep(.nav-item){
  border-radius: 6px !important;
}



@media screen and (max-width:840px) {
  .steam-top-content{
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-direction: column !important;
    margin-bottom: 0 !important;
  }
  .steam-bottom-content{
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-direction: column !important;
  }
  .steam-top-item{
    margin-bottom: 16px !important;
    margin-right: 0 !important;
  }
  .steam-bottom-item{
    max-width: 484px !important;
    margin-bottom: 16px;
    margin-right: 0 !important;
  }

  .epic-container{
    display: flex !important;
    flex-direction: column !important;
  }
}

@media screen and (min-width:841px)  and (max-width:1074px) {
  .steam-bottom-item{
    width: calc(100% / 1);
    margin-bottom: 16px !important;
  }
  .steam-bottom-content{
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  .epic-container{
    display: flex !important;
    flex-wrap: wrap !important;
    align-items: center !important;
    justify-content: center !important;
  }
  .steam-top-item{
    width: calc(100% / 1);
  }
}

@media screen and (min-width:1075px)  and (max-width:1140px){
  .steam-bottom-item{
    width: calc(100% / 2);
    margin-bottom: 16px !important;
  }
  .steam-bottom-content{
    display: flex !important;
  }
  .epic-container{
    display: flex !important;
    flex-wrap: wrap !important;
    align-items: center !important;
    justify-content: center !important;
  }
  .steam-top-item{
    width: calc(100% / 1);
  }
}

@media screen and (min-width:1141px) and (max-width: 1380px){
  .steam-bottom-item{
    width: calc(100% / 3);
    margin-bottom: 16px !important;
  }
  .steam-bottom-content{
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  .epic-container{
    display: flex !important;
    flex-wrap: wrap !important;
  }
  .steam-top-item{
    width: calc(100% / 1);
  }
}
@media screen and (min-width:1381px) and (max-width: 1512px){
  .steam-bottom-item{
    width: calc(100% / 4.5);
    margin-bottom: 16px !important;
  }
  .steam-bottom-content{
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-wrap: wrap !important;
  }
  .steam-top-item{
    width: calc(100% / 1);
  }
}

@media screen and (min-width:1512px){
  .steam-bottom-content{
    width: 1000px !important;
    margin: 0 auto ;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }
  .steam-bottom-item{
    margin-bottom: 16px !important;
    width: calc(100% / 1);
  }
  .steam-top-item{
    width: calc(100% / 1);
  }
  .steam-top-item{
    width: calc(100% / 1);
  }
}

::v-deep .ps__thumb-y{
  display: none !important;
}
</style>
