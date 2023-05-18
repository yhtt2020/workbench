<template>
  <div class="mx-7 flex flex-col">
    <div class="flex justify-between h-12 items-center">
      <HorizontalPanel :navList="leftTitle" v-model:selectType="leftTitleType"></HorizontalPanel>
      <span class="px-10 right-select-active s-bg rounded-lg area-name pointer" @click="openRightDrawer" v-if="leftTitleType.name === 'steam' ">地区: {{defaultGameValue.name}}</span>
    </div>
  </div>
  <template v-if="leftTitleType.name === 'steam' ">
    <div class="flex  items-center justify-center mx-7">
      <vue-custom-scrollbar  @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" style="height: calc(100vh - 15.8em)">
         <a-spin v-if="isLoading === true" style="margin-top: 2em;"></a-spin>
         <div  class="w-full flex justify-start flex-col">
          <div v-for="item in steamList" class="flex items-center s-bg  mt-3  flex-row  rounded-lg p-3" style="width: 100%;">
            <div class="flex-none mr-3" style="width: 258px;height: 120px;">
              <img :src="item.image" alt="" class="rounded-md"  style="width:100%;height: 100%;object-fit: cover;box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.3);">
            </div>
            <div class="flex-grow" >
              <div class="flex flex-col">
                <span class="mb-2" style="font-size: 18px;font-weight: 500;color: rgba(255, 255, 255, 0.85);">{{item.name}}</span>
                <span class="content-introduction" style="margin-bottom: 7px;font-size: 16px;font-weight: 400;">{{item.brief}}</span>
                <div class="flex items-center">
                   <span class="flex justify-center mr-3 rounded-lg items-center" style=" padding: 5px 14px; background: rgba(255, 77, 79, 1);color: rgba(255, 255, 255, 0.85);">-{{ item.percent }} %</span>
                   <span class="mr-3" style="color:rgba(255, 77, 79, 1);font-size: 18px;font-weight: 500;">{{ item.newPrice }}</span>
                   <span class="line-through " style="font-size: 14px;font-weight: 400;">{{ item.oldPrice }}</span>
                </div>
              </div>
            </div>
            <div class="flex-none btn-active ml-4 h-12 py-3 pointer px-8 s-bg rounded-md" style="font-size: 16px;color: rgba(255,255,255,0.85);font-weight: 400;" @click="enterDiscountDetail(item)" >
              查看详情
            </div>
          </div>
         </div>
      </vue-custom-scrollbar>
    </div>
  </template>
  <template v-else>
    <div class="flex mx-7">
        <vue-custom-scrollbar  @touchstart.stop @touchmove.stop @touchend.stop  :settings="settingsScroller" style="height: calc(100vh - 15.8em)">
          <div  class="w-full flex justify-start flex-col">
            <div v-for="item in epicList"  class="flex items-center s-bg cursor-pointer mt-3  flex-row  rounded-lg p-3" style="width: 100%;">
              <div class="flex-none mr-3" style="width: 258px;height: 120px;">
                <img :src="item.keyImages.url" alt="" class="rounded-md"  style="width:100%;height: 100%;object-fit: cover;box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.3);">
              </div>
              <div class="flex-grow" >
                <div class="flex flex-col">
                  <div>
                    <span class="mb-2" style="font-size: 18px;font-weight: 500;color: rgba(255, 255, 255, 0.85);">
                      {{ item.el.title }}
                    </span>
                    <span v-if="item.el.offerType === 'DLC'" class="ml-4 s-bg px-2 py-1 rounded-lg" style="font-size: 14px;font-weight: 500;color: rgba(255, 255, 255, 0.85);">
                       {{ item.el.offerType }}
                    </span>
                  </div>
                  <span class="content-introduction" style="margin-bottom: 7px;font-size: 16px;font-weight: 400;">
                    {{ item.el.description }}
                  </span>
                  <div class="flex items-center">
                    <template v-if="item.el.promotions !== null">
                      <span v-if="item.el.promotions.promotionalOffers.length !== 0" class="flex justify-center mr-3 reset-day rounded-lg items-center" >
                        剩余{{ remainderDay(item.el.promotions.promotionalOffers[0].promotionalOffers[0].endDate) }}天
                      </span>
                      <span v-else class="mr-3 rounded-lg px-4 py-1 s-bg" style="font-size: 16px; font-weight: 600;">
                        下周预告
                      </span>
                    </template>
                    <span class="mr-3" style="color:rgba(255, 77, 79, 1);font-size: 18px;font-weight: 600;">
                      {{ item.el.price.totalPrice.fmtPrice.intermediatePrice ==='0' ? '免费领取' : item.el.price.totalPrice.fmtPrice.intermediatePrice }}
                    </span>
                    <span class="line-through " style="font-size: 14px;font-weight: 400;">{{ item.el.price.totalPrice.fmtPrice.originalPrice }}</span>
                 </div>
                </div>
              </div>
              <div class="flex-none btn-active ml-4 h-12 py-3 pointer px-8 s-bg rounded-md" style="font-size: 16px;color: rgba(255,255,255,0.85);font-weight: 400;" 
                @click="openEpicStore"
              >
                打开epic商城
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
import { sendRequest,regionRange,remainderDay } from '../../js/axios/api';
import HorizontalPanel from '../../components/HorizontalPanel.vue';
import HorizontalDrawer from '../../components/HorizontalDrawer.vue';
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
      this.$router.push({name:'GameDiscountDetail',params:{id:val.data.steam_appid,exTime:val.expirationTime}})
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
            listData.map(el=>{
              sendRequest(`https://store.steampowered.com/api/appdetails?appids=${el.id}&cc=${this.defaultGameValue.id}&l=${this.defaultGameValue.id}`,{},{
                localCache:true,
                localTtl:60*12*60
              }).then(res=>{
                const data = res.data[el.id].data
                if(data !== undefined){
                  this.steamList.push({
                   id:el.id,
                   image:data.header_image,
                   name:data.name,
                   brief:data.short_description,
                   newPrice:data.price_overview.final_formatted,
                   oldPrice:data.price_overview.initial_formatted,
                   percent:data.price_overview.discount_percent,
                   data:data,
                   expirationTime:el.discount_expiration
                  })
                }
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
            listData.map(el=>{
              sendRequest(`https://store.steampowered.com/api/appdetails?appids=${el.id}&cc=${v}&l=${v}`,{},{
                localCache:true,
                localTtl:60*12*60
              }).then(res=>{
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
                   data:data,
                   expirationTime:el.discount_expiration
                  })
                }
              }).finally(()=>{
                this.$nextTick(()=>{
                 this.isLoading = false
                })
              })
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
      window.ipc.send('addTab',{url:'https://store.epicgames.com/zh-CN/'})
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

</style>
