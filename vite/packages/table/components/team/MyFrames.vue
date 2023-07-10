<script lang="ts">
import {defineComponent} from 'vue'
import {avatarBgColor, avatarTagColor, textTag, titleTagColor} from "../../js/common/avatar";
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
            frame: itemOwner.item.detail
          }
        })
        console.log(this.frameList)

      }
    })
  },
  methods: {
    ...mapActions(frameStore, ['getMyFrames']),
    avatarTagColor, textTag, titleTagColor, avatarBgColor,
  }
})
</script>

<template>
  <vue-custom-scrollbar @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller"
                        style="height: 68%;">
    <div v-for="item in frameList" class="w-full mb-3 rounded-lg flex flex-col p-3" :style="avatarBgColor(item)">
      <div class="avatar-top flex mb-4">
        <div style="width: 100px;height: 100px;">
          <img :src="item.image" class="w-full h-full object-fill" alt="">
        </div>
        <div class="flex flex-col justify-center ml-4">
              <span class="avatar-font" :style="titleTagColor(item)">
                {{ item.alias }}
              </span>
          <span class="w-11 h-6 rank-font rounded my-2.5" :style="avatarTagColor(item)">
                {{ textTag(item) }}
              </span>
          <span class="get-way-font">
                获得途径：商店购买、日常签到
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
