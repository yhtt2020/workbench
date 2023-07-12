<template>
  <vueCustomScrollbar :settings="scrollbarSettingsBarrage" style="height:100%;padding-top: 15px">
    <a-row class="mb-5" :gutter="[10, 15]">
      <a-col :span="24" v-if="barrages.length === 0 && loading === false" style="text-align: center">
        <a-empty description="暂无弹幕" style="margin-top: 40px"></a-empty>
      </a-col>
      <template v-for="barrage in barrages">
        <a-col :span="5">
          <FrameAvatar :avatar-size="55" style="zoom:0.65;" @click="showUserCard(barrage.uid)" class="mt-2 pointer ml-6" :size="36" :avatar-url="barrage.avatar"
                       :frame-url="barrage.userInfo?.equippedItems?.frameDetail?.image"></FrameAvatar>
        </a-col>
        <a-col :span="19">
          <div class="barrage-name">
            <strong style="color:var(--main-text)">{{ barrage.nickname }}</strong > <span  style="color:var(--primary-text)">· {{
              barrage.create_time_text }}</span>
          </div>
          <div class="barrage-content" style="color:var(--main-text)">
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

import { appStore } from '../../store'
import { mapActions } from 'pinia'
import FrameAvatar from '../avatar/FrameAvatar.vue'

export default {
  name: 'TeamBarrage',
  components: { FrameAvatar },
  props: ['barrages', 'loading'],
  data() {
    return {
      scrollbarSettingsBarrage: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      barragesTeam: [],
      CONST: {}
    }
  },
  methods: {
    ...mapActions(appStore, ['showUserCard'])
  }

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
