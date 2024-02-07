<script lang="ts">
import {
  avatarGainMethodText,
  avatarTagColor,
  textTag,
  titleTagColor
} from "../js/common/avatar";
import {mapActions} from "pinia";
import {frameStore} from "../store/avatarFrame";
import {message} from "ant-design-vue";
import {appStore} from "../store";
import {Avatar} from 'ant-design-vue'

export default {
  name: "Item.vue",
  components: {
    Avatar
  },
  props: {
    'item': {},
    'size': 80,
    'showTitle': false
  },
  methods: {
    ...mapActions(appStore, ['getUserInfo', 'showUserCard']),
    titleTagColor,
    avatarTagColor,
    textTag,
    avatarGainMethodText,
    ...mapActions(frameStore, ['getMyFrames', 'equipFrame', 'getFrameGoods']),
    async equip(item) {
      let rs = await this.equipFrame(item.nanoid)
      if (rs && rs.status) {
        this.frameList.forEach(i => {
          i.equipped = false
        })
        item.equipped = true
        this.getUserInfo()
        this.refreshTeamUsers()
        message.success('装备成功。')
      } else {
        message.error('装备失败，请稍后再试。')
      }
    },
  }
}
</script>

<template>
  <tippy :z-index="99" trigger="mouseenter" :interactive="true">
    <Avatar shape="square" :size="size" :src="item.image" class="object-cover display-inline-block"
            :style="{width:size+'px',height:size+'px'}"
            alt=""></Avatar>
    <span v-if="showTitle" class="rank-font">{{ item.alias }}</span>
    <template #content>
      <div class="p-2" style="width: 320px">
        <div class="mb-2">
          <a-row>
            <a-col :span="10">
              <a-avatar shape="square" :size="100" :src="item.image" class="w-full h-full object-cover "
                        style="" alt=""></a-avatar>
            </a-col>
            <a-col class="text-left" :span="14">
              <div class="mt-6">
                      <span class="avatar-font mr-2 font-bold" :style="titleTagColor(item.detail.rarity)">
                        {{ item.alias }}
                      </span>
                <span class="h-6 rounded py-0.5 px-2 my-2.5"
                      :style="avatarTagColor(item.detail.rarity)">
                        {{ textTag(item.detail.rarity) }}
                      </span>
              </div>
              <div style="font-size: 12px" class="xt-text-2 mt-1 px-2 py-2">
                {{ item.summary }}
              </div>

            </a-col>
          </a-row>
          <div class="xt-bg-2 mb-4" style="width:100%;border-radius: 12px;">
            <div class="px-2 py-4">
              <span>获取方式</span>
              <span>{{ avatarGainMethodText(item.detail.gainMethod) }}</span>
            </div>
            <!-- <div class="text-content">
              <span>已售</span>
              <span>{{item.ownersCount[1]}} 件</span>
            </div> -->
          </div>
        </div>
      </div>
    </template>
  </tippy>
</template>

<style scoped lang="scss">
</style>
