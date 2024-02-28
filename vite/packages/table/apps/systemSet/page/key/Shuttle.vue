<template>
  <xt-option-box class="mt-3">
    <xt-option-info
      title="摇一摇鼠标穿梭"
      isSwitch
      v-model:switch="settings.shake.enable"
    />
    <template v-if="settings.shake.enable">
      <xt-text type="2">目前暂不支持坐标轴为负的屏幕穿梭返回。</xt-text>
      <xt-text type="2" class="mb-3">
        穿梭位置： x:{{ settings.shake.pos.x }} y:{{ settings.shake.pos.y }}
      </xt-text>
      <xt-option-info title="灵敏度" />
      <xt-option-tab
        circle
        style="height: 40px"
        :list="sensitive"
        v-model="sensitiveValue"
      />
      <hr />
      <xt-option-info title="穿梭音效" />
      <xt-option-select :list="sounds" v-model="sound" />
      <xt-button
        type="theme"
        class="my-3"
        :x="80"
        :h="40"
        size="mini"
        @click="setPos"
        >重新设置</xt-button
      >
    </template>
  </xt-option-box>
</template>

<script>
import { mapWritableState, mapActions } from "pinia";
import { appStore } from "../../../../store";
import { message } from "ant-design-vue";

export default {
  name: "Key",
  computed: {
    ...mapWritableState(appStore, ["settings"]),
  },
  data() {
    return {
      aaa: "",
      sensitive: [
        { name: "低", value: "6" },
        { name: "中", value: "5" },
        { name: "高", value: "4" },
      ],
      sounds: [
        {
          name: "木鱼",
          value: "fish.mp3",
        },
        {
          name: "青蛙叫",
          value: "gua.mp3",
        },
        {
          name: "逼兜",
          value: "bidou.wav",
        },
        {
          name: "篮球",
          value: "lanqiu.wav",
        },
        {
          name: "歘",
          value: "chua.wav",
        },
      ],
      sound: "",
      sensitiveValue: "",
      listenEnter: (event) => {
        if (event.code === "Enter") {
          let win32 = $models.win32;
          console.log("监听到回车键了", win32.getMouseMovePoints());

          const point = tsbApi.mouse.getPos();
          this.settings.shake.pos = {
            x: point.x,
            y: point.y,
          };
          message.success("设置摇一摇定位成功。");
          window.shake.pos = this.settings.shake.pos;
          this.shakeConfirm.close();
          // this.$router.push({
          //   name: "key",
          // });
          window.removeEventListener("keydown", this.listenEnter);

          event.preventDefault();
          event.stopPropagation();
        }
      },
      shakeConfirm: null,
    };
  },
  mounted() {
    this.sound = this.settings.shake.audio;
    this.sensitiveValue = String(this.settings.shake.sensitive);
    console.log(this.sound, this.sensitiveValue);
  },
  methods: {
    ...mapActions(appStore, ["disableShake", "enableShake"]),
    setPos() {
      window.addEventListener("keydown", this.listenEnter);
      this.shakeConfirm = window.$ui.confirm(
        "提示",
        "请将鼠标移动到您希望在摇一摇后自动定位到的位置，并按下回车键（Enter），期间请勿关闭此窗口",
        {
          mask: true,
          okText: "取消",
          no: false,
          noText: false,
          ok: () => {
            window.removeEventListener("keydown", this.listenEnter);
            message.info("已取消设置");
          },
        }
      );
    },
  },
  watch: {
    sensitiveValue: {
      handler(newVal) {
        console.log(newVal);
        this.settings.shake.sensitive = Number(newVal);
        window.shake.sensitive = this.settings.shake.sensitive;
      },
    },
    "settings.shake.enable": {
      handler(newVal) {
        if (newVal) {
          this.enableShake();
        } else {
          this.disableShake();
        }
      },
      deep: true,
    },
    sound: {
      handler(newVal) {
        console.log(newVal);
        this.settings.shake.audio = newVal;
        this.$nextTick(() => {
          document.getElementById("shakeAudio").play();
        });
      },
    },
  },
};
</script>

<style scoped lang="scss"></style>
