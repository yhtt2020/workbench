<template>
  <HomeComponentSlot :options="options" :confirmCCData="confirmCCData" :customIndex="customIndex"
                     :customData="customData" :formulaBar="gameBare" ref="gameSlot">
    <div class="bg-mask rounded-lg px-3 py-1 pointer" @click="showRegionSelect"
         style="position: absolute;left: 45px;top:10px">{{ region.name }}
    </div>
    <a-spin v-if="isLoading === true"
            style="display: flex; justify-content: center; align-items:center;margin-top: 60%"></a-spin>
    <template v-else-if="fail">
      <a-result :status="null" title="请确认网络" style="margin-top: 3em">
        <template #extra>
          <a-button key="console" type="primary" @click="retry">重试</a-button>
        </template>
      </a-result>

    </template>
    <template v-else>
      <template v-if="gameShow ===false">

        <div class="discount-item flex flex-col" style="margin-top: 1em;">
          <div class="flex flex-col ">
            <div class="w-full flex cursor-pointer rounded-md" @click="enterDetail(item,customData.id)"
                 v-for="item in list" style="position:relative;height:65px; margin-bottom: 12px;overflow: hidden">
              <img :src="item.header_image" alt="" class=" rounded-md"
                   style="width:140px;height:65px; object-fit: cover;">
              <div class="flex  discount-content flex-col" style="margin-left: 10px; width: 104px;">
                <div class="name truncate" style="width: 100%; margin-bottom: 10px;">{{ item.name }}</div>
                <span class="line-through text-white text-opacity-60" style="font-size: 10px;">
                {{ currencyFormat(item.original_price, item.currency) }}
              </span>
                <div class="flex w-full justify-between ">
                <span style="color:rgba(255, 77, 79, 1); line-height: 21px; font-size: 14px;font-weight: 500;">
                 {{ currencyFormat(item.final_price, item.currency) }}
                </span>

                </div>
                <div
                  style="position: absolute;top:0;left:0;background-color: rgba(255, 77, 79,0.5);backdrop-filter: blur(8px);border-bottom-right-radius: 9px;">
                 <span style=" padding: 3px 10px;font-size: 12px;">
                   -{{ item.discount_percent }}%
                  </span>
                </div>
              </div>

            </div>
          </div>
          <div class="bg-black change bg-opacity-10 flex rounded-lg cursor-pointer" @click="discountChange"
               style="padding:13px 80px;">
            <Icon icon="reload" class="animate-spin" style="font-size: 1.429em;color: rgba(255, 255, 255, 0.85);"
                  v-if="reloadShow === true"></Icon>
            <Icon icon="reload" style="font-size: 1.429em;color: rgba(255, 255, 255, 0.85);" v-else></Icon>
            <span style="margin-left: 1em;color: rgba(255, 255, 255, 0.85);">换一换</span>
          </div>
        </div>
      </template>
      <template v-else-if="gameShow === true">

        <div class="flex flex-grow flex-col" style="margin-top: 14px;" >
          <div class="detail-image rounded-lg" style="margin-bottom: 14px;">
            <img class="rounded-lg" :src="detailList.header_image" alt="">
          </div>
          <div class="truncate" style="margin-bottom: 6px; font-size: 18px;font-weight: 500;">{{ detailList.name }}</div>
          <span class="content-introduction text-white text-opacity-60">{{ detailList.short_description }}</span>
          <div class="flex" style="margin-bottom: 10px;">
          <span class="discount-description rounded-md bg-white bg-opacity-20 "
                v-for="item in detailList.genres">{{ item.description }}</span>
          </div>
          <span v-if="detailList.price_overview.initial_formatted" class="line-through text-white text-opacity-60"
                style="font-size: 12px;">
            {{ detailList.price_overview.initial_formatted }}
          </span>
          <div class="flex w-full justify-between " style="margin-bottom: 16px;">
            <span
              style="color:rgba(255, 77, 79, 1); line-height: 21px; font-size: 16px;font-weight: 500; padding-right: 2.41em;">
             {{ detailList.price_overview.final_formatted }}
            </span>
            <div class="flex justify-end">
              <span class="rounded-md" style="background:rgba(255, 77, 79, 1); padding: 3px 10.23px;font-size: 12px;">
               -{{ detailList.price_overview.discount_percent }}%
              </span>
            </div>
          </div>
          <div class="flex items-center justify-around">
            <div @click="discountBack()"
                 class="bg-black change cursor-pointer bg-opacity-10 rounded-lg w-12 h-12 flex items-center justify-center">
              <Icon icon="xiangzuo" style="font-size: 1.715em;color: rgba(255, 255, 255, 0.85);"></Icon>
            </div>
            <div class="bg-black change flex items-center justify-center  rounded-lg  h-12 cursor-pointer bg-opacity-10"
                 @click="openSteam(detailList.steam_appid)" style="width:196px;color: rgba(255, 255, 255, 0.85);">打开steam
            </div>
          </div>
        </div>
      </template>
    </template>

  </HomeComponentSlot>

  <HorizontalDrawer :drawerTitle="drawerTitle" ref="regionDrawer" v-model:selectRegion="customData.id" :rightSelect="regionRange" @getArea="getArea"></HorizontalDrawer>
</template>

<script>
import HomeComponentSlot from '../HomeComponentSlot.vue'
import HorizontalDrawer from '../../HorizontalDrawer.vue'
import { randomData, sendRequest, currencyFormat, compareTime } from '../../../js/axios/api'
import { mapWritableState, mapActions, mapState } from 'pinia'
import { steamStore } from '../../../store/steam'
import { cardStore } from '../../../store/card'
import Template from '../../../../user/pages/Template.vue'
import { regionRange } from '../../../js/axios/api'
export default {
  name: 'GamesDiscount',
  props: {
    customIndex: {
      type: Number,
      default: 0
    },
    customData: {
      type: Object,
      default: () => {}
    },
    confirmCCData: {
      type: Function,
      default: () => {}
    }
  },
  components: {
    Template,
    HomeComponentSlot,
    HorizontalDrawer
  },
  data () {
    return {
      fail:false,//失败
      options: {
        className: 'card',
        title: '',
        icon: 'steam',
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
          this.gameVisible = true
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
    ...mapActions(cardStore, ['updateCustomComponents']),
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
              console.log('steam数据',res)
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
      window.ipc.send('addTab', { url: `https://store.steampowered.com/app/${id}` })
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
      console.log(this.region.id,'当前的国家')
      await this.getData(this.region.id).catch(()=>this.fail=true).finally(()=>{
        this.key=Date.now()
        this.isLoading = false
      })
    },
    getArea(v){
      this.defaultRegion = v.id
      this.getRegion()
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


</style>
