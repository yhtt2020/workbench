<template>
  <div>
    <a-tabs v-model:activeKey="currentCity" type="editable-card" @edit="onEdit">
      <a-tab-pane  v-for="city in appData.weather.cities" :key="city.id" :tab="city.name">

        <div><Icon icon="position"></Icon> {{city.adm2}}-{{city.name}} <Icon style="margin-left: 2em" icon="shijian"></Icon> 发布于 {{ getObsTime(city.weather.now.obsTime)}}</div>

        <div class="section">
        <a-row>
          <a-col :span="4">
            实时天气
          </a-col>
          <a-col :span="16">
            <div style="font-size: 2em"> {{city.weather.now.temp}} ℃</div>
            <div>
              {{city.weather.now.text}}  风力 {{city.weather.now.windScale}}级
            </div>
          </a-col>
        </a-row></div>


        <div class="card" style="padding: 0.1em 1.2em 1em">
          <div class="section">
            24小时天气
          </div>
          <a-row style="width: 150em">
            <a-col style="text-align: center" :span="1" v-for="w in city.h24.hourly">
              {{getdHours(w.fxTime)}}:00
              <br>
              {{w.text}}
              <br>
              {{w.temp}}℃
            </a-col>
          </a-row>
        </div>

        <div class="card" style="padding: 0.1em 1.2em 1em;margin-top: 1em">
          <div class="section" >
            多日预报
          </div>
          <a-row style="text-align: center">
            <a-col :span="4" v-for="w in city.d7.daily">
              {{getMonthAndDay(w.fxDate)}}<br>
              {{w.textDay}}<br>
              {{w.tempMin}}℃ ~ {{w.tempMax}}℃
              <br>
              {{w.windScaleDay}}级
            </a-col>
          </a-row>
        </div>

      </a-tab-pane>
    </a-tabs>
  </div>
  <a-drawer v-model:visible="visibleAdd">
    <h3>添加城市</h3>
    <a-input-search v-model:value="words" @search="search" placeholder="输入城市搜索">

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
export default {
  name: 'Weather',
  data () {
    return {
      words: '',
      searchList: [],
      currentCity:'',
      visibleAdd:false,
      weather:{}
    }
  },
  computed:{
    ...mapWritableState(appStore, ['appData']),
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
    ...mapActions(appStore,['addCity','removeCity']),
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
      console.log(city)
      try{
        city.weather=await this.getNow(city)
        city.h24=await this.get24h(city)
        city.d7=await this.get7d(city)
      }catch (e) {
        console.error(e)
      }

      this.addCity(city)
      this.visibleAdd=false
    }
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
