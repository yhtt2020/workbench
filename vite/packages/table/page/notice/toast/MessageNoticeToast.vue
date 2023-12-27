<template>
  <div class="flex" style="width: 380px;">
    <div class="flex flex-col w-full">
      <div class="flex items-center justify-between" style="margin-bottom: 13px;">
        <div class="flex items-center">
          <div class="flex items-center justify-center" style="width: 32px;height: 32px;">
            <img :src="msg.icon" class="w-full rounded-lg h-full object-cover" alt="">
          </div>
          <div class="font-16 ml-3" style="color: var(--primary-text);">{{ msg.title }}</div>
        </div>
        <div class="flex items-center active-button pointer justify-center" v-if="styles"
             style="width:21px;height:21px;" @click="closeMessage">
          <img src="/img/icon/close-circle-fill1.png" class="w-full rounded-full h-full object-cover" alt="">
        </div>
        <div class="flex items-center pointer active-button justify-center" v-else style="width:21px;height:21px;"
             @click="closeMessage">
          <img src="/img/icon/close-circle-fill.png" class="w-full rounded-full h-full object-cover" alt="">
        </div>
      </div>

      <div class="font-16" style="color: var(--secondary-text);margin-bottom: 24px;">
        <NoticeBody :content="msg"></NoticeBody>
      </div>

      <div class="flex items-center justify-end gap-2">
        <div class="font-16" style="color:var(--secondary-text);">{{ formatTime(parseInt(msg.time) * 1000) }}</div>
        <UrlButtons @close="close" :urls="urls" @viewNow="viewNow"></UrlButtons>
      </div>
    </div>
  </div>
  <audio ref="message" src="/sound/message.mp3"></audio>
</template>

<script>
import { defineComponent, ref, toRefs, computed, } from 'vue'
import { mapWritableState, mapActions } from 'pinia'
import { formatTime } from '../../../util'
import { appStore } from '../../../store'
import Button from '../../../ui/libs/Button/index.vue'
import Browser from '../../../js/common/browser'
import UrlButtons from '../part/UrlButtons.vue'
import NoticeBody from '../part/NoticeBody.vue'

export default defineComponent({
  props: ['msg', 'type', 'play'],
  components: { NoticeBody, UrlButtons, Button },
  computed: {
    ...mapWritableState(appStore, ['styles', 'settings'])
  },
  emits:['closeToast','messageExamine','putNotice'],

  methods: {
    ...mapActions(appStore, ['setMessagePlay']),

  },
  data () {
    return {
      urls: []
    }
  },

  watch: {
    'messageType': {
      handler (newVal) {
        if (this.play && newVal === 'message') {
          this.setMessagePlay()
          if (this.settings.messagePlay) {
            this.$nextTick(() => {
              this.$refs.message.play()
            })
          } else {
            this.$nextTick(() => {
              this.$refs.message.pause()
            })
          }
        }
      },
      immediate: true,
      deep: true,
    }

  },

  mounted () {
    if (this.msg.urls) {
      this.urls = JSON.parse(this.msg.urls)
    }
  },
  setup (props, ctx) {
    //  const talkLater = () =>{  // 点击稍后再说按钮
    //    ctx.emit('closeToast')
    //    ctx.emit('nowCheck')
    //  }

    const closeMessage = () => {
      ctx.emit('closeToast')
      ctx.emit('putNotice')
    }

    const viewNow = () => {  // 点击立即查看
      ctx.emit('closeToast')
      ctx.emit('messageExamine')
    }
    const close= ()=> {
      ctx.emit('closeToast')
    }
    return {
      formatTime, closeMessage,
      //  talkLater,
      viewNow,close
    }
  }
})

</script>

<style lang="scss" scoped>
</style>
