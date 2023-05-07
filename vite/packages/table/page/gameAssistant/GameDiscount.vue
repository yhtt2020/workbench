<template>
  <div class="flex justify-between h-12 items-center" style="margin-right: 30px;">
    <HorizontalPanel :navList="leftTitle" v-model:selectType="leftTitleType"></HorizontalPanel>
    <a-select style="border: 1px solid rgba(255, 255, 255, 0.1);"
              @change="selectOptionValue($event)"    class="w-56 h-auto rounded-xl  text-xs s-item" size="large" :bordered="false" v-model:value="defaultGameValue">
      <a-select-option v-for="item in rightSelect" :value="item.id">{{item.name}}</a-select-option>
    </a-select>
  </div>
  <template v-if="leftTitleType.name === 'steam' ">
    <div class="flex  items-center justify-center">
      <vue-custom-scrollbar  :settings="settingsScroller" style="height: calc(100vh - 15.8em)">
         <a-spin v-if="isLoading === true" style="margin-top: 2em;"></a-spin>
         <div  class="w-full flex justify-start flex-col">
            <div v-for="item in steamList" @click="enterDiscountDetail(item)" class="flex items-center s-bg cursor-pointer mt-3  flex-row  rounded-lg p-3" style="width: 98%;">
              <div style="width: 269px;height: 120px;" class="mr-3">
                <img :src="item.image" alt="" class="rounded-md"  style="width:100%;height: 100%;object-fit: cover;box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.3);">
              </div>
              <div class="flex flex-col" style="width: 80%;">
                  <span class="mb-2" style="font-size: 18px;font-weight: 500;color: rgba(255, 255, 255, 0.85);">{{item.name}}</span>
                  <span class="content-introduction" style="margin-bottom: 7px;font-size: 16px;font-weight: 400;">{{item.brief}}</span>
                  <div class="flex items-center">
                     <span class="flex justify-center mr-3 rounded-lg items-center" style=" padding: 5px 14px; background: rgba(255, 77, 79, 1);color: rgba(255, 255, 255, 0.85);">-{{ item.percent }} %</span>
                     <span class="mr-3" style="color:rgba(255, 77, 79, 1);font-size: 18px;font-weight: 500;">{{ item.newPrice }}</span>
                     <span class="line-through " style="font-size: 14px;font-weight: 400;">{{ item.oldPrice }}</span>
                  </div>
              </div>
            </div>
         </div>
      </vue-custom-scrollbar>
    </div>
  </template>
  <template v-else>
    <div class="flex items-center justify-center">
        <vue-custom-scrollbar  :settings="settingsScroller" style="height: calc(100vh - 15.8em)">
          <div  class="w-full flex justify-start flex-col">
            <!-- @click="enterDiscountDetail(item)" -->
            <div v-for="item in epicList"  class="flex items-center s-bg cursor-pointer mt-3  flex-row  rounded-lg p-3" style="width: 98%;">
              <div style="width: 269px;height: 120px;" class="mr-3">
                <img :src="item.keyImages.url" alt="" class="rounded-md"  style="width:100%;height: 100%;object-fit: cover;box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.3);">
              </div>
              <div class="flex flex-col" style="width: 80%;">
                <div>
                  <span class="mb-2" style="font-size: 18px;font-weight: 500;color: rgba(255, 255, 255, 0.85);">
                    {{ item.el.title }}
                  </span>
                  <span class="ml-4 s-bg px-2 py-1 rounded-lg" style="font-size: 14px;font-weight: 500;color: rgba(255, 255, 255, 0.85);">
                     {{ item.el.offerType }}
                  </span>
                </div>
                <span class="content-introduction" style="margin-bottom: 7px;font-size: 16px;font-weight: 400;">
                  {{ item.el.description }}
                </span>
                <div class="flex items-center">
                  <span v-if="item.el.promotions !== null" class="flex justify-center mr-3 rounded-lg items-center" style=" padding: 5px 14px; background: rgba(255, 77, 79, 1);color: rgba(255, 255, 255, 0.85);">
                    -{{ item.el.promotions.promotionalOffers.length === 0 ? item.el.promotions.upcomingPromotionalOffers[0].promotionalOffers[0].discountSetting.discountPercentage : item.el.promotions.promotionalOffers[0].promotionalOffers[0].discountSetting.discountPercentage }} %
                  </span>
                  <span class="mr-3" style="color:rgba(255, 77, 79, 1);font-size: 18px;font-weight: 500;">
                    {{ item.el.price.totalPrice.fmtPrice.intermediatePrice }}
                  </span>
                  <span class="line-through " style="font-size: 14px;font-weight: 400;">{{ item.el.price.totalPrice.fmtPrice.originalPrice }}</span>
               </div>
              </div>
            </div>
          </div>
        </vue-custom-scrollbar>
     </div>
  </template>
  <router-view></router-view>
</template>

<script>
import { sendRequest,regionRange } from '../../js/axios/api';
import HorizontalPanel from '../../components/HorizontalPanel.vue';
export default {
  name: "GameDiscount",
  components:{
    HorizontalPanel
  },
  data(){
    return{
      leftTitle:[{title:'Steam折扣',name:'steam'},{title:'Epic喜加一',name:'epic'}],
      leftTitleType:{title:'Steam折扣',name:'steam'},
      rightSelect:regionRange,
      defaultGameValue:'cn',
      defaultLocale:'zh-CN',
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
    }
  },
  mounted(){
    this.getSteamDataList()
    this.getEpicData(this.defaultLocale)
  },
  methods:{
    // 获取默认的加载数据
    getSteamDataList(){
      if(!this.isLoading){
        this.isLoading = true
        setTimeout(()=>{
          sendRequest(`https://store.steampowered.com/api/featuredcategories/?cc=${this.defaultGameValue}&l=${this.defaultGameValue}`,3).then(res=>{
            const listData = res.data.specials.items
            listData.map(el=>{
              sendRequest(`https://store.steampowered.com/api/appdetails?appids=${el.id}&cc=${this.defaultGameValue}&l=${this.defaultGameValue}`,3).then(res=>{
                const data = res.data[el.id].data
                this.steamList.push({
                  id:el.id,
                  image:data.header_image,
                  name:data.name,
                  brief:data.short_description,
                  newPrice:data.price_overview.final_formatted,
                  oldPrice:data.price_overview.initial_formatted,
                  percent:data.price_overview.discount_percent,
                  data:data
                })
              }).finally(()=>{
                this.$nextTick(()=>{
                 this.isLoading = false
                })
              })
            })
          })
        },0)
      }
    },
    // 标题切换
    changTitle(v){
      this.titleIndex = v
    },
    // 区服切换
    selectOptionValue(e){
      this.defaultGameValue = e
      const found = this.rightSelect.find(el=>{
        return el.id === e
      })
      this.getSelectCCData(e)
      this.getEpicData(found.locale)
    },
    // 根据不同区服切换数据
    getSelectCCData(v){
      this.steamList = []
      if(!this.isLoading){
        this.isLoading = true
        setTimeout(()=>{
          sendRequest(`https://store.steampowered.com/api/featuredcategories/?cc=${v}&l=${v}`,3).then(res=>{
            const listData = res.data.specials.items
            listData.map(el=>{
              sendRequest(`https://store.steampowered.com/api/appdetails?appids=${el.id}&cc=${this.defaultGameValue}&l=${this.defaultGameValue}`,3).then(res=>{
                const data = res.data[el.id].data
                if(data !== undefined){
                  this.steamList.push({
                   id:data.steam_appid,
                   image:data.header_image,
                   name:data.name,
                   brief:data.short_description,
                   newPrice:data.price_overview.final_formatted,
                   oldPrice:data.price_overview.initial_formatted,
                   percent:data.price_overview.discount_percent,
                   data:data
                  })
                }
              }).finally(()=>{
                this.$nextTick(()=>{
                 this.isLoading = false
                })
              })
            })
          })
        },2000)
      }
    },
    // 进入详情
    enterDiscountDetail(val){
      this.$router.push({name:'GameDiscountDetail',params:{id:val.data.steam_appid}})
    },

    // 根据区服获取epic数据
    getEpicData(){
      sendRequest(`https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions?locale=${this.defaultLocale}&country=${this.defaultGameValue.toLocaleUpperCase()}&allowCountries=${this.defaultGameValue.toLocaleUpperCase()}`,3).then(res=>{
         const result = res.data.data.Catalog.searchStore.elements
         const resultArr = []
         result.forEach(el=>{
            // 取出epic图片
            const fIndex = el.keyImages.find(keyImg=>{
              return keyImg.type === 'OfferImageWide'
            })
            resultArr.push({
              el,
              keyImages:fIndex
            })
         })
         this.epicList  = resultArr
        })
    },
  }
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
</style>
<style>
/*.ant-select .ant-select-selector{*/
/*  border-radius: 6px !important;*/
/*  border:none !important;*/
/*  background: rgba(42, 42, 42, 1) !important;*/
/*}*/
</style>
