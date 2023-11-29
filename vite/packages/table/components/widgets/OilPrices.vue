<template>
  <div>
    <Widget :options="options" :customIndex="customIndex" :customData="customData" :menuList="menuList" ref="cardSlot"
      :desk="desk" :size="size" :env="env">
      <template #left-title-icon>
        <div
          class="icon"
          style=" width: 38px;height: 24px; display: flex;justify-content: center;align-items: center;position: absolute;
            left: 2px; ">
          <newIcon icon="fluent:gas-pump-24-regular" style="font-size: 22px;" />
        </div>
      </template>
      <!-- {{ currentCity }} -->
      <!-- {{ cityOilData }} -->
      <!-- {{ cityOilList }} -->
      <div v-if="isLoading">
        <a-spin style="display: flex; justify-content: center; align-items:center;margin-top: 60%" />
      </div>
      <template v-else-if="fail">
        <a-result :status="null" title="请确认网络" style="margin-top: 3em">
          <template #extra>
            <a-button key="console" type="primary" @click="retry"
              style="background: var(--primary-bg);color:var(--primary-text)">重试</a-button>
          </template>
        </a-result>

      </template>
      <div v-else >
        <div class="city xt-bg xt-text" @click="showMenu">
          {{ showOilData[0].city }}
          <CaretDownOutlined style="font-size: 16px; " />
        </div>
        <div class="oil">
          <div class="oil-item mar-r xt-bg ">
            <span class="xt-text">92号汽油</span>
            <div class="oil-price xt-text">
              {{ showOilData[0]['92h'] }}
            </div>
          </div>
          <div class="oil-item xt-bg">
            <span class="xt-text">95号汽油</span>
            <div class="oil-price xt-text">
              {{ showOilData[0]['95h'] }}
            </div>
          </div>
          <div class="oil-item mar-r xt-bg">
            <span class="xt-text">98号汽油</span>
            <div class="oil-price xt-text">
              {{ showOilData[0]['98h'] }}
            </div>
          </div>
          <div class="oil-item xt-bg">
            <span class="xt-text">0号柴油</span>
            <div class="oil-price xt-text">
              {{ showOilData[0]['0h'] }}
            </div>
          </div>
        </div>
      </div>

    </Widget>
    <!-- {{ showOilData[0] }} -->
    <a-drawer :width="500" title="设置" v-model:visible="settingVisible" placement="right">
      <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;">
        <div class="primary-title" style="color: var(--primary-text);">选择地区</div>
        <div class="flex items-center justify-center w-full h-12 my-4 rounded-lg pointer s-list" v-for="(item) in city"
          :class="defaultCityIndex === item.id ? 'drawer-active' : ''" @click="selectedAreaSuit(item)">
          <!-- {{ defaultCityIndex }} -->
          <!-- {{ item.id }} -->
          {{ item.city }}
        </div>
      </vue-custom-scrollbar>

    </a-drawer>
  </div>
</template>

<script>
import Widget from '../card/Widget.vue'
import { LineChartOutlined, CaretDownOutlined } from '@ant-design/icons-vue'
import city from '../../js/axios/city.ts'
import { mapActions, mapState } from 'pinia'
import { oilStore } from '../../store/store.ts'
import {Icon as newIcon} from '@iconify/vue';
export default {
  name: 'OilPrices',
  components: {
    Widget,
    LineChartOutlined,
    CaretDownOutlined,
    newIcon
  },
  props: {
    customIndex: {
      type: Number,
      default: 0
    },
    customData: {
      type: Object,
      default: () => { }
    },
    desk: {
      type: Object
    }
  },
  data() {
    return {
      fail: false,
      options: {
        className: 'card ',
        title: '今日油价',
        icon: '',
        type: 'OilPrices',
      },
      menuList: [
        {
          icon: 'shezhi1',
          title: '设置',
          fn: () => { this.settingVisible = true; this.$refs.cardSlot.visible = false }
        },
      ],
      currentIndex: 0,
      size: {
        width: 1,
        height: 2,
      },
      settingVisible: false,
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      defaultCityIndex: 0,
      city: city,
      isLoading: true,
      env:{
        web: false,
        mobile: false,
        client: false,
        offline:true
      }
    }
  },
  methods: {
    selectedAreaSuit(item) {
      this.defaultCityIndex = (item.id - 1)
      this.settingVisible = false

      // this.city[this.defaultCityIndex].city=this.customData.city
      let defaultCity = this.city[this.defaultCityIndex].city
      this.customData.city = defaultCity
      this.currentCity.p = undefined
      // this.getCityOilData()
      // this.showCity()
      this.cityOil(this.customData.city)
    },
    showCity() {
      if (this.currentCity.p !== this.customData.city) {
        this.currentCity.p = this.customData.city
      }
    },
    showMenu() {
      this.settingVisible = true
    },
    ...mapActions(oilStore, ['getCityOilData', 'getCity', 'cityOil']),
    retry() {
      this.cityOil(this.city[this.defaultCityIndex].city).then(() => {
      }).catch(() => this.fail = true).finally(() => {
        this.isLoading = false
      })
    },


  },
  computed: {
    ...mapState(oilStore, ['cityOilData', 'currentCity', 'cityOilList']),
    // 获取当前组件省市的油价信息
    showOilData() {
      let cityMsg = this.cityOilData.filter((item) => {
        return item.city == this.customData.city
      })
      return cityMsg
    }
  },
  async mounted() {
    this.isLoading = true
    this.getCity().then(()=>{
      //  console.log(this.currentCity);
      //  await this.getCityOilData()
      // 判断用户ip是否在国内省市
      const isCity = this.city.some(item => item.city == this.currentCity.p)
      // console.log(isCity);
      if (this.customData && this.customData.city) {
        // console.log(this.customData.city);
        this.cityOil(this.customData.city)
      } else {
        if (isCity && this.currentCity.p) {
          // this.customData.city=this.currentCity.p
          let city = this.currentCity.p
          this.customData.city = city
          this.cityOil(this.customData.city)

        } else {
          this.customData.city=this.city[this.defaultCityIndex].city
          this.cityOil(this.city[this.defaultCityIndex].city)
        }
        // this.customData.city=this.city[this.defaultCityIndex].city
        // this.cityOil(this.city[this.defaultCityIndex].city)

      }
      setTimeout(() => {
        this.isLoading = false
      }, 0);
    })

  }

}
</script>
<style lang='scss' scoped>
.city {
  width: 252px;
  height: 56px;
  background: #2A2A2A;
  border-radius: 10px;
  text-align: center;
  line-height: 56px;

  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 400;
  margin-top: 14px;
}

.oil {
  display: flex;
  flex-wrap: wrap;
  margin-top: 12px;

  .mar-r {
    margin-right: 12px;
  }

  .oil-item {
    width: 120px;
    height: 138px;
    background: #2A2A2A;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    margin-bottom: 12px;

    span {
      position: absolute;
      top: 16px;

      font-size: 16px;
      color: rgba(255, 255, 255, 0.85);
      font-weight: 400;
    }

    .oil-price {
      font-family: Oswald-Medium;
      font-size: 24px;
      color: rgba(255, 255, 255, 0.85);
      font-weight: 500;
      margin-top: 30px;
    }
  }
}
</style>
