<template>
  <div>
    <div>
      <div style="overflow-x: visible">
        <div class="card-wrapper">
          <Music></Music>
          <div style="display: inline-block;width: 21em;white-space: pre-wrap;vertical-align: text-top;">
            <Timer></Timer>
            <Weather></Weather>
          </div>

          <Calendar></Calendar>
          <Stock></Stock>
         <AddMore></AddMore>


        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Weather from '../components/homeWidgets/Weather.vue'
import Calendar from '../components/homeWidgets/Calendar.vue'
import Timer from '../components/homeWidgets/Timer.vue'
import Music from '../components/homeWidgets/Music.vue'
import Stock from '../components/homeWidgets/Stock.vue'
import AddMore from '../components/homeWidgets/AddMore.vue'

export default {
  name: 'Home',
  components: { AddMore, Stock, Music, Calendar, Weather, Timer }
}
</script>

<style scoped lang="scss">

.card-wrapper {
  width: auto;
  flex-wrap: nowrap;
  white-space: nowrap;
  height: calc(100vh - 12em)
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
