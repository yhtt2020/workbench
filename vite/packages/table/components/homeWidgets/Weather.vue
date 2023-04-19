<template>
  <HomeComponentSlot :options="options">
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
    <div @click="enterWeather" v-else>
      <template v-if="city.now && city.d7 && city.h24">
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
    };
  },
  components:{
    HomeComponentSlot
  },
  computed: {
    ...mapState(weatherStore, ['cities']),
    city () {
      return this.cities[0]
    }
  },
  mounted() {
    this.today = getDateTime();
    if(this.city)this.options.title = this.city.name;
    if(this.cities.length)this.options.icon = 'position';
  },
  methods: {
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
