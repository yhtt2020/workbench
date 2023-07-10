<script lang="ts">
import {defineComponent} from 'vue'
import {avatarBgColor, avatarGainMethodText, avatarTagColor, textTag, titleTagColor} from "../../js/common/avatar";
import {mapActions} from "pinia";
import {frameStore} from "../../store/avatarFrame";

export default defineComponent({
  name: "MyFrames",
  data() {
    return {
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      frameList: []
    }
  },
  mounted() {
    this.getMyFrames().then(rs => {
      if (rs.status) {
        console.log(rs.data)
        this.frameList = rs.data.map(itemOwner => {

          return {
            ...itemOwner.item,
          }
        })
        console.log(this.frameList)

      }
    })
  },
  methods: {
    avatarGainMethodText,
    ...mapActions(frameStore, ['getMyFrames']),
    avatarTagColor, textTag, titleTagColor, avatarBgColor,avatarGainMethodText
  }
})
</script>

<template>
  <div v-if="frameList.length===0">
    <a-empty style="margin-top:40%" image="/img/test/load-ail.png" description="暂无可用头像框" />
  </div>
  <vue-custom-scrollbar v-else @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller"
                        style="height: 68%;">
    <div v-for="item in frameList" class="w-full mb-3 rounded-lg flex flex-col p-3" :style="avatarBgColor(item.detail.rarity)">
      <div class="avatar-top flex mb-4">
        <div style="width: 100px;height: 100px;">
          <img :src="item.image" class="w-full h-full object-fill" alt="">
        </div>
        <div class="flex flex-col justify-center ml-4">
              <span class="avatar-font" :style="titleTagColor(item.detail.rarity)">
                {{ item.alias }}
              </span>
          <span class="w-11 h-6 rank-font rounded my-2.5" :style="avatarTagColor(item.detail.rarity)">
                {{ textTag(item.detail.rarity) }}
              </span>
          <span class="get-way-font">
                获得途径：{{ avatarGainMethodText(item.detail.gainMethod) }}
              </span>
        </div>
      </div>
      <a-button type="primary" class="rounded-xl h-12 w-full" style="margin-right: 0;color: var(--active-text);">
        使用
      </a-button>
    </div>
  </vue-custom-scrollbar>
</template>

<style scoped lang="scss">
.avatar-font{
  font-family:Oswald;
  font-size: 16px;
  font-weight: 500;
}
.rank-font{
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: var(--active-text);
  font-weight: 500;
  text-align: center;
}
.get-way-font{
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color:var(--secondary-text);
  font-weight: 400;
}
</style>
