<template>
  <div class="text-base" style="margin: 12px 0">链接/快捷方式</div>
  <!-- 未选择打开方式 -->
  <div class="flex justify-between" v-if="_link == ''">
    <div
      class="xt-btn xt-text xt-hover h-12"
      style="width: 142px"
      @click="linkClick()"
    >
      网页链接
    </div>
    <div
      class="xt-btn xt-text xt-hover h-12"
      style="width: 142px"
      @click="fastClick()"
    >
      快捷方式
    </div>
    <div
      class="xt-btn xt-text xt-hover h-12"
      style="width: 142px"
      @click="navClick()"
    >
      应用导航
    </div>
  </div>
  <!-- 链接方式 -->
  <template v-else-if="_link === 'link'">
    <a-input
      @blur="leaveInput()"
      v-model:value="_open.value"
      placeholder="以http/https开头"
      class="xt-bg-2 xt-border h-12 rounded-xl"
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
    <!-- <Radio
      :list="linkList"
      v-model:data="newType"
      text="选择打开的浏览器"
    ></Radio> -->
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
  <input
    style="display: none"
    ref="fileRef"
    type="file"
    v-if="_link === 'nav'"
  />
  <fastNav
    v-if="_link != 'link' && _link != 'nav'"
    style="z-index: 999999999999999"
    @returnApp="returnApp"
    ref="fastNavRef"
  ></fastNav>
</template>

<script>
import Radio from "../../../card/components/radio/index.vue";

import editProxy from "../hooks/editProxy";
import editProps from "../hooks/editProps";
import editData from "../hooks/editData";
export default {
  mixins: [editProxy,editProps,editData],
  components: { Radio },
  computed: {
    title() {
      // return this._open.name || this._linkValue.name || this._linkValue || "";
    },
  },
  methods: {
    linkClick() {
      this._link = "link";
    },
    imgError() {
      if (this._link === "link") {
        this._src = "";
        this.leaveInput(true);
      }
      this._src = "";
    },
    leaveInput(flag) {
      // 匹配icon放在失去焦点后在调用外部api 减少频繁请求被屏蔽
      console.log("this._src :>> ", this._src);
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
    clear() {
      this._linkValue = "";
      this._link = "";
      this._open = { value: "", type: "internal" };
    },
    fastClick() {
      this.$nextTick(() => {
        this.$refs.fastNavRef.showFastNav();
      });
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
    navClick() {
      let fileRef = this.$refs.fileRef;
      fileRef.click();
      let that = this;
      // 用户选择执行
      fileRef.onchange = function () {
        if (this.files.length === 0) {
          this.clear();
          return;
        }
        const file = this.files[0];
        that._open = {
          type: "tableApp",
          name: file.name,
          value: file.path,
        };
        that._link = "nav";
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
