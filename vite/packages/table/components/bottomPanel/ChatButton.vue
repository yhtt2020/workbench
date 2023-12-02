<script lang="ts">
import {defineComponent} from 'vue'
import Emoji from "../comp/Emoji.vue";

export default defineComponent({
  name: "ChatButton",
  components: {Emoji},
  data() {
    return {
      unReadStatus: undefined,
    }
  },
  mounted() {
    // 监听IM聊天消息是否已读,未读总数
    window.$chat.on(window.$TUIKit.TIM.EVENT.TOTAL_UNREAD_MESSAGE_COUNT_UPDATED, (e) => {
      this.unReadStatus = e.data
    })
  },
  methods: {
    enterIM() {
      this.$router.push({name: 'chat'})
    },
  }
})
</script>

<template>
  <a-tooltip title="社群沟通">
  <div @click.stop="enterIM" style="padding:0.6em !important;;position:relative;" >
    <emoji style="width: 52px;height:52px" icon="chat"></emoji>
    <div class="rounded-full flex items-center justify-center  ml-3 p-0.5"
         style="width:20px;height:20px; background:red;color:var(--active-text); position: absolute;right:4px;top:4px"
         v-if="unReadStatus !== undefined &&  unReadStatus !== 0"
    >
      <span v-if="unReadStatus > 99 "  style="font-size:9px;">99+</span>
      <span v-else> {{ unReadStatus }} </span>
    </div>
  </div>
  </a-tooltip>
</template>

<style scoped lang="scss">

</style>
