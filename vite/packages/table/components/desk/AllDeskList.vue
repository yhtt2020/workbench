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
    ...mapWritableState(steamUserStore, ['runningGame']),
  },
  watch:{
    'visible':{
      handler(newVal){
        this.drawerVisible=newVal
      }
    }
  },
  mounted() {
  }
}
</script>

<template>

  <vue-custom-scrollbar style="width: 100%;height: 100%;white-space: nowrap;" :settings="outerSettings">
    <div  :class="{'active-game':item.id===activeId}" @click="select(item)" v-for="item in items" style="display: inline-block;width: 100px"
         class="mr-6 text-center pointer mb-1 game">
      <div>
        <a-avatar v-if="item.iconUrl" :size="50" class="mb-2" :preview="false" style="border-radius: 4px"
                  :src="item.iconUrl"></a-avatar>
        <icon v-else :icon="item.icon" style="font-size: 40px"></icon>
      </div>
      <div style="font-size: 14px" class="truncate">
        {{ item.name }}
      </div>
    </div>

  </vue-custom-scrollbar>

</template>

<style scoped lang="scss">
.game {
  opacity: 0.5;

  &:hover, &.active,&.active-game {
    opacity: 1;
  }
}
</style>
