<template>
  <vueCustomScrollbar :settings="scrollbarSettingsBarrage"
                      style="height:100%">
  <a-row class="mb-5" :gutter="[10,15]">
    <template v-for="barrage in barrages">
      <a-col :span="4">
        <a-avatar class="mt-2" :size="36" :src="barrage.avatar"></a-avatar>
      </a-col>
      <a-col :span="20">
        <div class="barrage-name">
          <strong>{{ barrage.nickname }}</strong> · {{ barrage.create_time_text }}
        </div>
        <div class="barrage-content">
          {{ barrage.content }}
        </div>
        <div class="barrage-time">
        </div>
      </a-col>
    </template>
  </a-row>
  </vueCustomScrollbar>
</template>

<script>

export default {
  name: 'TeamBarrage',
  props:['barrages'],
  data(){
    return {
      scrollbarSettingsBarrage: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      barragesTeam:[],
      CONST:{}
    }
  },

}
</script>

<style scoped>

.barrage-name {
  font-size: 0.8em;
}

.barrage-content {
  color: white;
  white-space: pre-wrap;
  word-break: break-all;
}

.barrage-time {
  font-size: 0.8em;
}

</style>
