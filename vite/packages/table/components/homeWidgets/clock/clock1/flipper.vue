<template>
  <div class="M-Flipper" :class="[flipType, { go: isFlipping }]">
    <div class="digital front" :class="_textClass(frontTextFromData)"></div>
    <div class="digital back" :class="_textClass(backTextFromData)"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isFlipping: false,
      flipType: "down",
      frontTextFromData: 0,
      backTextFromData: 1,
    };
  },
  props: {
    // front paper text
    // 前牌文字
    frontText: {
      type: [Number, String],
      default: 0,
    },
    // back paper text
    // 后牌文字
    backText: {
      type: [Number, String],
      default: 1,
    },
    // flipping duration, please be consistent with the CSS animation-duration value.
    // 翻牌动画时间，与CSS中设置的animation-duration保持一致
    duration: {
      type: Number,
      default: 600,
    },
  },
  methods: {
    _textClass(number) {
      return "number" + number;
    },
    _flip(type, front, back) {
      // 如果处于翻转中，则不执行
      if (this.isFlipping) {
        return false;
      }
      this.frontTextFromData = front;
      this.backTextFromData = back;
      // 根据传递过来的type设置翻转方向
      this.flipType = type;
      // 设置翻转状态为true
      this.isFlipping = true;
      setTimeout(() => {
        // 设置翻转状态为false
        this.isFlipping = false;
        this.frontTextFromData = back;
      }, this.duration);
    },
    // 下翻牌
    flipDown(front, back) {
      this._flip("down", front, back);
    },
    // 上翻牌
    flipUp(front, back) {
      this._flip("up", front, back);
    },
    // 设置前牌文字
    setFront(text) {
      this.frontTextFromData = text;
    },
    // 设置后牌文字
    setBack(text) {
      this.backTextFromData = text;
    },
  },
  created() {
    this.frontTextFromData = this.frontText;
    this.backTextFromData = this.backText;
  },
};
</script>

<style scoped></style>
