<template>
  <HomeComponentSlot :options="options" ref="weatherSlot">
    <div v-if="city" class="bg-mask rounded-xl px-3 py-1  pointer" @click="openWeatherDrawer" style="position: absolute;left: 45px;top:10px">
      {{ city.name }}
    </div>
    <div @click="enterWeather">
    <div v-if="!cities.length">
      <div>
        <a-col style="text-align: center; margin-top: 1em">
          <Icon
            style="
              width: 5em;
              height: 5em;
              margin-right: 10px;
              vertical-align: middle;
            "
            icon="icon_qingtian"
          ></Icon>
        </a-col>
      </div>
      <div style="text-align: center">
        <div
          class="btn"
          @click.stop="add"
          style="
            font-size: 1.3em;
            font-weight: bold;
            margin-top: 1em;
            width: 12em;
            display: inline-block;
          "
        >
          <Icon icon="tianjia1"></Icon>
          添加城市
        </div>
      </div>
    </div>
    <div @click="enterWeather" class="pointer" v-else>
      <template v-if="city.now && city.d7 && city.h24 && city.d7.daily">
        <a-row>
          <a-col :span="7" style="text-align: center">
            <i
              style="font-size: 4em"
              :class="'qi-' + city.now.icon + '-fill'"
            ></i>
          </a-col>
          <a-col :span="17" style="text-align: center">
            <div style="font-size: 1.5em; font-weight: bold; padding-top: .8em">
              {{ today.month }}月{{ today.day }}日 {{ today.week }}
            </div>
            <div style="font-size: 1.5em">
              {{ city.now.text }} {{ city.now.temp }}℃
            </div>
          </a-col>
        </a-row>
        <a-row style="margin-top: .5em">
          <a-col :span="12" style="text-align: center">
            <div style="font-size: 1.2em; font-weight: bold">明天</div>
            <div style="font-size: 1.2em">
              <i
                style="font-size: 1.2em"
                :class="'qi-' + city.d7.daily[1].iconDay + '-fill'"
              ></i>
              {{ city.d7.daily[1].text }} {{ city.d7.daily[1].tempMin }}℃ ~
              {{ city.d7.daily[1].tempMax }}℃
            </div>
          </a-col>
          <a-col :span="12" style="text-align: center">
            <div style="font-size: 1.2em; font-weight: bold">后天</div>
            <div style="font-size: 1.2em">
              <i
                style="font-size: 1.2em"
                :class="'qi-' + city.d7.daily[2].iconDay + '-fill'"
              ></i>
              {{ city.d7.daily[2].text }} {{ city.d7.daily[2].tempMin }}℃ ~
              {{ city.d7.daily[2].tempMax }}℃
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
  </HomeComponentSlot>
  <a-drawer :width="500" v-model:visible="weatherVisible" @close="onClose" title="常用天气位置" style="text-align: center;" :bodyStyle="{textAlign:'left'}" placement="right">
    <div class="flex flex-col justify-start">
      <span style="margin-bottom: 14px;">常用天气位置</span>
      <a-radio-group @change="getDefaultWeather($event)" v-model:value="city.id">
        <a-radio class="line" v-for="item in cities" :value="item.id">
          {{ item.name }}
        </a-radio>
      </a-radio-group>
    </div>
  </a-drawer>
</template>
<script>

import { mapState } from 'pinia'
import { getDateTime } from '../../../../src/util/dateTime'
import { weatherStore } from '../../store/weather'
import HomeComponentSlot from "./HomeComponentSlot.vue";
export default {
  name: "Weather",
  data() {
    return {
      today: "",
      options:{
        className:'card small',
        title:'',
        icon:'',
        type:'weather',
      },
      weatherVisible:false,
      defaultCity:{}
    };
  },

  components:{
    HomeComponentSlot
  },
  computed: {
    ...mapState(weatherStore, ['cities','reloadAll']),
    city () {
      if(this.cities[0]){
        return this.cities[0]
      }else{
        return {}
      }
    }

  },
  mounted() {
    this.reloadAll()
    this.today = getDateTime();
    if(this.cities) this.defaultCity = this.city
    if(this.cities.length)this.options.icon = 'position';
  },
  methods: {
    openWeatherDrawer(){
      this.weatherVisible = true
    },
    getDefaultWeather(e){
      const found =  this.cities.find(ci=>{
        return ci.id === e.target.value
      })
      if(found){
        return found
      }
      console.log(found);
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
  },
};
</script>

<style scoped lang="scss">
@import "qweather-icons/font/qweather-icons.css";
</style>
