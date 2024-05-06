<template>
  <div class="pt-6 text-center font-16 xt-text">最后一步啦，定制主题 ~</div>
  <div class="px-4">
    <div class="p-4 pb-1 mt-2 xt-bg-2 rounded-xl">
      <xt-option-info title="主题色" />
      <xt-option-color :isLinear="false" v-model:color="themeColor" :colorNum="5" />
    </div>
    <div class="p-4 pb-1 mt-3 xt-bg-2 rounded-xl "><xt-option-info title="桌面壁纸" info="选择喜欢的图片作为工作台桌面壁纸。" />
      <div class="mb-4">
        <xt-update-desk-bg></xt-update-desk-bg>
      </div>
      <hr />
      <xt-option-info title="桌面壁纸模糊度" info="调节桌面壁纸的模糊程度。" icon="fluent:arrow-clockwise-16-filled"
        @onIconClick="backgroundSettings.backGroundImgBlur = 0" />
      <xt-option-slider v-model:slider="backgroundSettings.backGroundImgBlur" :min="0" :max="100" />
    </div>
  </div>
</template>

<script>
import { Icon } from '@iconify/vue';
import { setBgColor, setSecondaryBgColor } from "../../../../components/card/hooks/styleSwitch/setStyle";

export default {
  name: 'Theme',
  props: ['backgroundSettings'],
  data() {
    return {
      themeColor:''

    }
  },
  async mounted() {
  },
  watch:{
    // 修改主题颜色
    themeColor(newV) {
      if (!newV) return;
      setBgColor(newV);
      setSecondaryBgColor(newV);
    },
  },
  components: {
    Icon,
  },

  computed: {
  },
  methods: {


  }
}
</script>

<style scoped lang="scss"></style>
