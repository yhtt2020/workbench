<template>
  <div id="display">

    <a-tabs v-model:activeKey="currentCity" type="editable-card" @edit="onEdit">
      <a-tab-pane  v-for="city in cities" :key="city.id" :tab="city.name">

        <vue-custom-scrollbar :settings="outerSettings" style="position:relative;height:calc(100vh - 14em);  ">
        <div class="section" style="text-align: center">
          <div style="width: 40em;display: inline-block">
            <a-row style="">

              <a-col :span="8" style="font-size: 2.5em">
                <i  :class="'qi-'+city.weather.now.icon+'-fill'"></i> {{city.weather.now.text}}
              </a-col>
              <a-col :span="8">
                <div style="font-size: 2em"> {{city.weather.now.temp}} ℃</div>
                <div>
                  风力 {{city.weather.now.windScale}}级
                </div>
              </a-col>
              <a-col :span="8">
                <Icon icon="position"></Icon> {{city.adm2}}-{{city.name}}<br> <Icon style="margin-left: 2em" icon="shijian"></Icon> 发布于 {{ getObsTime(city.weather.now.obsTime)}}

              </a-col>
            </a-row>
          </div>
       </div>
        <div class="card auto-height" style="padding: 0.1em 1.2em 1em;display: block;width: 100%">
          <div class="section">
            24小时天气
          </div>
          <vue-custom-scrollbar :settings="innerSettings" style="position:relative;width: 100%  ">
          <a-row style="width: 150em;margin-bottom: 0.7em">
            <a-col style="text-align: center" :span="1" v-for="w in city.h24.hourly">
              {{getdHours(w.fxTime)}}:00
              <br>
              <i style="font-size: 1.2em" :class="'qi-'+w.icon+'-fill'"></i> {{w.text}}
              <br>
              {{w.temp}}℃
            </a-col>
          </a-row>
          </vue-custom-scrollbar>
        </div>

        <div class="card auto-height" style="padding: 0.1em 1.2em 1em;margin-top: 1em;margin-bottom: 3em;display: blockl;width: 100%">
          <div class="section" >
            多日预报
          </div>
          <a-row style="text-align: center">
            <a-col :span="3" v-for="w in city.d7.daily">

              {{getMonthAndDay(w.fxDate)}}<br>
              <i style="font-size: 1.2em" :class="'qi-'+w.iconDay+'-fill'"></i> {{w.textDay}}<br>
              {{w.tempMin}}℃ ~ {{w.tempMax}}℃
              <br>
              {{w.windScaleDay}}级
            </a-col>
          </a-row>

          <Son :daily="city.d7.daily"></Son>

        </div>
        </vue-custom-scrollbar>
      </a-tab-pane>
    </a-tabs>

  </div>
  <a-drawer v-model:visible="visibleAdd">
    <h3>添加城市</h3>
    <a-input-search id="searchInput" ref="searchInput" v-model:value="words" @search="search" placeholder="输入城市搜索">

    </a-input-search>

    <div class="add-options">
      <div @click="add(city)"  v-for="city in searchList">
        <Icon icon="tianjia1"></Icon>  {{city.adm2 }}  - {{ city.name }}
      </div>
    </div>
  </a-drawer>
</template>

<script>
import axios from 'axios'
import { message } from 'ant-design-vue'
import { appStore } from '../../store'
import {mapWritableState,mapActions} from 'pinia'
import { getDateTime } from  '../../../../src/util/dateTime.js'
import Son from './Son.vue'
import { weatherStore } from '../../store/weather'
export default {
  name: 'Weather',
  components:{Son},
  data () {
    return {
      outerSettings:{
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      innerSettings:{
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: false,
        wheelPropagation: true
      },
      words: '',
      searchList: [],
      currentCity:'',
      visibleAdd:false,
      weather:{},

    }
  },
  mounted () {
    $("#display").on("touchend",(e)=>{e.stopPropagation()})
    if(this.$route.params['add']){
      this.visibleAdd=true
      setTimeout(()=>{
        document.getElementById('searchInput').focus()
      },300)
    }
    if(this.cities.length){
      this.currentCity=this.cities[0].id
    }


  },
  computed:{
    ...mapWritableState(weatherStore,['cities','lastUpdateTime']),
  },
  methods: {
    getMonthAndDay(time){
      let format=this.getDateTime(new Date(time))
      return  format.month+'/'+format.day
    },
    getdHours(time){
      let format=this.getDateTime(new Date(time))
      return  format.hours
    },
    getObsTime(time){
      let format =this.getDateTime(new Date(time))
      return format.month+'-'+format.day+' '+format.hours+":"+format.minutes
    },
    getDateTime,
    ...mapActions(weatherStore,['addCity','removeCity']),
    onEdit(cityId,action){
      if(action==='add'){
        this.visibleAdd=true
      }else{
        this.removeCity(cityId)
      }

    },
    async search () {
      if (!this.words) {
        return
      }
      let cities = await this.get('https://geoapi.qweather.com/v2/city/lookup?',{
        location: this.words}
      )
      if (cities) {
        this.searchList = cities.location
      }

    },//
    async getNow(city){
      let weather=await this.get('https://devapi.qweather.com/v7/weather/now?',{
        location:city.id
      })
      return weather
    },
    async get24h(city){
      let weather=await this.get('https://devapi.qweather.com/v7/weather/24h?',{
        location:city.id
      })
      return weather
    },
    async get7d(city){
      let weather=await this.get('https://devapi.qweather.com/v7/weather/7d?',{
        location:city.id
      })
      return weather
    },
    async get (url, data) {
      let result = await axios.get(url, {
        params: {
          ...data,
          key:'10e0203ea2234e028301877d04d08ffc'
        }
      })
      console.log(result)
      if(result.status===200 && result.data.code==='200'){

        return result.data
      }else{
        message.error('接口返回错误，请稍后再试！')
        return false
      }
    },

    async add(city){
      try{
        city.weather=await this.getNow(city)
        city.h24=await this.get24h(city)
        city.d7=await this.get7d(city)
        city.getTime=Date.now()
      }catch (e) {
        console.error(e)
      }
      this.addCity(city)
      this.currentCity=city.id
      this.visibleAdd=false
    },

  }
}
</script>

<style scoped lang="scss">
.frame {
  width: 100%;
  border: none;
}

.add-options{
  height:calc( 100vh - 15em);
  overflow-y: auto;
  div{
    &:hover{
      opacity: 0.7;
    }
    cursor: pointer;
    padding: 7px;
  }
}
.section{
  margin-top: 1em;
  font-size: 1.2em;
  margin-bottom: 1em;
}

</style>
<style>
.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn{
  color: white;
}
.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab-active, .ant-tabs-card > div > .ant-tabs-nav .ant-tabs-tab-active{
  background: #494949;
  border-bottom: none;
}
.ant-tabs-card.ant-tabs-top > .ant-tabs-nav .ant-tabs-tab-active, .ant-tabs-card.ant-tabs-top > div > .ant-tabs-nav .ant-tabs-tab-active{
  border-bottom: none;
}
.ant-tabs-tab:hover,.ant-tabs > .ant-tabs-nav .ant-tabs-nav-add:hover, .ant-tabs > div > .ant-tabs-nav .ant-tabs-nav-add:hover{
  color: white !important;
}
</style>
