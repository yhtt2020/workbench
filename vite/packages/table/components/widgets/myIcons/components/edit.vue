<template>
  <Size v-model:size="_size"></Size>
  <Name v-model:isTitle="_isTitle" v-model:titleValue="_titleValue"></Name>
  <ImgUpload
    v-model:src="_src"
    :imgState="_imgState"
    :isRadius="_isRadius"
    :isBackground="_isBackground"
    :radius="_radius"
    :backgroundColor="_backgroundColor"
  ></ImgUpload>
  <ImgState v-model:imgState="_imgState"></ImgState>
  <Radius v-model:isRadius="_isRadius" v-model:radius="_radius"></Radius>
  <BgColor
    v-model:isBackground="_isBackground"
    v-model:backgroundColor="_backgroundColor"
  ></BgColor>
</template>

<script>
import Size from "../edit/Size.vue";

import Name from "../edit/Name.vue";
import ImgUpload from "../edit/ImgUpload.vue";
import ImgState from "../edit/ImgState.vue";
import Radius from "../edit/Radius.vue";
import BgColor from "../edit/BgColor.vue";

import editProxy from "../hooks/editProxy";
import editProps from "../hooks/editProps";
import editData from "../hooks/editData";
export default {
  mixins: [editProxy, editProps, editData],
  components: {
    Size,
    Name,
    ImgUpload,
    ImgState,
    Radius,
    BgColor,
  },
  // 下面都是旧代码 后续 需要考虑重构
  computed: {
    iconObj: {
      immediate: true,
      get() {
        let iconObj = {
          isRadius: this._isRadius,
          radius: this._radius,
          isBackground: this._isBackground,
          backgroundColor: this._backgroundColor,
          isTitle: this._isTitle,
          titleValue: this._titleValue,
          link: this._link,
          linkValue: this._linkValue,
          open: this._open,
          size: this._size,
          src: this._src,
          imgState: this._imgState,
          backgroundIndex: this._backgroundIndex,
        };
        this.$emit("onIconObj", iconObj);
        return iconObj;
      },
    },
  },
  watch: {
    iconObj: {
      handler: () => {},
      immediate: true,
    },
  },
  methods: {
    imgError() {
      if (this._link === "link") {
        this._src = "";
        this.leaveInput(true);
      }
      this._src = "";
    },
    leaveInput(flag) {
      // 匹配icon放在失去焦点后在调用外部api 减少频繁请求被屏蔽
      if (this._src.length === 0) {
        const url = new URL(this._open.value);
        const urlWithoutParams = url.origin;
        if (flag == undefined) {
          this._src = urlWithoutParams + "/favicon.ico";
        } else {
          this._src =
            `https://www.svlik.com/t/favicon/ico.php?` + urlWithoutParams;
        }
      }
    },

    save() {
      if (this._src.length == 0 || this._src == "") return "未上传图标";
      return this.iconObj;
    },
  },
};
</script>

<style lang="scss" scoped></style>
