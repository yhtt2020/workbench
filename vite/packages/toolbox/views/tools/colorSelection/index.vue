<template>
  <XtTab
    boxClass="xt-bg-2 p-1"
    style="height: 48px"
    :list="list"
    v-model:data="selectNav"
  ></XtTab>
  <div class="flex justify-between">
    <div class="flex items-center h-12">
      没对齐
      {{ colorList[selectIndex] }}
      <XtIcon
        :copy="colorList[selectIndex]"
        icon="fuzhi"
        size="28"
        type=""
      ></XtIcon>

      --
      <div
        v-for="(item, index) in colorList"
        class="mr-2"
        style="border-radius: 50%; height: 29px; width: 30px"
        :style="{ border: selectIndex == index ? '3px solid red' : '' }"
      >
        <XtBaseColor
          @click.native="selectColor(index)"
          v-model:data="colorList[index]"
        ></XtBaseColor>
      </div>
      <XtBaseIcon
        @click="addColor()"
        icon="guanbi2"
        class="xt-theme-text"
        style="transform: rotate(45deg); font-size: 24px"
      ></XtBaseIcon>
    </div>
    <div>
      <button @click="getColor()">打开拾色器</button> <span id="result"></span>
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
              width: 85px;

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
      <XtInput class="xt-bg-2 flex-1" v-model:data="colorList[selectIndex]">
        <template #addonBefore>
          <div
            class="h-full flex items-center xt-text justify-between px-4 relative"
            style="
              width: 85px;
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
              width: 85px;
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
              width: 85px;
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
    <div class="flex my-2 h-12">
      <!-- CMYK -->
      <div class="flex-1">
        <div class="flex h-12">
          <XtInput class="xt-bg-2 flex-1" v-model:data="CMYK">
            <template #addonBefore>
              <div
                class="h-full flex items-center xt-text justify-between px-4 relative"
                style="
                  width: 85px;
                  background: var(--disable-text);
                  opacity: 0.2;
                  border-radius: 8px 0 0 8px;
                "
              ></div>
              <div
                class="absolute xt-text top-1/2 -translate-y-1/2 text-base"
                style="left: 10px"
              >
                CMYK
              </div>
            </template>
          </XtInput>
          <XtIcon :copy="CMYK" icon="fuzhi" size="28" type=""></XtIcon>
        </div>
      </div>
      <div class="flex-1">这个算不准</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      color: "#fff",
      colorList: ["#FF0000"],
      selectIndex: 0,
      RGB: "",
      HSL: "",
      HSV: "",
      CMYK: "",
      selectNav: "convert",
      list: [
        { name: "颜色转换", value: "convert" },
        { name: "颜色提取", value: "extract" },
      ],
    };
  },
  watch: {
    colorList: {
      handler(newV) {
        let color = newV[this.selectIndex];
        console.log("newV :>> ", color);
        this.RGB = this.getRGB(color);
        this.getHSL(color);
        this.getCMYK(color);
        this.getHSV(color);
        console.log("object :>> ", this.RGB);
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    selectColor(index) {
      console.log("index :>> ", index);
      this.selectIndex = index;
    },
    getColor() {
      if (!window.EyeDropper) {
        console.log("object :>> ", "你的浏览器不支持 EyeDropper API");
        return;
      }
      const eyeDropper = new EyeDropper();
      eyeDropper
        .open()
        .then((result) => {
          resultElement.textContent = result.sRGBHex;
          resultElement.style.backgroundColor = result.sRGBHex;
        })
        .catch((e) => {
          resultElement.textContent = e;
        });
    },
    getRGB(color) {
      // 去掉 # 号（如果有的话）
      color = color.replace("#", "");

      // 提取 R, G, B 分量
      const r = parseInt(color.substring(0, 2), 16);
      const g = parseInt(color.substring(2, 4), 16);
      const b = parseInt(color.substring(4, 6), 16);

      // 返回 rgb 格式字符串
      return `RGB(${r}, ${g}, ${b})`;
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
    getHSL(hexColor) {
      // 去掉 # 号
      hexColor = hexColor.replace("#", "");

      // 将 HEX 转换为 RGB
      const r = parseInt(hexColor.substring(0, 2), 16) / 255;
      const g = parseInt(hexColor.substring(2, 4), 16) / 255;
      const b = parseInt(hexColor.substring(4, 6), 16) / 255;

      // 将 RGB 转换为 HSL
      const cmax = Math.max(r, g, b);
      const cmin = Math.min(r, g, b);
      const delta = cmax - cmin;

      let h = 0;
      if (delta !== 0) {
        if (cmax === r) {
          h = 60 * (((g - b) / delta) % 6);
        } else if (cmax === g) {
          h = 60 * ((b - r) / delta + 2);
        } else {
          h = 60 * ((r - g) / delta + 4);
        }
      }

      if (h < 0) {
        h += 360;
      }

      const l = (cmax + cmin) / 2;
      const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
      this.HSL = `HSL(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(
        l * 100
      )}%)`;
    },
    getHSV(hexColor) {
      // 去掉 # 号
      hexColor = hexColor.replace("#", "");

      // 将 HEX 转换为 RGB
      const r = parseInt(hexColor.substring(0, 2), 16) / 255;
      const g = parseInt(hexColor.substring(2, 4), 16) / 255;
      const b = parseInt(hexColor.substring(4, 6), 16) / 255;

      // 将 RGB 转换为 HSV
      const v = Math.max(r, g, b);
      const d = v - Math.min(r, g, b);
      const s = v === 0 ? 0 : d / v;
      let h =
        v === r
          ? 60 * (((g - b) / d) % 6)
          : v === g
          ? 60 * ((b - r) / d + 2)
          : 60 * ((r - g) / d + 4);

      if (h < 0) {
        h += 360;
      }

      // 将 HSV 值转换为整数，并构造 HSV 字符串
      h = Math.round(h);
      this.HSV =
        "HSV(" +
        h +
        ", " +
        Math.round(s * 100) +
        "%, " +
        Math.round(v * 100) +
        "%)";
    },
    addColor() {
      this.colorList.push("#fff");
    },
  },
};
</script>

<style lang="scss" scoped>
:deep(.zs-color-picker-panel__visible) {
  position: absolute;
  top: -20px !important;
  right: -215px !important;
}
:deep(.zs-color-picker-panel) {
  position: absolute;
  top: -20px !important;
  right: -215px !important;
}

:deep(.zs-color-picker-btn) {
  width: 24px !important;
  height: 24px !important;
  border-radius: 50% !important;
}
</style>
