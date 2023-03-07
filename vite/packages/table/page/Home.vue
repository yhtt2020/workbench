<template>
  <div>
    <div>
      <div style="overflow-x: visible">
        <div class="card-wrapper">
          <Dou></Dou>
          <Music></Music>
          <div
            style="
              display: inline-block;
              width: 21em;
              white-space: pre-wrap;
              vertical-align: text-top;
            "
          >
            <Timer></Timer>
            <Weather></Weather>
          </div>

          <Calendar></Calendar>
          <Stock></Stock>
          <CustomComponents></CustomComponents>
          <AddMore></AddMore>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Weather from "../components/homeWidgets/Weather.vue";
import Calendar from "../components/homeWidgets/Calendar.vue";
import Timer from "../components/homeWidgets/Timer.vue";
import Music from "../components/homeWidgets/Music.vue";
import Stock from "../components/homeWidgets/Stock.vue";
import AddMore from "../components/homeWidgets/AddMore.vue";
import Dou from "../components/homeWidgets/Dou.vue";
import CustomComponents from "../components/homeWidgets/CustomComponents.vue";
export default {
  name: "Home",
  components: {
    Dou,
    AddMore,
    Stock,
    Music,
    Calendar,
    Weather,
    Timer,
    CustomComponents,
  },
  mounted() {
    // console.log(localStorage.getItem("CountdownDay"));
    if (this.$route.params["name"]) {
      console.log(this.$route.params);
    }
  },
};
</script>

<style scoped lang="scss">
.card-wrapper {
  width: auto;
  flex-wrap: nowrap;
  white-space: nowrap;
}

.card {
  width: 20em;
  display: inline-block;
  height: 30em;
  padding: 1em;
  margin-right: 1em;

  .title {
  }
}
</style>
