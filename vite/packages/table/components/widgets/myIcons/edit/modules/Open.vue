<template>
  <Title> 链接/快捷方式 </Title>
  <div class="flex justify-between" v-if="edit.link == ''">
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
  <template v-else-if="edit.link === 'link'">
    <a-input
      @blur="leaveInput()"
      v-model:value="edit.open.value"
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
    <Title> 浏览器打开方式 </Title>
    <Radio :list="linkList" v-model:data="edit.open.type" text=""></Radio>
  </template>
  <!-- 快捷和应用 -->
  <template v-else>
    <a-input
      v-model:value="title"
      placeholder=""
      class="xt-bg-2 xt-border h-12 rounded-xl"
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
  <FastNav
    v-if="edit.link != 'link' && edit.link != 'nav'"
    style="z-index: 999999999999999"
    @returnApp="returnApp"
    ref="fastNavRef"
  ></FastNav>

  <input
    style="display: none"
    ref="fileRef"
    type="file"
    v-if="edit.link !== 'link' && edit.link !== 'fast'"
  />
</template>

<script>
import FastNav from "../components/FastNav.vue";
import Radio from "../../../../card/components/radio/index.vue";
import { linkList } from "../hooks/config";
import { getHostAddress } from "../hooks/getHostAddress";
import editMixins from "../hooks/mixins";
import api from "../../../../../../../src/model/api";
import { base64Flie } from "../../../../card/hooks/imageProcessing";

export default {
  mixins: [editMixins],
  components: {
    FastNav,
    Radio,
  },
  data() {
    return {
      linkList,
    };
  },
  computed: {
    title() {
      return (
        this.edit.open.name ||
        this.edit.linkValue.name ||
        this.edit.linkValue ||
        ""
      );
    },
  },

  methods: {
    clear() {
      this.edit.linkValue = "";
      this.edit.link = "";
      this.edit.open = { value: "", type: "internal" };
    },
    leaveInput() {
      if (this.edit.src.length === 0) {
        const domain = getHostAddress(this.edit.open.value);
        this.edit.src = domain + "/favicon.ico";
      }
    },
    linkClick() {
      this.edit.link = "link";
    },
    fastClick() {
      this.$nextTick(() => {
        this.$refs.fastNavRef.showFastNav();
      });
    },
    // 获取app信息
    returnApp(item) {
      this.edit.open.name = item.name;
      // 当图片状态为空时
      if (!this.edit.src) {
        if (item.icon && item.type !== "tableApp") {
          this.edit.src = item.icon;
        } else {
          let file = base64Flie(item.icon);
          const formData = new FormData();
          formData.append("file", file);
          api.postCosUpload(formData, (err, res) => {
            if (!err) {
            } else {
              const url = "http://" + res.data.data;
              this.edit.src = url;
            }
          });
        }
      }
      // 当标题状态为空时
      if (this.edit.titleValue == "") {
        if (item.name) this.edit.titleValue = item.name;
      }
      if (item.type === "lightApp") {
        // 轻应用数据
        this.edit.open = {
          type: "lightApp",
          value: item.package,
          name: item.name,
        };
        item = this.edit.open;
      } else if (item.type === "coolApp") {
        // 酷应用数据
        this.edit.open = {
          type: "coolApp",
          value: item.data,
          name: item.name,
        };
        item = this.edit.open;
      } else if (item.type === "tableApp") {
        // 本地应用数据

        this.edit.open = {
          type: "tableApp",
          value: item.path,
          name: item.name,
        };
        item = this.edit.open;
      }
      //  else if (item.type === "systemApp") {
      //   // 本地应用数据
      //   this.edit.open = {
      //     type: "systemApp",
      //     value: item.event,
      //     name: item.name,
      //   };
      //   item = this.edit.open;
      // }
      this.edit.linkValue = item;
      this.edit.link = "fast";
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
        that.edit.open = {
          type: "tableApp",
          name: file.name,
          value: file.path,
        };
        that.edit.link = "nav";
        this.value = "";
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
