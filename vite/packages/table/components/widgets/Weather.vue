<template>
  <Widget :options="options" ref="weatherSlot" :customIndex="customIndex" :customData="customData" :desk="desk" :env="env">
    <template #left-title-icon>
        <div
          class="icon"
          style=" width: 38px;height: 24px; display: flex;justify-content: center;align-items: center;position: absolute;
            left: 2px; ">
          <newIcon icon="fluent:cloud-16-regular" style="font-size: 22px;" />
        </div>
      </template>
    <div v-if="defaultCity" class="px-3 py-1 bg-mask rounded-xl pointer" @click="openWeatherDrawer" style="position: absolute;left: 45px;top:10px">
      {{ defaultCity.name }}
    </div>
    <div @click="enterWeather">
      <div v-if="!cities.length">
        <div>
          <a-col style="text-align: center; margin-top: 1em">
            <Icon style=" width: 5em;  height: 5em;    vertical-align: middle; " icon="icon_qingtian"></Icon>
          </a-col>
        </div>
        <div class="item-content" >
          <xt-button class="mt-4" size="mini" :w="120" :h="40"  @click.stop="add"  >
            <Icon icon="tianjia1"></Icon>
            添加城市
          </xt-button>
        </div>
      </div>
      <div @click="enterWeather" v-else>
        <template v-if="defaultCity.now && defaultCity.d7 && defaultCity.h24 && defaultCity.d7.daily">
          <a-row>
            <a-col :span="7" style="text-align: center">
              <i
                style="font-size: 4em"
                :class="'qi-' + defaultCity.now.icon + '-fill'"
              ></i>
            </a-col>
            <a-col :span="17" style="text-align: center">
              <div style="font-size: 1.5em; font-weight: bold; padding-top: .8em">
                {{ today.month }}月{{ today.day }}日 {{ today.week }}
              </div>
              <div style="font-size: 1.5em">
                {{ defaultCity.now.text }} {{ defaultCity.now.temp }}℃
              </div>
            </a-col>
          </a-row>
          <a-row style="margin-top: .5em">
            <a-col :span="12" style="text-align: center">
              <div style="font-size: 1.2em; font-weight: bold">明天</div>
              <div style="font-size: 1.1em">
                <i
                  style="font-size: 1.2em"
                  :class="'qi-' + defaultCity.d7.daily[1].iconDay + '-fill'"
                ></i>
                {{ defaultCity.d7.daily[1].text }} {{ defaultCity.d7.daily[1].tempMin }}℃ ~
                {{ defaultCity.d7.daily[1].tempMax }}℃
              </div>
            </a-col>
            <a-col :span="12" style="text-align: center">
              <div style="font-size: 1.2em; font-weight: bold">后天</div>
              <div style="font-size: 1.1em">
                <i
                  style="font-size: 1.2em"
                  :class="'qi-' + defaultCity.d7.daily[2].iconDay + '-fill'"
                ></i>
                {{ defaultCity.d7.daily[2].text }} {{ defaultCity.d7.daily[2].tempMin }}℃ ~
                {{ defaultCity.d7.daily[2].tempMax }}℃
              </div>
            </a-col>
          </a-row>

        </template>
        <template v-else>
          <div style="text-align: center;padding: 3em">
          <Icon icon="tuichu" style="font-size: 32px"></Icon>
            <div style="font-size: 16px;margin-top: 5px">天气服务暂时离线<br>请明日再试</div>
          </div>
        </template>
      </div>
    </div>
  </Widget>

  <HorizontalDrawer :drawerTitle="drawerTitle" :rightSelect="cities" ref="regionDrawer" v-model:selectRegion="defaultValue" @getArea="getDefaultWeather"></HorizontalDrawer>
</template>
<script>

import { mapState } from 'pinia'
import { getDateTime } from '../../../../src/util/dateTime'
import { weatherStore } from '../../store/weather'
import Widget from "../card/Widget.vue";
import HorizontalDrawer from '../HorizontalDrawer.vue';
import XtButton from '../../ui/libs/Button/index.vue'
import { Icon as newIcon } from '@iconify/vue';
export default {
  name: "Weather",
  props:{
    customIndex: {
      type: Number,
      default: 0
    },
    customData: {
      type: Object,
      default: () => {}
    },
    desk:{
      type:Object
    }
  },
  data() {
    return {
      today: "",
      options:{
        className:'card small',
        title:'天气',
        icon:'',
        type:'weather',
      },
      defaultValue:'',
      drawerTitle:'常用天气位置',
      env:{
        web: false,
        mobile: false,
        client: false,
        offline:true
      }
    };
  },

  components:{
    XtButton,
    Widget,
    HorizontalDrawer,
    newIcon
  },
  computed: {
    ...mapState(weatherStore, ['cities','reloadAll']),
    // city () {
    //   if(this.cities[0]){
    //     return this.cities[0]
    //   }else{
    //     return {}
    //   }
    // },
    defaultCity(){
      if(this.customData && this.customData.id){
          const found = this.cities.find(el=>{
             return el.id === this.customData.id
          })
          if(found) {
            return found
          }
      }
      return this.cities[0]
    }

  },
  mounted() {
    this.reloadAll()
    this.today = getDateTime();
    if(this.cities.length !== 0) this.defaultValue = this.defaultCity.id
    // if(this.cities.length)this.options.icon = 'position';
  },
  methods: {
    openWeatherDrawer(){
      this.$refs.regionDrawer.openDrawer()
    },
    enterWeather() {
      this.$router.push({ name: "weather" });
    },
    add() {
      this.$router.push({
        name: "weather",
        params: {
          add: "1",
        },
      });
    },
    getDefaultWeather(e){
      this.customData.id = e.id
    },
  },
};
</script>

<style scoped lang="scss">
@import "qweather-icons/font/qweather-icons.css";
</style>
