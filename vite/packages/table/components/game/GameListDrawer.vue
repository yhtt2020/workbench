<script lang="ts">
import {mapWritableState} from "pinia";
import {steamUserStore} from "../../store/steamUser";
import {getCover} from "../../js/common/game";
import VueCustomScrollbar from "../../../../src/components/vue-scrollbar.vue";

export default {
  components: {VueCustomScrollbar},
  methods: {
    getCover,
    select(game) {
      this.$emit('valueChanged',game)
      this.$emit('update:visible',false)
      this.drawerVisible=false
    },
    visibleChanged(){
      this.$emit('update:visible',false)
    }
  },
  props: ['visible','items','activeId'],
  emits: ['valueChanged','visibleChanged'],
  data() {
    return {
      drawerVisible: false,
      outerSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: true,
        suppressScrollX: false,
        wheelPropagation: true
      },
    }
  },
  computed: {
    ...mapWritableState(steamUserStore, ['desks', 'runningGame']),
  },
  watch:{
    'visible':{
      handler(newVal){
        this.drawerVisible=newVal
      }
    }
  },
  mounted() {
    this.drawerVisible = this.visible
  }
}
</script>

<template>

  <a-drawer @close="visibleChanged" :height="270" placement="bottom" v-model:visible="drawerVisible">
    <vue-custom-scrollbar style="width: 100%;height: 100%;white-space: nowrap;" :settings="outerSettings">
      <div :class="{'active-game':game.appid===activeId}" @click="select(game)" v-for="game in items" style="display: inline-block"
           class="mr-6 text-center pointer mb-1 game">
        <a-image class="mb-2" :preview="false" style="width:250px;border-radius: 4px"
                 :src="getCover(game.appid)"></a-image>
        <div style="font-size: 18px" class="truncate">
          {{ game.chineseName }}
        </div>
      </div>

    </vue-custom-scrollbar>
  </a-drawer>

</template>

<style scoped lang="scss">
.game {
  opacity: 0.5;

  &:hover, &.active,&.active-game {
    opacity: 1;
  }
}
</style>
