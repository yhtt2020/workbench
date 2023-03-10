<template>
  <div
    @click="enterWeather"
    class="card pointer half"
    style="padding: 1em; margin-bottom: 0; height: 50%"
  >
    <!--    <iframe scrolling="no"  style="border: none;height: 196px;width: 100%" :src="src"></iframe>-->
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
      <Icon icon="position"></Icon>
      {{ city.name }}
      <a-row>
        <a-col :span="7" style="text-align: center">
          <i
            style="font-size: 4em"
            :class="'qi-' + city.weather.now.icon + '-fill'"
          ></i>
        </a-col>
        <a-col :span="17" style="text-align: center">
          <div style="font-size: 1.5em; font-weight: bold; padding-top: 1em">
            {{ today.month }}月{{ today.day }}日 {{ today.week }}
          </div>
          <div style="font-size: 1.5em">
            {{ city.weather.now.text }} {{ city.weather.now.temp }}℃
          </div>
        </a-col>
      </a-row>
      <a-row style="margin-top: 1em">
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
    </div>
  </div>
</template>
<script>
import { mapState } from "pinia";
import { getDateTime } from "../../../../src/util/dateTime";
import { weatherStore } from "../../store/weather";

export default {
  name: "Weather",
  data() {
    return {
      src: "https://a.apps.vip/weather/weather.html",
      today: "",
    };
  },
  computed: {
    ...mapState(weatherStore, ["cities"]),
    city() {
      return this.cities[0];
    },
  },
  mounted() {
    this.today = getDateTime();
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
