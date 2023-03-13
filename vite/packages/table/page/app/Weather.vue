<template>
  <div id="display">

    <a-tabs v-model:activeKey="currentCity" type="editable-card" @edit="onEdit" :destroyInactiveTabPane="true">
      <a-tab-pane  v-for="city in cities" :key="city.id" :tab="city.name" v-if="typeof city.weather !=='undefined'">

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
                <Icon icon="position"></Icon> {{city.adm2}}-{{city.name}}<br> <Icon style="margin-left: 2em" icon="shijian"></Icon>  {{ getObsTime(city.weather.now.obsTime)}} 发布
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

          <div class="card auto-height"
               style="padding: 0.1em 1.2em 1em;margin-top: 1em;margin-bottom: 3em;display: block;width: 100%">
            <div class="section">
              多日预报
            </div>
            <a-row style="text-align: center">
              <a-col :span="3" v-for="w in city.d7.daily">

                {{ getMonthAndDay(w.fxDate) }}<br>
                <i style="font-size: 1.2em" :class="'qi-' + w.iconDay + '-fill'"></i> {{ w.textDay }}<br>
                {{ w.tempMin }}℃ ~ {{ w.tempMax }}℃
                <br>
                {{ w.windScaleDay }}级
              </a-col>
            </a-row>

            <WeatherChart :daily="city.d7.daily"></WeatherChart>

          </div>
        </vue-custom-scrollbar>
      </a-tab-pane>
    </a-tabs>

  </div>
  <a-drawer v-model:visible="visibleAdd">
    <h3>添加城市</h3>
    <a-input-search id="searchInput" ref="searchInput" v-model:value="words" @search="onSearch" placeholder="输入城市搜索">

    </a-input-search>

    <div class="add-options">
      <div @click="add(city)" v-for="city in searchList">
        <Icon icon="tianjia1"></Icon> {{ city.adm2 }} - {{ city.name }}
      </div>
    </div>
  </a-drawer>
</template>

<script>
import { message } from 'ant-design-vue'
import { mapWritableState, mapActions } from 'pinia'
import { getDateTime } from '../../../../src/util/dateTime.js'
import WeatherChart from './WeatherChart.vue'
import { weatherStore } from '../../store/weather'
export default {
  name: 'Weather',
  components: { WeatherChart },
  data () {
    return {
      outerSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      innerSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: false,
        wheelPropagation: true
      },
      words: '',
      searchList: [],
      currentCity: '',
      visibleAdd: false,
      weather: {},

    }
  },
  mounted () {
    $("#display").on("touchend", (e) => { e.stopPropagation() })
    if (this.$route.params['add']) {
      this.visibleAdd = true
      setTimeout(() => {
        document.getElementById('searchInput').focus()
      }, 300)
    }
    if (this.cities.length) {
      this.currentCity = this.cities[0].id
    }


  },
  computed: {
    ...mapWritableState(weatherStore, ['cities', 'lastUpdateTime']),
  },
  methods: {
    ...mapActions(weatherStore, ['getNow', 'get24h', 'get7d', 'search', 'addCity', 'removeCity', 'reloadCityWeatherAll', 'get']),
    getMonthAndDay (time) {
      let format = this.getDateTime(new Date(time))
      return format.month + '/' + format.day
    },
    getdHours (time) {
      let format = this.getDateTime(new Date(time))
      return format.hours
    },
    getObsTime (time) {
      let format = this.getDateTime(new Date(time))
      return format.month + '-' + format.day + ' ' + format.hours + ":" + format.minutes
    },
    getDateTime,
    onEdit (cityId, action) {
      if (action === 'add') {
        this.visibleAdd = true
      } else {
        this.removeCity(cityId)
      }
    },

    async add (city) {
      try {
        city = await this.reloadCityWeatherAll(city)
      } catch (e) {
        console.error(e)
        message.error('数据请求失败,添加城市错误')
        return
      }
      this.addCity(city)
      this.currentCity = city.id
      this.visibleAdd = false
    },

    async onSearch () {
      let rs = await this.search(this.words)
      if (rs) {
        this.searchList = rs
      } else {
        message.error('接口返回错误')
      }

    }
  }
}
</script>

<style scoped lang="scss">
.frame {
  width: 100%;
  border: none;
}

.add-options {
  height: calc(100vh - 15em);
  overflow-y: auto;

  div {
    &:hover {
      opacity: 0.7;
    }

    cursor: pointer;
    padding: 7px;
  }
}

.section {
  margin-top: 1em;
  font-size: 1.2em;
  margin-bottom: 1em;
}
</style>
<style>
.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
  color: white;
}

.ant-tabs-card>.ant-tabs-nav .ant-tabs-tab-active,
.ant-tabs-card>div>.ant-tabs-nav .ant-tabs-tab-active {
  background: #494949;
  border-bottom: none;
}

.ant-tabs-card.ant-tabs-top>.ant-tabs-nav .ant-tabs-tab-active,
.ant-tabs-card.ant-tabs-top>div>.ant-tabs-nav .ant-tabs-tab-active {
  border-bottom: none;
}

.ant-tabs-tab:hover,
.ant-tabs>.ant-tabs-nav .ant-tabs-nav-add:hover,
.ant-tabs>div>.ant-tabs-nav .ant-tabs-nav-add:hover {
  color: white !important;
}
</style>
