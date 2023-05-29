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
            <div @click="enterDiscountDetail(item)" class="pointer flex-none mr-3" style="width: 258px;height: 120px;">
              <img :src="item.image" alt="" class="rounded-md"  style="width:100%;height: 100%;object-fit: cover;box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.3);">
            </div>
            <div class="flex-grow" >
              <div class="flex flex-col">
                <span @click="enterDiscountDetail(item)" class="mb-2 pointer" style="font-size: 18px;font-weight: 500;color: rgba(255, 255, 255, 0.85);">{{item.name}}</span>
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
      <vue-custom-scrollbar @touchstart.stop @touchmove.stop @touchend.stop  :settings="settingsScroller"  style="height: calc(100vh - 15.8em);padding-right: 5px;padding-left: 1em" class="pt-3 mr-3">
       <div class="flex flex-row flex-wrap -ml-3 ">
        <div class="pb-3 pl-3 game-list-local flex-shrink-0 my-game-content" v-for="(item) in epicList" @click="openEpicStore">
         <div class="s-bg h-full pointer w-full rounded-lg">
          <div class="relative    mx-auto " style="height: 272px;width: 484px;">
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
      browser.openInUserSelect(`https://store.epicgames.com/zh-CN`)
    },

    deadline(value){
      const date = new Date(`${value}`);
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

</style>
