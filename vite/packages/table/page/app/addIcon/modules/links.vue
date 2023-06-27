<template>
  <div class="h-full" >
    <Icon
      ref="iconRef"
      @updateSelectApps="updateSelectApps"
      style="height: calc(100% - 48px)"
      :data="appList"
    >
    <div
      class="w-full flex overflow-x-auto xt-container"
      ref="scrollContainer"
      v-scrollable
    >
      <div
        v-for="(item, index) in webBtn"
        @click="handleChange(index)"
        class="w-120 h-12 justify-center items-center cursor-pointer flex rounded-xl"
        style="flex: 0 0 auto"
        :class="{
          'xt-bg-2': index === selectIndex,
        }"
      >
        {{ item.label }}
      </div>
    </div>
  </Icon>
  </div>
</template>

<script>
import { getSelect } from "../api/api";
import syncSelected from "../hooks/syncSelected";
import cache from "../hooks/cache";
import { scrollable } from "../hooks/scrollable";

export default {
  mixins: [syncSelected],
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
      appList: [],
      selectIndex: 0,
    };
  },
  directives: {
    scrollable,
  },
  async mounted() {
    this.getData(this.selectIndex);
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
            icon: item.app.version.logo256,
            name: item.app.version.name,
            path: item.app.version.url,
          });
        });
        cache.set(`link-${index}`, appList, 2 * 24 * 60 * 60 * 1000);
      }
      this.appList = appList;
    },
    handleChange(index) {
      let iconRef = this.$refs["iconRef"];
      iconRef.cancelAll();
      this.selectIndex = index;
      this.getData(this.selectIndex);
    },
  },
};
</script>

<style lang="scss" scoped></style>
