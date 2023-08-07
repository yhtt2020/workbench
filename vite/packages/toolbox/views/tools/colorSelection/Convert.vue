<template>
  <div class="flex justify-between">
    <div class="flex items-center h-12">
      <XtMenu :menus="menus" :data="index" v-for="(item, index) in colorList">
        <colorPicker
          class="mr-3"
          style="margin-top: 6px"
          v-model:hex="colorList[index]"
          @click="selectColor(index)"
          :style="{
            border: index == selectIndex ? '4px solid var(--active-bg)' : '',
          }"
        />
      </XtMenu>

      <XtBaseIcon
        @click="addColor()"
        icon="guanbi2"
        class="xt-theme-text"
        style="transform: rotate(45deg); font-size: 24px"
      ></XtBaseIcon>
    </div>
    <div
      @click="getColor()"
      class="flex items-center xt-theme-text cursor-pointer"
    >
      <XtBaseIcon icon="icon-checkin"></XtBaseIcon>
      <div class="ml-1">屏幕取色</div>
    </div>
  </div>
  <div>
    <div class="flex my-2 h-12" style="">
      <!-- rgb -->
      <XtInput class="xt-bg-2 flex-1 relative" v-model:data="RGB">
        <template #addonBefore>
          <div
            class="h-full flex items-center xt-text justify-between px-4 relative"
            style="
              width: 50px;

              background: var(--disable-text);
              opacity: 0.2;
              border-radius: 8px 0 0 8px;
            "
          ></div>
          <div
            class="absolute xt-text top-1/2 -translate-y-1/2 text-base"
            style="left: 10px"
          >
            RGB
          </div>
        </template>
      </XtInput>
      <XtIcon :copy="RGB" icon="fuzhi" size="28" type=""></XtIcon>
      <!-- hex -->
      <XtInput class="xt-bg-2 flex-1" v-model:data="HEX">
        <template #addonBefore>
          <div
            class="h-full flex items-center xt-text justify-between px-4 relative"
            style="
              width: 50px;
              background: var(--disable-text);
              opacity: 0.2;
              border-radius: 8px 0 0 8px;
            "
          ></div>
          <div
            class="absolute xt-text top-1/2 -translate-y-1/2 text-base"
            style="left: 10px"
          >
            HEX
          </div>
        </template>
      </XtInput>
      <XtIcon :copy="HEX" icon="fuzhi" size="28" type=""> </XtIcon>
    </div>
    <div class="flex my-2 h-12">
      <!-- HSV/HSB -->
      <XtInput class="xt-bg-2 flex-1" v-model:data="HSV">
        <template #addonBefore>
          <div
            class="h-full flex items-center xt-text justify-between px-4 relative"
            style="
              width: 50px;
              background: var(--disable-text);
              opacity: 0.2;
              border-radius: 8px 0 0 8px;
            "
          ></div>
          <div
            class="absolute xt-text top-1/2 -translate-y-1/2 text-base"
            style="left: 10px"
          >
            HSV
          </div>
        </template>
      </XtInput>
      <XtIcon :copy="HSV" icon="fuzhi" size="28" type=""></XtIcon>
      <!-- HSL -->
      <XtInput class="xt-bg-2 flex-1" v-model:data="HSL">
        <template #addonBefore>
          <div
            class="h-full flex items-center xt-text justify-between px-4 relative"
            style="
              width: 50px;
              background: var(--disable-text);
              opacity: 0.2;
              border-radius: 8px 0 0 8px;
            "
          ></div>
          <div
            class="absolute xt-text top-1/2 -translate-y-1/2 text-base"
            style="left: 10px"
          >
            HSL
          </div>
        </template>
      </XtInput>
      <XtIcon :copy="HSL" icon="fuzhi" size="28" type=""></XtIcon>
    </div>
  </div>
</template>

<script>
import ColorPicker from "colorpicker-v3";
import "colorpicker-v3/style.css";
import { defineAsyncComponent } from "vue";
import tinycolor from "tinycolor2";
import { colorSelection } from "../../../store/colorSelection";
import { mapWritableState } from "pinia";

export default {
  components: {
    ColorPicker,
    Convert: defineAsyncComponent(() => import("./convert.vue")),
  },
  data() {
    return {
      selectIndex: 0,
      RGB: "",
      HSL: "",
      HEX: "",
      HSV: "",
      menus: [{ label: "删除", callBack: this.delColor }],
    };
  },
  computed: {
    ...mapWritableState(colorSelection, ["colorList"]),
  },
  watch: {
    colorList: {
      handler(newV) {
        var color = tinycolor(this.colorList[this.selectIndex]);
        this.RGB = color.toRgbString(); // "rgb(255, 0, 0)"
        this.HEX = color.toHexString(); // "#ff0000"
        this.HSL = color.toHslString(); // "hsl(0, 100%, 50%)"
        this.HSV = color.toHsvString(); // "hsv(0, 100%, 100%)"
        // this.getCMYK( newV[this.selectIndex]);
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    delColor(index) {
      this.selectIndex--;
      this.colorList.splice(index, 1);
    },
    selectColor(index) {
      this.selectIndex = index;
    },
    getColor() {
      if (!window.EyeDropper) {
        resultElement.textContent = "你的浏览器不支持 EyeDropper API";
        return;
      }

      const eyeDropper = new EyeDropper();

      eyeDropper
        .open()
        .then((result) => {
          this.colorList[this.selectIndex] = result.sRGBHex;
        })
        .catch((e) => {
          console.log("e :>> ", e);
        });
    },

    addColor() {
      if (this.colorList.length > 6) return;
      this.colorList.push("#ffffff");
      this.selectIndex = this.colorList.length - 1;
    },
    getCMYK(hexColor) {
      // 去掉 # 号
      hexColor = hexColor.replace("#", "");

      // 将 HEX 转换为 RGB
      const r = parseInt(hexColor.substring(0, 2), 16) / 255;
      const g = parseInt(hexColor.substring(2, 4), 16) / 255;
      const b = parseInt(hexColor.substring(4, 6), 16) / 255;

      // 将 RGB 转换为 CMYK
      const k = 1 - Math.max(r, g, b);
      const c = (1 - r - k) / (1 - k);
      const m = (1 - g - k) / (1 - k);
      const y = (1 - b - k) / (1 - k);

      // 将 CMYK 值乘以 100 并四舍五入
      const cmyk = {
        c: Math.round(c * 100),
        m: Math.round(m * 100),
        y: Math.round(y * 100),
        k: Math.round(k * 100),
      };

      this.CMYK = `${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k}`;
      return this.CMYK;
    },
  },
};
</script>

<style lang="scss" scoped>
:deep(.zs-color-picker-panel__visible) {
  position: absolute;
  top: -30px !important;
  right: -215px !important;
}
:deep(.zs-color-picker-panel) {
  position: absolute;
  top: -30px !important;
  right: -215px !important;
}

:deep(.zs-color-picker-btn) {
  width: 24px;
  height: 24px;
  border-radius: 50% !important;
  background-image: none;
  border: 0;
}

:deep(.zs-color-picker-btn-color) {
  border-radius: 50% !important;
  border: 0 !important;
}
:deep(.zs-color-picker) {
  border-radius: 100px !important;
}
</style>
