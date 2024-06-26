<template>
  <div class="flex" style="width: 380px">
    <div class="flex flex-col w-full">
      <div
        class="flex items-center justify-between"
        style="margin-bottom: 13px"
      >
        <div class="flex items-center">
          <div
            class="flex items-center justify-center"
            style="width: 32px; height: 32px"
          >
            <img
              :src="msg.icon"
              class="w-full rounded-full h-full object-cover"
              alt=""
            />
          </div>
          <div class="font-16 ml-3" style="color: var(--primary-text)">
            {{ msg.title }}
          </div>
        </div>

        <div
          class="flex items-center active-button pointer justify-center"
          v-if="styles"
          style="width: 21px; height: 21px"
          @click="closeNotice"
        >
          <img
            src="/img/icon/close-circle-fill1.png"
            class="w-full rounded-full h-full object-cover"
            alt=""
          />
        </div>
        <div
          class="flex items-center pointer active-button justify-center"
          v-else
          style="width: 21px; height: 21px"
          @click="closeNotice"
        >
          <img
            src="/img/icon/close-circle-fill.png"
            class="w-full rounded-full h-full object-cover"
            alt=""
          />
        </div>
      </div>

      <div
        class="font-16"
        style="color: var(--secondary-text); margin-bottom: 24px"
      >
        {{ systemContent }}
      </div>

      <div class="flex items-center justify-between">
        <div class="font-16" style="color: var(--secondary-text)">
          {{ formatTime(parseInt(msg.time) * 1000) }}
        </div>
        <div
          class="px-5 py-2 rounded-lg flex pointer items-center justify-center active-button"
          style="background: var(--active-bg); color: var(--active-text)"
          @click="viewNow"
        >
          查看
        </div>
      </div>
    </div>
  </div>

  <audio ref="notice" src="/sound/notice.mp3"></audio>
</template>

<script>
import { defineComponent, ref, toRefs, computed } from "vue";
import { mapWritableState, mapActions } from "pinia";
import { formatTime } from "../../../util";
import { appStore } from "../../../store";

export default {
  name: "SystemNoticeToast",

  props: ["msg", "type", "play"],

  computed: {
    ...mapWritableState(appStore, ["settings"]),

    // 当前消息内容
    systemContent() {
      return this.msg?.body ? this.msg?.body : this.msg?.content;
    },
  },

  methods: {
    ...mapActions(appStore, ["setNoticePlay"]),
    formatTime,

    // 右上角关闭按钮
    closeNotice() {
      this.$emit("closeToast");
      this.$emit("putNotice");
    },

    //  const talkLater = () =>{  // 点击稍后再说按钮
    //   ctx.emit('closeToast')
    //   ctx.emit('nowCheck')
    //  }

    viewNow() {
      // 点击立即查看
      this.$emit("closeToast");
      this.$emit("systemExamine");
    },
  },

  watch: {
    noticeType: {
      handler(newVal) {
        if (this.type === "notice" && this.play) {
          this.setNoticePlay();
          if (this.settings.noticePlay) {
            this.$nextTick(() => {
              this.$refs.notice.play();
            });
          } else {
            this.$nextTick(() => {
              this.$refs.notice.pause();
            });
          }
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
