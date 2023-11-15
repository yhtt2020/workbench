<template>
  <Widget :options="options" :customData="customData" :customIndex="customIndex" style="overflow: hidden" :desk="desk">
    <!-- <a-empty style="margin-top: 10px" description="您还没有好友或未绑定Steam">

    </a-empty> -->
    <template #left-title-icon>
        <div
          class="icon"
          style=" width: 38px;height: 24px; display: flex;justify-content: center;align-items: center;position: absolute;
            left: 2px; ">
          <newIcon icon="mdi:steam" style="font-size: 20px;" />
        </div>
      </template>
    <XtState v-if="myFriends.length===0"  zoom="30" :state="'null'" :text="{'null':'您还没有好友或未绑定Steam'}" bg="" style="width: 100%;height: 80%;" class="mt-2"></XtState>
    <vue-custom-scrollbar v-else :settings="scrollbarSettings" style="height: 90%">
      <div class="mt-5 my-friends"  >
          <div v-for="item in myFriends" class=" avatar-item">
            <a-popover :content="item.player_name">
              <a-avatar shape="square" :size="48" :src="item.avatar_url_medium"  class="mb-4 rounded-md" style="border:3px solid rgba(82, 196, 26, 1);"></a-avatar>
            </a-popover>
          </div>
      </div>
    </vue-custom-scrollbar>
  </Widget>
</template>
<script>

import Widget from '../../card/Widget.vue'
import { steamUserStore } from '../../../store/steamUser'
import {mapState}from 'pinia'
import VueCustomScrollbar from '../../../../../src/components/vue-scrollbar.vue'
import {Icon as newIcon} from '@iconify/vue'
export default {
  name:'SteamFriends',
  components:{
    VueCustomScrollbar,
    Widget,
    newIcon
  },
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
  data(){
    return{
      scrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      options: {
        className: 'card small',
        title: 'Steam好友',
        // icon: 'steam',
        type: 'games',
      }
    }
  },
  computed:{
    ...mapState(steamUserStore,['myFriends'])
  }
}
</script>

<style lang="scss" scoped>
.my-friends{
  display: grid;
  grid-template-columns: repeat(3,0.35fr);
  grid-gap: 10px;
  justify-content: center;
  align-items: center;
}
.avatar-item{
  display: flex;
  align-items: center;
  justify-content: center;
  margin:  0  auto;
}
</style>
