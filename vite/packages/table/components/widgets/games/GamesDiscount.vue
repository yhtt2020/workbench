<template>
  <Widget :options="options" :confirmCCData="confirmCCData" :customIndex="customIndex"
                     :customData="customData" :menuList="gameBare" ref="gameSlot" :desk="desk">
    <template #left-title-icon>
        <div
          class="icon"
          style=" width: 38px;height: 24px; display: flex;justify-content: center;align-items: center;position: absolute;
            left: 2px; ">
          <newIcon icon="mdi:steam" style="font-size: 24px;" />
        </div>
      </template>
    <div class="px-3 py-1 rounded-lg bg-mask pointer xt-bg-2" @click="showRegionSelect"
         style="position: absolute;left: 45px;top:10px;color:var(--primary-text)">{{ region.name }}
    </div>
    <a-spin v-if="isLoading === true"
            style="display: flex; justify-content: center; align-items:center;margin-top: 60%"></a-spin>
    <template v-else-if="fail">
      <a-result :status="null" title="请确认网络" style="margin-top: 3em">
        <template #extra>
          <a-button key="console" type="primary" @click="retry" style="background: var(--primary-bg);color:var(--primary-text)">重试</a-button>
        </template>
      </a-result>

    </template>
    <template v-else>
      <template v-if="gameShow ===false">

        <div class="flex flex-col discount-item" style="margin-top: 1em;">
          <div class="flex flex-col ">
            <div class="flex w-full rounded-md cursor-pointer" @click="enterDetail(item,customData.id)"
                 v-for="item in list" style="position:relative;height:65px; margin-bottom: 12px;overflow: hidden">
              <img :src="item.header_image" alt="" class="rounded-md "
                   style="width:140px;height:65px; object-fit: cover;">
              <div class="flex flex-col discount-content" style="margin-left: 10px; width: 104px;">
                <div class="truncate name" style="width: 100%; margin-bottom: 10px;color: var(--primary-text);">{{ item.name }}</div>
                <span class="text-white line-through price-font text-opacity-60" style="font-size: 10px;color: var(--secondary-text);">
                {{ currencyFormat(item.original_price, item.currency) }}
              </span>
                <div class="flex justify-between w-full ">
                <span style="color:rgba(255, 77, 79, 1); line-height: 21px; font-size: 16px;font-weight: 500;">
                 {{ currencyFormat(item.final_price, item.currency) }}
                </span>

                </div>
                <div
                  style="position: absolute;top:0;left:0;background-color: rgba(255, 77, 79,0.5);backdrop-filter: blur(8px);border-bottom-right-radius: 9px;">
                 <span style="font-family: oswald; padding: 3px 10px;font-size: 12px;color: var(--active-text);">
                   - {{ item.discount_percent }} %
                  </span>
                </div>
              </div>

            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex rounded-lg cursor-pointer s-item change xt-bg-2" @click="discountChange" style="padding:13px 41px;color:var(--primary-text)">
              <Icon icon="reload" class="animate-spin" style="font-size: 1.429em;" v-if="reloadShow === true"></Icon>
              <Icon icon="reload" style="font-size: 1.429em;" v-else></Icon>
              <span style="margin-left: 1em;">换一换</span>
            </div>
            <span style="padding:13px 26px;" class="rounded-lg s-item change pointer xt-bg-2" @click="enterDiscountDetail">更多</span>
          </div>
        </div>
      </template>
      <template v-else-if="gameShow === true">
        <div class="flex flex-col flex-grow" style="margin-top: 14px;" >
          <div class="rounded-lg detail-image" style="margin-bottom: 14px;">
            <img class="rounded-lg" :src="detailList.header_image" alt="">
          </div>
          <div class="truncate" style="margin-bottom: 6px; font-size: 18px;font-weight: 500;color: var(--primary-text);">{{ detailList.name }}</div>
          <span class="text-white content-introduction text-opacity-60" style="color: var(--secondary-text);">{{ detailList.short_description }}</span>
          <div class="flex" style="margin-bottom: 10px;">
          <span class="bg-white rounded-md discount-description bg-opacity-20 " style="color: var(--secondary-text);background: var(--secondary-bg);"
                v-for="item in detailList.genres">{{ item.description }}</span>
          </div>
          <span v-if="detailList.price_overview.initial_formatted" class="text-white line-through price-font text-opacity-60"
                style="font-size: 12px;color: var(--secondary-text);">
            {{ detailList.price_overview.initial_formatted }}
          </span>
          <div class="flex justify-between w-full " style="margin-bottom: 16px;">
            <span
              style="font-family: oswald; color:rgba(255, 77, 79, 1); line-height: 21px; font-size: 16px;font-weight: 500; padding-right: 2.41em;">
             {{ detailList.price_overview.final_formatted }}
            </span>
            <div class="flex justify-end">
              <span class="rounded-md" style="font-family: oswald; background:rgba(255, 77, 79, 1);color: var(--active-text); padding: 3px 10.23px;font-size: 12px;">
               -{{ detailList.price_overview.discount_percent }}%
              </span>
            </div>
          </div>
          <div class="flex items-center justify-around">
            <div @click="discountBack"
                 class="flex items-center justify-center w-12 h-12 rounded-lg cursor-pointer s-item change" style="color: var(--primary-text);background: var(--primary-bg);">
              <Icon icon="xiangzuo" style="font-size: 1.715em;color: var(--primary-text);"></Icon>
            </div>
            <span class="flex items-center justify-center rounded-lg change pointer s-item"
            style="padding:13px 30px;color: var(--primary-text);background: var(--primary-bg);"
             @click="enterGameDetail(detailList.steam_appid)"
            >
              详情
            </span>
            <span class="flex items-center justify-center rounded-lg change pointer s-item"
             style="padding:13px 30px;color: var(--primary-text);background: var(--primary-bg);"
             @click="openSteam(detailList.steam_appid)">购买</span>
          </div>
        </div>
      </template>
    </template>

  </Widget>

  <HorizontalDrawer :drawerTitle="drawerTitle" ref="regionDrawer" v-model:selectRegion="customData.id" :rightSelect="regionRange" @getArea="getArea"></HorizontalDrawer>
</template>

<script>
import Widget from '../../card/Widget.vue'
import HorizontalDrawer from '../../HorizontalDrawer.vue'
import { randomData, sendRequest, currencyFormat, compareTime } from '../../../js/axios/api'
import { mapWritableState, mapActions, mapState } from 'pinia'
import { steamStore } from '../../../store/steam'
import { cardStore } from '../../../store/card'
import Template from '../../../../user/pages/Template.vue'
import { regionRange } from '../../../js/axios/api'
import browser from '../../../js/common/browser'
import { Icon as newIcon} from '@iconify/vue'
export default {
  name: 'GamesDiscount',
  props: {
    customIndex: {
      type: Number,
      default: 0
    },
    customData: {
      type: Object,
      default: () => {
        return {
          id:0
        }
      }
    },
    desk:{
      type:Object
    }
  },
  components: {
    Template,
    Widget,
    HorizontalDrawer,
    newIcon
  },
  data () {
    return {
      fail:false,//失败
      options: {
        className: 'card',
        title: '',
        // icon: 'steam',
        type: 'games',
        epicShow: true
      },
      regionRange,
      defaultRegion: 'cn',
      randomList: [],
      key: Date.now(),
      reloadShow: false,
      drawerTitle:'地区',
      detailList: {},
      gameShow: false,
      isLoading: false,
      epicShow: false,
      gameBare: [{
        icon: 'shezhi1', title: '设置', fn: () => {
          this.$refs.regionDrawer.detailDisplay = true;
          this.$refs.gameSlot.visible = false
        }
      }]
    }
  },
  computed: {
    ...mapWritableState(steamStore, ['data', 'dataDetail']),
    ...mapWritableState(cardStore, ['customComponents']),
    region () {
      if (this.customData && this.customData.id) {
        let found = this.regionRange.find(re => {
          return re.id === this.customData.id
        })
        if (found) {
          return found
        }
      }
      return this.regionRange[0]

    },
    list () {
      if (this.key) {

      }
      if (this.data[this.region.id]) {
        return this.getRandomList(this.data[this.region.id].list)
      } else return []
    }
  },

  watch: {
    // data: {
    //   handler (newVal, oldVal) {
    //     console.log('检测到数据变化', newVal)
    //     if (Object.keys(newVal).length !== 0) {
    //       this.getData()
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  async mounted () {
    this.isLoading = true
    if (this.customData && this.customData.id) {
      this.defaultRegion = this.customData.id
    }


    this.getRegion().then(() => {

    })
  },
  methods: {
    ...mapActions(steamStore, ['setGameDetail', 'updateGameData', 'setGameData', 'getData','getRandomList']),
    ...mapActions(cardStore, ['updateCustomData']),
    currencyFormat,
    showRegionSelect () {
      this.$refs.regionDrawer.openDrawer()
    },
    retry(){
      this.getRegion().then(() => {
      }).catch(()=>this.fail=true).finally(()=>{
        this.isLoading = false
      })
    },

    // 点击切换
    discountChange () {
      this.reloadShow = true
      setTimeout(() => {
        this.key = Date.now()
        this.reloadShow = false
      }, 300)
    },
    // 点击进入详情
    enterDetail (item, cc) {
      this.gameShow = true
      if (!this.isLoading) {
        this.isLoading = true
        if (Object.keys(this.customData).length !== 0) {
          setTimeout(() => {
            sendRequest(`https://store.steampowered.com/api/appdetails?appids=${item.id}&cc=${cc}&l=${cc}`, {},{
              localCache:true,
              localTtl:60
            }).then(res => {
              const resData = res.data[item.id]
              if (resData.success === true) {
                const detailData = resData.data
                this.detailList = detailData
              } else {
                return
              }
            }).finally(() => {
              this.$nextTick(() => {
                this.isLoading = false
              })
            })
          }, 500)
        }
      }
    },
    discountBack () {
      this.gameShow = false
      window.localStorage.removeItem('detail')
    },
    openSteam (id) {
      browser.openInUserSelect(`https://store.steampowered.com/app/${id}` )
    },
    async getRegion () {

      this.fail=false
      this.isLoading = true
      setTimeout(()=>{
        if(this.loading){
          this.fail=true
        }
      },6000)


      this.gameVisible = false
      this.customData.id = this.defaultRegion
      // 获取国家地区名称参数
      await this.getData(this.region.id).catch(()=>this.fail=true).finally(()=>{
        this.key=Date.now()
        this.isLoading = false
      })
    },
    getArea(v){
      this.defaultRegion = v.id
      this.getRegion()
    },
    enterDiscountDetail(){
      this.$router.push({name:'recommend',params:{id:this.customData.id}})
    },
    enterGameDetail(v){
      this.$router.push({name:'GameDiscountDetail',params:{id:v}})
    }
  }
}
</script>

<style lang="scss" scoped>
.animate-spin{
  animation: spin 0.3s linear infinite !important;
}
.discount-item {

  .discount-content {
    .name {
      max-width: 104px;
    }
  }
}

.change:active {
  filter: brightness(0.8);
  background: rgba(42, 42, 42, 0.25);
}

.detail-image {
  width: 100%;
  height: 118px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.discount-description {
  line-height: 20px;
  margin-right: 4px;
  padding: 1px 6px;
  color: rgba(255, 255, 255, 0.6);
}

.change:active {
  filter: brightness(0.8);
  background: rgba(42, 42, 42, 0.25);
}

.content-introduction {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre-wrap;
  margin-bottom: 5px;
}

.price-font{
  font-family: Oswald-Regular;
}
.oswald-font{
  font-family: Oswald-SemiBold;
}

</style>
