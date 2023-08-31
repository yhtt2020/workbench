<template>
<div>
    <Widget :options="options" :customIndex="customIndex" :customData="customData" :menuList="menuList" ref="cardSlot" :desk="desk" :size="size">
        <template #left-title>
            <div class="icon"
          style="width: 35px;height: 24px;display: flex; justify-content: center;align-items: center;position: absolute;left: 2px;">
          <LineChartOutlined style="font-size: 20px;" />
        </div>
        </template>
        {{ currentCity }}
        {{ cityOilData }}
        <div class="city" @click="showMenu">
            {{ city[defaultCityIndex].city }} <CaretDownOutlined style="font-size: 16px; " />
        </div>
        
        <div class="oil">
            <div class="oil-item mar-r">
                <span>92号汽油</span>
                <div class="oil-price">
                    8.05
                </div>
            </div>
            <div class="oil-item">
                <span>95号汽油</span>
                <div class="oil-price">
                    8.05
                </div>
            </div>
            <div class="oil-item mar-r">
                <span>98号汽油</span>
                <div class="oil-price">
                    8.05
                </div>
            </div>
            <div class="oil-item">
                <span>0号柴油</span>
                <div class="oil-price">
                    8.05
                </div>
            </div>
        </div>
    </Widget>
    <a-drawer :width="500" title="设置" v-model:visible="settingVisible" placement="right">
      <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;">
        <div class="primary-title" style="color: var(--primary-text);">选择地区</div>
        <div class="flex items-center justify-center w-full h-12 my-4 rounded-lg pointer s-list"
      v-for="(item) in city" :class="defaultCityIndex=== item.id ? 'drawer-active':''" @click="selectedAreaSuit(item)">
      <!-- {{ defaultCityIndex }} -->
      <!-- {{ item.id }} -->
      {{ item.city }}
    </div>
      </vue-custom-scrollbar>

    </a-drawer>
</div>
</template>

<script>
import Widget from '../../../components/card/Widget.vue'
import {LineChartOutlined,CaretDownOutlined} from '@ant-design/icons-vue'
import city from '../city.ts'
import { mapActions,mapStores } from 'pinia'
import {oilStore} from '../store.ts'
export default{
    name:'OilPrices',
    components:{
        Widget,
        LineChartOutlined,
        CaretDownOutlined,
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
  data(){
    return {
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
      size:{
        width:1,
        height:2,
      },
      settingVisible: false,
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      rightSelect: [
          {
            city:'北京',
          },
          {
            city:'上海',
          },
          {
            city:'北京',
          },
          {
            city:'北京',
          },
          {
            city:'北京',
          },
      ],
      defaultCityIndex:0,
      city:city,
    }
  },
  methods:{
    selectedAreaSuit(item){
        this.defaultCityIndex=(item.id -1)
        this.settingVisible=false
        this.getCityOil()
        // this.getCityOilData()
    },
    showMenu(){
        this.settingVisible=true
    },
    ...mapActions(oilStore,['getCityOilData','getCity']),
    // 获取当前城市油价
    currentCityOil(){
      if(city.includes(this.currentCity)){
        this.customData.currentCity=this.currentCity
        this.getCityOilData()
        return this.cityOilData.filters((item)=>{
          return item==this.currentCity
        })
      }
    },
    getCityOil(){
      this.getCityOilData()
    }
    
  },
  computed:{
    ...mapStores(oilStore,['cityOilData','currentCity']),
    targetCity(){
      let target
      if(this.customData.city){
        target=this.customData.city
      }
      target=this.city[this.defaultCityIndex]
      return this.cityOilData.filters((item)=>{
        return item.city==target.city
      })
    }
    
  },
  async mounted(){
   await this.getCity()
  //  await this.getCityOilData()
  }
}
</script>
<style lang='scss' scoped>
.city{
    width: 252px;
    height: 56px;
    background: #2A2A2A;
    border-radius: 10px;
    text-align: center;
    line-height: 56px;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: rgba(255,255,255,0.85);
    font-weight: 400;
    margin-top: 14px;
}
.oil{
    display: flex;
    flex-wrap: wrap;
    margin-top: 12px;
    .mar-r{
        margin-right: 12px;
    }
   .oil-item{
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
   span{
    position: absolute;
    top: 16px;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: rgba(255,255,255,0.85);
    font-weight: 400;
   } 
   .oil-price{
    font-family: Oswald-Medium;
    font-size: 24px;
    color: rgba(255,255,255,0.85);
    font-weight: 500;
    margin-top: 30px;
   }
} 
}

</style>