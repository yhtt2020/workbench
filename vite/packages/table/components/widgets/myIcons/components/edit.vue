<template>
  <div>
    <fastNav
      style="z-index: 99999999999999999"
      @returnApp="returnApp"
      ref="fastNavRef"
    ></fastNav>
    <Radio v-model:data="_size" :list="sizeList"></Radio>
    <div class="text-base" style="margin: 12px 0">链接/快捷方式</div>
    <!-- 未选择打开方式 -->
    <div class="link-box" v-if="_link == ''">
      <div class="xt-bg-2 xt-text xt-hover" @click="_link = 'link'">
        网页链接
      </div>
      <div class="xt-bg-2 xt-text xt-hover" @click="fastClick()">快捷方式</div>
      <input style="display: none" ref="fileRef" type="file" />
      <div class="xt-bg-2 xt-text xt-hover" @click="customClick()">
        应用导航
      </div>
    </div>
    <!-- 链接方式 -->
    <template v-else-if="_link === 'link'">
      <a-input
        @blur="leaveInput()"
        v-model:value="_open.value"
        placeholder=""
        class="xt-bg-2 xt-border input"
      >
        <template #suffix>
          <div
            style="border-radius: 50%; padding: 5px"
            class="xt-bg-2 flex justify-center items-center xt-hover cursor-pointer"
            @click="clear()"
          >
            <Icon class="icon xt-text no-drag" icon="guanbi"></Icon>
          </div>
        </template>
      </a-input>
      <!-- <div class="w-full h-12 xt-bg-2 rounded-xl flex p-1">
        <div
          class="flex-1 flex justify-center items-center"
          :class="{ 'xt-active-btn': 'internal' == _open.type }"
          @click="_open.type = 'internal'"
        >
          工作台内打开
        </div>
        <div
          class="flex-1 flex justify-center items-center"
          :class="{ 'xt-active-btn': 'thinksky' == _open.type }"
          @click="_open.type = 'thinksky'"
        >
          想天浏览器
        </div>
        <div
          class="flex-1 flex justify-center items-center"
          :class="{ 'xt-active-btn': 'default' == _open.type }"
          @click="_open.type = 'default'"
        >
          系统默认浏览器
        </div>
      </div> -->
      <Radio
        :list="linkList"
        v-model:data="_open.type"
        text="选择打开的浏览器"
      ></Radio>
      <!-- <a-radio-group
        class="my-3"
        style="font-size: 18px"
        v-model:value="_open.type"
        size="large"
      >
        <a-radio value="internal" class="mr-8">工作台内打开</a-radio>
        <a-radio value="thinksky" class="mr-8">想天浏览器</a-radio>
        <a-radio value="default" class="mr-8">系统默认浏览器</a-radio>
      </a-radio-group> -->
    </template>

    <!-- 快捷和应用 -->
    <template v-else>
      <a-input
        v-model:value="title"
        placeholder=""
        class="xt-bg-2 xt-border input"
        style="border: 0"
      >
        <template #suffix>
          <div
            style="border-radius: 50%; padding: 5px; cursor: pointer"
            class="xt-bg-2 flex justify-center items-center xt-hover"
            @click="clear()"
          >
            <Icon class="icon xt-text no-drag" icon="guanbi"></Icon>
          </div>
        </template>
      </a-input>
    </template>
    <!-- 设置组件名称 -->
    <div class="text-base" style="margin: 12px 0">图标名称</div>
    <a-input
      v-model:value="_titleValue"
      placeholder="给你的图标组件取个名称吧"
      class="xt-bg-2 xt-border input"
    />
    <!-- 设置组件图标 -->
    <div class="text-base" style="margin: 12px 0">图标</div>
    <div class="parent" style="justify-content: start">
      <div
        class="image"
        :style="[backgroundState]"
        :class="{ active: _src.length == 0 }"
      >
        <img
          :src="_src"
          v-if="_src"
          :style="radiusState"
          style="width: 100%; height: 100%; object-fit: cover"
          @error="imgError"
        />
        <div
          style="border-radius: 50%; padding: 5px; cursor: pointer"
          class="xt-bg-2 flex justify-center items-center xt-hover clear"
          @click="this._src = ''"
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
        <div @click="upIcon()" class="btn no-drag xt-bg-2">自定义上传</div>
      </div>
    </div>
    <!-- 设置组件圆角 -->
    <div class="parent">
      <div class="text-base">图标圆角</div>
      <a-switch v-model:checked="_isRadius"></a-switch>
    </div>
    <a-slider
      v-if="_isRadius"
      v-model:value="_radius"
      :max="50"
      :step="1"
      class="no-drag"
    />
    <!-- 设置图标背景 -->
    <div class="parent">
      <div class="text-base">图标背景</div>
      <a-switch v-model:checked="_isBackground"></a-switch>
    </div>
    <div v-if="_isBackground" class="item-box">
      <colorPicker style="width: 100px" v-model:hex="_backgroundColor" />
      <div
        class="item"
        :key="item"
        :style="{ background: backgroundColorList[`${'color' + item}`] }"
        v-for="item in 15"
        @click="backgroundClick(item)"
        :class="{ active: _backgroundIndex == item }"
      ></div>
    </div>
  </div>
</template>

<script>
import fastNav from "./fastNav.vue";
import Radio from "../../../card/hooks/Radio.vue";
import { validateFile } from "../../../card/hooks/innerImgHook";
import { sizeList, linkList, backgroundColorList } from "./edit";
import { message } from "ant-design-vue";
export default {
  components: { fastNav, Radio },
  props: {
    isRadius: { type: Boolean },
    radius: { type: Number },
    isBackground: { type: Boolean },
    backgroundColor: { type: String },
    titleValue: { type: String },
    link: { type: String },
    linkValue: {},
    size: { type: String, default: "mini" },
    open: {
      default: () => {
        return {
          value: "",
          type: "internal",
        };
      },
    },
    src: { type: String },
    backgroundIndex: { type: Number },
  },
  mounted() {},
  data() {
    return {
      sizeList,
      linkList,
      backgroundColorList,
      _isRadius: this.isRadius,
      _radius: this.radius,
      _isBackground: this.isBackground,
      _backgroundColor: this.backgroundColor,
      _titleValue: this.titleValue,
      _link: this.link,
      _linkValue: this.linkValue,
      _size: this.size,
      _open: { ...this.open },
      _src: this.src,
      _backgroundIndex: this.backgroundIndex,
    };
  },
  computed: {
    title() {
      return this._open.name || this._linkValue.name || this._linkValue || "";
    },
    backgroundState() {
      if (this._isBackground) {
        if (this._backgroundColor === null) this.backgroundClick(1);
        return { background: this._backgroundColor };
      } else return { background: "none" };
    },
    radiusState() {
      if (this._isRadius) return { borderRadius: this._radius + "px" };
      else return { borderRadius: "0px" };
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
        this._src = urlWithoutParams + "/favicon.ico";
        if (flag == undefined) {
          this._src = urlWithoutParams + "/favicon.ico";
          console.log("1 :>> ", this._src);
        } else {
          this._src =
            `https://www.svlik.com/t/favicon/ico.php?` + urlWithoutParams;
          console.log("2 :>> ", this._src);
        }
        // if (flag == undefined) {
        //   // 这个api比下面的好用很多
        //   this._src = `https://www.svlik.com/t/favicon/ico.php?` + result;
        //   console.log("1 :>> ", this._src);
        // } else {
        //   console.log("2 :>> ", 2);
        //   this._src =
        //     `http://statics.dnspod.cn/proxy_favicon/_/favicon?domain=` + result;
        // }
      }
    },
    backgroundClick(index) {
      this._backgroundColor = this.backgroundColorList[`${"color" + index}`];
      this._backgroundIndex = index;
    },
    clear() {
      this._linkValue = "";
      this._link = "";
      this._open = {};
    },
    async upIcon() {
      let imgRef = this.$refs.imgRef;
      imgRef.click();
      let that = this;
      imgRef.onchange = async function (event) {
        if (this.files.length === 0) return;
        const file = this.files[0];
        let validate = validateFile(file, 2);
        if (validate !== true) return message.error(validate);

        that._src = file.path;
        event.target.value = "";
      };
    },
    // 获取app信息
    returnApp(item) {
      this._open.name = item.name;
      // 当图片状态为空时
      if (!this._src) {
        if (item.icon) {
          this._src = item.icon;
        }
      }
      // 当标题状态为空时
      if (this._titleValue == "") {
        if (item.name) this._titleValue = item.name;
      }
      if (item.type === "lightApp") {
        // 轻应用数据
        this._open = {
          type: "lightApp",
          value: item.package,
          name: item.name,
        };
        item = this._open;
      } else if (item.type === "coolApp") {
        // 酷应用数据
        this._open = {
          type: "coolApp",
          value: item.data,
          name: item.name,
        };
        item = this._open;
      } else if (item.type === "tableApp") {
        // 本地应用数据
        this._open = {
          type: "tableApp",
          value: item.path,
          name: item.name,
        };
        item = this._open;
      }
      //  else if (item.type === "systemApp") {
      //   // 本地应用数据
      //   this._open = {
      //     type: "systemApp",
      //     value: item.event,
      //     name: item.name,
      //   };
      //   item = this._open;
      // }
      this._linkValue = item;
      this._link = "fast";
    },
    save() {
      if (this._src.length == 0 || this._src == "") return "未上传图标";
      return {
        isRadius: this._isRadius,
        radius: this._radius,
        isBackground: this._isBackground,
        backgroundColor: this._backgroundColor,
        titleValue: this._titleValue,
        link: this._link,
        linkValue: this._linkValue,
        open: this._open,
        size: this._size,
        src: this._src,
        backgroundIndex: this._backgroundIndex,
      };
    },
    async customClick() {
      let fileRef = this.$refs.fileRef;
      fileRef.click();
      let that = this;
      fileRef.onchange = async function (event) {
        if (this.files.length === 0) return;
        const file = this.files[0];
        that._open = {
          type: "tableApp",
          name: file.name,
          value: file.path,
        };
      };
      this._link = "nav";
    },
    fastClick() {
      this.$refs.fastNavRef.showFastNav();
    },
  },
};
</script>

<style lang="scss" scoped>
:deep(.zs-color-picker-btn) {
  width: 56px;
  height: 56px;
}

.text-base {
  font-weight: 500;
  font-family: PingFangSC-Medium;
}

.parent {
  display: flex;
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

.item-box {
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  margin-left: 2px;

  .item {
    width: 56px;
    height: 56px;
    opacity: 0.65;
    border-radius: 10px;
    cursor: pointer;
    margin: 9px;
  }
}

.link-box {
  display: flex;
  justify-content: space-between;

  div {
    width: 142px;
    height: 48px;
    cursor: pointer;
    border-radius: 12px;
    text-align: center;
    line-height: 48px;
  }
}

.input {
  border-radius: 12px;
  height: 48px;
  border: 0;
}

.icon {
  width: 20px;
  height: 20px;
}

.active {
  border: 2px solid var(--active-bg);
}
</style>
