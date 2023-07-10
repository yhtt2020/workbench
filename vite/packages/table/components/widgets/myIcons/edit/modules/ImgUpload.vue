<template>
  <Title> 图标 </Title>
  <div class="parent flex" style="justify-content: start">
    <div
      class="image"
      :style="[backgroundState]"
      :class="{ active: edit.src.length == 0 }"
    >
      <img
        :src="edit.src"
        v-if="edit.src"
        :style="[radiusStyle, imgStateStyle]"
        class="h-full w-full"
        @error="imgError"
      />
      <div
        style="border-radius: 50%; padding: 5px; cursor: pointer"
        class="xt-bg-2 flex justify-center items-center xt-hover clear"
        @click="clear()"
      >
        <Icon class="icon xt-text no-drag" icon="guanbi"></Icon>
      </div>
    </div>
    <div class="img-info">
      <div class="xt-text-2" style="font-size: 16px">
        推荐图片尺寸：128*128，不能超过2MB
      </div>
      <input
        style="display: none"
        ref="imgRef"
        type="file"
        accept="image/jpg,image/jpeg,image/png"
      />
      <div @click="imgUpload()" class="btn no-drag xt-bg-2">自定义上传</div>
    </div>
  </div>
</template>

<script>
import { validateFile } from "../../../../card/hooks/imageProcessing";
import { getHostAddress } from "../hooks/getHostAddress";
import { message } from "ant-design-vue";
import editMixins from "../hooks/mixins";
export default {
  mixins: [editMixins],
  data() {
    return {
      imgErrorCount: 0,
    };
  },
  computed: {
    radiusStyle() {
      if (this.isRadius) return { borderRadius: this.radius + "px" };
      else return { borderRadius: "0px" };
    },
    backgroundState() {
      if (this.isBackground) {
        return { background: this.backgroundColor };
      } else return { background: "none" };
    },
    imgStateStyle() {
      return {
        "object-fit": this.imgState,
      };
    },
  },
  methods: {
    clear() {
      this.edit.src = "";
    },
    imgUpload() {
      let imgRef = this.$refs.imgRef;
      imgRef.click();
      let that = this;
      imgRef.onchange = function (event) {
        if (this.files.length === 0) return;
        const file = this.files[0];
        let validate = validateFile(file, 2);
        if (validate !== true) return message.error(validate);

        that.edit.src = file.path;
        event.target.value = "";
      };
    },
    imgError() {
      if (this.edit.link === "link") {
        this.imgErrorCount++;
        const domain = getHostAddress(this.edit.open.value);
        switch (this.imgErrorCount) {
          case 1:
            this.edit.src = `https://www.svlik.com/t/favicon/ico.php?` + domain;
            break;
          default:
            this.edit.src = "";
            this.imgErrorCount = 0;
            break;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.parent {
  justify-content: space-between;
  align-content: center;
  margin: 20px 0;

  .btn {
    cursor: pointer;
    width: 120px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-content: center;
    border-radius: 12px;
  }

  .img-info {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .image {
    position: relative;
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    margin-right: 20px;

    .clear {
      position: absolute;
      top: -10px;
      right: -10px;
    }
  }
}

.active {
  border: 2px solid var(--active-bg);
}
</style>
