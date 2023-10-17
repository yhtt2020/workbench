<template>
  <div class="flex relative">
    <div class="w-32">
      <div class="overflow-y-auto xt-container" :style="heightStyle">
        <div
          v-for="(item, index) in webBtn"
          @click="handleChange(index)"
          class="h-12 justify-center items-center cursor-pointer flex rounded-xl mr-2"
          style="flex: 0 0 auto ;width: 120px;"
          :class="{
            'xt-bg-2': index === selectIndex,
          }"
        >
          {{ item.label }}
        </div>
      </div>
    </div>
    <Icon
      ref="iconRef"
      @updateSelectApps="updateSelectApps"
      :isSelect="true"
      :name="selectName"
      style="height: calc(100% - 48px)"
      :data="appList[selectName]"
    >
    </Icon>
  </div>
</template>

<script>
import { getSelect } from "../api/api";
import syncSelected from "../hooks/syncSelected";
import cache from "../../../../components/card/hooks/cache";
import { scrollable } from "../hooks/scrollable";

export default {
  inject: ["height"],
  mixins: [syncSelected],
  props: {
    type: {},
  },
  watch: {
    type: {
      handler(newV) {
        this.appList[this.selectName].forEach((item) => {
          item.open.type = this.type;
        });
      },
    },
  },
  data() {
    return {
      webBtn: [
        {
          label: "设计工具",
          name: "design",
          checked: true,
        },
        {
          label: "即时通讯",
          name: "message",
          checked: false,
        },
        {
          label: "文档表单",
          name: "docx",
          checked: false,
        },
        {
          label: "常用邮箱",
          name: "email",
          checked: false,
        },
        {
          label: "资讯门户",
          name: "information",
          checked: false,
        },
        {
          label: "效率工具",
          name: "effect",
          checked: false,
        },
        {
          label: "媒体运营",
          name: "media",
          checked: false,
        },
        {
          label: "SAAS服务",
          name: "saas",
          checked: false,
        },
        {
          label: "程序开发",
          name: "code",
          checked: false,
        },
        {
          label: "休闲娱乐",
          name: "game",
          checked: false,
        },
        {
          label: "学习成长",
          name: "learning",
          checked: false,
        },
        {
          label: "企业采购",
          name: "copurchase",
          checked: false,
        },
        {
          label: "企业信息",
          name: "coinfo",
          checked: false,
        },
      ],
      appList: {},
      selectIndex: 0,
      selectName: "",
    };
  },
  directives: {
    scrollable,
  },
  async mounted() {
    this.getData(this.selectIndex);
  },
  computed: {
    heightStyle() {
      return {
        height: this.height() + 60 + "px",
      };
    },
  },
  methods: {
    async getData(index) {
      index = this.webBtn[index].name;
      let appList = cache.get(`link-${index}`);
      if (!appList) {
        appList = [];
        let res = await getSelect({
          applicationType: index,
        });
        res.data[0].forEach((item) => {
          appList.push({
            link: "link",
            icon: item.app.version.logo256 || "",
            name: item.app.version.name || "",
            open: {
              value: item.app.version.url || "",
              type: this.type,
            },
          });
        });
        cache.set(`link-${index}`, appList, 2 * 24 * 60 * 60 * 1000);
      } else {
        appList.forEach((item) => {
          item.open.type = this.type;
        });
      }

      this.appList[index] = appList;
      this.selectName = index;
    },
    handleChange(index) {
      this.selectIndex = index;
      this.getData(this.selectIndex);
    },
  },
};
</script>

<style lang="scss" scoped></style>
