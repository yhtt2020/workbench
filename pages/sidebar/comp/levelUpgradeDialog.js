const levelUpgradeTempl = /* html */`
  <div class="lv-upgrade-wrap" v-show="visible">
    <div class="lv-upgrade-mask" @click.stop="clkmask"></div>
    <div class="lv-upgrade-dialog flex flex-direction align-start justify-around">
      <p class="cl-ant-p"><span>🎉</span><strong style="padding-left: 10px">恭喜！您的现在等级已升至<span style="font-size: 16px; color: #6196FE; padding:0px 5px">{{this.$store.getters.getTsGrade.lv}}</span>级</strong></p>
      <p class="cl-ant-p" style="padding-left: 28px">当前累积在线时长：{{this.$store.getters.getTsGrade.cumulativeHours}}小时，继续使用想天浏览器以获得更高的在线时长和等级。</p>
      <a-icon type="close" class="close-btn" @click="closeLevelUpgrade"></a-icon>
    </div>
  </div>
`

Vue.component("level-upgrade", {
  template: levelUpgradeTempl,
  props: {
    visible: {
      type: Boolean,
    }
  },
  methods: {
    closeLevelUpgrade() {
      this.$emit('closeLevelUpgrade')
    }
  }
})
